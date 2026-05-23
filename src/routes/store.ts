import { Hono } from 'hono';
import { storeAuthMiddleware } from '../middleware';
import { Bindings, Variables, nowJST, ymdJST } from '../types';

const store = new Hono<{ Bindings: Bindings; Variables: Variables }>();
store.use('*', storeAuthMiddleware);

// 商品一覧
store.get('/products', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE is_active=1 ORDER BY category, product_name'
  ).all();
  return c.json({ products: results });
});

// お知らせ
store.get('/notices', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM notices WHERE (expire_at IS NULL OR datetime(expire_at) > datetime('now')) ORDER BY created_at DESC LIMIT 20`
  ).all();
  return c.json({ notices: results });
});

// 発注一覧
store.get('/orders', async (c) => {
  const storeId = c.get('storeId');
  const from = c.req.query('from');
  const to   = c.req.query('to');
  let sql = `SELECT o.*, op.is_completed, op.worker_name, op.printed_at
             FROM orders o LEFT JOIN order_progress op ON o.id=op.order_id
             WHERE o.store_id=?`;
  const params: any[] = [storeId];
  if (from) { sql += " AND date(datetime(o.created_at,'+9 hours')) >= ?"; params.push(from); }
  if (to)   { sql += " AND date(datetime(o.created_at,'+9 hours')) <= ?"; params.push(to); }
  sql += ' ORDER BY o.created_at DESC';
  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ orders: results });
});

// 発注詳細
store.get('/orders/:id', async (c) => {
  const storeId = c.get('storeId');
  const id = c.req.param('id');
  const order = await c.env.DB.prepare(
    `SELECT o.*, op.is_completed, op.worker_name, op.printed_at, op.completed_at
     FROM orders o LEFT JOIN order_progress op ON o.id=op.order_id
     WHERE o.id=? AND o.store_id=?`
  ).bind(id, storeId).first<any>();
  if (!order) return c.json({ error: '発注が見つかりません' }, 404);
  const { results: items } = await c.env.DB.prepare('SELECT * FROM order_items WHERE order_id=?').bind(id).all();
  return c.json({ order, items });
});

// 発注作成（発注番号: YYYYMMDD + 3桁連番）
store.post('/orders', async (c) => {
  const storeId  = c.get('storeId');
  const storeName = c.get('storeName');
  const body = await c.req.json();
  const { section_name, orderer_name, desired_delivery_date, note, items } = body;

  if (!items || !Array.isArray(items) || items.length === 0)
    return c.json({ error: '発注商品を選択してください' }, 400);

  const ymd = ymdJST();
  const jst = nowJST();

  // 連番取得・更新（アトミック）
  const seq = await c.env.DB.prepare(
    'INSERT INTO order_sequences (ymd, last_seq) VALUES (?,1) ON CONFLICT(ymd) DO UPDATE SET last_seq=last_seq+1 RETURNING last_seq'
  ).bind(ymd).first<any>();
  const seqNum = String(seq?.last_seq || 1).padStart(3, '0');
  const order_no = `${ymd}${seqNum}`;

  const orderResult = await c.env.DB.prepare(
    `INSERT INTO orders (order_no,store_id,store_name,section_name,orderer_name,desired_delivery_date,status,note,created_at,updated_at)
     VALUES (?,?,?,?,?,?,'pending',?,?,?)`
  ).bind(order_no, storeId, storeName, section_name||'', orderer_name||'', desired_delivery_date||'', note||'', jst, jst).run();

  const orderId = orderResult.meta.last_row_id;

  for (const item of items) {
    const product = await c.env.DB.prepare('SELECT * FROM products WHERE id=?').bind(item.product_id).first<any>();
    if (product) {
      await c.env.DB.prepare(
        `INSERT INTO order_items
          (order_id,product_id,product_name,product_code,barcode,quantity,category,
           gift_code,unified_code,supplier_code,supplier_name,stock_location,stock_ku,stock_banchi)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
      ).bind(
        orderId, product.id, product.product_name, product.product_code||'', product.barcode||'',
        item.quantity, product.category||'',
        product.gift_code||'', product.unified_code||'', product.supplier_code||'', product.supplier_name||'',
        product.stock_location||'', product.stock_ku||null, product.stock_banchi||null
      ).run();
    }
  }

  await c.env.DB.prepare('INSERT INTO order_progress (order_id) VALUES (?)').bind(orderId).run();
  return c.json({ order_no, order_id: orderId }, 201);
});

// キャンセル依頼
store.post('/orders/:id/cancel-request', async (c) => {
  const storeId = c.get('storeId');
  const id = c.req.param('id');
  const { reason } = await c.req.json();
  const jst = nowJST();

  const order = await c.env.DB.prepare(
    'SELECT * FROM orders WHERE id=? AND store_id=?'
  ).bind(id, storeId).first<any>();
  if (!order) return c.json({ error: '発注が見つかりません' }, 404);
  if (order.status === 'completed' || order.status === 'cancelled')
    return c.json({ error: 'この発注はキャンセル依頼できません' }, 400);

  await c.env.DB.prepare(
    `UPDATE orders SET status='cancel_request', cancel_requested=1, cancel_reason=?, cancel_requested_at=?, updated_at=? WHERE id=?`
  ).bind(reason||'', jst, jst, id).run();

  return c.json({ success: true });
});

// ログイン情報
store.get('/me', async (c) => {
  const storeId = c.get('storeId');
  const s = await c.env.DB.prepare('SELECT id,store_name,section_name,phone,login_id FROM stores WHERE id=?').bind(storeId).first();
  return c.json({ store: s });
});

export default store;
