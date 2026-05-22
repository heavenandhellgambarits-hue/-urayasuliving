export function getAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>管理者画面 | OrderFlow</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{
  --p1:#5d8464; --p2:#3d6444; --p3:#2a4a30;
  --p-bg1:#f0f4f0; --p-bg2:#e4ece4;
  --p-card-border:rgba(180,210,180,.4);
  --p-input-border:#c8d8c0;
  --p-title:#3d6444;
  --p-line:#b0d0b0;
  --p-nav-hover-bg:rgba(93,132,100,.1);
  --p-nav-hover-fg:#3d6444;
  --p-tbl-bg1:#f0f7f0; --p-tbl-bg2:#e4f0e4;
  --p-tbl-border:rgba(180,210,180,.2);
  --p-hover-row:rgba(93,132,100,.04);
  --p-focus-ring:rgba(93,132,100,.15);
  --p-sidebar-bg:linear-gradient(180deg,#3d6444 0%,#2a4a30 100%);
  --p-sidebar-logo-bg:rgba(255,255,255,.18);
  --p-sidebar-text:rgba(255,255,255,.7);
  --p-sidebar-active-bg:rgba(255,255,255,.18);
  --p-loading-color:#5d8464;
  --p-upload-border:#b0d0b0;
  --p-toggle-on:#5d8464;
}
body{background:linear-gradient(135deg,var(--p-bg1) 0%,var(--p-bg2) 100%);min-height:100vh;
  font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;
  color:#1f2937;}
.card{background:rgba(255,255,255,.88);backdrop-filter:blur(8px);border-radius:14px;
  box-shadow:0 2px 16px rgba(80,110,80,.10),0 1px 4px rgba(0,0,0,.04);border:1px solid var(--p-card-border);}
.btn-p{background:linear-gradient(135deg,var(--p1),var(--p2));color:#fff;border-radius:9px;
  padding:8px 18px;font-weight:700;transition:all .2s;border:none;cursor:pointer;font-size:.875rem;}
.btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-s{background:linear-gradient(135deg,#f0ece4,#e4ddd0);color:#5a5040;border-radius:9px;
  padding:8px 18px;font-weight:700;transition:all .2s;border:1px solid rgba(160,140,100,.3);cursor:pointer;font-size:.875rem;}
.btn-s:hover{filter:brightness(.97);transform:translateY(-1px);}
.btn-d{background:linear-gradient(135deg,#e07070,#c05050);color:#fff;border-radius:8px;
  padding:5px 10px;font-size:.78rem;border:none;cursor:pointer;transition:all .2s;}
.btn-d:hover{filter:brightness(1.08);}
.btn-i{background:linear-gradient(135deg,#4a9cc0,#2a7aa0);color:#fff;border-radius:9px;
  padding:8px 18px;font-weight:700;transition:all .2s;border:none;cursor:pointer;font-size:.875rem;}
.btn-i:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-warn{background:linear-gradient(135deg,#f5a623,#e08000);color:#fff;border-radius:9px;
  padding:8px 18px;font-weight:700;transition:all .2s;border:none;cursor:pointer;font-size:.875rem;}
.btn-warn:hover{filter:brightness(1.07);transform:translateY(-1px);}
.form-input,.form-select{border:1.5px solid var(--p-input-border);border-radius:9px;padding:8px 12px;
  background:rgba(255,255,255,.9);transition:border-color .2s,box-shadow .2s;width:100%;font-size:.9rem;}
.form-input:focus,.form-select:focus{outline:none;border-color:var(--p1);box-shadow:0 0 0 3px var(--p-focus-ring);}
.nav-item{padding:10px 14px;border-radius:10px;cursor:pointer;transition:all .2s;
  display:flex;align-items:center;gap:10px;font-size:.875rem;font-weight:600;color:var(--p-sidebar-text);}
.nav-item:hover{background:var(--p-sidebar-active-bg);color:#fff;}
.nav-item.active{background:var(--p-sidebar-active-bg);color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.18);}
.sbadge{padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700;white-space:nowrap;}
.s-pending{background:#fff3cd;color:#856404;}
.s-confirmed{background:#d1ecf1;color:#0c5460;}
.s-preparing{background:#e8d5f5;color:#5a1fa2;}
.s-inspecting{background:#fce4ec;color:#8b174d;}
.s-shipped{background:#d1e7dd;color:#0a3622;}
.s-cancelled{background:#f8d7da;color:#842029;}
th{padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;color:var(--p-title);white-space:nowrap;}
td{padding:9px 12px;font-size:.85rem;border-bottom:1px solid var(--p-tbl-border);color:#374151;font-weight:500;}
tr:hover td{background:var(--p-hover-row);}
.tbl-header{background:linear-gradient(135deg,var(--p-tbl-bg1),var(--p-tbl-bg2));}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;
  display:flex;align-items:center;justify-content:center;padding:16px;}
.modal-box{background:#fff;border-radius:16px;padding:28px;width:100%;
  box-shadow:0 20px 60px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto;}
.sec-title{font-size:1rem;font-weight:700;color:var(--p-title);display:flex;align-items:center;gap:8px;margin-bottom:16px;}
.sec-title::after{content:'';flex:1;height:1px;background:linear-gradient(to right,var(--p-line),transparent);}
.loading{display:inline-block;width:16px;height:16px;border:2px solid #ccc;
  border-top-color:var(--p-loading-color);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
.fade-in{animation:fadeIn .3s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.new-badge{background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:#fff;font-size:.65rem;font-weight:700;
  padding:2px 6px;border-radius:6px;margin-left:4px;}
.drawer-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:150;display:none;}
.drawer-overlay.open{display:block;}
.drawer{position:fixed;top:0;left:0;bottom:0;width:260px;z-index:160;
  background:var(--p-sidebar-bg);
  transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);
  box-shadow:4px 0 20px rgba(0,0,0,.15);overflow-y:auto;}
.drawer.open{transform:translateX(0);}
.upload-zone{border:2px dashed var(--p-upload-border);border-radius:12px;padding:28px;text-align:center;
  cursor:pointer;transition:all .2s;background:rgba(240,250,240,.5);}
.upload-zone:hover{border-color:var(--p1);background:rgba(0,0,0,.03);}
.toggle-switch{position:relative;display:inline-block;width:44px;height:24px;}
.toggle-switch input{opacity:0;width:0;height:0;}
.toggle-slider{position:absolute;cursor:pointer;inset:0;background:#ccc;border-radius:24px;transition:.3s;}
.toggle-slider:before{position:absolute;content:'';width:18px;height:18px;left:3px;bottom:3px;
  background:#fff;border-radius:50%;transition:.3s;}
input:checked+.toggle-slider{background:var(--p-toggle-on);}
input:checked+.toggle-slider:before{transform:translateX(20px);}
.stat-card{background:rgba(255,255,255,.88);border-radius:14px;padding:20px 22px;
  border:1px solid var(--p-card-border);box-shadow:0 2px 10px rgba(80,110,80,.08);
  cursor:pointer;transition:all .2s;}
.stat-card:hover{transform:translateY(-2px);box-shadow:0 4px 18px rgba(80,110,80,.14);}
.page-section{display:none;}
.page-section.active{display:block;}
/* テーマ選択スウォッチ */
.theme-swatch{width:40px;height:40px;border-radius:10px;cursor:pointer;transition:all .2s;
  border:3px solid transparent;flex-shrink:0;}
.theme-swatch:hover{transform:scale(1.12);}
.theme-swatch.selected{border-color:#fff;box-shadow:0 0 0 3px var(--p1),0 2px 8px rgba(0,0,0,.2);transform:scale(1.1);}
/* アクセントカラーテキスト（テーマ連動） */
.p-accent{color:var(--p2);font-weight:700;}
.p-accent-link{color:var(--p2);font-weight:700;cursor:pointer;}
.p-accent-link:hover{text-decoration:underline;opacity:.85;}
/* サイドバー内のセクションラベル */
.sidebar-section-label{font-size:.7rem;font-weight:700;color:rgba(255,255,255,.55);
  letter-spacing:.08em;text-transform:uppercase;padding:12px 14px 4px;}
/* モーダル内 */
.modal-label{font-size:.78rem;font-weight:600;color:#374151;margin-bottom:4px;}
/* カード内の補助テキスト */
.meta-text{font-size:.78rem;color:#6b7280;}
/* stat-card見出し */
.stat-label{font-size:.75rem;font-weight:600;color:#4b5563;margin-bottom:4px;}
@media(max-width:768px){.sidebar-desktop{display:none!important;}.header-page-name{display:block;}}
@media(min-width:769px){.mobile-menu-btn{display:none!important;}.header-page-name{display:none;}}
</style>
</head>
<body>

<!-- ドロワーオーバーレイ(スマホ) -->
<div class="drawer-overlay" id="drawerOverlay" onclick="closeDrawer()"></div>
<div class="drawer" id="drawerMenu">
  <div class="p-4 border-b border-green-100">
    <div class="flex items-center gap-3 mb-2">
      <div style="background:linear-gradient(135deg,#5d8464,#3d6444);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-cog text-white text-sm"></i>
      </div>
      <div><p class="font-bold text-gray-800 text-sm">管理者メニュー</p>
        <p id="drawerAdminName" class="text-xs text-gray-400"></p></div>
    </div>
  </div>
  <nav class="p-3 space-y-1" id="drawerNav">
    <div class="nav-item active" data-page="dashboard" onclick="switchPage('dashboard')"><i class="fas fa-tachometer-alt w-4"></i>ダッシュボード</div>
    <div class="nav-item" data-page="orders" onclick="switchPage('orders')"><i class="fas fa-inbox w-4"></i>受注管理</div>
    <div class="sidebar-section-label">マスタ管理</div>
    <div class="nav-item" data-page="products" onclick="switchPage('products')"><i class="fas fa-box w-4"></i>商品マスタ</div>
    <div class="nav-item" data-page="stores" onclick="switchPage('stores')"><i class="fas fa-store w-4"></i>発注元マスタ</div>
    <div class="sidebar-section-label">設定</div>
    <div class="nav-item" data-page="notices" onclick="switchPage('notices')"><i class="fas fa-bell w-4"></i>お知らせ</div>
    <div class="nav-item" data-page="email" onclick="switchPage('email')"><i class="fas fa-envelope w-4"></i>メール設定</div>
    <div class="nav-item" data-page="settings" onclick="switchPage('settings')"><i class="fas fa-cog w-4"></i>システム設定</div>
  </nav>
  <div class="p-3 border-t border-gray-100 mt-2">
    <button onclick="doLogout()" class="btn-s w-full text-center"><i class="fas fa-sign-out-alt mr-2"></i>ログアウト</button>
  </div>
</div>

<!-- ログイン画面 -->
<div id="loginPage" class="min-h-screen flex items-center justify-center p-4">
  <div class="card p-8 w-full max-w-sm fade-in">
    <div class="text-center mb-6">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style="background:linear-gradient(135deg,#5d8464,#3d6444);">
        <i class="fas fa-lock text-white text-2xl"></i>
      </div>
      <h1 class="text-xl font-bold text-gray-800">管理者ログイン</h1>
      <p id="loginSiteName" class="text-xs text-gray-400 mt-1">OrderFlow</p>
    </div>
    <div class="space-y-4">
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">ユーザー名</label>
        <input type="text" id="loginUser" class="form-input" placeholder="admin" autocomplete="username"></div>
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">パスワード</label>
        <div class="relative">
          <input type="password" id="loginPass" class="form-input pr-10" placeholder="••••••••" autocomplete="current-password">
          <button type="button" onclick="togglePw('loginPass',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i class="fas fa-eye text-sm"></i></button>
        </div>
      </div>
      <div id="loginError" class="text-red-500 text-sm hidden text-center bg-red-50 rounded-lg p-2"></div>
      <button onclick="doLogin()" id="loginBtn" class="btn-p w-full py-3"><i class="fas fa-sign-in-alt mr-2"></i>ログイン</button>
    </div>
    <p class="text-center mt-4 text-xs text-gray-400">
      <a href="/" class="hover:underline p-accent-link"><i class="fas fa-arrow-left mr-1"></i>発注画面へ戻る</a>
    </p>
  </div>
</div>

<!-- メイン -->
<div id="mainPage" class="hidden flex">
  <!-- サイドバー(デスクトップ) -->
  <aside class="sidebar-desktop w-64 flex-shrink-0 min-h-screen p-4 sticky top-0 self-start" style="max-height:100vh;overflow-y:auto;">
    <div class="card p-4 mb-4">
      <div class="flex items-center gap-3">
        <div style="background:linear-gradient(135deg,#5d8464,#3d6444);width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-box text-white"></i>
        </div>
        <div>
          <p id="sidebarSiteName" class="font-bold text-gray-800 text-sm leading-tight">OrderFlow</p>
          <p class="text-xs text-gray-400">管理者画面</p>
        </div>
      </div>
    </div>
    <nav class="space-y-1">
      <div class="nav-item active" data-page="dashboard" onclick="switchPage('dashboard')"><i class="fas fa-tachometer-alt w-4"></i>ダッシュボード</div>
      <div class="nav-item" data-page="orders" onclick="switchPage('orders')"><i class="fas fa-inbox w-4"></i>受注管理</div>
      <div class="sidebar-section-label">マスタ管理</div>
      <div class="nav-item" data-page="products" onclick="switchPage('products')"><i class="fas fa-box w-4"></i>商品マスタ</div>
      <div class="nav-item" data-page="stores" onclick="switchPage('stores')"><i class="fas fa-store w-4"></i>発注元マスタ</div>
      <div class="sidebar-section-label">設定</div>
      <div class="nav-item" data-page="notices" onclick="switchPage('notices')"><i class="fas fa-bell w-4"></i>お知らせ</div>
      <div class="nav-item" data-page="email" onclick="switchPage('email')"><i class="fas fa-envelope w-4"></i>メール設定</div>
      <div class="nav-item" data-page="settings" onclick="switchPage('settings')"><i class="fas fa-cog w-4"></i>システム設定</div>
      <div class="mt-4 pt-3 border-t border-gray-100">
        <div class="nav-item" onclick="doLogout()"><i class="fas fa-sign-out-alt w-4"></i>ログアウト</div>
      </div>
    </nav>
  </aside>

  <!-- コンテンツエリア -->
  <div class="flex-1 min-w-0 p-4 md:p-6">
    <!-- ヘッダー -->
    <header class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <button class="mobile-menu-btn btn-s p-2 px-3" onclick="openDrawer()"><i class="fas fa-bars"></i></button>
        <h1 id="pageTitle" class="text-lg font-bold text-gray-800 header-page-name">ダッシュボード</h1>
        <h1 id="pageTitleDesktop" class="text-lg font-bold text-gray-800 hidden md:block">ダッシュボード</h1>
      </div>
      <span id="adminDisplayName" class="text-sm text-gray-700 font-semibold hidden sm:block"></span>
    </header>

    <!-- ダッシュボード -->
    <div id="page-dashboard" class="page-section active fade-in">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="stat-card" onclick="switchPage('orders');filterOrderStatus('pending')">
          <p class="stat-label">未確認の発注</p>
          <p id="statPending" class="text-3xl font-bold text-amber-600">-</p>
        </div>
        <div class="stat-card" onclick="switchPage('orders')">
          <p class="stat-label">対応中</p>
          <p id="statPreparing" class="text-3xl font-bold p-accent">-</p>
        </div>
        <div class="stat-card" onclick="switchPage('orders');filterOrderStatus('shipped')">
          <p class="stat-label">出荷完了（累計）</p>
          <p id="statShipped" class="text-3xl font-bold text-blue-600">-</p>
        </div>
        <div class="stat-card" onclick="switchPage('products')">
          <p class="stat-label">登録商品数</p>
          <p id="statProducts" class="text-3xl font-bold text-purple-600">-</p>
        </div>
      </div>
      <div class="card p-6">
        <div class="sec-title"><i class="fas fa-bell text-amber-500"></i> 未確認の発注</div>
        <div id="recentOrders"></div>
      </div>
    </div>

    <!-- 受注管理 -->
    <div id="page-orders" class="page-section fade-in">
      <div class="card p-5 mb-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="relative flex-1 min-w-[180px]">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" id="orderSearch" placeholder="発注番号・店舗名・担当者名" class="form-input pl-9" oninput="loadOrders()">
          </div>
          <select id="orderStatusFilter" class="form-select w-auto" onchange="loadOrders()">
            <option value="">全ステータス</option>
            <option value="pending">未確認</option>
            <option value="confirmed">受注確認済</option>
            <option value="preparing">出荷準備中</option>
            <option value="inspecting">検品中</option>
            <option value="shipped">出荷完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
          <button onclick="loadOrders()" class="btn-s px-3 py-2"><i class="fas fa-sync-alt"></i></button>
        </div>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="tbl-header">
              <tr><th>発注番号</th><th>店舗/部署</th><th>担当者</th><th>納品希望日</th><th>ステータス</th><th>発注日時</th><th>操作</th></tr>
            </thead>
            <tbody id="ordersTbody"><tr><td colspan="7" class="text-center py-8 text-gray-400"><span class="loading"></span></td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 商品マスタ -->
    <div id="page-products" class="page-section fade-in">
      <div class="card p-5 mb-4">
        <div class="flex flex-wrap gap-3 items-center">
          <div class="relative flex-1 min-w-[180px]">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" id="productSearchAdmin" placeholder="商品名・コード・バーコード検索" class="form-input pl-9" oninput="loadProducts()">
          </div>
          <button onclick="openProductModal()" class="btn-p"><i class="fas fa-plus mr-1"></i>商品追加</button>
          <button onclick="openImportModal()" class="btn-i"><i class="fas fa-file-import mr-1"></i>CSV取込</button>
        </div>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="tbl-header">
              <tr><th>カテゴリ</th><th>ブランド</th><th>商品名</th><th>商品コード</th><th>バーコード</th><th>単位</th><th>状態</th><th>操作</th></tr>
            </thead>
            <tbody id="productsTbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 発注元マスタ -->
    <div id="page-stores" class="page-section fade-in">
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-600 font-medium">発注元（店舗/部署）の管理</p>
        <button onclick="openStoreModal()" class="btn-p"><i class="fas fa-plus mr-1"></i>発注元追加</button>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="tbl-header"><tr><th>店舗名</th><th>部署名</th><th>電話番号</th><th>ログインID</th><th>テスト</th><th>操作</th></tr></thead>
            <tbody id="storesTbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- お知らせ管理 -->
    <div id="page-notices" class="page-section fade-in">
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-600 font-medium">発注者へのお知らせ管理</p>
        <button onclick="openNoticeModal()" class="btn-p"><i class="fas fa-plus mr-1"></i>お知らせ追加</button>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="tbl-header"><tr><th>タイトル</th><th>種類</th><th>有効期限</th><th>作成日</th><th>操作</th></tr></thead>
            <tbody id="noticesTbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- メール設定 -->
    <div id="page-email" class="page-section fade-in">
      <div class="card p-6" style="max-width:540px">
        <div class="sec-title"><i class="fas fa-envelope p-accent"></i> メール設定（Resend API）</div>
        <div class="space-y-4">
          <div><label class="block text-sm font-semibold text-gray-600 mb-1">メイン通知先メールアドレス</label>
            <input id="mainEmail" type="email" class="form-input" placeholder="admin@example.com"></div>
          <div><label class="block text-sm font-semibold text-gray-600 mb-1">サブ通知先（任意）</label>
            <input id="subEmail" type="email" class="form-input" placeholder="sub@example.com"></div>
          <div><label class="block text-sm font-semibold text-gray-600 mb-1">Resend APIキー</label>
            <div class="relative">
              <input id="resendApiKey" type="password" class="form-input pr-10" placeholder="re_xxxxx">
              <button type="button" onclick="togglePw('resendApiKey',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"><i class="fas fa-eye text-sm"></i></button>
            </div>
            <p class="text-xs text-gray-400 mt-1"><a href="https://resend.com" target="_blank" class="p-accent-link hover:underline">resend.com</a> でAPIキーを取得してください</p>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button onclick="saveEmailSettings()" class="btn-p"><i class="fas fa-save mr-1"></i>保存</button>
          <button onclick="sendTestEmail()" class="btn-s"><i class="fas fa-paper-plane mr-1"></i>テスト送信</button>
        </div>
      </div>
    </div>

    <!-- システム設定 -->
    <div id="page-settings" class="page-section fade-in">
      <div class="grid gap-6" style="max-width:520px">
        <div class="card p-6">
          <div class="sec-title"><i class="fas fa-cog p-accent"></i> 一般設定</div>
          <div class="space-y-4">
            <div><label class="block text-sm font-semibold text-gray-600 mb-1">システム名</label>
              <input id="settingSiteName" type="text" class="form-input" placeholder="OrderFlow"></div>
            <div><label class="block text-sm font-semibold text-gray-600 mb-1">説明文</label>
              <input id="settingSiteDesc" type="text" class="form-input" placeholder="汎用発注システム"></div>
            <div><label class="block text-sm font-semibold text-gray-600 mb-1">カラーテーマ</label>
              <div id="themeSwatches" class="flex gap-3 flex-wrap mt-2"></div>
              <p id="themeLabel" class="text-xs text-gray-400 mt-2"></p>
            </div>
          </div>
          <button onclick="saveSettings()" class="btn-p mt-5"><i class="fas fa-save mr-1"></i>設定を保存</button>
        </div>
        <div class="card p-6">
          <div class="sec-title"><i class="fas fa-key text-red-500"></i> パスワード変更</div>
          <div class="space-y-4">
            <div><label class="block text-sm font-semibold text-gray-600 mb-1">現在のパスワード</label>
              <input id="curPw" type="password" class="form-input"></div>
            <div><label class="block text-sm font-semibold text-gray-600 mb-1">新しいパスワード</label>
              <input id="newPw" type="password" class="form-input"></div>
            <div><label class="block text-sm font-semibold text-gray-600 mb-1">確認</label>
              <input id="confirmPw" type="password" class="form-input"></div>
          </div>
          <button onclick="changePassword()" class="btn-d mt-5" style="padding:8px 18px;border-radius:9px;font-size:.875rem;"><i class="fas fa-key mr-1"></i>パスワード変更</button>
        </div>
      </div>
    </div>

  </div>
</div>

<!-- 発注詳細モーダル -->
<div id="orderModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:760px">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-clipboard-list p-accent"></i>発注詳細</h2>
      <button onclick="closeModal('orderModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="orderModalContent"></div>
  </div>
</div>

<!-- 商品モーダル -->
<div id="productModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:520px">
    <div class="flex items-center justify-between mb-4">
      <h2 id="productModalTitle" class="text-lg font-bold text-gray-800">商品追加</h2>
      <button onclick="closeModal('productModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <form id="productForm" class="space-y-4" onsubmit="saveProduct(event)">
      <input type="hidden" id="productId">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">カテゴリ</label><input id="pCategory" type="text" class="form-input" placeholder="飲料"></div>
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">ブランド</label><input id="pBrand" type="text" class="form-input"></div>
      </div>
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">商品名 <span class="text-red-400">*</span></label><input id="pName" type="text" class="form-input" required></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">商品コード</label><input id="pCode" type="text" class="form-input"></div>
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">バーコード</label><input id="pBarcode" type="text" class="form-input" placeholder="JAN等"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">単位</label><input id="pUnit" type="text" class="form-input" placeholder="個"></div>
        <div class="flex gap-4 items-end pb-2">
          <label class="flex items-center gap-2 cursor-pointer text-sm"><input id="pIsActive" type="checkbox" checked class="w-4 h-4 accent-green-600"> 有効</label>
          <label class="flex items-center gap-2 cursor-pointer text-sm"><input id="pIsNew" type="checkbox" class="w-4 h-4 accent-red-500"> NEW</label>
        </div>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button" onclick="closeModal('productModal')" class="btn-s flex-1">キャンセル</button>
        <button type="submit" class="btn-p flex-1">保存</button>
      </div>
    </form>
  </div>
</div>

<!-- CSV取込モーダル -->
<div id="importModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:580px">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-file-import p-accent"></i>商品CSV取込</h2>
      <button onclick="closeModal('importModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <p class="text-sm text-gray-500 mb-2">1行目をヘッダーとして読み込みます。列名：<code class="bg-gray-100 px-1 rounded">category,brand,product_name,product_code,barcode,unit</code></p>
    <textarea id="csvInput" rows="10" class="form-input font-mono text-xs" placeholder="category,brand,product_name,product_code,barcode,unit
飲料,サントリー,プレミアムモルツ,DRK-001,4901777317871,缶"></textarea>
    <div class="flex gap-3 mt-4">
      <button onclick="closeModal('importModal')" class="btn-s flex-1">キャンセル</button>
      <button onclick="importCSV()" class="btn-p flex-1"><i class="fas fa-upload mr-1"></i>インポート</button>
    </div>
  </div>
</div>

<!-- 発注元モーダル -->
<div id="storeModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:500px">
    <div class="flex items-center justify-between mb-4">
      <h2 id="storeModalTitle" class="text-lg font-bold text-gray-800">発注元追加</h2>
      <button onclick="closeModal('storeModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <form id="storeForm" class="space-y-4" onsubmit="saveStore(event)">
      <input type="hidden" id="storeId">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">店舗名 <span class="text-red-400">*</span></label><input id="sName" type="text" class="form-input" required></div>
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">部署名</label><input id="sSection" type="text" class="form-input"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">電話番号</label><input id="sPhone" type="text" class="form-input"></div>
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">FAX</label><input id="sFax" type="text" class="form-input"></div>
      </div>
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">ログインID <span class="text-red-400">*</span></label><input id="sLoginId" type="text" class="form-input" required></div>
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">パスワード <span id="sPwReq" class="text-red-400">*</span></label>
        <div class="relative">
          <input id="sPassword" type="password" class="form-input pr-10">
          <button type="button" onclick="togglePw('sPassword',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-eye text-sm"></i></button>
        </div>
        <p id="sPwNote" class="text-xs text-gray-400 mt-1 hidden">変更する場合のみ入力してください</p>
      </div>
      <label class="flex items-center gap-2 cursor-pointer text-sm"><input id="sIsTest" type="checkbox" class="w-4 h-4 accent-yellow-500"> テスト店舗</label>
      <div class="flex gap-3 pt-2">
        <button type="button" onclick="closeModal('storeModal')" class="btn-s flex-1">キャンセル</button>
        <button type="submit" class="btn-p flex-1">保存</button>
      </div>
    </form>
  </div>
</div>

<!-- お知らせモーダル -->
<div id="noticeModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:520px">
    <div class="flex items-center justify-between mb-4">
      <h2 id="noticeModalTitle" class="text-lg font-bold text-gray-800">お知らせ追加</h2>
      <button onclick="closeModal('noticeModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <form id="noticeForm" class="space-y-4" onsubmit="saveNotice(event)">
      <input type="hidden" id="noticeId">
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">タイトル <span class="text-red-400">*</span></label><input id="nTitle" type="text" class="form-input" required></div>
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">概要（一覧表示用）</label><input id="nMessage" type="text" class="form-input" placeholder="短い説明文"></div>
      <div><label class="block text-sm font-semibold text-gray-600 mb-1">本文</label><textarea id="nBody" rows="5" class="form-input resize-none"></textarea></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">種類</label>
          <select id="nType" class="form-select">
            <option value="general">一般</option>
            <option value="important">重要</option>
            <option value="info">情報</option>
          </select>
        </div>
        <div><label class="block text-sm font-semibold text-gray-600 mb-1">有効期限</label><input id="nExpire" type="datetime-local" class="form-input"></div>
      </div>
      <div class="flex gap-3 pt-2">
        <button type="button" onclick="closeModal('noticeModal')" class="btn-s flex-1">キャンセル</button>
        <button type="submit" class="btn-p flex-1">保存</button>
      </div>
    </form>
  </div>
</div>

<!-- トースト -->
<div id="toast" class="fixed bottom-6 right-6 z-[300] hidden">
  <div id="toastInner" class="px-5 py-3 rounded-xl shadow-lg text-white font-semibold flex items-center gap-2 text-sm">
    <i id="toastIcon" class="fas fa-check-circle"></i><span id="toastMsg"></span>
  </div>
</div>

<script>
var adminToken = localStorage.getItem('admin_token');
var adminInfo  = JSON.parse(localStorage.getItem('admin_info') || 'null');
var siteName   = 'OrderFlow';
var currentPage = 'dashboard';

// ============ 初期化 ============
async function init() {
  await loadPublicSettings();
  if (adminToken && adminInfo) showMain();
  else document.getElementById('loginPage').classList.remove('hidden');
}

// ============ カラーテーマ ============
var THEMES_ADMIN = {
  green:  {p1:'#5d8464',p2:'#3d6444',p3:'#2a4a30',bg1:'#f0f4f0',bg2:'#e4ece4',cb:'rgba(180,210,180,.4)',ib:'#c8d8c0',tt:'#3d6444',ln:'#b0d0b0',nhb:'rgba(93,132,100,.1)',nhf:'#3d6444',tb1:'#f0f7f0',tb2:'#e4f0e4',tbr:'rgba(180,210,180,.2)',hr:'rgba(93,132,100,.04)',fr:'rgba(93,132,100,.15)',sbg:'linear-gradient(180deg,#3d6444 0%,#2a4a30 100%)',sab:'rgba(255,255,255,.18)',lc:'#5d8464',ub:'#b0d0b0',ton:'#5d8464'},
  blue:   {p1:'#3a6bbf',p2:'#1e4d9e',p3:'#0f3070',bg1:'#f0f4fc',bg2:'#e4ecf8',cb:'rgba(160,190,230,.4)',ib:'#b8cce0',tt:'#1e3a6e',ln:'#90b0d8',nhb:'rgba(58,107,191,.1)',nhf:'#1e4d9e',tb1:'#eef3fd',tb2:'#dde9fb',tbr:'rgba(160,190,230,.2)',hr:'rgba(58,107,191,.04)',fr:'rgba(91,141,217,.15)',sbg:'linear-gradient(180deg,#1e4d9e 0%,#0f3070 100%)',sab:'rgba(255,255,255,.18)',lc:'#3a6bbf',ub:'#90b0d8',ton:'#3a6bbf'},
  purple: {p1:'#6a52a8',p2:'#4e3888',p3:'#361c6c',bg1:'#f5f0fc',bg2:'#ece4f8',cb:'rgba(190,170,225,.4)',ib:'#c8b8e0',tt:'#3d2878',ln:'#b098d0',nhb:'rgba(106,82,168,.1)',nhf:'#4e3888',tb1:'#f4f0fd',tb2:'#e8e0fb',tbr:'rgba(180,160,220,.2)',hr:'rgba(106,82,168,.04)',fr:'rgba(139,114,200,.15)',sbg:'linear-gradient(180deg,#4e3888 0%,#361c6c 100%)',sab:'rgba(255,255,255,.18)',lc:'#6a52a8',ub:'#b098d0',ton:'#6a52a8'},
  orange: {p1:'#c06820',p2:'#a05010',p3:'#803808',bg1:'#fef5ec',bg2:'#fde8d4',cb:'rgba(225,185,145,.4)',ib:'#e8c898',tt:'#7a3a10',ln:'#d8a870',nhb:'rgba(192,104,32,.1)',nhf:'#a05010',tb1:'#fdf4e8',tb2:'#fbe8d0',tbr:'rgba(220,180,130,.2)',hr:'rgba(192,104,32,.04)',fr:'rgba(224,134,58,.15)',sbg:'linear-gradient(180deg,#a05010 0%,#803808 100%)',sab:'rgba(255,255,255,.18)',lc:'#c06820',ub:'#d8a870',ton:'#c06820'},
  slate:  {p1:'#455a64',p2:'#2e3f46',p3:'#1c2b30',bg1:'#f2f5f7',bg2:'#e6ebed',cb:'rgba(170,190,200,.4)',ib:'#b8ccd4',tt:'#2e3f46',ln:'#98b4bc',nhb:'rgba(69,90,100,.1)',nhf:'#2e3f46',tb1:'#eef4f8',tb2:'#dce8ee',tbr:'rgba(160,190,205,.2)',hr:'rgba(69,90,100,.04)',fr:'rgba(96,125,139,.15)',sbg:'linear-gradient(180deg,#2e3f46 0%,#1c2b30 100%)',sab:'rgba(255,255,255,.18)',lc:'#455a64',ub:'#98b4bc',ton:'#455a64'},
  rose:   {p1:'#b85070',p2:'#943050',p3:'#701838',bg1:'#fdf4f6',bg2:'#f8e8ec',cb:'rgba(218,168,178,.4)',ib:'#e0b0c0',tt:'#7a2038',ln:'#d898a8',nhb:'rgba(184,80,112,.1)',nhf:'#943050',tb1:'#fdf0f4',tb2:'#fae0e8',tbr:'rgba(220,170,185,.2)',hr:'rgba(184,80,112,.04)',fr:'rgba(212,116,138,.15)',sbg:'linear-gradient(180deg,#943050 0%,#701838 100%)',sab:'rgba(255,255,255,.18)',lc:'#b85070',ub:'#d898a8',ton:'#b85070'}
};
var THEME_NAMES = {green:'グリーン',blue:'ブルー',purple:'パープル',orange:'オレンジ',slate:'スレート',rose:'ローズ'};
var currentTheme = 'green';

function applyTheme(preset) {
  var t = THEMES_ADMIN[preset] || THEMES_ADMIN.green;
  currentTheme = preset || 'green';
  var r = document.documentElement.style;
  r.setProperty('--p1',                   t.p1);
  r.setProperty('--p2',                   t.p2);
  r.setProperty('--p3',                   t.p3);
  r.setProperty('--p-bg1',                t.bg1);
  r.setProperty('--p-bg2',                t.bg2);
  r.setProperty('--p-card-border',        t.cb);
  r.setProperty('--p-input-border',       t.ib);
  r.setProperty('--p-title',              t.tt);
  r.setProperty('--p-line',               t.ln);
  r.setProperty('--p-nav-hover-bg',       t.nhb);
  r.setProperty('--p-nav-hover-fg',       t.nhf);
  r.setProperty('--p-tbl-bg1',            t.tb1);
  r.setProperty('--p-tbl-bg2',            t.tb2);
  r.setProperty('--p-tbl-border',         t.tbr);
  r.setProperty('--p-hover-row',          t.hr);
  r.setProperty('--p-focus-ring',         t.fr);
  r.setProperty('--p-sidebar-bg',         t.sbg);
  r.setProperty('--p-sidebar-active-bg',  t.sab);
  r.setProperty('--p-loading-color',      t.lc);
  r.setProperty('--p-upload-border',      t.ub);
  r.setProperty('--p-toggle-on',          t.ton);
  // ドロワー・ログインボタンのインラインスタイル更新
  document.querySelectorAll('[data-theme-gradient]').forEach(function(el){
    el.style.background = 'linear-gradient(135deg,' + t.p1 + ',' + t.p2 + ')';
  });
  document.querySelectorAll('[data-theme-sidebar]').forEach(function(el){
    el.style.background = t.sbg;
  });
}

async function loadPublicSettings() {
  try {
    var d = await (await fetch('/api/settings')).json();
    siteName = d.settings.site_name || 'OrderFlow';
    document.getElementById('loginSiteName').textContent = siteName;
    document.title = '管理者画面 | ' + siteName;
    applyTheme(d.settings.theme_preset || 'green');
  } catch(e) {}
}

function togglePw(id, btn) {
  var el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.querySelector('i').className = el.type === 'password' ? 'fas fa-eye text-sm' : 'fas fa-eye-slash text-sm';
}

async function doLogin() {
  var user = document.getElementById('loginUser').value.trim();
  var pw   = document.getElementById('loginPass').value;
  var err  = document.getElementById('loginError');
  var btn  = document.getElementById('loginBtn');
  err.classList.add('hidden');
  btn.disabled = true; btn.innerHTML = '<span class="loading"></span>';
  try {
    var res = await fetch('/api/auth/admin/login', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({username:user, password:pw})
    });
    var data = await res.json();
    if (!res.ok) { err.textContent = data.error||'ログイン失敗'; err.classList.remove('hidden'); return; }
    adminToken = data.token; adminInfo = data.admin;
    localStorage.setItem('admin_token', adminToken);
    localStorage.setItem('admin_info', JSON.stringify(adminInfo));
    showMain();
  } catch(e) { err.textContent = 'ネットワークエラー'; err.classList.remove('hidden');
  } finally { btn.disabled=false; btn.innerHTML='<i class="fas fa-sign-in-alt mr-2"></i>ログイン'; }
}
document.addEventListener('keydown', function(e){ if(e.key==='Enter' && !document.getElementById('loginPage').classList.contains('hidden')) doLogin(); });

function doLogout() {
  if (!confirm('ログアウトしますか？')) return;
  localStorage.removeItem('admin_token'); localStorage.removeItem('admin_info');
  location.reload();
}

function showMain() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainPage').classList.remove('hidden');
  document.getElementById('sidebarSiteName').textContent = siteName;
  if (adminInfo) {
    var name = adminInfo.display_name || adminInfo.username;
    document.getElementById('adminDisplayName').textContent = name;
    document.getElementById('drawerAdminName').textContent  = name;
  }
  switchPage('dashboard');
}

// ============ ページ切替 ============
var pageNames = {dashboard:'ダッシュボード',orders:'受注管理',products:'商品マスタ',stores:'発注元マスタ',notices:'お知らせ管理',email:'メール設定',settings:'システム設定'};
function switchPage(page) {
  closeDrawer();
  currentPage = page;
  document.querySelectorAll('.page-section').forEach(function(el){ el.classList.remove('active'); });
  var sec = document.getElementById('page-'+page);
  if (sec) { sec.classList.add('active'); }
  document.querySelectorAll('.nav-item[data-page]').forEach(function(el){
    el.classList.toggle('active', el.dataset.page === page);
  });
  var t = pageNames[page] || page;
  document.getElementById('pageTitle').textContent        = t;
  document.getElementById('pageTitleDesktop').textContent = t;

  if (page==='dashboard') loadDashboard();
  else if (page==='orders')   loadOrders();
  else if (page==='products') loadProducts();
  else if (page==='stores')   loadStores();
  else if (page==='notices')  loadNoticesAdmin();
  else if (page==='email')    loadEmailSettings();
  else if (page==='settings') loadSettings();
}

function filterOrderStatus(status) {
  document.getElementById('orderStatusFilter').value = status;
  loadOrders();
}

// ============ ドロワー ============
function openDrawer()  { document.getElementById('drawerMenu').classList.add('open'); document.getElementById('drawerOverlay').classList.add('open'); }
function closeDrawer() { document.getElementById('drawerMenu').classList.remove('open'); document.getElementById('drawerOverlay').classList.remove('open'); }

// ============ API ============
async function apiFetch(url, opts) {
  opts = opts || {};
  var h = {'Content-Type':'application/json'};
  if (opts.headers) Object.assign(h, opts.headers);
  if (adminToken) h['Authorization'] = 'Bearer ' + adminToken;
  var res = await fetch(url, Object.assign({}, opts, {headers:h}));
  if (res.status === 401) { doLogout(); throw new Error('Unauthorized'); }
  return res;
}

// ============ ダッシュボード ============
async function loadDashboard() {
  try {
    var res = await apiFetch('/api/admin/stats');
    var d   = await res.json();
    document.getElementById('statPending').textContent  = d.orders.pending;
    document.getElementById('statPreparing').textContent= d.orders.preparing;
    document.getElementById('statShipped').textContent  = d.orders.shipped;
    document.getElementById('statProducts').textContent = d.products;
    var res2 = await apiFetch('/api/admin/orders?status=pending');
    var d2   = await res2.json();
    var recent = (d2.orders||[]).slice(0,5);
    var el = document.getElementById('recentOrders');
    if (recent.length===0){ el.innerHTML='<p class="text-gray-400 text-sm py-4 text-center">未確認の発注はありません</p>'; return; }
    el.innerHTML = '<div class="space-y-2">' + recent.map(function(o){
      return '<div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-green-50 transition-colors" onclick="goDashboardOrder('+o.id+')" style="cursor:pointer">'
        + '<div><p class="font-bold text-sm p-accent">'+o.order_no+'</p>'
        + '<p class="text-xs text-gray-500">'+o.store_name+(o.section_name?' / '+o.section_name:'')+'</p></div>'
        + '<span class="sbadge s-pending">未確認</span>'
        + '</div>';
    }).join('') + '</div>';
  } catch(e) {}
}

// ============ 受注管理 ============
var statusLabel = {pending:'未確認',confirmed:'受注確認済',preparing:'出荷準備中',inspecting:'検品中',shipped:'出荷完了',cancelled:'キャンセル'};
var statusCls   = {pending:'s-pending',confirmed:'s-confirmed',preparing:'s-preparing',inspecting:'s-inspecting',shipped:'s-shipped',cancelled:'s-cancelled'};

async function loadOrders() {
  var search = document.getElementById('orderSearch')?.value||'';
  var status = document.getElementById('orderStatusFilter')?.value||'';
  var url = '/api/admin/orders?';
  if (search) url += 'search='+encodeURIComponent(search)+'&';
  if (status) url += 'status='+status;
  var res  = await apiFetch(url);
  var data = await res.json();
  var tbody = document.getElementById('ordersTbody');
  var orders = data.orders||[];
  if (orders.length===0){ tbody.innerHTML='<tr><td colspan="7" class="text-center py-8 text-gray-400">発注はありません</td></tr>'; return; }
  tbody.innerHTML = orders.map(function(o){
    return '<tr>'
      +'<td><span class="font-bold cursor-pointer hover:underline p-accent-link" onclick="showOrderDetail('+o.id+')">'+o.order_no+'</span></td>'
      +'<td>'+o.store_name+'<br><span class="text-xs text-gray-400">'+(o.section_name||'')+'</span></td>'
      +'<td>'+(o.orderer_name||'-')+'</td>'
      +'<td>'+(o.desired_delivery_date||'-')+'</td>'
      +'<td><span class="sbadge '+(statusCls[o.status]||'')+'">'+( statusLabel[o.status]||o.status)+'</span></td>'
      +'<td class="text-xs text-gray-500">'+fmtDate(o.created_at)+'</td>'
      +'<td class="flex items-center gap-2 py-2">'
      +'<select class="form-select text-xs py-1 px-2 w-auto" style="width:auto" onchange="updateStatus('+o.id+',this.value)">'
      +['pending','confirmed','preparing','inspecting','shipped','cancelled'].map(function(s){ return '<option value="'+s+'"'+(s===o.status?' selected':'')+'>'+statusLabel[s]+'</option>'; }).join('')
      +'</select>'
      +'<button onclick="showOrderDetail('+o.id+')" class="p-accent-link text-sm"><i class="fas fa-eye"></i></button>'
      +'</td></tr>';
  }).join('');
}

async function updateStatus(id, status) {
  var res = await apiFetch('/api/admin/orders/'+id+'/status', {method:'PUT', body:JSON.stringify({status:status})});
  if (res.ok) showToast('ステータスを更新しました'); else showToast('更新に失敗しました','error');
  loadOrders();
}

async function showOrderDetail(id) {
  var res = await apiFetch('/api/admin/orders/'+id);
  var d = await res.json();
  var order=d.order, items=d.items, inspections=d.inspections||[];
  var inspectedBarcodes = new Set(inspections.filter(function(i){return i.is_match;}).map(function(i){return i.barcode_scanned;}));
  document.getElementById('orderModalContent').innerHTML =
    '<div class="space-y-4">'
    +'<div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">'
    +'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">発注番号</p><p class="font-bold p-accent">'+order.order_no+'</p></div>'
    +'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">ステータス</p>'
    +'<select class="form-select text-xs py-1 px-2" onchange="updateStatusAndClose('+order.id+',this.value)">'
    +['pending','confirmed','preparing','inspecting','shipped','cancelled'].map(function(s){ return '<option value="'+s+'"'+(s===order.status?' selected':'')+'>'+statusLabel[s]+'</option>'; }).join('')
    +'</select></div>'
    +'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">発注日時</p><p>'+fmtDate(order.created_at)+'</p></div>'
    +'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">店舗/部署</p><p>'+order.store_name+(order.section_name?' / '+order.section_name:'')+'</p></div>'
    +'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">担当者</p><p>'+(order.orderer_name||'-')+'</p></div>'
    +'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">納品希望日</p><p>'+(order.desired_delivery_date||'-')+'</p></div>'
    +(order.worker_name?'<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">作業者</p><p>'+order.worker_name+'</p></div>':'')
    +'</div>'
    +(order.note?'<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm"><p class="text-xs text-amber-600 mb-1 font-semibold">備考</p><p>'+order.note+'</p></div>':'')
    +'<div class="sec-title mt-2"><i class="fas fa-list p-accent"></i> 発注明細</div>'
    +'<div class="overflow-x-auto"><table class="w-full text-sm"><thead class="tbl-header"><tr><th>商品名</th><th>ブランド</th><th>コード</th><th>バーコード</th><th>数量</th><th>検品</th></tr></thead><tbody>'
    +items.map(function(i){
      var matched = i.barcode && inspectedBarcodes.has(i.barcode);
      return '<tr><td>'+i.product_name+'</td><td class="text-gray-500">'+(i.brand||'-')+'</td>'
        +'<td class="text-xs text-gray-400 font-mono">'+(i.product_code||'-')+'</td>'
        +'<td class="text-xs text-gray-400 font-mono">'+(i.barcode||'-')+'</td>'
        +'<td class="font-bold text-right p-accent">'+i.quantity+(i.unit||'')+'</td>'
        +'<td class="text-center">'+(matched?'<i class="fas fa-check-circle text-green-500"></i>':'<i class="far fa-circle text-gray-300"></i>')+'</td></tr>';
    }).join('')
    +'</tbody></table></div>'
    +'<div class="flex flex-wrap gap-3 mt-2">'
    +'<button onclick="printOrder('+order.id+')" class="btn-s text-sm"><i class="fas fa-print mr-1"></i>印刷</button>'
    +'<button onclick="goInspection('+order.id+')" class="btn-p text-sm"><i class="fas fa-barcode mr-1"></i>検品する</button>'
    +'</div></div>';
  document.getElementById('orderModal').classList.remove('hidden');
}

function printOrder(id) { apiFetch('/api/admin/orders/'+id+'/printed',{method:'PUT'}); window.print(); }
function goInspection(id) { closeModal('orderModal'); window.location.href='/admin/inspection/'+id; }
function goDashboardOrder(id) { switchPage('orders'); setTimeout(function(){ showOrderDetail(id); }, 300); }
function updateStatusAndClose(id, status) { updateStatus(id, status); closeModal('orderModal'); }

// ============ 商品マスタ ============
async function loadProducts() {
  var search = document.getElementById('productSearchAdmin')?.value||'';
  var url = '/api/admin/products'+(search?'?search='+encodeURIComponent(search):'');
  var res  = await apiFetch(url);
  var data = await res.json();
  var tbody = document.getElementById('productsTbody');
  var prods = data.products||[];
  if (prods.length===0){ tbody.innerHTML='<tr><td colspan="8" class="text-center py-8 text-gray-400">商品がありません</td></tr>'; return; }
  tbody.innerHTML = prods.map(function(p){
    return '<tr>'
      +'<td><span class="sbadge" style="background:#e8f5e9;color:#2e7d32">'+(p.category||'-')+'</span></td>'
      +'<td class="text-gray-500 text-xs">'+(p.brand||'-')+'</td>'
      +'<td class="font-medium">'+(p.is_new?'<span class="new-badge">NEW</span>':'')+' '+p.product_name+'</td>'
      +'<td class="text-xs text-gray-400 font-mono">'+(p.product_code||'-')+'</td>'
      +'<td class="text-xs text-gray-400 font-mono">'+(p.barcode||'-')+'</td>'
      +'<td>'+(p.unit||'個')+'</td>'
      +'<td><span class="sbadge '+(p.is_active?'s-shipped':'s-cancelled')+'">'+(p.is_active?'有効':'無効')+'</span></td>'
      +'<td class="flex items-center gap-2">'
      +'<button onclick="openProductModal('+p.id+')" class="text-xs btn-s py-1 px-2"><i class="fas fa-edit mr-1"></i>編集</button>'
      +'<button onclick="deleteProduct('+p.id+')" class="btn-d"><i class="fas fa-trash"></i></button>'
      +'</td></tr>';
  }).join('');
}

async function openProductModal(id) {
  id = id || null;
  document.getElementById('productModalTitle').textContent = id ? '商品編集' : '商品追加';
  document.getElementById('productId').value = id||'';
  if (id) {
    var res=await apiFetch('/api/admin/products'); var data=await res.json();
    var p=data.products.find(function(x){return x.id===id;});
    if (p) {
      document.getElementById('pCategory').value=p.category||'';
      document.getElementById('pBrand').value=p.brand||'';
      document.getElementById('pName').value=p.product_name||'';
      document.getElementById('pCode').value=p.product_code||'';
      document.getElementById('pBarcode').value=p.barcode||'';
      document.getElementById('pUnit').value=p.unit||'個';
      document.getElementById('pIsActive').checked=!!p.is_active;
      document.getElementById('pIsNew').checked=!!p.is_new;
    }
  } else {
    document.getElementById('productForm').reset();
    document.getElementById('pUnit').value='個';
    document.getElementById('pIsActive').checked=true;
  }
  document.getElementById('productModal').classList.remove('hidden');
}

async function saveProduct(e) {
  e.preventDefault();
  var id=document.getElementById('productId').value;
  var body={category:document.getElementById('pCategory').value,brand:document.getElementById('pBrand').value,
    product_name:document.getElementById('pName').value,product_code:document.getElementById('pCode').value,
    barcode:document.getElementById('pBarcode').value,unit:document.getElementById('pUnit').value||'個',
    is_active:document.getElementById('pIsActive').checked?1:0,is_new:document.getElementById('pIsNew').checked?1:0};
  var url=id?'/api/admin/products/'+id:'/api/admin/products';
  var res=await apiFetch(url,{method:id?'PUT':'POST',body:JSON.stringify(body)});
  if(res.ok){showToast(id?'商品を更新しました':'商品を追加しました');closeModal('productModal');loadProducts();}
  else showToast('保存に失敗しました','error');
}

async function deleteProduct(id) {
  if (!confirm('この商品を無効にしますか？')) return;
  await apiFetch('/api/admin/products/'+id,{method:'DELETE'});
  showToast('商品を無効にしました'); loadProducts();
}

function openImportModal() { document.getElementById('csvInput').value=''; document.getElementById('importModal').classList.remove('hidden'); }

async function importCSV() {
  var csv=document.getElementById('csvInput').value.trim();
  if(!csv) return;
  var lines=csv.split(String.fromCharCode(10)).filter(function(l){return l.trim();});
  var headers=lines[0].split(',').map(function(h){return h.trim();});
  var rows=lines.slice(1).map(function(line){
    var vals=line.split(',').map(function(v){return v.trim();});
    var obj={};
    headers.forEach(function(h,i){obj[h]=vals[i]||'';});
    return obj;
  });
  var res=await apiFetch('/api/admin/products/import',{method:'POST',body:JSON.stringify({rows:rows})});
  var data=await res.json();
  if(res.ok){showToast(data.imported+'件インポートしました');closeModal('importModal');loadProducts();}
  else showToast('インポートに失敗しました','error');
}

// ============ 発注元マスタ ============
async function loadStores() {
  var res=await apiFetch('/api/admin/stores');
  var data=await res.json();
  var tbody=document.getElementById('storesTbody');
  var stores=data.stores||[];
  if(stores.length===0){tbody.innerHTML='<tr><td colspan="6" class="text-center py-8 text-gray-400">発注元がありません</td></tr>';return;}
  tbody.innerHTML=stores.map(function(s){
    return '<tr>'
      +'<td class="font-medium">'+s.store_name+'</td>'
      +'<td class="text-gray-500">'+(s.section_name||'-')+'</td>'
      +'<td class="text-gray-500">'+(s.phone||'-')+'</td>'
      +'<td class="font-mono text-sm p-accent">'+s.login_id+'</td>'
      +'<td>'+(s.is_test?'<span class="sbadge" style="background:#fef3c7;color:#b45309">テスト</span>':'')+'</td>'
      +'<td class="flex items-center gap-2">'
      +'<button onclick="openStoreModal('+s.id+')" class="text-xs btn-s py-1 px-2"><i class="fas fa-edit mr-1"></i>編集</button>'
      +'<button onclick="deleteStore('+s.id+')" class="btn-d"><i class="fas fa-trash"></i></button>'
      +'</td></tr>';
  }).join('');
}

async function openStoreModal(id) {
  id = id || null;
  document.getElementById('storeModalTitle').textContent = id?'発注元編集':'発注元追加';
  document.getElementById('storeId').value = id||'';
  document.getElementById('sPwNote').classList.toggle('hidden',!id);
  document.getElementById('sPwReq').classList.toggle('hidden',!!id);
  if (id) {
    var res=await apiFetch('/api/admin/stores'); var data=await res.json();
    var s=data.stores.find(function(x){return x.id===id;});
    if(s){document.getElementById('sName').value=s.store_name||'';document.getElementById('sSection').value=s.section_name||'';document.getElementById('sPhone').value=s.phone||'';document.getElementById('sFax').value=s.fax||'';document.getElementById('sLoginId').value=s.login_id||'';document.getElementById('sPassword').value='';document.getElementById('sIsTest').checked=!!s.is_test;}
  } else { document.getElementById('storeForm').reset(); }
  document.getElementById('storeModal').classList.remove('hidden');
}

async function saveStore(e) {
  e.preventDefault();
  var id=document.getElementById('storeId').value;
  var body={store_name:document.getElementById('sName').value,section_name:document.getElementById('sSection').value,
    phone:document.getElementById('sPhone').value,fax:document.getElementById('sFax').value,
    login_id:document.getElementById('sLoginId').value,password:document.getElementById('sPassword').value,
    is_test:document.getElementById('sIsTest').checked};
  var res=await apiFetch(id?'/api/admin/stores/'+id:'/api/admin/stores',{method:id?'PUT':'POST',body:JSON.stringify(body)});
  if(res.ok){showToast(id?'発注元を更新しました':'発注元を追加しました');closeModal('storeModal');loadStores();}
  else{var d=await res.json();showToast(d.error||'保存に失敗しました','error');}
}

async function deleteStore(id) {
  if(!confirm('この発注元を削除しますか？'))return;
  await apiFetch('/api/admin/stores/'+id,{method:'DELETE'});
  showToast('削除しました');loadStores();
}

// ============ お知らせ管理 ============
var allNoticesAdmin = [];
async function loadNoticesAdmin() {
  var res=await apiFetch('/api/admin/notices'); var data=await res.json();
  allNoticesAdmin = data.notices||[];
  var tbody=document.getElementById('noticesTbody');
  var typeLabel={general:'一般',important:'重要',info:'情報'};
  var typeBg={general:'background:#dbeafe;color:#1e40af',important:'background:#fee2e2;color:#991b1b',info:'background:#d1fae5;color:#065f46'};
  if(allNoticesAdmin.length===0){tbody.innerHTML='<tr><td colspan="5" class="text-center py-8 text-gray-400">お知らせがありません</td></tr>';return;}
  tbody.innerHTML=allNoticesAdmin.map(function(n){
    return '<tr>'
      +'<td class="font-medium">'+n.title+'</td>'
      +'<td><span class="sbadge" style="'+(typeBg[n.notice_type]||typeBg.general)+'">'+(typeLabel[n.notice_type]||n.notice_type)+'</span></td>'
      +'<td class="text-xs text-gray-400">'+(n.expire_at?fmtDate(n.expire_at):'無期限')+'</td>'
      +'<td class="text-xs text-gray-400">'+fmtDate(n.created_at)+'</td>'
      +'<td class="flex items-center gap-2">'
      +'<button onclick="openNoticeModal('+n.id+')" class="text-xs btn-s py-1 px-2"><i class="fas fa-edit mr-1"></i>編集</button>'
      +'<button onclick="deleteNotice('+n.id+')" class="btn-d"><i class="fas fa-trash"></i></button>'
      +'</td></tr>';
  }).join('');
}

async function openNoticeModal(id) {
  id = id || null;
  document.getElementById('noticeModalTitle').textContent=id?'お知らせ編集':'お知らせ追加';
  document.getElementById('noticeId').value=id||'';
  if(id){
    var n=allNoticesAdmin.find(function(x){return x.id===id;});
    if(n){document.getElementById('nTitle').value=n.title||'';document.getElementById('nMessage').value=n.message||'';document.getElementById('nBody').value=n.body||'';document.getElementById('nType').value=n.notice_type||'general';document.getElementById('nExpire').value=n.expire_at?n.expire_at.slice(0,16):'';}
  } else { document.getElementById('noticeForm').reset(); }
  document.getElementById('noticeModal').classList.remove('hidden');
}

async function saveNotice(e) {
  e.preventDefault();
  var id=document.getElementById('noticeId').value;
  var body={title:document.getElementById('nTitle').value,message:document.getElementById('nMessage').value,body:document.getElementById('nBody').value,notice_type:document.getElementById('nType').value,expire_at:document.getElementById('nExpire').value||null};
  var res=await apiFetch(id?'/api/admin/notices/'+id:'/api/admin/notices',{method:id?'PUT':'POST',body:JSON.stringify(body)});
  if(res.ok){showToast(id?'お知らせを更新しました':'お知らせを追加しました');closeModal('noticeModal');loadNoticesAdmin();}
  else showToast('保存に失敗しました','error');
}

async function deleteNotice(id) {
  if(!confirm('このお知らせを削除しますか？'))return;
  await apiFetch('/api/admin/notices/'+id,{method:'DELETE'});
  showToast('削除しました');loadNoticesAdmin();
}

// ============ メール設定 ============
async function loadEmailSettings() {
  var res=await apiFetch('/api/admin/email-settings'); var d=await res.json();
  if(d.settings){document.getElementById('mainEmail').value=d.settings.main_email||'';document.getElementById('subEmail').value=d.settings.sub_email||'';document.getElementById('resendApiKey').value=d.settings.resend_api_key||'';}
}
async function saveEmailSettings() {
  var res=await apiFetch('/api/admin/email-settings',{method:'PUT',body:JSON.stringify({main_email:document.getElementById('mainEmail').value,sub_email:document.getElementById('subEmail').value,resend_api_key:document.getElementById('resendApiKey').value})});
  if(res.ok)showToast('メール設定を保存しました'); else showToast('保存に失敗しました','error');
}
async function sendTestEmail() {
  var res=await apiFetch('/api/admin/email-settings/test',{method:'POST'});
  var d=await res.json();
  if(res.ok)showToast('テストメールを送信しました'); else showToast(d.error||'テスト送信に失敗しました','error');
}

// ============ システム設定 ============
function buildThemeSwatches() {
  var container = document.getElementById('themeSwatches');
  if (!container) return;
  var themeColors = {
    green:'#5d8464', blue:'#3a6bbf', purple:'#6a52a8',
    orange:'#c06820', slate:'#455a64', rose:'#b85070'
  };
  var swatchHtml = '';
  Object.keys(themeColors).forEach(function(k) {
    swatchHtml += '<div class="theme-swatch' + (k===currentTheme?' selected':'') + '"'
      + ' style="background:linear-gradient(135deg,' + themeColors[k] + ',' + THEMES_ADMIN[k].p2 + ')"'
      + ' data-theme="' + k + '"'
      + ' title="' + THEME_NAMES[k] + '"></div>';
  });
  container.innerHTML = swatchHtml;
  document.getElementById('themeLabel').textContent = THEME_NAMES[currentTheme] || '';
  // イベント委譲でクリック処理（onclick属性不使用 → 引用符衝突回避）
  container.onclick = function(e) {
    var el = e.target.closest('[data-theme]');
    if (el) { applyTheme(el.dataset.theme); buildThemeSwatches(); }
  };
}
async function loadSettings() {
  var res=await apiFetch('/api/admin/settings'); var d=await res.json();
  var s=d.settings;
  document.getElementById('settingSiteName').value=s.site_name||'';
  document.getElementById('settingSiteDesc').value=s.site_description||'';
  applyTheme(s.theme_preset || 'green');
  buildThemeSwatches();
}
async function saveSettings() {
  var body={
    site_name:document.getElementById('settingSiteName').value,
    site_description:document.getElementById('settingSiteDesc').value,
    theme_preset:currentTheme
  };
  var res=await apiFetch('/api/admin/settings',{method:'PUT',body:JSON.stringify(body)});
  if(res.ok){
    showToast('設定を保存しました');
    document.getElementById('sidebarSiteName').textContent=body.site_name;
    document.title='管理者画面 | '+body.site_name;
    applyTheme(currentTheme);
  } else showToast('保存に失敗しました','error');
}
async function changePassword() {
  var cur=document.getElementById('curPw').value, nw=document.getElementById('newPw').value, conf=document.getElementById('confirmPw').value;
  if(!cur||!nw){showToast('パスワードを入力してください','warn');return;}
  if(nw!==conf){showToast('新しいパスワードが一致しません','error');return;}
  var res=await apiFetch('/api/admin/admins/password',{method:'PUT',body:JSON.stringify({current_password:cur,new_password:nw})});
  var d=await res.json();
  if(res.ok){showToast('パスワードを変更しました');['curPw','newPw','confirmPw'].forEach(function(id){document.getElementById(id).value='';});}
  else showToast(d.error||'変更に失敗しました','error');
}

// ============ ユーティリティ ============
function closeModal(id){document.getElementById(id).classList.add('hidden');}
function fmtDate(s){if(!s)return'-';return new Date(s).toLocaleString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});}
var toastTimer;
function showToast(msg,type){
  type=type||'success';
  var colors={success:'background:linear-gradient(135deg,#5d8464,#3d6444)',error:'background:#dc2626',warn:'background:#d97706'};
  var icons={success:'fas fa-check-circle',error:'fas fa-times-circle',warn:'fas fa-exclamation-circle'};
  document.getElementById('toastInner').style.cssText=colors[type]||colors.success;
  document.getElementById('toastIcon').className=icons[type]||icons.success;
  document.getElementById('toastMsg').textContent=msg;
  document.getElementById('toast').classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(function(){document.getElementById('toast').classList.add('hidden');},3500);
}

init();
<\/script>
</body>
</html>`;
}
