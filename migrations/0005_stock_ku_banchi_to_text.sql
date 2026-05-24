-- stock_ku / stock_banchi を INTEGER → TEXT に変更（先頭0を保持するため）
-- SQLite は ALTER COLUMN 非対応のため、テーブル再作成方式で移行する

-- ===== products テーブル =====
-- 1. 現行データを一時テーブルにバックアップ（TEXT キャスト済み）
CREATE TABLE IF NOT EXISTS products_migration_tmp AS
  SELECT
    id, category, brand, product_name, product_code, barcode, unit,
    gift_code, unified_code, supplier_code, supplier_name,
    stock_location,
    CAST(stock_ku   AS TEXT) AS stock_ku,
    CAST(stock_banchi AS TEXT) AS stock_banchi,
    is_active, is_new, registered_at, updated_at
  FROM products;

-- 2. 旧テーブル削除
DROP TABLE products;

-- 3. 新テーブルを TEXT 型で再作成
CREATE TABLE products (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
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
  stock_ku       TEXT,   -- 先頭0を保持するため TEXT に変更
  stock_banchi   TEXT,   -- 先頭0を保持するため TEXT に変更
  is_active      INTEGER DEFAULT 1,
  is_new         INTEGER DEFAULT 0,
  registered_at  DATETIME,
  updated_at     DATETIME
);

-- 4. バックアップから復元
INSERT INTO products
  SELECT
    id, category, brand, product_name, product_code, barcode, unit,
    gift_code, unified_code, supplier_code, supplier_name,
    stock_location, stock_ku, stock_banchi,
    is_active, is_new, registered_at, updated_at
  FROM products_migration_tmp;

-- 5. 一時テーブル削除
DROP TABLE products_migration_tmp;

-- ===== order_items テーブル =====
CREATE TABLE IF NOT EXISTS order_items_migration_tmp AS
  SELECT
    id, order_id, product_id, product_name, product_code, barcode,
    quantity, category, brand, unit,
    gift_code, unified_code, supplier_code, supplier_name,
    stock_location,
    CAST(stock_ku   AS TEXT) AS stock_ku,
    CAST(stock_banchi AS TEXT) AS stock_banchi
  FROM order_items;

DROP TABLE order_items;

CREATE TABLE order_items (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id       INTEGER NOT NULL,
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
  stock_ku       TEXT,   -- 先頭0を保持するため TEXT に変更
  stock_banchi   TEXT    -- 先頭0を保持するため TEXT に変更
);

INSERT INTO order_items
  SELECT
    id, order_id, product_id, product_name, product_code, barcode,
    quantity, category, brand, unit,
    gift_code, unified_code, supplier_code, supplier_name,
    stock_location, stock_ku, stock_banchi
  FROM order_items_migration_tmp;

DROP TABLE order_items_migration_tmp;
