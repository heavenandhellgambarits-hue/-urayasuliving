import { Hono } from 'hono';
import { adminAuthMiddleware } from '../middleware';
import { Bindings, Variables, ORDER_STATUS_LABEL, nowJST, ymdJST } from '../types';
import { hashPassword } from '../auth';

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();

admin.use('*', adminAuthMiddleware);

// ========== 発注管理 ==========

admin.get('/orders', async (c) => {
  const status = c.req.query('status');
  const search = c.req.query('search');
  const from   = c.req.query('from');
  const to     = c.req.query('to');

  let sql = `SELECT o.*, op.is_completed, op.worker_name, op.printed_at, op.completed_at, op.alert_sent
             FROM orders o
             LEFT JOIN order_progress op ON o.id = op.order_id`;
  const params: any[] = [];
  const conditions: string[] = [];

  if (status) { conditions.push('o.status = ?'); params.push(status); }
  if (search) {
    conditions.push('(o.order_no LIKE ? OR o.store_name LIKE ? OR o.orderer_name LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (from) { conditions.push("date(datetime(o.created_at, '+9 hours')) >= ?"); params.push(from); }
  if (to)   { conditions.push("date(datetime(o.created_at, '+9 hours')) <= ?"); params.push(to); }

  if (conditions.length > 0) sql += ' WHERE ' + conditions.join(' AND ');
  sql += ' ORDER BY o.created_at DESC LIMIT 500';

  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ orders: results });
});

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
    'SELECT * FROM order_items WHERE order_id = ?'
  ).bind(id).all();

  const { results: inspections } = await c.env.DB.prepare(
    'SELECT * FROM inspection_logs WHERE order_id = ? ORDER BY scanned_at'
  ).bind(id).all();

  return c.json({ order, items, inspections });
});

// ステータス手動更新
admin.put('/orders/:id/status', async (c) => {
  const id = c.req.param('id');
  const { status, worker_name } = await c.req.json();
  const jst = nowJST();

  await c.env.DB.prepare(
    `UPDATE orders SET status = ?, updated_at = ? WHERE id = ?`
  ).bind(status, jst, id).run();

  if (status === 'completed') {
    await c.env.DB.prepare(
      `UPDATE order_progress SET is_completed=1, completed_at=?, worker_name=?, updated_at=? WHERE order_id=?`
    ).bind(jst, worker_name || '', jst, id).run();
  } else {
    await c.env.DB.prepare(
      `UPDATE order_progress SET worker_name=?, updated_at=? WHERE order_id=?`
    ).bind(worker_name || '', jst, id).run();
  }

  // キャンセル済 → お知らせ自動作成
  if (status === 'cancelled') {
    const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<any>();
    if (order) {
      const title = `【キャンセル完了】発注番号 ${order.order_no}`;
      const body  = `発注番号: ${order.order_no}\n発注元: ${order.store_name}${order.section_name ? ' / ' + order.section_name : ''}\n担当者: ${order.orderer_name || '-'}\nキャンセルが完了しました。`;
      await c.env.DB.prepare(
        `INSERT INTO notices (title, message, body, notice_type, order_id) VALUES (?,?,?,'cancel',?)`
      ).bind(title, `${order.order_no} のキャンセルが完了しました`, body, id).run();
    }
  }

  return c.json({ success: true });
});

// 印刷記録 → ステータスを「印刷済」に自動更新
admin.put('/orders/:id/printed', async (c) => {
  const id = c.req.param('id');
  const jst = nowJST();
  await c.env.DB.prepare(
    `UPDATE order_progress SET printed_at=?, updated_at=? WHERE order_id=?`
  ).bind(jst, jst, id).run();
  // pending → printed へ自動遷移
  await c.env.DB.prepare(
    `UPDATE orders SET status='printed', updated_at=? WHERE id=? AND status='pending'`
  ).bind(jst, id).run();
  return c.json({ success: true });
});

// キャンセル依頼承認（管理者がキャンセル完了にする）
admin.put('/orders/:id/cancel-complete', async (c) => {
  const id = c.req.param('id');
  const jst = nowJST();
  await c.env.DB.prepare(
    `UPDATE orders SET status='cancelled', updated_at=? WHERE id=?`
  ).bind(jst, id).run();

  const order = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<any>();
  if (order) {
    const title = `【キャンセル完了】発注番号 ${order.order_no}`;
    const body  = `発注番号: ${order.order_no}\n発注元: ${order.store_name}${order.section_name ? ' / ' + order.section_name : ''}\n担当者: ${order.orderer_name || '-'}\nキャンセルが完了しました。`;
    await c.env.DB.prepare(
      `INSERT INTO notices (title, message, body, notice_type, order_id) VALUES (?,?,?,'cancel',?)`
    ).bind(title, `${order.order_no} のキャンセルが完了しました`, body, id).run();
  }
  return c.json({ success: true });
});

// 受注履歴 単件削除
admin.delete('/orders/:id', async (c) => {
  const id = c.req.param('id');
  // 関連レコードを先に削除してからordersを削除
  await c.env.DB.prepare('DELETE FROM inspection_logs WHERE order_id=?').bind(id).run();
  await c.env.DB.prepare('DELETE FROM order_items WHERE order_id=?').bind(id).run();
  await c.env.DB.prepare('DELETE FROM order_progress WHERE order_id=?').bind(id).run();
  await c.env.DB.prepare('DELETE FROM notices WHERE order_id=?').bind(id).run();
  await c.env.DB.prepare('DELETE FROM orders WHERE id=?').bind(id).run();
  return c.json({ success: true });
});

// 受注履歴 一括削除
admin.post('/orders/bulk-delete', async (c) => {
  const { ids } = await c.req.json();
  if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: '削除対象がありません' }, 400);
  // idは整数のみ許容（SQLインジェクション対策）
  const safeIds = ids.map((v: any) => parseInt(v, 10)).filter((v) => !isNaN(v));
  if (safeIds.length === 0) return c.json({ error: '有効なIDがありません' }, 400);
  const placeholders = safeIds.map(() => '?').join(',');
  await c.env.DB.prepare(`DELETE FROM inspection_logs WHERE order_id IN (${placeholders})`).bind(...safeIds).run();
  await c.env.DB.prepare(`DELETE FROM order_items WHERE order_id IN (${placeholders})`).bind(...safeIds).run();
  await c.env.DB.prepare(`DELETE FROM order_progress WHERE order_id IN (${placeholders})`).bind(...safeIds).run();
  await c.env.DB.prepare(`DELETE FROM notices WHERE order_id IN (${placeholders})`).bind(...safeIds).run();
  await c.env.DB.prepare(`DELETE FROM orders WHERE id IN (${placeholders})`).bind(...safeIds).run();
  return c.json({ deleted: safeIds.length });
});

// ========== 商品マスタ ==========

admin.get('/products', async (c) => {
  const search = c.req.query('search');
  let sql = 'SELECT * FROM products';
  const params: any[] = [];
  if (search) {
    sql += ' WHERE product_name LIKE ? OR product_code LIKE ? OR barcode LIKE ? OR category LIKE ? OR gift_code LIKE ? OR unified_code LIKE ? OR supplier_name LIKE ?';
    const q = `%${search}%`;
    params.push(q, q, q, q, q, q, q);
  }
  sql += ' ORDER BY category, product_name';
  const { results } = await c.env.DB.prepare(sql).bind(...params).all();
  return c.json({ products: results });
});

admin.post('/products', async (c) => {
  const b = await c.req.json();
  const jst = nowJST();
  if (!b.product_name) return c.json({ error: '商品名は必須です' }, 400);
  const result = await c.env.DB.prepare(
    `INSERT INTO products
      (category, product_name, product_code, barcode, gift_code, unified_code,
       supplier_code, supplier_name, stock_location, stock_ku, stock_banchi,
       is_active, is_new, registered_at, updated_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`
  ).bind(
    b.category||'', b.product_name, b.product_code||'', b.barcode||'',
    b.gift_code||'', b.unified_code||'', b.supplier_code||'', b.supplier_name||'',
    b.stock_location||'', b.stock_ku||null, b.stock_banchi||null,
    b.is_active??1, b.is_new??0, jst, jst
  ).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put('/products/:id', async (c) => {
  const id = c.req.param('id');
  const b = await c.req.json();
  const jst = nowJST();
  await c.env.DB.prepare(
    `UPDATE products SET
      category=?, product_name=?, product_code=?, barcode=?,
      gift_code=?, unified_code=?, supplier_code=?, supplier_name=?,
      stock_location=?, stock_ku=?, stock_banchi=?,
      is_active=?, is_new=?, updated_at=? WHERE id=?`
  ).bind(
    b.category||'', b.product_name, b.product_code||'', b.barcode||'',
    b.gift_code||'', b.unified_code||'', b.supplier_code||'', b.supplier_name||'',
    b.stock_location||'', b.stock_ku||null, b.stock_banchi||null,
    b.is_active??1, b.is_new??0, jst, id
  ).run();
  return c.json({ success: true });
});

admin.delete('/products/:id', async (c) => {
  const id = c.req.param('id');
  // order_items は product_id を参照しているが削除は許可（履歴は残す）
  await c.env.DB.prepare('DELETE FROM products WHERE id=?').bind(id).run();
  return c.json({ success: true });
});

// 商品一括削除
// D1 は bind() のバインド変数が最大99個のため、100件以上の場合は99件ずつチャンクに分割して実行
admin.post('/products/bulk-delete', async (c) => {
  const { ids } = await c.req.json();
  if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: '削除対象がありません' }, 400);
  const safeIds = ids.map((v: any) => parseInt(v, 10)).filter((v) => !isNaN(v));
  if (safeIds.length === 0) return c.json({ error: '有効なIDがありません' }, 400);
  const CHUNK = 99;
  for (let i = 0; i < safeIds.length; i += CHUNK) {
    const chunk = safeIds.slice(i, i + CHUNK);
    const placeholders = chunk.map(() => '?').join(',');
    await c.env.DB.prepare(`DELETE FROM products WHERE id IN (${placeholders})`).bind(...chunk).run();
  }
  return c.json({ deleted: safeIds.length });
});

// Excel取込（JSON行データで受信）
admin.post('/products/import', async (c) => {
  const { rows } = await c.req.json();
  if (!Array.isArray(rows)) return c.json({ error: '不正なデータ形式です' }, 400);
  const jst = nowJST();
  let count = 0;
  for (const r of rows) {
    // 日本語ヘッダー・英語ヘッダー両対応
    const category      = r['カテゴリ']       || r.category       || '';
    const unified_code  = r['統一コード']      || r.unified_code   || '';
    const gift_code     = r['ギフトコード']    || r.gift_code      || '';
    const product_name  = r['商品名']          || r.product_name   || '';
    const product_code  = r['商品記号']        || r.product_code   || '';
    const barcode       = r['バーコード']      || r.barcode        || '';
    const supplier_code = r['仕入先コード']    || r.supplier_code  || '';
    const supplier_name = r['仕入先名']        || r.supplier_name  || '';
    const stock_location= r['ストック場所']    || r.stock_location || '';
    // stock_ku / stock_banchi は TEXT カラム（先頭0を保持するため文字列のまま保存）
    const rawKu      = r['区']     ?? r.stock_ku     ?? null;
    const rawBanchi  = r['番地']   ?? r.stock_banchi ?? null;
    const stock_ku     = (rawKu     !== '' && rawKu     != null) ? String(rawKu).trim()     || null : null;
    const stock_banchi = (rawBanchi !== '' && rawBanchi != null) ? String(rawBanchi).trim() || null : null;
    // 全コード系フィールドは文字列として保存（先頭0・小数点を除去した整数文字列にする）
    const toStr = (v: unknown) => {
      if (v == null || v === '') return '';
      const s = String(v).trim();
      // "12345.0" → "12345" に正規化
      if (/^\d+\.0+$/.test(s)) return String(parseInt(s, 10));
      return s;
    };
    if (!product_name) continue;
    await c.env.DB.prepare(
      `INSERT OR REPLACE INTO products
        (category, product_name, product_code, barcode, gift_code, unified_code,
         supplier_code, supplier_name, stock_location, stock_ku, stock_banchi, is_active, registered_at, updated_at)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?,?)`
    ).bind(
      toStr(category), product_name, toStr(product_code), toStr(barcode),
      toStr(gift_code), toStr(unified_code), toStr(supplier_code), toStr(supplier_name),
      toStr(stock_location), stock_ku, stock_banchi, jst, jst  // stock_ku/banchi は文字列のまま渡す
    ).run();
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
  const { store_name, section_name, phone, fax, login_id, password, is_test } = await c.req.json();
  if (!store_name || !login_id || !password) return c.json({ error: '店舗名・ログインID・パスワードは必須です' }, 400);
  const hash = await hashPassword(password);
  const result = await c.env.DB.prepare(
    'INSERT INTO stores (store_name, section_name, phone, fax, login_id, password_hash, is_test) VALUES (?,?,?,?,?,?,?)'
  ).bind(store_name, section_name||'', phone||'', fax||'', login_id, hash, is_test?1:0).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put('/stores/:id', async (c) => {
  const id = c.req.param('id');
  const { store_name, section_name, phone, fax, login_id, password, is_test } = await c.req.json();
  const jst = nowJST();
  if (password) {
    const hash = await hashPassword(password);
    await c.env.DB.prepare(
      `UPDATE stores SET store_name=?,section_name=?,phone=?,fax=?,login_id=?,password_hash=?,is_test=?,updated_at=? WHERE id=?`
    ).bind(store_name, section_name||'', phone||'', fax||'', login_id, hash, is_test?1:0, jst, id).run();
  } else {
    await c.env.DB.prepare(
      `UPDATE stores SET store_name=?,section_name=?,phone=?,fax=?,login_id=?,is_test=?,updated_at=? WHERE id=?`
    ).bind(store_name, section_name||'', phone||'', fax||'', login_id, is_test?1:0, jst, id).run();
  }
  return c.json({ success: true });
});

admin.delete('/stores/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM stores WHERE id=?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ========== お知らせ ==========

admin.get('/notices', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM notices ORDER BY created_at DESC').all();
  return c.json({ notices: results });
});

admin.post('/notices', async (c) => {
  const { title, message, body: nb, notice_type, expire_at } = await c.req.json();
  if (!title) return c.json({ error: 'タイトルは必須です' }, 400);
  const jst = nowJST();
  const result = await c.env.DB.prepare(
    'INSERT INTO notices (title, message, body, notice_type, expire_at, created_at) VALUES (?,?,?,?,?,?)'
  ).bind(title, message||'', nb||'', notice_type||'general', expire_at||null, jst).run();
  return c.json({ id: result.meta.last_row_id }, 201);
});

admin.put('/notices/:id', async (c) => {
  const { title, message, body: nb, notice_type, expire_at } = await c.req.json();
  await c.env.DB.prepare(
    'UPDATE notices SET title=?,message=?,body=?,notice_type=?,expire_at=? WHERE id=?'
  ).bind(title, message||'', nb||'', notice_type||'general', expire_at||null, c.req.param('id')).run();
  return c.json({ success: true });
});

admin.delete('/notices/:id', async (c) => {
  await c.env.DB.prepare('DELETE FROM notices WHERE id=?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// ========== メール設定 ==========

admin.get('/email-settings', async (c) => {
  const s = await c.env.DB.prepare('SELECT * FROM email_settings WHERE id=1').first<any>();
  if (s) s.resend_api_key = s.resend_api_key ? '***' : '';
  return c.json({ settings: s });
});

admin.put('/email-settings', async (c) => {
  const { main_email, sub_email, resend_api_key } = await c.req.json();
  const jst = nowJST();
  const ex = await c.env.DB.prepare('SELECT id FROM email_settings WHERE id=1').first();
  if (ex) {
    if (resend_api_key && resend_api_key !== '***') {
      await c.env.DB.prepare(`UPDATE email_settings SET main_email=?,sub_email=?,resend_api_key=?,updated_at=? WHERE id=1`).bind(main_email||'', sub_email||'', resend_api_key, jst).run();
    } else {
      await c.env.DB.prepare(`UPDATE email_settings SET main_email=?,sub_email=?,updated_at=? WHERE id=1`).bind(main_email||'', sub_email||'', jst).run();
    }
  } else {
    await c.env.DB.prepare('INSERT INTO email_settings (id,main_email,sub_email,resend_api_key) VALUES (1,?,?,?)').bind(main_email||'', sub_email||'', resend_api_key||'').run();
  }
  return c.json({ success: true });
});

admin.post('/email-settings/test', async (c) => {
  const s = await c.env.DB.prepare('SELECT * FROM email_settings WHERE id=1').first<any>();
  if (!s?.resend_api_key || !s?.main_email) return c.json({ error: 'メール設定が未完了です' }, 400);
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${s.resend_api_key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'OrderFlow <onboarding@resend.dev>', to: s.main_email, subject: 'OrderFlow テストメール', html: '<p>テストメールです。</p>' }),
    });
    if (!res.ok) { const e = await res.json() as any; return c.json({ error: e.message || 'メール送信失敗' }, 500); }
    return c.json({ success: true });
  } catch { return c.json({ error: 'メール送信エラー' }, 500); }
});

// ========== システム設定 ==========

admin.get('/settings', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT * FROM site_settings').all();
  const settings: Record<string, string> = {};
  for (const r of results as any[]) settings[r.key] = r.value;
  return c.json({ settings });
});

admin.put('/settings', async (c) => {
  const body = await c.req.json();
  const jst = nowJST();
  for (const [key, value] of Object.entries(body)) {
    await c.env.DB.prepare(
      `INSERT INTO site_settings (key,value,updated_at) VALUES (?,?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value,updated_at=excluded.updated_at`
    ).bind(key, value as string, jst).run();
  }
  return c.json({ success: true });
});

admin.put('/admins/password', async (c) => {
  const adminId = c.get('adminId');
  const { current_password, new_password } = await c.req.json();
  if (!current_password || !new_password) return c.json({ error: '入力してください' }, 400);
  const rec = await c.env.DB.prepare('SELECT * FROM admins WHERE id=?').bind(adminId).first<any>();
  if (!rec) return c.json({ error: '管理者が見つかりません' }, 404);
  const { verifyPassword } = await import('../auth');
  if (!(await verifyPassword(current_password, rec.password_hash))) return c.json({ error: '現在のパスワードが正しくありません' }, 401);
  const h = await hashPassword(new_password);
  await c.env.DB.prepare('UPDATE admins SET password_hash=? WHERE id=?').bind(h, adminId).run();
  return c.json({ success: true });
});

admin.get('/admins', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT id,username,display_name,created_at FROM admins').all();
  return c.json({ admins: results });
});

admin.post('/admins', async (c) => {
  const { username, password, display_name } = await c.req.json();
  if (!username || !password) return c.json({ error: 'ユーザー名とパスワードは必須です' }, 400);
  const h = await hashPassword(password);
  const r = await c.env.DB.prepare('INSERT INTO admins (username,password_hash,display_name) VALUES (?,?,?)').bind(username, h, display_name||username).run();
  return c.json({ id: r.meta.last_row_id }, 201);
});

// ========== 検品 ==========

admin.get('/orders/:id/inspections', async (c) => {
  const { results } = await c.env.DB.prepare(
    'SELECT * FROM inspection_logs WHERE order_id=? ORDER BY scanned_at'
  ).bind(c.req.param('id')).all();
  return c.json({ inspections: results });
});

// 検品スキャン記録（数量チェック付き）
admin.post('/orders/:id/inspect', async (c) => {
  const orderId = c.req.param('id');
  const { barcode_scanned, scanned_by } = await c.req.json();
  const jst = nowJST();

  // 発注明細にバーコードが含まれているか
  const item = await c.env.DB.prepare(
    'SELECT * FROM order_items WHERE order_id=? AND barcode=?'
  ).bind(orderId, barcode_scanned).first<any>();

  const is_match = item ? 1 : 0;

  await c.env.DB.prepare(
    'INSERT INTO inspection_logs (order_id,product_id,barcode_scanned,is_match,scanned_by,scanned_at) VALUES (?,?,?,?,?,?)'
  ).bind(orderId, item?.product_id||null, barcode_scanned, is_match, scanned_by||'', jst).run();

  // スキャン済み数チェック
  let allCompleted = false;
  if (is_match) {
    // この商品の発注数とスキャン済み数を比較
    const { results: allItems } = await c.env.DB.prepare(
      'SELECT * FROM order_items WHERE order_id=?'
    ).bind(orderId).all<any>();

    const { results: logs } = await c.env.DB.prepare(
      'SELECT barcode_scanned FROM inspection_logs WHERE order_id=? AND is_match=1'
    ).bind(orderId).all<any>();

    // バーコードごとのスキャン数
    const scannedCount: Record<string, number> = {};
    for (const l of logs) scannedCount[l.barcode_scanned] = (scannedCount[l.barcode_scanned]||0) + 1;

    // 全商品の発注数 <= スキャン数か確認
    allCompleted = allItems.every((it: any) => (scannedCount[it.barcode]||0) >= it.quantity);

    if (allCompleted) {
      // 検品中ステータスに自動遷移
      await c.env.DB.prepare(
        `UPDATE orders SET status='completed', updated_at=? WHERE id=? AND status='inspecting'`
      ).bind(jst, orderId).run();
      await c.env.DB.prepare(
        `UPDATE order_progress SET is_completed=1, completed_at=?, updated_at=? WHERE order_id=?`
      ).bind(jst, jst, orderId).run();
    }
  }

  return c.json({ is_match: !!is_match, product: item||null, all_completed: allCompleted });
});

// 検品開始 → ステータスを inspecting に
admin.put('/orders/:id/start-inspection', async (c) => {
  const id = c.req.param('id');
  const jst = nowJST();
  await c.env.DB.prepare(
    `UPDATE orders SET status='inspecting', updated_at=? WHERE id=? AND status IN ('pending','printed')`
  ).bind(jst, id).run();
  return c.json({ success: true });
});

admin.delete('/orders/:id/inspections', async (c) => {
  await c.env.DB.prepare('DELETE FROM inspection_logs WHERE order_id=?').bind(c.req.param('id')).run();
  return c.json({ success: true });
});

// 検品完了 → ステータスを completed に
admin.post('/orders/:id/complete-inspection', async (c) => {
  const id = c.req.param('id');
  const jst = nowJST();
  await c.env.DB.prepare(
    `UPDATE orders SET status='completed', updated_at=? WHERE id=?`
  ).bind(jst, id).run();
  return c.json({ success: true });
});

// ========== 統計 ==========

admin.get('/stats', async (c) => {
  const pending    = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status='pending'").first<any>();
  const active     = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status IN ('printed','inspecting')").first<any>();
  const completed  = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status='completed'").first<any>();
  const products   = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM products WHERE is_active=1").first<any>();
  const cancel_req = await c.env.DB.prepare("SELECT COUNT(*) as cnt FROM orders WHERE status='cancel_request'").first<any>();
  return c.json({
    orders: { pending: pending?.cnt||0, active: active?.cnt||0, completed: completed?.cnt||0, cancel_request: cancel_req?.cnt||0 },
    products: products?.cnt||0,
  });
});

export default admin;
