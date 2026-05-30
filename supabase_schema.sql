-- ========== OrderFlow PostgreSQL Schema for Supabase ==========

-- 商品マスタ
CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  category       TEXT,
  brand          TEXT,
  product_name   TEXT NOT NULL,
  product_code   TEXT,
  barcode        TEXT,
  unit           TEXT DEFAULT '個',
  gift_code      TEXT,
  unified_code   TEXT,
  supplier_code  TEXT,
  supplier_name  TEXT,
  stock_location TEXT,
  stock_ku       TEXT,
  stock_banchi   TEXT,
  is_active      INTEGER DEFAULT 1,
  is_new         INTEGER DEFAULT 0,
  registered_at  TIMESTAMP,
  updated_at     TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_product_code ON products(product_code);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);

-- 発注元マスタ
CREATE TABLE IF NOT EXISTS stores (
  id            SERIAL PRIMARY KEY,
  store_name    TEXT NOT NULL,
  section_name  TEXT,
  phone         TEXT,
  fax           TEXT,
  is_test       INTEGER DEFAULT 0,
  login_id      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- 発注
CREATE TABLE IF NOT EXISTS orders (
  id                    SERIAL PRIMARY KEY,
  order_no              TEXT UNIQUE NOT NULL,
  store_id              INTEGER NOT NULL REFERENCES stores(id),
  store_name            TEXT NOT NULL,
  section_name          TEXT,
  orderer_name          TEXT,
  desired_delivery_date TEXT,
  status                TEXT DEFAULT 'pending',
  note                  TEXT,
  cancel_requested      INTEGER DEFAULT 0,
  cancel_reason         TEXT,
  cancel_requested_at   TIMESTAMP,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON orders(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_order_no ON orders(order_no);

-- 発注明細
CREATE TABLE IF NOT EXISTS order_items (
  id             SERIAL PRIMARY KEY,
  order_id       INTEGER NOT NULL REFERENCES orders(id),
  product_id     INTEGER,
  product_name   TEXT NOT NULL,
  product_code   TEXT,
  barcode        TEXT,
  quantity       INTEGER NOT NULL DEFAULT 1,
  category       TEXT,
  brand          TEXT,
  unit           TEXT DEFAULT '個',
  gift_code      TEXT,
  unified_code   TEXT,
  supplier_code  TEXT,
  supplier_name  TEXT,
  stock_location TEXT,
  stock_ku       TEXT,
  stock_banchi   TEXT
);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 発注進捗
CREATE TABLE IF NOT EXISTS order_progress (
  id           SERIAL PRIMARY KEY,
  order_id     INTEGER UNIQUE NOT NULL REFERENCES orders(id),
  is_completed INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  worker_name  TEXT,
  printed_at   TIMESTAMP,
  alert_sent   INTEGER DEFAULT 0,
  updated_at   TIMESTAMP DEFAULT NOW()
);

-- お知らせ
CREATE TABLE IF NOT EXISTS notices (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  message         TEXT,
  body            TEXT,
  notice_type     TEXT DEFAULT 'general',
  order_id        INTEGER,
  expire_at       TIMESTAMP,
  attachment_url  TEXT,
  attachment_name TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);

-- 管理者
CREATE TABLE IF NOT EXISTS admins (
  id            SERIAL PRIMARY KEY,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- メール設定
CREATE TABLE IF NOT EXISTS email_settings (
  id             SERIAL PRIMARY KEY,
  main_email     TEXT,
  sub_email      TEXT,
  resend_api_key TEXT,
  updated_at     TIMESTAMP DEFAULT NOW()
);

-- サイト設定
CREATE TABLE IF NOT EXISTS site_settings (
  id         SERIAL PRIMARY KEY,
  key        TEXT UNIQUE NOT NULL,
  value      TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 検品ログ
CREATE TABLE IF NOT EXISTS inspection_logs (
  id              SERIAL PRIMARY KEY,
  order_id        INTEGER NOT NULL REFERENCES orders(id),
  product_id      INTEGER,
  barcode_scanned TEXT,
  is_match        INTEGER DEFAULT 0,
  scanned_at      TIMESTAMP DEFAULT NOW(),
  scanned_by      TEXT
);
CREATE INDEX IF NOT EXISTS idx_inspection_logs_order_id ON inspection_logs(order_id);

-- 発注番号連番管理
CREATE TABLE IF NOT EXISTS order_sequences (
  ymd      TEXT PRIMARY KEY,
  last_seq INTEGER DEFAULT 0
);

-- ========== 初期データ ==========
INSERT INTO site_settings (key, value) VALUES
  ('site_name',        'OrderFlow'),
  ('site_description', '汎用発注システム'),
  ('primary_color',    '#2563eb'),
  ('theme_preset',     'green')
ON CONFLICT (key) DO NOTHING;

INSERT INTO admins (username, password_hash, display_name) VALUES
  ('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '管理者')
ON CONFLICT (username) DO NOTHING;

INSERT INTO email_settings (id, main_email, sub_email, resend_api_key) VALUES
  (1, '', '', '')
ON CONFLICT (id) DO NOTHING;
