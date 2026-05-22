import { Hono } from 'hono';
import { adminAuthMiddleware } from '../middleware';
import { Bindings, Variables, ORDER_STATUS_LABEL } from '../types';
import { hashPassword } from '../auth';

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use('*', adminAuthMiddleware);

// ========== 発注管理 ==========

// 発注一覧
admin.get('/orders', async (c) => {
  const status = c.req.query('status');
  const search = c.req.query('search');

  let sql = `SELECT o.*, op.is_completed, op.worker_name, op.printed_at, op.completed_at, op.alert_sent
             FROM orders o
             LEFT JOIN order_progress op ON o.id = op.order_id`;
  const params: any[] = [];

  const conditions: string[] = [];
  if (status) { conditions.push('o.status = ?'); params.push(status); }
  if (search) { conditions.push('(o.order_no LIKE ? OR o.store_name LIKE ? OR o.orderer_name LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }

  if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY o.created_at DESC LIMIT 100';

  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ orders: results });
});

// 発注詳細
admin.get('/orders/:id', async (c) => {
  const id = c.req.param('id');
  const order = await c.env.DB.prepare(
    `SELECT o.*, op.is_completed, op.worker_name, op.printed_at, op.completed_at, op.alert_sent
     FROM orders o
     LEFT JOIN order_progress op ON o.id = op.order_id
     WHERE o.id = ?`
  ).bind(id).first<any>();

  if (!order) return c.json({ error: '発注が見つかりません' }, 404);

  const { results: items } = await c.env.DB.prepare(
    'SELECT oi.*, p.barcode as product_barcode FROM order_items oi LEFT JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?'
  ).bind(id).all();

  const { results: inspections } = await c.env.DB.prepare(
    'SELECT * FROM inspection_logs WHERE order_id = ? ORDER BY scanned_at'
  ).bind(id).all();

  return c.json({ order, items, inspections });
});

// ステータス更新
admin.put('/orders/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status, worker_name } = await c.req.json();

  await c.env.DB.prepare(
    'UPDATE orders SET status = ?, updated_at = datetime("now") WHERE id = ?'
  ).bind(status, id).run();

  // 進捗更新
  if (status === 'shipped') {
    await c.env.DB.prepare(
      `UPDATE order_progress SET is_completed = 1, completed_at = datetime('now'), worker_name = ?, updated_at = datetime('now') WHERE order_id = ?`
    ).bind(worker_name || '', id).run();
  } else {
    await c.env.DB.prepare(
      `UPDATE order_progress SET worker_name = ?, updated_at = datetime('now') WHERE order_id = ?`
    ).bind(worker_name || '', id).run();
  }

  return c.json({ success: true });
});

// 印刷記録
admin.put('/orders/:id/printed', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare(
    `UPDATE order_progress SET printed_at = datetime('now'), updated_at = datetime('now') WHERE order_id = ?`
  ).bind(id).run();
  return c.json({ success: true });
});

// ========== 商品マスタ ==========

admin.get('/products', async (c) => {
  const search = c.req.query('search');
  let sql = 'SELECT * FROM products';
  const params: any[] = [];
  if (search) {
    sql += ' WHERE product_name LIKE ? OR product_code LIKE ? OR barcode LIKE ? OR brand LIKE ? OR category LIKE ?';
    const q = `%${search}%`;
    params.push(q, q, q, q, q);
  }
  sql += ' ORDER BY category, brand, product_name';
  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ products: results });
});

admin.post('/products', async (c) => {
  const body = await c.req.json();
  const { category, brand, product_name, product_code, barcode, unit, is_active, is_new } = body;
  if (!product_name) return c.json({ error: '商品名は必須です' }, 400);
  const result = await c.env.DB.prepare(
    `INSERT INTO products (category, brand, product_name, product_code, barcode, unit, is_active, is_new)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(category || '', brand || '', product_name, product_code || '', barcode || '', unit || '個', is_active ?? 1, is_new ?? 0).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put('/products/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { category, brand, product_name, product_code, barcode, unit, is_active, is_new } = body;
  await c.env.DB.prepare(
    `UPDATE products SET category=?, brand=?, product_name=?, product_code=?, barcode=?, unit=?, is_active=?, is_new=?, updated_at=datetime('now') WHERE id=?`
  ).bind(category || '', brand || '', product_name, product_code || '', barcode || '', unit || '個', is_active ?? 1, is_new ?? 0, id).run();
  return c.json({ success: true });
});

admin.delete('/products/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('UPDATE products SET is_active = 0 WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// 商品CSV一括インポート
admin.post('/products/import', async (c) => {
  const body = await c.req.json();
  const { rows } = body; // [{category, brand, product_name, product_code, barcode, unit}]
  if (!Array.isArray(rows)) return c.json({ error: '不正なデータ形式です' }, 400);

  let count = 0;
  for (const row of rows) {
    if (!row.product_name) continue;
    await c.env.DB.prepare(
      `INSERT OR REPLACE INTO products (category, brand, product_name, product_code, barcode, unit, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 1)`
    ).bind(row.category || '', row.brand || '', row.product_name, row.product_code || '', row.barcode || '', row.unit || '個').run();
    count++;
  }
  return c.json({ imported: count });
});

// ========== 発注元マスタ ==========

admin.get('/stores', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM stores ORDER BY store_name').all();
  return c.json({ stores: results });
});

admin.post('/stores', async (c) => {
  const body = await c.req.json();
  const { store_name, section_name, phone, fax, login_id, password, is_test } = body;
  if (!store_name || !login_id || !password) return c.json({ error: '店舗名・ログインID・パスワードは必須です' }, 400);
  const hash = await hashPassword(password);
  const result = await c.env.DB.prepare(
    'INSERT INTO stores (store_name, section_name, phone, fax, login_id, password_hash, is_test) VALUES (?,?,?,?,?,?,?)'
  ).bind(store_name, section_name || '', phone || '', fax || '', login_id, hash, is_test ? 1 : 0).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put('/stores/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { store_name, section_name, phone, fax, login_id, password, is_test } = body;

  if (password) {
    const hash = await hashPassword(password);
    await c.env.DB.prepare(
      `UPDATE stores SET store_name=?, section_name=?, phone=?, fax=?, login_id=?, password_hash=?, is_test=?, updated_at=datetime('now') WHERE id=?`
    ).bind(store_name, section_name || '', phone || '', fax || '', login_id, hash, is_test ? 1 : 0, id).run();
  } else {
    await c.env.DB.prepare(
      `UPDATE stores SET store_name=?, section_name=?, phone=?, fax=?, login_id=?, is_test=?, updated_at=datetime('now') WHERE id=?`
    ).bind(store_name, section_name || '', phone || '', fax || '', login_id, is_test ? 1 : 0, id).run();
  }
  return c.json({ success: true });
});

admin.delete('/stores/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM stores WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ========== お知らせ管理 ==========

admin.get('/notices', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM notices ORDER BY created_at DESC').all();
  return c.json({ notices: results });
});

admin.post('/notices', async (c) => {
  const body = await c.req.json();
  const { title, message, body: noticeBody, notice_type, expire_at } = body;
  if (!title) return c.json({ error: 'タイトルは必須です' }, 400);
  const result = await c.env.DB.prepare(
    'INSERT INTO notices (title, message, body, notice_type, expire_at) VALUES (?,?,?,?,?)'
  ).bind(title, message || '', noticeBody || '', notice_type || 'general', expire_at || null).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put('/notices/:id', async (c) => {
  const id = c.req.param('id');
  const body = await c.req.json();
  const { title, message, body: noticeBody, notice_type, expire_at } = body;
  await c.env.DB.prepare(
    'UPDATE notices SET title=?, message=?, body=?, notice_type=?, expire_at=? WHERE id=?'
  ).bind(title, message || '', noticeBody || '', notice_type || 'general', expire_at || null, id).run();
  return c.json({ success: true });
});

admin.delete('/notices/:id', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM notices WHERE id = ?').bind(id).run();
  return c.json({ success: true });
});

// ========== メール設定 ==========

admin.get('/email-settings', async (c) => {
  const settings = await c.env.DB.prepare('SELECT * FROM email_settings WHERE id = 1').first();
  if (settings) {
    (settings as any).resend_api_key = (settings as any).resend_api_key ? '***' : '';
  }
  return c.json({ settings });
});

admin.put('/email-settings', async (c) => {
  const body = await c.req.json();
  const { main_email, sub_email, resend_api_key } = body;

  const existing = await c.env.DB.prepare('SELECT id FROM email_settings WHERE id = 1').first();
  if (existing) {
    if (resend_api_key && resend_api_key !== '***') {
      await c.env.DB.prepare(
        `UPDATE email_settings SET main_email=?, sub_email=?, resend_api_key=?, updated_at=datetime('now') WHERE id=1`
      ).bind(main_email || '', sub_email || '', resend_api_key).run();
    } else {
      await c.env.DB.prepare(
        `UPDATE email_settings SET main_email=?, sub_email=?, updated_at=datetime('now') WHERE id=1`
      ).bind(main_email || '', sub_email || '').run();
    }
  } else {
    await c.env.DB.prepare(
      'INSERT INTO email_settings (id, main_email, sub_email, resend_api_key) VALUES (1,?,?,?)'
    ).bind(main_email || '', sub_email || '', resend_api_key || '').run();
  }
  return c.json({ success: true });
});

// テストメール送信
admin.post('/email-settings/test', async (c) => {
  const settings = await c.env.DB.prepare('SELECT * FROM email_settings WHERE id = 1').first<any>();
  if (!settings?.resend_api_key || !settings?.main_email) {
    return c.json({ error: 'メール設定が未完了です' }, 400);
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${settings.resend_api_key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'OrderFlow <onboarding@resend.dev>',
        to: settings.main_email,
        subject: 'OrderFlow テストメール',
        html: '<p>OrderFlowからのテストメールです。メール設定が正常に動作しています。</p>',
      }),
    });
    if (!res.ok) {
      const err = await res.json() as any;
      return c.json({ error: err.message || 'メール送信に失敗しました' }, 500);
    }
    return c.json({ success: true });
  } catch (e) {
    return c.json({ error: 'メール送信エラー' }, 500);
  }
});

// ========== システム設定 ==========

admin.get('/settings', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM site_settings').all();
  const settings: Record<string, string> = {};
  for (const row of results as any[]) {
    settings[row.key] = row.value;
  }
  return c.json({ settings });
});

admin.put('/settings', async (c) => {
  const body = await c.req.json();
  for (const [key, value] of Object.entries(body)) {
    await c.env.DB.prepare(
      `INSERT INTO site_settings (key, value) VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')`
    ).bind(key, value as string).run();
  }
  return c.json({ success: true });
});

// 管理者パスワード変更
admin.put('/admins/password', async (c) => {
  const adminId = c.get('adminId');
  const { current_password, new_password } = await c.req.json();
  if (!current_password || !new_password) return c.json({ error: '現在のパスワードと新しいパスワードを入力してください' }, 400);

  const adminRecord = await c.env.DB.prepare('SELECT * FROM admins WHERE id = ?').bind(adminId).first<any>();
  if (!adminRecord) return c.json({ error: '管理者が見つかりません' }, 404);

  const { verifyPassword } = await import('../auth');
  const ok = await verifyPassword(current_password, adminRecord.password_hash);
  if (!ok) return c.json({ error: '現在のパスワードが正しくありません' }, 401);

  const newHash = await hashPassword(new_password);
  await c.env.DB.prepare('UPDATE admins SET password_hash = ? WHERE id = ?').bind(newHash, adminId).run();
  return c.json({ success: true });
});

// 管理者一覧
admin.get('/admins', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT id, username, display_name, created_at FROM admins').all();
  return c.json({ admins: results });
});

// 管理者追加
admin.post('/admins', async (c) => {
  const { username, password, display_name } = await c.req.json();
  if (!username || !password) return c.json({ error: 'ユーザー名とパスワードは必須です' }, 400);
  const hash = await hashPassword(password);
  const result = await c.env.DB.prepare(
    'INSERT INTO admins (username, password_hash, display_name) VALUES (?,?,?)'
  ).bind(username, hash, display_name || username).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

// ========== 検品 ==========

// 検品ログ取得
admin.get('/orders/:id/inspections', async (c) => {
  const id = c.req.param('id');
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM inspection_logs WHERE order_id = ? ORDER BY scanned_at'
  ).bind(id).all();
  return c.json({ inspections: results });
});

// 検品スキャン記録
admin.post('/orders/:id/inspect', async (c) => {
  const orderId = c.req.param('id');
  const { barcode_scanned, scanned_by } = await c.req.json();

  // 発注明細にバーコードが含まれているか確認
  const item = await c.env.DB.prepare(
    'SELECT * FROM order_items WHERE order_id = ? AND barcode = ?'
  ).bind(orderId, barcode_scanned).first<any>();

  const is_match = item ? 1 : 0;
  const product_id = item?.product_id || null;

  await c.env.DB.prepare(
    'INSERT INTO inspection_logs (order_id, product_id, barcode_scanned, is_match, scanned_by) VALUES (?,?,?,?,?)'
  ).bind(orderId, product_id, barcode_scanned, is_match, scanned_by || '').run();

  return c.json({ is_match: !!is_match, product: item || null });
});

// 検品ログリセット
admin.delete('/orders/:id/inspections', async (c) => {
  const id = c.req.param('id');
  await c.env.DB.prepare('DELETE FROM inspection_logs WHERE order_id = ?').bind(id).run();
  return c.json({ success: true });
});

// 統計情報
admin.get('/stats', async (c) => {
  const total = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM orders').first<any>();
  const pending = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status = 'pending'").first<any>();
  const preparing = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status IN ('confirmed','preparing','inspecting')").first<any>();
  const shipped = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status = 'shipped'").first<any>();
  const products = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM products WHERE is_active = 1").first<any>();
  const stores = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM stores").first<any>();

  return c.json({
    orders: { total: total?.cnt || 0, pending: pending?.cnt || 0, preparing: preparing?.cnt || 0, shipped: shipped?.cnt || 0 },
    products: products?.cnt || 0,
    stores: stores?.cnt || 0,
  });
});

export default admin;
