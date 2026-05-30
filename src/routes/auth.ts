import { Hono } from 'hono';
import { signJwt, verifyPassword, getJwtSecret } from '../auth';
import { Bindings, Variables } from '../types';
import { getSupabase } from '../lib/db';

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 発注者ログイン
auth.post('/store/login', async (c) => {
  const { login_id, password } = await c.req.json();
  if (!login_id || !password) {
    return c.json({ error: 'ログインIDとパスワードを入力してください' }, 400);
  }

  const sb = getSupabase(c.env);
  const { data: store, error } = await sb
    .from('stores')
    .select('*')
    .eq('login_id', login_id)
    .single();

  if (error || !store) {
    return c.json({ error: 'ログインIDまたはパスワードが正しくありません' }, 401);
  }

  const ok = await verifyPassword(password, store.password_hash);
  if (!ok) {
    return c.json({ error: 'ログインIDまたはパスワードが正しくありません' }, 401);
  }

  const token = await signJwt(
    { type: 'store', storeId: store.id, storeName: store.store_name },
    getJwtSecret(c.env)
  );

  return c.json({
    token,
    store: {
      id: store.id,
      store_name: store.store_name,
      section_name: store.section_name,
      login_id: store.login_id,
    },
  });
});

// 管理者ログイン
auth.post('/admin/login', async (c) => {
  const { username, password } = await c.req.json();
  if (!username || !password) {
    return c.json({ error: 'ユーザー名とパスワードを入力してください' }, 400);
  }

  const sb = getSupabase(c.env);
  const { data: admin, error } = await sb
    .from('admins')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !admin) {
    return c.json({ error: 'ユーザー名またはパスワードが正しくありません' }, 401);
  }

  const ok = await verifyPassword(password, admin.password_hash);
  if (!ok) {
    return c.json({ error: 'ユーザー名またはパスワードが正しくありません' }, 401);
  }

  const token = await signJwt(
    { type: 'admin', adminId: admin.id, username: admin.username },
    getJwtSecret(c.env)
  );

  return c.json({
    token,
    admin: {
      id: admin.id,
      username: admin.username,
      display_name: admin.display_name,
    },
  });
});

export default auth;
