import { Hono } from 'hono';
import { signJwt, verifyPassword, getJwtSecret } from '../auth';
import { Bindings, Variables } from '../types';

const auth = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// 発注者ログイン
auth.post('/store/login', async (c) => {
  const { login_id, password } = await c.req.json();
  if (!login_id || !password) {
    return c.json({ error: 'ログインIDとパスワードを入力してください' }, 400);
  }

  const store = await c.env.DB.prepare(
    'SELECT * FROM stores WHERE login_id = ?'
  ).bind(login_id).first<any>();

  if (!store) {
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

  const admin = await c.env.DB.prepare(
    'SELECT * FROM admins WHERE username = ?'
  ).bind(username).first<any>();

  if (!admin) {
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
