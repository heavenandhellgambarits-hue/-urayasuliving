-- サンプルデータ（開発・テスト用）

-- テスト店舗（パスワード: test1234）
INSERT OR IGNORE INTO stores (store_name, section_name, phone, login_id, password_hash, is_test)
VALUES 
  ('東京本店', '食品部', '03-1234-5678', 'tokyo-honten', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0),
  ('大阪支店', '生鮮部', '06-1234-5678', 'osaka-shiten', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 0),
  ('テスト店舗', 'テスト部門', '000-0000-0000', 'test-store', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 1);

-- サンプル商品
INSERT OR IGNORE INTO products (category, brand, product_name, product_code, barcode, unit, is_active, is_new)
VALUES
  ('飲料', 'サントリー', 'プレミアムモルツ 350ml', 'DRK-001', '4901777317871', '缶', 1, 1),
  ('飲料', 'キリン', '一番搾り 500ml', 'DRK-002', '4909411082948', '缶', 1, 0),
  ('食品', '日清', 'カップヌードル', 'FD-001', '4902105001295', '個', 1, 0),
  ('食品', '明治', 'チョコレート効果 72%', 'FD-002', '4902777012345', '箱', 1, 1),
  ('日用品', '花王', 'メリット シャンプー 400ml', 'HH-001', '4901301340856', '本', 1, 0),
  ('日用品', 'P&G', 'アリエール 洗濯洗剤 4.5kg', 'HH-002', '4902430724456', '袋', 1, 0),
  ('飲料', 'コカコーラ', 'コカ・コーラ 500ml PET', 'DRK-003', '4902102113465', '本', 1, 0),
  ('食品', '江崎グリコ', 'ポッキー チョコレート', 'FD-003', '4901005100014', '箱', 1, 0);

-- お知らせサンプル
INSERT OR IGNORE INTO notices (title, message, body, notice_type)
VALUES
  ('OrderFlow へようこそ', 'システムを開始しました。', 'OrderFlowへようこそ。このシステムでは商品の発注管理が簡単に行えます。', 'general'),
  ('年末年始の休業について', '12/29〜1/3は休業となります。', '年末年始（12月29日〜1月3日）は休業となります。ご発注はお早めにお願いします。', 'important');
