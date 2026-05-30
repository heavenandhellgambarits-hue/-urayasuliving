import { Hono } from 'hono';
import { storeAuthMiddleware } from '../middleware';
import { Bindings, Variables, nowJST, ymdJST } from '../types';
import { getSupabase } from '../lib/db';

const store = new Hono<{ Bindings: Bindings; Variables: Variables }>();
store.use('*', storeAuthMiddleware);

// 商品一覧
store.get('/products', async (c) => {
  const sb = getSupabase(c.env);
  const { data, error } = await sb
    .from('products')
    .select('*')
    .eq('is_active', 1)
    .order('category')
    .order('product_name');
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ products: data });
});

// お知らせ
store.get('/notices', async (c) => {
  const sb = getSupabase(c.env);
  const now = nowJST();
  const { data, error } = await sb
    .from('notices')
    .select('*')
    .or(`expire_at.is.null,expire_at.gt.${now}`)
    .order('created_at', { ascending: false })
    .limit(20);
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ notices: data });
});

// 発注一覧
store.get('/orders', async (c) => {
  const storeId = c.get('storeId');
  const from = c.req.query('from');
  const to   = c.req.query('to');
  const sb = getSupabase(c.env);

  let query = sb
    .from('orders')
    .select('*, order_progress(is_completed, worker_name, printed_at)')
    .eq('store_id', storeId!)
    .order('created_at', { ascending: false });

  if (from) query = query.gte('created_at', `${from}T00:00:00`);
  if (to)   query = query.lte('created_at', `${to}T23:59:59`);

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);

  // order_progress をフラットに展開
  const orders = (data || []).map((o: any) => {
    const op = Array.isArray(o.order_progress) ? o.order_progress[0] : o.order_progress;
    return { ...o, order_progress: undefined, ...op };
  });
  return c.json({ orders });
});

// 発注詳細
store.get('/orders/:id', async (c) => {
  const storeId = c.get('storeId');
  const id = Number(c.req.param('id'));
  const sb = getSupabase(c.env);

  const { data: order, error } = await sb
    .from('orders')
    .select('*, order_progress(is_completed, worker_name, printed_at, completed_at)')
    .eq('id', id)
    .eq('store_id', storeId!)
    .single();

  if (error || !order) return c.json({ error: '発注が見つかりません' }, 404);

  const { data: items } = await sb
    .from('order_items')
    .select('*')
    .eq('order_id', id);

  const op = Array.isArray(order.order_progress) ? order.order_progress[0] : order.order_progress;
  return c.json({ order: { ...order, order_progress: undefined, ...op }, items: items || [] });
});

// 発注作成（発注番号: YYYYMMDD + 3桁連番）
store.post('/orders', async (c) => {
  const storeId  = c.get('storeId');
  const storeName = c.get('storeName');
  const body = await c.req.json();
  const { section_name, orderer_name, desired_delivery_date, note, items } = body;

  if (!items || !Array.isArray(items) || items.length === 0)
    return c.json({ error: '発注商品を選択してください' }, 400);

  const sb = getSupabase(c.env);
  const ymd = ymdJST();
  const jst = nowJST();

  // 連番取得（order_sequencesをupsert）
  const { data: seqData } = await sb
    .from('order_sequences')
    .select('last_seq')
    .eq('ymd', ymd)
    .single();

  const newSeq = (seqData?.last_seq || 0) + 1;
  await sb.from('order_sequences').upsert({ ymd, last_seq: newSeq });

  const seqNum = String(newSeq).padStart(3, '0');
  const order_no = `${ymd}${seqNum}`;

  // 発注登録
  const { data: orderData, error: orderError } = await sb
    .from('orders')
    .insert({
      order_no,
      store_id: storeId,
      store_name: storeName,
      section_name: section_name || '',
      orderer_name: orderer_name || '',
      desired_delivery_date: desired_delivery_date || '',
      status: 'pending',
      note: note || '',
      created_at: jst,
      updated_at: jst,
    })
    .select('id')
    .single();

  if (orderError || !orderData) return c.json({ error: orderError?.message || '発注登録失敗' }, 500);
  const orderId = orderData.id;

  // 明細登録
  for (const item of items) {
    const { data: product } = await sb
      .from('products')
      .select('*')
      .eq('id', item.product_id)
      .single();

    if (product) {
      await sb.from('order_items').insert({
        order_id: orderId,
        product_id: product.id,
        product_name: product.product_name,
        product_code: product.product_code || '',
        barcode: product.barcode || '',
        quantity: item.quantity,
        category: product.category || '',
        gift_code: product.gift_code || '',
        unified_code: product.unified_code || '',
        supplier_code: product.supplier_code || '',
        supplier_name: product.supplier_name || '',
        stock_location: product.stock_location || '',
        stock_ku: product.stock_ku || null,
        stock_banchi: product.stock_banchi || null,
      });
    }
  }

  await sb.from('order_progress').insert({ order_id: orderId });
  return c.json({ order_no, order_id: orderId, id: orderId }, 201);
});

// キャンセル依頼
store.post('/orders/:id/cancel-request', async (c) => {
  const storeId = c.get('storeId');
  const id = Number(c.req.param('id'));
  const { reason } = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);

  const { data: order } = await sb
    .from('orders')
    .select('*')
    .eq('id', id)
    .eq('store_id', storeId!)
    .single();

  if (!order) return c.json({ error: '発注が見つかりません' }, 404);
  if (order.status === 'completed' || order.status === 'cancelled')
    return c.json({ error: 'この発注はキャンセル依頼できません' }, 400);

  await sb.from('orders').update({
    status: 'cancel_request',
    cancel_requested: 1,
    cancel_reason: reason || '',
    cancel_requested_at: jst,
    updated_at: jst,
  }).eq('id', id);

  return c.json({ success: true });
});

// ログイン情報
store.get('/me', async (c) => {
  const storeId = c.get('storeId');
  const sb = getSupabase(c.env);
  const { data } = await sb
    .from('stores')
    .select('id, store_name, section_name, phone, login_id')
    .eq('id', storeId!)
    .single();
  return c.json({ store: data });
});

export default store;
