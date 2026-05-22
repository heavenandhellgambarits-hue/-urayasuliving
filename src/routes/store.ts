import { Hono } from 'hono';
import { storeAuthMiddleware } from '../middleware';
import { Bindings, Variables } from '../types';

const store = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 認証必須
store.use('*', storeAuthMiddleware);

// 商品一覧
store.get('/products', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM products WHERE is_active = 1 ORDER BY category, brand, product_name'
  ).all();
  return c.json({ products: results });
});

// お知らせ一覧
store.get('/notices', async (c) => {
  const { results } = await c.env.DB.prepare(
    `SELECT * FROM notices 
     WHERE (expire_at IS NULL OR expire_at > datetime('now'))
     ORDER BY created_at DESC LIMIT 20`
  ).all();
  return c.json({ notices: results });
});

// 発注一覧
store.get('/orders', async (c) => {
  const storeId = c.get('storeId');
  const { results } = await c.env.DB.prepare(
    `SELECT o.*, op.is_completed, op.worker_name, op.printed_at
     FROM orders o
     LEFT JOIN order_progress op ON o.id = op.order_id
     WHERE o.store_id = ?
     ORDER BY o.created_at DESC`
  ).bind(storeId).all();
  return c.json({ orders: results });
});

// 発注詳細
store.get('/orders/:id', async (c) => {
  const storeId = c.get('storeId');
  const id = c.req.param('id');

  const order = await c.env.DB.prepare(
    `SELECT o.*, op.is_completed, op.worker_name, op.printed_at, op.completed_at
     FROM orders o
     LEFT JOIN order_progress op ON o.id = op.order_id
     WHERE o.id = ? AND o.store_id = ?`
  ).bind(id, storeId).first<any>();

  if (!order) return c.json({ error: '発注が見つかりません' }, 404);

  const { results: items } = await c.env.DB.prepare(
    'SELECT * FROM order_items WHERE order_id = ?'
  ).bind(id).all();

  return c.json({ order, items });
});

// 発注作成
store.post('/orders', async (c) => {
  const storeId = c.get('storeId');
  const storeName = c.get('storeName');
  const body = await c.req.json();

  const { section_name, orderer_name, desired_delivery_date, note, items } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return c.json({ error: '発注商品を選択してください' }, 400);
  }

  // 発注番号生成
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.floor(Math.random() * 9000) + 1000;
  const order_no = `ORD-${ymd}-${rand}`;

  // 発注レコード作成
  const orderResult = await c.env.DB.prepare(
    `INSERT INTO orders (order_no, store_id, store_name, section_name, orderer_name, desired_delivery_date, status, note)
     VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`
  ).bind(order_no, storeId, storeName, section_name || '', orderer_name || '', desired_delivery_date || '', note || '').run();

  const orderId = orderResult.meta.last_row_id;

  // 発注明細
  for (const item of items) {
    const product = await c.env.DB.prepare(
      'SELECT * FROM products WHERE id = ?'
    ).bind(item.product_id).first<any>();

    if (product) {
      await c.env.DB.prepare(
        `INSERT INTO order_items (order_id, product_id, product_name, product_code, barcode, quantity, category, brand, unit)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(orderId, product.id, product.product_name, product.product_code, product.barcode, item.quantity, product.category, product.brand, product.unit).run();
    }
  }

  // 進捗レコード作成
  await c.env.DB.prepare(
    'INSERT INTO order_progress (order_id) VALUES (?)'
  ).bind(orderId).run();

  return c.json({ order_no, order_id: orderId }, 201);
});

// ログイン情報取得
store.get('/me', async (c) => {
  const storeId = c.get('storeId');
  const store = await c.env.DB.prepare(
    'SELECT id, store_name, section_name, phone, login_id FROM stores WHERE id = ?'
  ).bind(storeId).first();
  return c.json({ store });
});

export default store;
