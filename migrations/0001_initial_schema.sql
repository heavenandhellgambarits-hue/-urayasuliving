-- OrderFlow Initial Schema

-- 商品マスタ
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category TEXT,
  brand TEXT,
  product_name TEXT NOT NULL,
  product_code TEXT,
  barcode TEXT,
  unit TEXT DEFAULT '個',
  is_active INTEGER DEFAULT 1,
  is_new INTEGER DEFAULT 0,
  registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- 発注元マスタ（店舗/部署）
CREATE TABLE IF NOT EXISTS stores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  store_name TEXT NOT NULL,
  section_name TEXT,
  phone TEXT,
  fax TEXT,
  is_test INTEGER DEFAULT 0,
  login_id TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 発注
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_no TEXT UNIQUE NOT NULL,
  store_id INTEGER NOT NULL,
  store_name TEXT NOT NULL,
  section_name TEXT,
  orderer_name TEXT,
  desired_delivery_date TEXT,
  status TEXT DEFAULT 'pending',
  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (store_id) REFERENCES stores(id)
);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);

-- 発注明細
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  product_name TEXT NOT NULL,
  product_code TEXT,
  barcode TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  category TEXT,
  brand TEXT,
  unit TEXT DEFAULT '個',
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 発注進捗
CREATE TABLE IF NOT EXISTS order_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER UNIQUE NOT NULL,
  is_completed INTEGER DEFAULT 0,
  completed_at DATETIME,
  worker_name TEXT,
  printed_at DATETIME,
  alert_sent INTEGER DEFAULT 0,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- お知らせ
CREATE TABLE IF NOT EXISTS notices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  message TEXT,
  body TEXT,
  notice_type TEXT DEFAULT 'general',
  order_id INTEGER,
  expire_at DATETIME,
  attachment_url TEXT,
  attachment_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 管理者
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- メール設定
CREATE TABLE IF NOT EXISTS email_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  main_email TEXT,
  sub_email TEXT,
  resend_api_key TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- サイト設定
CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 検品ログ
CREATE TABLE IF NOT EXISTS inspection_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER,
  barcode_scanned TEXT,
  is_match INTEGER DEFAULT 0,
  scanned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  scanned_by TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE INDEX IF NOT EXISTS idx_inspection_logs_order_id ON inspection_logs(order_id);

-- 初期データ
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('site_name', 'OrderFlow');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('site_description', '汎用発注システム');
INSERT OR IGNORE INTO site_settings (key, value) VALUES ('primary_color', '#2563eb');

-- デフォルト管理者（admin / admin123）
INSERT OR IGNORE INTO admins (username, password_hash, display_name)
VALUES ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理者');

-- メール設定の初期レコード
INSERT OR IGNORE INTO email_settings (id, main_email, sub_email, resend_api_key)
VALUES (1, '', '', '');
