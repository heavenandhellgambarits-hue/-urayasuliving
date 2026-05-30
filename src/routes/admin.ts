import { Hono } from 'hono';
import { adminAuthMiddleware } from '../middleware';
import { Bindings, Variables, nowJST, ymdJST } from '../types';
import { hashPassword } from '../auth';
import { getSupabase } from '../lib/db';

const admin = new Hono<{ Bindings: Bindings; Variables: Variables }>();
admin.use('*', adminAuthMiddleware);

// ========== 発注管理 ==========

admin.get('/orders', async (c) => {
  const status = c.req.query('status');
  const search = c.req.query('search');
  const from   = c.req.query('from');
  const to     = c.req.query('to');
  const sb = getSupabase(c.env);

  let query = sb
    .from('orders')
    .select('*, order_progress(is_completed, worker_name, printed_at, completed_at, alert_sent)')
    .order('created_at', { ascending: false })
    .limit(500);

  if (status) query = query.eq('status', status);
  if (from)   query = query.gte('created_at', `${from}T00:00:00`);
  if (to)     query = query.lte('created_at', `${to}T23:59:59`);
  if (search) {
    query = query.or(
      `order_no.ilike.%${search}%,store_name.ilike.%${search}%,orderer_name.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);

  const orders = (data || []).map((o: any) => {
    const op = Array.isArray(o.order_progress) ? o.order_progress[0] : o.order_progress;
    return { ...o, order_progress: undefined, ...op };
  });
  return c.json({ orders });
});

admin.get('/orders/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const sb = getSupabase(c.env);

  const { data: order, error } = await sb
    .from('orders')
    .select('*, order_progress(is_completed, worker_name, printed_at, completed_at, alert_sent)')
    .eq('id', id)
    .single();

  if (error || !order) return c.json({ error: '発注が見つかりません' }, 404);

  const { data: items } = await sb.from('order_items').select('*').eq('order_id', id);
  const { data: inspections } = await sb
    .from('inspection_logs')
    .select('*')
    .eq('order_id', id)
    .order('scanned_at');

  const op = Array.isArray(order.order_progress) ? order.order_progress[0] : order.order_progress;
  return c.json({
    order: { ...order, order_progress: undefined, ...op },
    items: items || [],
    inspections: inspections || [],
  });
});

// ステータス手動更新
admin.put('/orders/:id/status', async (c) => {
  const id = Number(c.req.param('id'));
  const { status, worker_name } = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);

  await sb.from('orders').update({ status, updated_at: jst }).eq('id', id);

  if (status === 'completed') {
    await sb.from('order_progress').update({
      is_completed: 1, completed_at: jst, worker_name: worker_name || '', updated_at: jst,
    }).eq('order_id', id);
  } else {
    await sb.from('order_progress').update({
      worker_name: worker_name || '', updated_at: jst,
    }).eq('order_id', id);
  }

  // キャンセル済 → お知らせ自動作成
  if (status === 'cancelled') {
    const { data: order } = await sb.from('orders').select('*').eq('id', id).single();
    if (order) {
      const title = `【キャンセル完了】発注番号 ${order.order_no}`;
      const body  = `発注番号: ${order.order_no}\n発注元: ${order.store_name}${order.section_name ? ' / ' + order.section_name : ''}\n担当者: ${order.orderer_name || '-'}\nキャンセルが完了しました。`;
      await sb.from('notices').insert({
        title, message: `${order.order_no} のキャンセルが完了しました`,
        body, notice_type: 'cancel', order_id: id, created_at: jst,
      });
    }
  }

  return c.json({ success: true });
});

// 印刷記録 → ステータスを「印刷済」に自動更新
admin.put('/orders/:id/printed', async (c) => {
  const id = Number(c.req.param('id'));
  const jst = nowJST();
  const sb = getSupabase(c.env);

  await sb.from('order_progress').update({ printed_at: jst, updated_at: jst }).eq('order_id', id);
  // pending → printed へ自動遷移
  await sb.from('orders').update({ status: 'printed', updated_at: jst })
    .eq('id', id).eq('status', 'pending');
  return c.json({ success: true });
});

// キャンセル依頼承認
admin.put('/orders/:id/cancel-complete', async (c) => {
  const id = Number(c.req.param('id'));
  const jst = nowJST();
  const sb = getSupabase(c.env);

  await sb.from('orders').update({ status: 'cancelled', updated_at: jst }).eq('id', id);

  const { data: order } = await sb.from('orders').select('*').eq('id', id).single();
  if (order) {
    const title = `【キャンセル完了】発注番号 ${order.order_no}`;
    const body  = `発注番号: ${order.order_no}\n発注元: ${order.store_name}${order.section_name ? ' / ' + order.section_name : ''}\n担当者: ${order.orderer_name || '-'}\nキャンセルが完了しました。`;
    await sb.from('notices').insert({
      title, message: `${order.order_no} のキャンセルが完了しました`,
      body, notice_type: 'cancel', order_id: id, created_at: jst,
    });
  }
  return c.json({ success: true });
});

// 受注履歴 単件削除
admin.delete('/orders/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const sb = getSupabase(c.env);
  await sb.from('inspection_logs').delete().eq('order_id', id);
  await sb.from('order_items').delete().eq('order_id', id);
  await sb.from('order_progress').delete().eq('order_id', id);
  await sb.from('notices').delete().eq('order_id', id);
  await sb.from('orders').delete().eq('id', id);
  return c.json({ success: true });
});

// 受注履歴 一括削除
admin.post('/orders/bulk-delete', async (c) => {
  const { ids } = await c.req.json();
  if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: '削除対象がありません' }, 400);
  const safeIds = ids.map((v: any) => parseInt(v, 10)).filter((v) => !isNaN(v));
  if (safeIds.length === 0) return c.json({ error: '有効なIDがありません' }, 400);
  const sb = getSupabase(c.env);
  await sb.from('inspection_logs').delete().in('order_id', safeIds);
  await sb.from('order_items').delete().in('order_id', safeIds);
  await sb.from('order_progress').delete().in('order_id', safeIds);
  await sb.from('notices').delete().in('order_id', safeIds);
  await sb.from('orders').delete().in('id', safeIds);
  return c.json({ deleted: safeIds.length });
});

// ========== 商品マスタ ==========

admin.get('/products', async (c) => {
  const search = c.req.query('search');
  const sb = getSupabase(c.env);

  let query = sb.from('products').select('*').order('category').order('product_name').limit(10000);
  if (search) {
    query = query.or(
      `product_name.ilike.%${search}%,product_code.ilike.%${search}%,barcode.ilike.%${search}%,category.ilike.%${search}%,gift_code.ilike.%${search}%,unified_code.ilike.%${search}%,supplier_name.ilike.%${search}%`
    );
  }

  const { data, error } = await query;
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ products: data });
});

admin.post('/products', async (c) => {
  const b = await c.req.json();
  const jst = nowJST();
  if (!b.product_name) return c.json({ error: '商品名は必須です' }, 400);
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('products').insert({
    category: b.category || '',
    product_name: b.product_name,
    product_code: b.product_code || '',
    barcode: b.barcode || '',
    gift_code: b.gift_code || '',
    unified_code: b.unified_code || '',
    supplier_code: b.supplier_code || '',
    supplier_name: b.supplier_name || '',
    stock_location: b.stock_location || '',
    stock_ku: b.stock_ku || null,
    stock_banchi: b.stock_banchi || null,
    is_active: b.is_active ?? 1,
    is_new: b.is_new ?? 0,
    registered_at: jst,
    updated_at: jst,
  }).select('id').single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ id: data.id }, 201);
});

admin.put('/products/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const b = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);
  await sb.from('products').update({
    category: b.category || '',
    product_name: b.product_name,
    product_code: b.product_code || '',
    barcode: b.barcode || '',
    gift_code: b.gift_code || '',
    unified_code: b.unified_code || '',
    supplier_code: b.supplier_code || '',
    supplier_name: b.supplier_name || '',
    stock_location: b.stock_location || '',
    stock_ku: b.stock_ku || null,
    stock_banchi: b.stock_banchi || null,
    is_active: b.is_active ?? 1,
    is_new: b.is_new ?? 0,
    updated_at: jst,
  }).eq('id', id);
  return c.json({ success: true });
});

admin.delete('/products/:id', async (c) => {
  const sb = getSupabase(c.env);
  await sb.from('products').delete().eq('id', Number(c.req.param('id')));
  return c.json({ success: true });
});

// 商品一括削除（Supabaseはbind上限なし）
admin.post('/products/bulk-delete', async (c) => {
  const { ids } = await c.req.json();
  if (!Array.isArray(ids) || ids.length === 0) return c.json({ error: '削除対象がありません' }, 400);
  const safeIds = ids.map((v: any) => parseInt(v, 10)).filter((v) => !isNaN(v));
  if (safeIds.length === 0) return c.json({ error: '有効なIDがありません' }, 400);
  const sb = getSupabase(c.env);
  await sb.from('products').delete().in('id', safeIds);
  return c.json({ deleted: safeIds.length });
});

// Excel取込
admin.post('/products/import', async (c) => {
  const { rows } = await c.req.json();
  if (!Array.isArray(rows)) return c.json({ error: '不正なデータ形式です' }, 400);
  const jst = nowJST();
  const sb = getSupabase(c.env);
  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let errors = 0;

  const toStr = (v: unknown) => {
    if (v == null || v === '') return '';
    const s = String(v).trim();
    if (/^\d+\.0+$/.test(s)) return String(parseInt(s, 10));
    return s;
  };

  // 行データをパース（商品名空はスキップ）
  type ParsedRow = {
    product_name: string;
    category: string; unified_code: string; gift_code: string;
    product_code: string; barcode: string;
    supplier_code: string; supplier_name: string; stock_location: string;
    stock_ku: string | null; stock_banchi: string | null;
  };
  const parsed: ParsedRow[] = [];
  for (const r of rows) {
    const product_name = (r['商品名'] || r.product_name || '').trim();
    if (!product_name) { skipped++; continue; }
    const rawKu     = r['区']   ?? r.stock_ku     ?? null;
    const rawBanchi = r['番地'] ?? r.stock_banchi ?? null;
    parsed.push({
      product_name,
      category:       toStr(r['カテゴリ']    || r.category       || ''),
      unified_code:   toStr(r['統一コード']   || r.unified_code   || ''),
      gift_code:      toStr(r['ギフトコード'] || r.gift_code      || ''),
      product_code:   toStr(r['商品記号']    || r.product_code   || ''),
      barcode:        toStr(r['バーコード']   || r.barcode        || ''),
      supplier_code:  toStr(r['仕入先コード'] || r.supplier_code  || ''),
      supplier_name:  toStr(r['仕入先名']    || r.supplier_name  || ''),
      stock_location: toStr(r['ストック場所'] || r.stock_location || ''),
      stock_ku:     (rawKu     !== '' && rawKu     != null) ? String(rawKu).trim()     || null : null,
      stock_banchi: (rawBanchi !== '' && rawBanchi != null) ? String(rawBanchi).trim() || null : null,
    });
  }

  if (parsed.length === 0) {
    return c.json({ imported: 0, inserted: 0, updated: 0, skipped, errors: 0 });
  }

  // ★ チャンク内全商品名を1回のINクエリでまとめてSELECT
  //    同名商品が複数ある場合もすべて取得するため全フィールドを取得
  const names = parsed.map(p => p.product_name);
  const { data: existingRows, error: findErr } = await sb
    .from('products')
    .select('product_name, gift_code, unified_code, product_code, barcode, category, supplier_code, supplier_name, stock_location, stock_ku, stock_banchi')
    .in('product_name', names);

  if (findErr) {
    return c.json({ imported: 0, inserted: 0, updated: 0, skipped, errors: parsed.length });
  }

  // ★ レコード全体の一致判定用：同名商品の全既存レコードをリストで保持
  //    商品名 → 既存レコード配列 のマップ
  type ExistingRow = {
    product_name: string; gift_code: string; unified_code: string;
    product_code: string; barcode: string; category: string;
    supplier_code: string; supplier_name: string; stock_location: string;
    stock_ku: string | null; stock_banchi: string | null;
  };
  const existingByName = new Map<string, ExistingRow[]>();
  for (const r of (existingRows || []) as ExistingRow[]) {
    const list = existingByName.get(r.product_name) || [];
    list.push(r);
    existingByName.set(r.product_name, list);
  }

  // ★ 同一レコード判定：比較対象フィールド全てが一致すればスキップ
  //    商品名・ギフトコード・統一コード・商品記号・バーコード・カテゴリ・
  //    仕入先コード・仕入先名・ストック場所・区・番地
  const norm = (v: string | null | undefined) => (v == null ? '' : String(v).trim());
  function isDuplicate(p: ParsedRow, existingList: ExistingRow[]): boolean {
    return existingList.some(e =>
      norm(e.gift_code)      === norm(p.gift_code)      &&
      norm(e.unified_code)   === norm(p.unified_code)   &&
      norm(e.product_code)   === norm(p.product_code)   &&
      norm(e.barcode)        === norm(p.barcode)        &&
      norm(e.category)       === norm(p.category)       &&
      norm(e.supplier_code)  === norm(p.supplier_code)  &&
      norm(e.supplier_name)  === norm(p.supplier_name)  &&
      norm(e.stock_location) === norm(p.stock_location) &&
      norm(e.stock_ku)       === norm(p.stock_ku)       &&
      norm(e.stock_banchi)   === norm(p.stock_banchi)
    );
  }

  // 仕分け：完全一致レコードはスキップ、それ以外はINSERT
  const toInsert: ParsedRow[] = [];
  for (const p of parsed) {
    const existingList = existingByName.get(p.product_name);
    if (existingList && isDuplicate(p, existingList)) {
      skipped++;  // 全フィールド一致 → スキップ
    } else {
      toInsert.push(p);  // 新規 or 同名でも内容が異なる → INSERT
    }
  }

  // ★ INSERT：1件ずつ直列
  // Cloudflare Workers 50サブリクエスト制限内（SELECT1 + INSERT≦4 = ≦5回）で安全
  for (const p of toInsert) {
    const { error: insertErr } = await sb.from('products').insert({
      category: p.category, product_name: p.product_name,
      product_code: p.product_code, barcode: p.barcode,
      gift_code: p.gift_code, unified_code: p.unified_code,
      supplier_code: p.supplier_code, supplier_name: p.supplier_name,
      stock_location: p.stock_location,
      stock_ku: p.stock_ku, stock_banchi: p.stock_banchi,
      is_active: 1, registered_at: jst, updated_at: jst,
    });
    if (insertErr) { errors++; } else { inserted++; }
  }

  return c.json({ imported: inserted, inserted, updated: 0, skipped, errors });
});

// ========== 発注元マスタ ==========

admin.get('/stores', async (c) => {
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('stores').select('*').order('store_name');
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ stores: data });
});

admin.post('/stores', async (c) => {
  const { store_name, section_name, phone, fax, login_id, password, is_test } = await c.req.json();
  if (!store_name || !login_id || !password) return c.json({ error: '店舗名・ログインID・パスワードは必須です' }, 400);
  const hash = await hashPassword(password);
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('stores').insert({
    store_name, section_name: section_name || '', phone: phone || '',
    fax: fax || '', login_id, password_hash: hash, is_test: is_test ? 1 : 0,
  }).select('id').single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ id: data.id }, 201);
});

admin.put('/stores/:id', async (c) => {
  const id = Number(c.req.param('id'));
  const { store_name, section_name, phone, fax, login_id, password, is_test } = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);
  if (password) {
    const hash = await hashPassword(password);
    await sb.from('stores').update({
      store_name, section_name: section_name || '', phone: phone || '',
      fax: fax || '', login_id, password_hash: hash,
      is_test: is_test ? 1 : 0, updated_at: jst,
    }).eq('id', id);
  } else {
    await sb.from('stores').update({
      store_name, section_name: section_name || '', phone: phone || '',
      fax: fax || '', login_id, is_test: is_test ? 1 : 0, updated_at: jst,
    }).eq('id', id);
  }
  return c.json({ success: true });
});

admin.delete('/stores/:id', async (c) => {
  const sb = getSupabase(c.env);
  await sb.from('stores').delete().eq('id', Number(c.req.param('id')));
  return c.json({ success: true });
});

// ========== お知らせ ==========

admin.get('/notices', async (c) => {
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('notices').select('*').order('created_at', { ascending: false });
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ notices: data });
});

admin.post('/notices', async (c) => {
  const { title, message, body: nb, notice_type, expire_at } = await c.req.json();
  if (!title) return c.json({ error: 'タイトルは必須です' }, 400);
  const jst = nowJST();
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('notices').insert({
    title, message: message || '', body: nb || '',
    notice_type: notice_type || 'general',
    expire_at: expire_at || null, created_at: jst,
  }).select('id').single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ id: data.id }, 201);
});

admin.put('/notices/:id', async (c) => {
  const { title, message, body: nb, notice_type, expire_at } = await c.req.json();
  const sb = getSupabase(c.env);
  await sb.from('notices').update({
    title, message: message || '', body: nb || '',
    notice_type: notice_type || 'general', expire_at: expire_at || null,
  }).eq('id', Number(c.req.param('id')));
  return c.json({ success: true });
});

admin.delete('/notices/:id', async (c) => {
  const sb = getSupabase(c.env);
  await sb.from('notices').delete().eq('id', Number(c.req.param('id')));
  return c.json({ success: true });
});

// ========== メール設定 ==========

admin.get('/email-settings', async (c) => {
  const sb = getSupabase(c.env);
  const { data: s } = await sb.from('email_settings').select('*').eq('id', 1).single();
  if (s) s.resend_api_key = s.resend_api_key ? '***' : '';
  return c.json({ settings: s });
});

admin.put('/email-settings', async (c) => {
  const { main_email, sub_email, resend_api_key } = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);
  const { data: ex } = await sb.from('email_settings').select('id').eq('id', 1).single();
  if (ex) {
    if (resend_api_key && resend_api_key !== '***') {
      await sb.from('email_settings').update({ main_email: main_email || '', sub_email: sub_email || '', resend_api_key, updated_at: jst }).eq('id', 1);
    } else {
      await sb.from('email_settings').update({ main_email: main_email || '', sub_email: sub_email || '', updated_at: jst }).eq('id', 1);
    }
  } else {
    await sb.from('email_settings').insert({ id: 1, main_email: main_email || '', sub_email: sub_email || '', resend_api_key: resend_api_key || '' });
  }
  return c.json({ success: true });
});

admin.post('/email-settings/test', async (c) => {
  const sb = getSupabase(c.env);
  const { data: s } = await sb.from('email_settings').select('*').eq('id', 1).single();
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
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('site_settings').select('*');
  if (error) return c.json({ error: error.message }, 500);
  const settings: Record<string, string> = {};
  for (const r of data || []) settings[r.key] = r.value;
  return c.json({ settings });
});

admin.put('/settings', async (c) => {
  const body = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);
  for (const [key, value] of Object.entries(body)) {
    await sb.from('site_settings').upsert(
      { key, value: value as string, updated_at: jst },
      { onConflict: 'key' }
    );
  }
  return c.json({ success: true });
});

admin.put('/admins/password', async (c) => {
  const adminId = c.get('adminId');
  const { current_password, new_password } = await c.req.json();
  if (!current_password || !new_password) return c.json({ error: '入力してください' }, 400);
  const sb = getSupabase(c.env);
  const { data: rec } = await sb.from('admins').select('*').eq('id', adminId!).single();
  if (!rec) return c.json({ error: '管理者が見つかりません' }, 404);
  const { verifyPassword } = await import('../auth');
  if (!(await verifyPassword(current_password, rec.password_hash))) return c.json({ error: '現在のパスワードが正しくありません' }, 401);
  const h = await hashPassword(new_password);
  await sb.from('admins').update({ password_hash: h }).eq('id', adminId!);
  return c.json({ success: true });
});

admin.get('/admins', async (c) => {
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('admins').select('id, username, display_name, created_at');
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ admins: data });
});

admin.post('/admins', async (c) => {
  const { username, password, display_name } = await c.req.json();
  if (!username || !password) return c.json({ error: 'ユーザー名とパスワードは必須です' }, 400);
  const h = await hashPassword(password);
  const sb = getSupabase(c.env);
  const { data, error } = await sb.from('admins').insert({
    username, password_hash: h, display_name: display_name || username,
  }).select('id').single();
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ id: data.id }, 201);
});

// ========== 検品 ==========

admin.get('/orders/:id/inspections', async (c) => {
  const sb = getSupabase(c.env);
  const { data, error } = await sb
    .from('inspection_logs')
    .select('*')
    .eq('order_id', Number(c.req.param('id')))
    .order('scanned_at');
  if (error) return c.json({ error: error.message }, 500);
  return c.json({ inspections: data });
});

// 検品スキャン記録（数量チェック付き）
admin.post('/orders/:id/inspect', async (c) => {
  const orderId = Number(c.req.param('id'));
  const { barcode_scanned, scanned_by } = await c.req.json();
  const jst = nowJST();
  const sb = getSupabase(c.env);

  const { data: item } = await sb
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .eq('barcode', barcode_scanned)
    .maybeSingle();

  const is_match = item ? 1 : 0;

  await sb.from('inspection_logs').insert({
    order_id: orderId,
    product_id: item?.product_id || null,
    barcode_scanned,
    is_match,
    scanned_by: scanned_by || '',
    scanned_at: jst,
  });

  let allCompleted = false;
  if (is_match) {
    const { data: allItems } = await sb.from('order_items').select('*').eq('order_id', orderId);
    const { data: logs } = await sb
      .from('inspection_logs')
      .select('barcode_scanned')
      .eq('order_id', orderId)
      .eq('is_match', 1);

    const scannedCount: Record<string, number> = {};
    for (const l of logs || []) scannedCount[l.barcode_scanned] = (scannedCount[l.barcode_scanned] || 0) + 1;

    const barcodeItems = (allItems || []).filter((it: any) => it.barcode && it.barcode.trim() !== '');
    allCompleted = barcodeItems.length > 0 &&
      barcodeItems.every((it: any) => (scannedCount[it.barcode] || 0) >= it.quantity);

    if (allCompleted) {
      await sb.from('orders').update({ status: 'completed', updated_at: jst })
        .eq('id', orderId).eq('status', 'inspecting');
      await sb.from('order_progress').update({ is_completed: 1, completed_at: jst, updated_at: jst })
        .eq('order_id', orderId);
    }
  }

  return c.json({ is_match: !!is_match, product: item || null, all_completed: allCompleted });
});

// 検品開始 → ステータスを inspecting に
admin.put('/orders/:id/start-inspection', async (c) => {
  const id = Number(c.req.param('id'));
  const jst = nowJST();
  const sb = getSupabase(c.env);
  await sb.from('orders').update({ status: 'inspecting', updated_at: jst })
    .eq('id', id).in('status', ['pending', 'printed']);
  return c.json({ success: true });
});

admin.delete('/orders/:id/inspections', async (c) => {
  const sb = getSupabase(c.env);
  await sb.from('inspection_logs').delete().eq('order_id', Number(c.req.param('id')));
  return c.json({ success: true });
});

// 検品完了 → ステータスを completed に
admin.post('/orders/:id/complete-inspection', async (c) => {
  const id = Number(c.req.param('id'));
  const jst = nowJST();
  const sb = getSupabase(c.env);
  await sb.from('orders').update({ status: 'completed', updated_at: jst }).eq('id', id);
  return c.json({ success: true });
});

// ========== 統計 ==========

admin.get('/stats', async (c) => {
  const sb = getSupabase(c.env);
  const [pendingR, activeR, completedR, productsR, cancelR] = await Promise.all([
    sb.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    sb.from('orders').select('id', { count: 'exact', head: true }).in('status', ['printed', 'inspecting']),
    sb.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
    sb.from('products').select('id', { count: 'exact', head: true }).eq('is_active', 1),
    sb.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'cancel_request'),
  ]);
  return c.json({
    orders: {
      pending: pendingR.count || 0,
      active: activeR.count || 0,
      completed: completedR.count || 0,
      cancel_request: cancelR.count || 0,
    },
    products: productsR.count || 0,
  });
});

export default admin;
