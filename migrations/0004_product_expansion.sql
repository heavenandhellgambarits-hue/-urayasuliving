-- 商品マスタ拡張: ギフトコード・ロケーション・仕入先・統一コード追加
-- brand/unit は廃止（NULL許容のまま残してデータ互換を保つ）

ALTER TABLE products ADD COLUMN gift_code TEXT;          -- 7桁ギフトコード（半角数字）
ALTER TABLE products ADD COLUMN unified_code TEXT;       -- 統一コード（半角数字）
ALTER TABLE products ADD COLUMN supplier_code TEXT;      -- 仕入先コード（半角英数）
ALTER TABLE products ADD COLUMN supplier_name TEXT;      -- 仕入先名
ALTER TABLE products ADD COLUMN stock_location TEXT;     -- ストック場所（フリー）
ALTER TABLE products ADD COLUMN stock_ku INTEGER;        -- 区（半角数字）
ALTER TABLE products ADD COLUMN stock_banchi INTEGER;    -- 番地（半角数字）

-- 発注明細にギフトコード・ロケーション情報をスナップショット保存
ALTER TABLE order_items ADD COLUMN gift_code TEXT;
ALTER TABLE order_items ADD COLUMN unified_code TEXT;
ALTER TABLE order_items ADD COLUMN supplier_code TEXT;
ALTER TABLE order_items ADD COLUMN supplier_name TEXT;
ALTER TABLE order_items ADD COLUMN stock_location TEXT;
ALTER TABLE order_items ADD COLUMN stock_ku INTEGER;
ALTER TABLE order_items ADD COLUMN stock_banchi INTEGER;

-- キャンセル依頼フラグ
ALTER TABLE orders ADD COLUMN cancel_requested INTEGER DEFAULT 0;
ALTER TABLE orders ADD COLUMN cancel_reason TEXT;
ALTER TABLE orders ADD COLUMN cancel_requested_at DATETIME;

-- 発注番号の通し番号管理（YYYYMMDD毎のシーケンス）
CREATE TABLE IF NOT EXISTS order_sequences (
  ymd TEXT PRIMARY KEY,
  last_seq INTEGER DEFAULT 0
);

-- ステータスを新体系に更新
-- 未確認/印刷済/完了/キャンセル依頼/キャンセル済
UPDATE orders SET status = 'pending' WHERE status = 'pending';
UPDATE orders SET status = 'printed' WHERE status = 'confirmed';
UPDATE orders SET status = 'completed' WHERE status = 'shipped';
UPDATE orders SET status = 'cancelled' WHERE status = 'cancelled';
