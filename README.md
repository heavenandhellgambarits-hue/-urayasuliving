# OrderFlow - 汎用発注システム

## プロジェクト概要
- **システム名**: OrderFlow（管理画面から変更可能）
- **目的**: 汎用的な発注・受注管理システム
- **テナント形態**: シングルテナント
- **技術スタック**: Hono + TypeScript + Cloudflare Pages/D1

## アクセスURL
- **発注者ポータル**: `http://localhost:3000/`
- **管理者画面**: `http://localhost:3000/admin`
- **バーコード検品**: `http://localhost:3000/admin/inspection/{order_id}`

## ログイン情報（開発用）

### 管理者
| ユーザー名 | パスワード |
|-----------|-----------|
| admin     | admin123  |

### 発注者（店舗）
| ログインID       | パスワード | 店舗名   |
|----------------|-----------|---------|
| tokyo-honten   | admin123  | 東京本店 |
| osaka-shiten   | admin123  | 大阪支店 |
| test-store     | admin123  | テスト店舗 |

## 機能一覧

### 発注者ポータル
- [x] ログイン（店舗/部署単位）
- [x] 商品一覧からの発注（数量入力・カート機能）
- [x] カテゴリ・ブランドフィルター、キーワード検索
- [x] 発注履歴・ステータス確認
- [x] 発注詳細モーダル
- [x] お知らせ閲覧（種別アイコン・詳細表示）

### 管理者画面
- [x] 受注管理・進捗管理（ステータス更新）
- [x] ダッシュボード（統計・最新受注）
- [x] 商品マスタ（CRUD・CSV一括取込）
- [x] 発注元マスタ（店舗/部署 CRUD）
- [x] お知らせ管理（CRUD・種別・有効期限）
- [x] メール設定（Resend API連携・テスト送信）
- [x] システム設定（システム名・テーマカラー変更）
- [x] パスワード変更

### バーコード検品システム（管理者専用）
- [x] html5-qrcodeライブラリによるカメラスキャン
- [x] HIDキーボード入力（外付けバーコードリーダー）対応
- [x] 手動入力対応
- [x] スキャン一致 → 😊 + 正解音
- [x] スキャン不一致 → 👹 + エラー音
- [x] リアルタイム進捗表示
- [x] 全品一致で「出荷完了」ボタン活性化

## DBスキーマ
- **products**: 商品マスタ（category, brand, product_name, product_code, barcode, unit）
- **orders**: 発注ヘッダー（発注番号・店舗・ステータス）
- **order_items**: 発注明細
- **order_progress**: 進捗管理（完了・印刷・アラート）
- **stores**: 発注元マスタ（ログインID/パスワード含む）
- **notices**: お知らせ（種別・有効期限）
- **admins**: 管理者アカウント
- **email_settings**: Resend API設定
- **site_settings**: システム設定（KVS形式）
- **inspection_logs**: バーコード検品ログ

## 発注フロー
```
発注者が発注（pending）
  → 管理者が受注確認（confirmed）
  → 出荷準備中（preparing）
  → バーコード検品（inspecting）
  → 出荷完了（shipped）
```

## ステータス
- **Platform**: Cloudflare Pages (D1 database)
- **Status**: ✅ 動作中
- **Last Updated**: 2026-05-22

## 開発コマンド
```bash
npm run build         # ビルド
npm run db:migrate:local  # DBマイグレーション（ローカル）
npm run db:reset      # DBリセット＋シードデータ投入

pm2 start ecosystem.config.cjs   # 開発サーバー起動
pm2 restart orderflow            # 再起動
pm2 logs orderflow --nostream    # ログ確認
```
