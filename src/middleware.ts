import { Context, Next } from 'hono';
import { verifyJwt, getJwtSecret } from './auth';
import { Bindings, Variables } from './types';

type AppContext = Context<{ Bindings: Bindings; Variables: Variables }>;

export async function storeAuthMiddleware(c: AppContext, next: Next) {
  const authHeader = c.req.header('Authorization');
  const cookieHeader = c.req.header('Cookie');

  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (cookieHeader) {
    const match = cookieHeader.match(/store_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const secret = getJwtSecret(c.env);
  const payload = await verifyJwt(token, secret);
  if (!payload || payload.type !== 'store') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('storeId', payload.storeId as number);
  c.set('storeName', payload.storeName as string);
  c.set('userType', 'store');
  await next();
}

export async function adminAuthMiddleware(c: AppContext, next: Next) {
  const authHeader = c.req.header('Authorization');
  const cookieHeader = c.req.header('Cookie');

  let token: string | undefined;

  if (authHeader?.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (cookieHeader) {
    const match = cookieHeader.match(/admin_token=([^;]+)/);
    if (match) token = match[1];
  }

  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const secret = getJwtSecret(c.env);
  const payload = await verifyJwt(token, secret);
  if (!payload || payload.type !== 'admin') {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  c.set('adminId', payload.adminId as number);
  c.set('adminUsername', payload.username as string);
  c.set('userType', 'admin');
  await next();
}
