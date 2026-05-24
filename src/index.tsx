import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import { Bindings, Variables } from './types';
import authRoutes from './routes/auth';
import storeRoutes from './routes/store';
import adminRoutes from './routes/admin';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use('*', cors());

// Static files
app.use('/static/*', serveStatic({ root: './public' }));

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/store', storeRoutes);
app.route('/api/admin', adminRoutes);

// Public settings
app.get('/api/settings', async (c) => {
  const { results } = await c.env.DB.prepare('SELECT key, value FROM site_settings').all();
  const settings: Record<string, string> = {};
  for (const row of results as any[]) {
    settings[row.key] = row.value;
  }
  return c.json({ settings });
});

// 検品ページ（管理者専用）
app.get('/admin/inspection/:orderId', async (c) => {
  const orderId = c.req.param('orderId');
  const { getInspectionPage } = await import('./pages/inspection-page');
  return c.html(getInspectionPage(orderId));
});

// Admin SPA
app.get('/admin', async (c) => {
  const { getAdminPage } = await import('./pages/admin-page');
  return c.html(getAdminPage());
});
app.get('/admin/*', async (c) => {
  const { getAdminPage } = await import('./pages/admin-page');
  return c.html(getAdminPage());
});

// Store Portal SPA
app.get('*', async (c) => {
  const { getStorePage } = await import('./pages/store-page');
  return c.html(getStorePage());
});

export default app;
