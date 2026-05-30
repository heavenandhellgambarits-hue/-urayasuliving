export function getAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>管理者画面 | OrderFlow</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js"><\/script>
<style>
:root{
  --p1:#5d8464; --p2:#3d6444; --p3:#2a4a30;
  --p-bg1:#f0f4f0; --p-bg2:#e4ece4;
  --p-card-border:rgba(180,210,180,.4);
  --p-input-border:#c8d8c0;
  --p-title:#3d6444;
  --p-line:#b0d0b0;
  --p-nav-hover-bg:rgba(93,132,100,.1);
  --p-tbl-bg1:#f0f7f0; --p-tbl-bg2:#e4f0e4;
  --p-tbl-border:rgba(180,210,180,.2);
  --p-hover-row:rgba(93,132,100,.04);
  --p-focus-ring:rgba(93,132,100,.15);
  --p-sidebar-bg:linear-gradient(180deg,#3d6444 0%,#2a4a30 100%);
  --p-sidebar-active-bg:rgba(255,255,255,.18);
  --p-loading-color:#5d8464;
  --p-upload-border:#b0d0b0;
  --p-toggle-on:#5d8464;
}
body{background:linear-gradient(135deg,var(--p-bg1) 0%,var(--p-bg2) 100%);min-height:100vh;
  font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;color:#111827;}
.content-area{background:rgba(255,255,255,.96);min-height:100vh;}
.card{background:rgba(255,255,255,.92);backdrop-filter:blur(8px);border-radius:14px;
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
.btn-warn:hover{filter:brightness(1.07);}
.form-input,.form-select{border:1.5px solid var(--p-input-border);border-radius:9px;padding:8px 12px;
  background:rgba(255,255,255,.9);transition:border-color .2s,box-shadow .2s;width:100%;font-size:.9rem;color:#111827;}
.form-input:focus,.form-select:focus{outline:none;border-color:var(--p1);box-shadow:0 0 0 3px var(--p-focus-ring);}
label{color:#1f2937!important;font-weight:600;}
.nav-item{padding:7px 10px;border-radius:8px;cursor:pointer;transition:all .2s;
  display:flex;align-items:center;gap:8px;font-size:.8rem;font-weight:600;color:#1f2937;}
.nav-item:hover{background:var(--p-nav-hover-bg);color:var(--p2);}
.nav-item.active{background:var(--p1);color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15);}
.drawer .nav-item{color:rgba(255,255,255,.85);}
.drawer .nav-item:hover{background:var(--p-sidebar-active-bg);color:#fff;}
.drawer .nav-item.active{background:var(--p-sidebar-active-bg);color:#fff;}
.drawer .sidebar-section-label{color:rgba(255,255,255,.5);}
.sbadge{padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700;white-space:nowrap;}
.s-pending{background:#fff3cd;color:#856404;}
.s-printed{background:#d1ecf1;color:#0c5460;}
.s-completed{background:#d1e7dd;color:#0a3622;}
.s-cancel_request{background:#ffe4cc;color:#7c2d12;}
.s-cancelled{background:#f8d7da;color:#842029;}
th{padding:6px 8px;text-align:left;font-size:.72rem;font-weight:700;color:var(--p-title);white-space:nowrap;}
td{padding:5px 7px;font-size:.78rem;border-bottom:1px solid var(--p-tbl-border);color:#1f2937;font-weight:500;}
tr:hover td{background:var(--p-hover-row);}
.tbl-header{background:linear-gradient(135deg,var(--p-tbl-bg1),var(--p-tbl-bg2));}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);z-index:200;
  display:flex;align-items:center;justify-content:center;padding:16px;}
.modal-box{background:#fff;border-radius:16px;padding:28px;width:100%;
  box-shadow:0 20px 60px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto;color:#111827;}
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
  background:var(--p-sidebar-bg);transform:translateX(-100%);transition:transform .3s cubic-bezier(.4,0,.2,1);
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
.page-section{display:none;}
.page-section.active{display:block;}
.theme-swatch{width:40px;height:40px;border-radius:10px;cursor:pointer;transition:all .2s;
  border:3px solid transparent;flex-shrink:0;}
.theme-swatch:hover{transform:scale(1.12);}
.theme-swatch.selected{border-color:#fff;box-shadow:0 0 0 3px var(--p1),0 2px 8px rgba(0,0,0,.2);transform:scale(1.1);}
.p-accent{color:var(--p2);font-weight:700;}
.p-accent-link{color:var(--p2);font-weight:700;cursor:pointer;}
.p-accent-link:hover{text-decoration:underline;opacity:.85;}
.sidebar-section-label{font-size:.65rem;font-weight:700;color:#6b7280;
  letter-spacing:.08em;text-transform:uppercase;padding:8px 10px 3px;}
.modal-label{font-size:.78rem;font-weight:600;color:#1f2937;margin-bottom:4px;}
.meta-text{font-size:.78rem;color:#4b5563;}
.stat-label{font-size:.75rem;font-weight:600;color:#374151;margin-bottom:4px;}
/* 納品書印刷 */
@media print{
  @page{size:A4 landscape;margin:10mm;}
  body *{visibility:hidden!important;}
  #deliverySlip,#deliverySlip *{visibility:visible!important;}
  #deliverySlip{position:fixed;top:0;left:0;width:100%;font-family:'Hiragino Sans',sans-serif;}
  header,footer,nav,.sidebar-desktop,.drawer,#drawerOverlay{display:none!important;}
}
@media(max-width:768px){.sidebar-desktop{display:none!important;}.header-page-name{display:block;}}
@media(min-width:769px){.mobile-menu-btn{display:none!important;}.header-page-name{display:none;}}
</style>
</head>
<body>

<div class="drawer-overlay" id="drawerOverlay" onclick="closeDrawer()"></div>
<div class="drawer" id="drawerMenu">
  <div class="p-4 border-b border-green-800">
    <div class="flex items-center gap-3 mb-2">
      <div style="background:linear-gradient(135deg,#5d8464,#3d6444);width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;">
        <i class="fas fa-cog text-white text-sm"></i>
      </div>
      <div><p class="font-bold text-white text-sm">管理者メニュー</p>
        <p id="drawerAdminName" class="text-xs text-green-200"></p></div>
    </div>
  </div>
  <nav class="p-3 space-y-1" id="drawerNav">
    <div class="nav-item active" data-page="orders" onclick="switchPage('orders')"><i class="fas fa-inbox w-4"></i>受注管理</div>
    <div class="sidebar-section-label">マスタ管理</div>
    <div class="nav-item" data-page="products" onclick="switchPage('products')"><i class="fas fa-box w-4"></i>商品マスタ</div>
    <div class="nav-item" data-page="stores" onclick="switchPage('stores')"><i class="fas fa-store w-4"></i>発注元マスタ</div>
    <div class="sidebar-section-label">その他</div>
    <div class="nav-item" data-page="history" onclick="switchPage('history')"><i class="fas fa-history w-4"></i>履歴</div>
    <div class="nav-item" data-page="notices" onclick="switchPage('notices')"><i class="fas fa-bell w-4"></i>お知らせ</div>
    <div class="nav-item" data-page="email" onclick="switchPage('email')"><i class="fas fa-envelope w-4"></i>メール設定</div>
    <div class="nav-item" data-page="settings" onclick="switchPage('settings')"><i class="fas fa-cog w-4"></i>システム設定</div>
  </nav>
  <div class="p-3 border-t border-green-800 mt-2">
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
      <p id="loginSiteName" class="text-xs text-gray-500 mt-1">OrderFlow</p>
    </div>
    <div class="space-y-4">
      <div><label class="block text-sm mb-1">ユーザー名</label>
        <input type="text" id="loginUser" class="form-input" placeholder="admin" autocomplete="username"></div>
      <div><label class="block text-sm mb-1">パスワード</label>
        <div class="relative">
          <input type="password" id="loginPass" class="form-input pr-10" placeholder="••••••••" autocomplete="current-password">
          <button type="button" onclick="togglePw('loginPass',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-eye text-sm"></i></button>
        </div>
      </div>
      <div id="loginError" class="text-red-500 text-sm hidden text-center bg-red-50 rounded-lg p-2"></div>
      <button onclick="doLogin()" id="loginBtn" class="btn-p w-full py-3"><i class="fas fa-sign-in-alt mr-2"></i>ログイン</button>
    </div>
    <p class="text-center mt-4 text-xs text-gray-500">
      <a href="/" class="hover:underline p-accent-link"><i class="fas fa-arrow-left mr-1"></i>発注画面へ戻る</a>
    </p>
  </div>
</div>

<!-- メイン -->
<div id="mainPage" class="hidden flex">
  <!-- サイドバー(デスクトップ) -->
  <aside class="sidebar-desktop w-44 flex-shrink-0 min-h-screen p-2 sticky top-0 self-start" style="max-height:100vh;overflow-y:auto;">
    <div class="card p-2 mb-2">
      <div class="flex items-center gap-2">
        <div style="background:linear-gradient(135deg,#5d8464,#3d6444);width:28px;height:28px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <i class="fas fa-box text-white" style="font-size:.7rem;"></i>
        </div>
        <div class="min-w-0">
          <p id="sidebarSiteName" class="font-bold text-gray-800 text-xs leading-tight truncate">OrderFlow</p>
          <p class="text-gray-500" style="font-size:.65rem;">管理者画面</p>
        </div>
      </div>
    </div>
    <nav class="space-y-1">
      <div class="nav-item active" data-page="orders" onclick="switchPage('orders')"><i class="fas fa-inbox w-4"></i>受注管理</div>
      <div class="sidebar-section-label">マスタ管理</div>
      <div class="nav-item" data-page="products" onclick="switchPage('products')"><i class="fas fa-box w-4"></i>商品マスタ</div>
      <div class="nav-item" data-page="stores" onclick="switchPage('stores')"><i class="fas fa-store w-4"></i>発注元マスタ</div>
      <div class="sidebar-section-label">その他</div>
      <div class="nav-item" data-page="history" onclick="switchPage('history')"><i class="fas fa-history w-4"></i>履歴</div>
      <div class="nav-item" data-page="notices" onclick="switchPage('notices')"><i class="fas fa-bell w-4"></i>お知らせ</div>
      <div class="nav-item" data-page="email" onclick="switchPage('email')"><i class="fas fa-envelope w-4"></i>メール設定</div>
      <div class="nav-item" data-page="settings" onclick="switchPage('settings')"><i class="fas fa-cog w-4"></i>システム設定</div>
      <div class="mt-3 pt-2 border-t border-gray-200">
        <div class="nav-item" onclick="doLogout()"><i class="fas fa-sign-out-alt w-4"></i>ログアウト</div>
      </div>
    </nav>
  </aside>

  <!-- コンテンツエリア -->
  <div class="flex-1 min-w-0 p-3 md:p-4 content-area">
    <header class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <button class="mobile-menu-btn btn-s p-2 px-3" onclick="openDrawer()"><i class="fas fa-bars"></i></button>
        <h1 id="pageTitle" class="text-lg font-bold text-gray-800 header-page-name">受注管理</h1>
        <h1 id="pageTitleDesktop" class="text-lg font-bold text-gray-800 hidden md:block">受注管理</h1>
      </div>
      <span id="adminDisplayName" class="text-sm text-gray-700 font-semibold hidden sm:block"></span>
    </header>

    <!-- 受注管理 -->
    <div id="page-orders" class="page-section active fade-in">
      <div class="card p-4 mb-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div class="relative flex-1 min-w-[180px]">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" id="orderSearch" placeholder="発注番号・店舗名・担当者名" class="form-input pl-9" oninput="loadOrders()">
          </div>
          <select id="orderStatusFilter" class="form-select w-auto" onchange="loadOrders()">
            <option value="">全ステータス</option>
            <option value="pending">未確認</option>
            <option value="printed">印刷済</option>
            <option value="completed">完了</option>
            <option value="cancel_request">キャンセル依頼</option>
            <option value="cancelled">キャンセル済</option>
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
            <tbody id="ordersTbody"><tr><td colspan="7" class="text-center py-8 text-gray-500"><span class="loading"></span></td></tr></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 商品マスタ -->
    <div id="page-products" class="page-section fade-in">
      <div class="card p-4 mb-4">
        <div class="flex flex-wrap gap-3 items-center">
          <div class="relative flex-1 min-w-[180px]">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" id="productSearchAdmin" placeholder="商品名・コード・ギフトコード検索" class="form-input pl-9" oninput="loadProducts()">
          </div>
          <button onclick="openProductModal()" class="btn-p"><i class="fas fa-plus mr-1"></i>商品追加</button>
          <button onclick="openImportModal()" class="btn-i"><i class="fas fa-file-excel mr-1"></i>Excel取込</button>
          <button onclick="downloadProductTemplate()" class="btn-s"><i class="fas fa-download mr-1"></i>テンプレート</button>
          <button onclick="exportProducts()" class="btn-s"><i class="fas fa-file-export mr-1"></i>Excel出力</button>
        </div>
      </div>
      <div class="card overflow-hidden">
        <!-- 一括削除バー -->
        <div id="productBulkBar" class="hidden px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <span id="productSelCount" class="text-sm font-bold text-red-700"></span>
          <button onclick="bulkDeleteProducts()" class="btn-sm btn-sm-red"><i class="fas fa-trash mr-1"></i>選択を一括削除</button>
          <button onclick="clearProductSelection()" class="btn-sm btn-sm-gray"><i class="fas fa-times mr-1"></i>選択解除</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full" style="font-size:.72rem;">
            <thead class="tbl-header">
              <tr>
                <th class="w-6 text-center px-1"><input type="checkbox" id="productSelAll" onchange="toggleAllProducts(this.checked)" class="cursor-pointer"></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('category')">カテゴリ<span class="sort-icon" id="psh-category"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('unified_code')">統一CD<span class="sort-icon" id="psh-unified_code"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('gift_code')">ギフトCD<span class="sort-icon" id="psh-gift_code"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('product_name')">商品名<span class="sort-icon" id="psh-product_name"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('product_code')">商品記号<span class="sort-icon" id="psh-product_code"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('barcode')">バーコード<span class="sort-icon" id="psh-barcode"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('supplier_code')">仕入先CD<span class="sort-icon" id="psh-supplier_code"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('supplier_name')">仕入先名<span class="sort-icon" id="psh-supplier_name"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('stock_location')">場所<span class="sort-icon" id="psh-stock_location"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('stock_ku')">区<span class="sort-icon" id="psh-stock_ku"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('stock_banchi')">番地<span class="sort-icon" id="psh-stock_banchi"></span></th>
                <th class="cursor-pointer select-none whitespace-nowrap" onclick="sortProductsBy('is_active')">状態<span class="sort-icon" id="psh-is_active"></span></th>
                <th class="px-1">操作</th>
              </tr>
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

    <!-- 履歴 -->
    <div id="page-history" class="page-section fade-in">
      <div class="card p-4 mb-4">
        <div class="flex flex-wrap gap-3 items-end">
          <div>
            <label class="block text-xs mb-1">開始日</label>
            <input type="date" id="historyFrom" class="form-input w-auto">
          </div>
          <div>
            <label class="block text-xs mb-1">終了日</label>
            <input type="date" id="historyTo" class="form-input w-auto">
          </div>
          <button onclick="loadHistory()" class="btn-p"><i class="fas fa-search mr-1"></i>検索</button>
          <button onclick="exportHistory('xlsx')" class="btn-s"><i class="fas fa-file-excel mr-1"></i>Excel出力(.xlsx)</button>
          <button onclick="exportHistory('xls')" class="btn-s"><i class="fas fa-file-excel mr-1"></i>Excel出力(.xls)</button>
        </div>
      </div>
      <div class="card overflow-hidden">
        <div id="historyBulkBar" class="hidden px-4 py-2 bg-red-50 border-b border-red-100 flex items-center gap-3">
          <span id="historySelCount" class="text-sm font-bold text-red-700"></span>
          <button onclick="bulkDeleteHistory()" class="btn-sm btn-sm-red"><i class="fas fa-trash mr-1"></i>選択を一括削除</button>
          <button onclick="clearHistorySelection()" class="btn-sm btn-sm-gray"><i class="fas fa-times mr-1"></i>選択解除</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead class="tbl-header"><tr>
              <th class="w-8"><input type="checkbox" id="historySelAll" onchange="toggleAllHistory(this.checked)" class="cursor-pointer"></th>
              <th>発注番号</th><th>店舗/部署</th><th>担当者</th><th>納品希望日</th><th>ステータス</th><th>発注日時</th><th>操作</th>
            </tr></thead>
            <tbody id="historyTbody"></tbody>
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
          <div><label class="block text-sm mb-1">メイン通知先メールアドレス</label><input id="mainEmail" type="email" class="form-input" placeholder="admin@example.com"></div>
          <div><label class="block text-sm mb-1">サブ通知先（任意）</label><input id="subEmail" type="email" class="form-input" placeholder="sub@example.com"></div>
          <div><label class="block text-sm mb-1">Resend APIキー</label>
            <div class="relative"><input id="resendApiKey" type="password" class="form-input pr-10" placeholder="re_xxxxx">
              <button type="button" onclick="togglePw('resendApiKey',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-eye text-sm"></i></button>
            </div>
            <p class="text-xs text-gray-500 mt-1"><a href="https://resend.com" target="_blank" class="p-accent-link">resend.com</a> でAPIキーを取得してください</p>
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
            <div><label class="block text-sm mb-1">システム名</label><input id="settingSiteName" type="text" class="form-input" placeholder="OrderFlow"></div>
            <div><label class="block text-sm mb-1">説明文</label><input id="settingSiteDesc" type="text" class="form-input" placeholder="汎用発注システム"></div>
            <div><label class="block text-sm mb-1">カラーテーマ</label>
              <div id="themeSwatchContainer" class="flex gap-2 flex-wrap mt-2"></div>
              <p id="themeLabel" class="text-xs text-gray-500 mt-2"></p>
            </div>
          </div>
          <button onclick="saveSettings()" class="btn-p mt-5"><i class="fas fa-save mr-1"></i>保存</button>
        </div>
        <div class="card p-6">
          <div class="sec-title"><i class="fas fa-key p-accent"></i> パスワード変更</div>
          <div class="space-y-3">
            <div><label class="block text-sm mb-1">現在のパスワード</label><input id="curPw" type="password" class="form-input"></div>
            <div><label class="block text-sm mb-1">新しいパスワード</label><input id="newPw" type="password" class="form-input"></div>
            <div><label class="block text-sm mb-1">確認</label><input id="confirmPw" type="password" class="form-input"></div>
          </div>
          <button onclick="changePassword()" class="btn-d mt-5" style="padding:8px 18px;border-radius:9px;font-size:.875rem;"><i class="fas fa-key mr-1"></i>パスワード変更</button>
        </div>
      </div>
    </div>
  </div>
</div>

<!-- 発注詳細モーダル -->
<div id="orderModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:820px">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-clipboard-list p-accent"></i>発注詳細</h2>
      <button onclick="closeModal('orderModal')" class="text-gray-500 hover:text-gray-700 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="orderModalContent"></div>
  </div>
</div>

<!-- 商品モーダル -->
<div id="productModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:700px">
    <div class="flex items-center justify-between mb-4">
      <h2 id="productModalTitle" class="text-lg font-bold text-gray-800">商品追加</h2>
      <button onclick="closeModal('productModal')" class="text-gray-500 hover:text-gray-700 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <input type="hidden" id="productId">
    <div class="grid grid-cols-2 gap-3">
      <div><label class="block text-sm mb-1">カテゴリ</label><input id="pCategory" type="text" class="form-input" placeholder="飲料"></div>
      <div><label class="block text-sm mb-1">統一コード（半角数字）</label><input id="pUnifiedCode" type="text" class="form-input" placeholder="1234567" pattern="[0-9]*" inputmode="numeric"></div>
      <div><label class="block text-sm mb-1">ギフトコード（7桁半角数字）<span class="text-red-500">*</span></label><input id="pGiftCode" type="text" class="form-input" placeholder="1234567" maxlength="7" pattern="[0-9]{7}" inputmode="numeric"></div>
      <div class="col-span-2"><label class="block text-sm mb-1">商品名 <span class="text-red-500">*</span></label><input id="pName" type="text" class="form-input" required></div>
      <div><label class="block text-sm mb-1">商品記号バーコード</label><input id="pBarcode" type="text" class="form-input" placeholder="JAN等"></div>
      <div><label class="block text-sm mb-1">仕入先コード（半角英数）</label><input id="pSupplierCode" type="text" class="form-input" placeholder="SUP001" pattern="[A-Za-z0-9]*"></div>
      <div class="col-span-2"><label class="block text-sm mb-1">仕入先名</label><input id="pSupplierName" type="text" class="form-input"></div>
      <div><label class="block text-sm mb-1">ストック場所</label><input id="pStockLocation" type="text" class="form-input" placeholder="倉庫A"></div>
      <div class="grid grid-cols-2 gap-2">
        <div><label class="block text-sm mb-1">区</label><input id="pStockKu" type="text" class="form-input" placeholder="01"></div>
        <div><label class="block text-sm mb-1">番地</label><input id="pStockBanchi" type="text" class="form-input" placeholder="001"></div>
      </div>
      <div class="flex items-center gap-3">
        <label class="toggle-switch"><input type="checkbox" id="pActive" checked><span class="toggle-slider"></span></label>
        <span class="text-sm text-gray-700">有効</span>
      </div>
      <div class="flex items-center gap-3">
        <label class="toggle-switch"><input type="checkbox" id="pNew"><span class="toggle-slider"></span></label>
        <span class="text-sm text-gray-700">NEW</span>
      </div>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="saveProduct()" class="btn-p"><i class="fas fa-save mr-1"></i>保存</button>
      <button onclick="closeModal('productModal')" class="btn-s">キャンセル</button>
    </div>
  </div>
</div>

<!-- Excel取込モーダル -->
<div id="importModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:560px">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2"><i class="fas fa-file-excel p-accent"></i>商品Excel取込</h2>
      <button onclick="closeModal('importModal')" class="text-gray-500 text-xl" id="importCloseBtn"><i class="fas fa-times"></i></button>
    </div>
    <p class="text-sm text-gray-700 mb-3">1行目をヘッダーとして読み込みます。<br>列名: <code class="bg-gray-100 px-1 rounded text-gray-700">カテゴリ / 統一コード / ギフトコード / 商品名 / 商品記号 / バーコード / 仕入先コード / 仕入先名 / ストック場所 / 区 / 番地</code></p>
    <div class="upload-zone" id="importDropZone" onclick="document.getElementById('importFile').click()">
      <i class="fas fa-file-excel text-green-600 text-3xl mb-2"></i>
      <p class="text-gray-600 text-sm">クリックまたはドロップでExcelを選択</p>
      <input type="file" id="importFile" accept=".xlsx,.xls" class="hidden" onchange="handleImportFile(this)">
    </div>
    <div id="importPreview" class="mt-3"></div>
    <!-- プログレスバーエリア（取込中のみ表示） -->
    <div id="importProgressArea" class="hidden mt-4">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm font-semibold text-gray-700"><i class="fas fa-spinner fa-spin mr-2 text-blue-500"></i>商品マスタ取り込み中...</span>
        <span id="importProgressText" class="text-sm font-bold text-blue-600">0%</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
        <div id="importProgressBar" class="h-4 rounded-full transition-all duration-300" style="width:0%;background:linear-gradient(90deg,#3b82f6,#6366f1)"></div>
      </div>
      <p id="importProgressDetail" class="text-xs text-gray-500 mt-1">準備中...</p>
    </div>
    <div class="flex gap-3 mt-4" id="importActionBtns">
      <button onclick="executeImport()" id="importBtn" class="btn-p hidden"><i class="fas fa-upload mr-1"></i>取込実行</button>
      <button onclick="closeModal('importModal')" class="btn-s" id="importCancelBtn">閉じる</button>
    </div>
  </div>
</div>

<!-- 発注元モーダル -->
<div id="storeModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:480px">
    <div class="flex items-center justify-between mb-4">
      <h2 id="storeModalTitle" class="text-lg font-bold text-gray-800">発注元追加</h2>
      <button onclick="closeModal('storeModal')" class="text-gray-500 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <input type="hidden" id="storeId">
    <div class="space-y-3">
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-sm mb-1">店舗名 <span class="text-red-500">*</span></label><input id="sName" type="text" class="form-input" required></div>
        <div><label class="block text-sm mb-1">部署名</label><input id="sSection" type="text" class="form-input"></div>
        <div><label class="block text-sm mb-1">電話番号</label><input id="sPhone" type="text" class="form-input"></div>
        <div><label class="block text-sm mb-1">FAX</label><input id="sFax" type="text" class="form-input"></div>
      </div>
      <div><label class="block text-sm mb-1">ログインID <span class="text-red-500">*</span></label><input id="sLoginId" type="text" class="form-input" required></div>
      <div><label class="block text-sm mb-1">パスワード <span id="sPwReq" class="text-red-500">*</span></label>
        <div class="relative"><input id="sPassword" type="password" class="form-input pr-10">
          <button type="button" onclick="togglePw('sPassword',this)" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><i class="fas fa-eye text-sm"></i></button>
        </div>
        <p id="sPwNote" class="text-xs text-gray-500 mt-1 hidden">変更する場合のみ入力してください</p>
      </div>
      <div class="flex items-center gap-3">
        <label class="toggle-switch"><input type="checkbox" id="sIsTest"><span class="toggle-slider"></span></label>
        <span class="text-sm text-gray-700">テスト用</span>
      </div>
    </div>
    <div class="flex gap-3 mt-6">
      <button onclick="saveStore()" class="btn-p"><i class="fas fa-save mr-1"></i>保存</button>
      <button onclick="closeModal('storeModal')" class="btn-s">キャンセル</button>
    </div>
  </div>
</div>

<!-- お知らせモーダル -->
<div id="noticeModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:500px">
    <div class="flex items-center justify-between mb-4">
      <h2 id="noticeModalTitle" class="text-lg font-bold text-gray-800">お知らせ追加</h2>
      <button onclick="closeModal('noticeModal')" class="text-gray-500 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <input type="hidden" id="noticeId">
    <div class="space-y-3">
      <div><label class="block text-sm mb-1">タイトル <span class="text-red-500">*</span></label><input id="nTitle" type="text" class="form-input" required></div>
      <div><label class="block text-sm mb-1">概要</label><input id="nMessage" type="text" class="form-input" placeholder="短い説明文"></div>
      <div><label class="block text-sm mb-1">本文</label><textarea id="nBody" rows="5" class="form-input resize-none"></textarea></div>
      <div class="grid grid-cols-2 gap-3">
        <div><label class="block text-sm mb-1">種類</label>
          <select id="nType" class="form-select">
            <option value="general">一般</option><option value="important">重要</option><option value="cancel">キャンセル</option>
          </select>
        </div>
        <div><label class="block text-sm mb-1">有効期限</label><input id="nExpire" type="datetime-local" class="form-input"></div>
      </div>
    </div>
    <div class="flex gap-3 mt-5">
      <button onclick="saveNotice()" class="btn-p"><i class="fas fa-save mr-1"></i>保存</button>
      <button onclick="closeModal('noticeModal')" class="btn-s">キャンセル</button>
    </div>
  </div>
</div>

<!-- 納品書印刷エリア（非表示） -->
<div id="deliverySlip" style="display:none;padding:20px;font-size:11pt;">
  <div id="deliverySlipContent"></div>
</div>

<!-- トースト -->
<div id="toast" class="fixed bottom-6 right-6 z-[300] hidden">
  <div id="toastInner" class="px-5 py-3 rounded-xl shadow-lg text-white font-semibold flex items-center gap-2 text-sm"></div>
</div>

<script>
// ========== 認証 ==========
var adminToken = localStorage.getItem('adminToken');
var currentAdminName = '';
var currentPage = 'orders';

var THEMES_ADMIN = {
  green:  {p1:'#5d8464',p2:'#3d6444',p3:'#2a4a30',bg1:'#f0f4f0',bg2:'#e4ece4',cb:'rgba(180,210,180,.4)',ib:'#c8d8c0',title:'#3d6444',line:'#b0d0b0',nhb:'rgba(93,132,100,.1)',tb1:'#f0f7f0',tb2:'#e4f0e4',tborder:'rgba(180,210,180,.2)',hr:'rgba(93,132,100,.04)',fr:'rgba(93,132,100,.15)',sb:'linear-gradient(180deg,#3d6444 0%,#2a4a30 100%)',lc:'#5d8464',ub:'#b0d0b0',ton:'#5d8464'},
  blue:   {p1:'#4a80c0',p2:'#2a5fa0',p3:'#1a3f80',bg1:'#f0f2f8',bg2:'#e4e8f4',cb:'rgba(180,200,240,.4)',ib:'#b8cce4',title:'#2a5fa0',line:'#a0c0e0',nhb:'rgba(74,128,192,.1)',tb1:'#f0f4fa',tb2:'#e4ecf8',tborder:'rgba(180,200,240,.2)',hr:'rgba(74,128,192,.04)',fr:'rgba(74,128,192,.15)',sb:'linear-gradient(180deg,#2a5fa0 0%,#1a3f80 100%)',lc:'#4a80c0',ub:'#a0c0e0',ton:'#4a80c0'},
  purple: {p1:'#8b5cf6',p2:'#6d3fd4',p3:'#4c1d95',bg1:'#f5f3ff',bg2:'#ede9fe',cb:'rgba(200,180,250,.4)',ib:'#c4b5fd',title:'#6d3fd4',line:'#c4b5fd',nhb:'rgba(139,92,246,.1)',tb1:'#f5f3ff',tb2:'#ede9fe',tborder:'rgba(200,180,250,.2)',hr:'rgba(139,92,246,.04)',fr:'rgba(139,92,246,.15)',sb:'linear-gradient(180deg,#6d3fd4 0%,#4c1d95 100%)',lc:'#8b5cf6',ub:'#c4b5fd',ton:'#8b5cf6'},
  orange: {p1:'#f5a623',p2:'#d97706',p3:'#92400e',bg1:'#fffbf0',bg2:'#fef3c7',cb:'rgba(245,166,35,.3)',ib:'#fcd34d',title:'#d97706',line:'#fcd34d',nhb:'rgba(245,166,35,.1)',tb1:'#fffbf0',tb2:'#fef9e7',tborder:'rgba(245,166,35,.2)',hr:'rgba(245,166,35,.04)',fr:'rgba(245,166,35,.15)',sb:'linear-gradient(180deg,#d97706 0%,#92400e 100%)',lc:'#f5a623',ub:'#fcd34d',ton:'#f5a623'},
  slate:  {p1:'#64748b',p2:'#475569',p3:'#334155',bg1:'#f8fafc',bg2:'#f1f5f9',cb:'rgba(148,163,184,.4)',ib:'#cbd5e1',title:'#475569',line:'#cbd5e1',nhb:'rgba(100,116,139,.1)',tb1:'#f8fafc',tb2:'#f1f5f9',tborder:'rgba(148,163,184,.2)',hr:'rgba(100,116,139,.04)',fr:'rgba(100,116,139,.15)',sb:'linear-gradient(180deg,#475569 0%,#334155 100%)',lc:'#64748b',ub:'#cbd5e1',ton:'#64748b'},
  rose:   {p1:'#e11d48',p2:'#be123c',p3:'#881337',bg1:'#fff1f2',bg2:'#ffe4e6',cb:'rgba(225,29,72,.3)',ib:'#fda4af',title:'#be123c',line:'#fda4af',nhb:'rgba(225,29,72,.1)',tb1:'#fff1f2',tb2:'#ffe4e6',tborder:'rgba(225,29,72,.2)',hr:'rgba(225,29,72,.04)',fr:'rgba(225,29,72,.15)',sb:'linear-gradient(180deg,#be123c 0%,#881337 100%)',lc:'#e11d48',ub:'#fda4af',ton:'#e11d48'},
};
var THEME_NAMES = {green:'グリーン',blue:'ブルー',purple:'パープル',orange:'オレンジ',slate:'スレート',rose:'ローズ'};
var currentTheme = 'green';

function applyTheme(preset) {
  var t = THEMES_ADMIN[preset] || THEMES_ADMIN.green;
  currentTheme = preset;
  var r = document.documentElement.style;
  r.setProperty('--p1', t.p1); r.setProperty('--p2', t.p2); r.setProperty('--p3', t.p3);
  r.setProperty('--p-bg1', t.bg1); r.setProperty('--p-bg2', t.bg2);
  r.setProperty('--p-card-border', t.cb); r.setProperty('--p-input-border', t.ib);
  r.setProperty('--p-title', t.title); r.setProperty('--p-line', t.line);
  r.setProperty('--p-nav-hover-bg', t.nhb);
  r.setProperty('--p-tbl-bg1', t.tb1); r.setProperty('--p-tbl-bg2', t.tb2);
  r.setProperty('--p-tbl-border', t.tborder); r.setProperty('--p-hover-row', t.hr);
  r.setProperty('--p-focus-ring', t.fr); r.setProperty('--p-sidebar-bg', t.sb);
  r.setProperty('--p-loading-color', t.lc); r.setProperty('--p-upload-border', t.ub);
  r.setProperty('--p-toggle-on', t.ton);
}

function buildThemeSwatches() {
  var c = document.getElementById('themeSwatchContainer'); if (!c) return;
  var html = '';
  for (var k in THEMES_ADMIN) {
    var t = THEMES_ADMIN[k];
    var sel = k === currentTheme ? ' selected' : '';
    html += '<div class="theme-swatch' + sel + '" data-theme="' + k + '" title="' + THEME_NAMES[k] + '"'
          + ' style="background:linear-gradient(135deg,' + t.p1 + ',' + t.p2 + ')"></div>';
  }
  c.innerHTML = html;
  c.onclick = function(e) {
    var el = e.target.closest('[data-theme]');
    if (el) { applyTheme(el.dataset.theme); buildThemeSwatches(); }
  };
  var lbl = document.getElementById('themeLabel');
  if (lbl) lbl.textContent = '選択中: ' + (THEME_NAMES[currentTheme] || currentTheme);
}

// ========== API ==========
async function apiFetch(url, opts) {
  opts = opts || {};
  opts.headers = Object.assign({'Content-Type':'application/json','Authorization':'Bearer '+adminToken}, opts.headers||{});
  return fetch(url, opts);
}

// ========== 日付フォーマット（日本時間） ==========
// DBにはnowJST()でJST値がそのまま保存されている（例:"2026-05-24 13:07:19"）
// → Zを付けずにそのままパースすることで正しいJST表示になる
function fmtJST(dt) {
  if (!dt) return '-';
  // スペース区切りをTに統一。末尾にZやオフセットがなければJSTとして扱う
  var s = String(dt).replace(' ', 'T');
  var d = new Date(s);
  if (isNaN(d.getTime())) return String(dt);
  var y  = d.getFullYear();
  var mo = String(d.getMonth()+1).padStart(2,'0');
  var dy = String(d.getDate()).padStart(2,'0');
  var h  = String(d.getHours()).padStart(2,'0');
  var mi = String(d.getMinutes()).padStart(2,'0');
  return y + '/' + mo + '/' + dy + ' ' + h + ':' + mi;
}
function fmtDateJST(dt) {
  if (!dt) return '-';
  var s = String(dt).replace(' ', 'T');
  var d = new Date(s);
  if (isNaN(d.getTime())) return String(dt);
  return d.getFullYear() + '/' + String(d.getMonth()+1).padStart(2,'0') + '/' + String(d.getDate()).padStart(2,'0');
}

// ========== ステータス ==========
var statusLabel = {pending:'未確認',printed:'印刷済',completed:'完了',cancel_request:'キャンセル依頼',cancelled:'キャンセル済'};
var statusCls   = {pending:'s-pending',printed:'s-printed',completed:'s-completed',cancel_request:'s-cancel_request',cancelled:'s-cancelled'};

// ========== ログイン ==========
async function doLogin() {
  var u = document.getElementById('loginUser').value.trim();
  var p = document.getElementById('loginPass').value;
  if (!u || !p) { showLoginError('入力してください'); return; }
  document.getElementById('loginBtn').disabled = true;
  try {
    var res = await fetch('/api/auth/admin/login', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({username:u, password:p})});
    var d = await res.json();
    if (!res.ok) { showLoginError(d.error || 'ログイン失敗'); return; }
    adminToken = d.token;
    currentAdminName = d.display_name || u;
    localStorage.setItem('adminToken', adminToken);
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    document.getElementById('adminDisplayName').textContent = currentAdminName;
    document.getElementById('drawerAdminName').textContent = currentAdminName;
    await loadPublicSettings();
    switchPage('orders');
    loadOrders();
  } catch(e) { showLoginError('通信エラー'); }
  finally { document.getElementById('loginBtn').disabled = false; }
}
function showLoginError(msg) {
  var el = document.getElementById('loginError');
  el.textContent = msg; el.classList.remove('hidden');
}
function doLogout() {
  localStorage.removeItem('adminToken');
  location.reload();
}
document.getElementById('loginPass').addEventListener('keydown', function(e){ if(e.key==='Enter') doLogin(); });
document.getElementById('loginUser').addEventListener('keydown', function(e){ if(e.key==='Enter') doLogin(); });

// ========== 設定読込 ==========
async function loadPublicSettings() {
  try {
    var d = await (await fetch('/api/settings')).json();
    var s = d.settings || {};
    var name = s.site_name || 'OrderFlow';
    document.getElementById('sidebarSiteName').textContent = name;
    document.getElementById('loginSiteName').textContent = name;
    applyTheme(s.theme_preset || 'green');
    buildThemeSwatches();
  } catch(e) {}
}

// ========== ページ切替 ==========
function switchPage(page) {
  currentPage = page;
  document.querySelectorAll('.page-section').forEach(function(el){ el.classList.remove('active'); });
  var target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');
  var titles = {orders:'受注管理',products:'商品マスタ',stores:'発注元マスタ',history:'履歴',notices:'お知らせ',email:'メール設定',settings:'システム設定'};
  var t = titles[page] || page;
  document.getElementById('pageTitle').textContent = t;
  document.getElementById('pageTitleDesktop').textContent = t;
  document.querySelectorAll('.nav-item').forEach(function(el){ el.classList.toggle('active', el.dataset.page === page); });
  closeDrawer();
  if (page === 'orders') loadOrders();
  else if (page === 'products') loadProducts();
  else if (page === 'stores') loadStores();
  else if (page === 'history') initHistory();
  else if (page === 'notices') loadNotices();
  else if (page === 'email') loadEmailSettings();
  else if (page === 'settings') loadSettings();
}

// ========== 受注管理 ==========
async function loadOrders() {
  var search = document.getElementById('orderSearch')?.value||'';
  var status = document.getElementById('orderStatusFilter')?.value||'';
  var url = '/api/admin/orders?';
  if (search) url += 'search='+encodeURIComponent(search)+'&';
  if (status) url += 'status='+status;
  var data = await (await apiFetch(url)).json();
  var orders = data.orders || [];
  var tbody = document.getElementById('ordersTbody');
  if (orders.length === 0) { tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-500">発注はありません</td></tr>'; return; }
  tbody.innerHTML = orders.map(function(o) {
    var cancelBtn = '';
    if (o.status === 'cancel_request') {
      cancelBtn = '<button onclick="cancelComplete(' + o.id + ')" class="btn-d text-xs py-1 px-2"><i class="fas fa-ban mr-1"></i>キャンセル完了</button>';
    }
    return '<tr>'
      + '<td><span class="font-bold cursor-pointer p-accent-link" onclick="showOrderDetail(' + o.id + ')">' + o.order_no + '</span></td>'
      + '<td>' + o.store_name + '<br><span class="text-xs text-gray-600">' + (o.section_name||'') + '</span></td>'
      + '<td>' + (o.orderer_name||'-') + '</td>'
      + '<td>' + (o.desired_delivery_date||'-') + '</td>'
      + '<td><span class="sbadge ' + (statusCls[o.status]||'') + '">' + (statusLabel[o.status]||o.status) + '</span>'
      + (o.cancel_requested ? '<br><span class="text-xs text-orange-600 font-bold">キャンセル依頼あり</span>' : '') + '</td>'
      + '<td class="text-xs text-gray-600">' + fmtJST(o.created_at) + '</td>'
      + '<td class="flex items-center gap-1 py-2 flex-wrap">'
      + '<button onclick="showOrderDetail(' + o.id + ')" class="p-accent-link text-sm"><i class="fas fa-eye"></i></button>'
      + '<button onclick="printDeliverySlip(' + o.id + ')" class="btn-s text-xs py-1 px-2"><i class="fas fa-print mr-1"></i>納品書</button>'
      + '<button onclick="goInspection(' + o.id + ')" class="btn-p text-xs py-1 px-2"><i class="fas fa-barcode mr-1"></i>検品</button>'
      + cancelBtn
      + '</td></tr>';
  }).join('');
}

async function cancelComplete(id) {
  if (!confirm('キャンセル完了にしますか？お知らせが自動作成されます。')) return;
  var res = await apiFetch('/api/admin/orders/' + id + '/cancel-complete', {method:'PUT'});
  if (res.ok) { showToast('キャンセル完了にしました'); loadOrders(); }
  else showToast('更新失敗', 'error');
}

async function showOrderDetail(id) {
  var d = await (await apiFetch('/api/admin/orders/' + id)).json();
  var order = d.order, items = d.items || [], inspections = d.inspections || [];
  var inspectedBarcodes = {};
  inspections.filter(function(i){ return i.is_match; }).forEach(function(i){
    inspectedBarcodes[i.barcode_scanned] = (inspectedBarcodes[i.barcode_scanned]||0) + 1;
  });

  var statusOptions = Object.keys(statusLabel).map(function(s){
    return '<option value="' + s + '"' + (s === order.status ? ' selected' : '') + '>' + statusLabel[s] + '</option>';
  }).join('');

  document.getElementById('orderModalContent').innerHTML =
    '<div class="space-y-4">'
    + '<div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">発注番号</p><p class="font-bold p-accent">' + order.order_no + '</p></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">ステータス（手動変更）</p>'
    + '<select class="form-select text-xs py-1 px-2" onchange="updateStatusModal(' + order.id + ',this.value)">' + statusOptions + '</select></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">発注日時</p><p class="text-gray-800">' + fmtJST(order.created_at) + '</p></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">店舗/部署</p><p class="text-gray-800">' + order.store_name + (order.section_name ? ' / ' + order.section_name : '') + '</p></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">担当者</p><p class="text-gray-800">' + (order.orderer_name||'-') + '</p></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">納品希望日</p><p class="text-gray-800">' + (order.desired_delivery_date||'-') + '</p></div>'
    + (order.worker_name ? '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-600 font-semibold mb-1">作業者</p><p class="text-gray-800">' + order.worker_name + '</p></div>' : '')
    + '</div>'
    + (order.cancel_reason ? '<div class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm"><p class="text-xs text-orange-600 font-semibold mb-1">キャンセル依頼理由</p><p>' + order.cancel_reason + '</p></div>' : '')
    + (order.note ? '<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm"><p class="text-xs text-amber-600 font-semibold mb-1">備考</p><p>' + order.note + '</p></div>' : '')
    + '<div class="sec-title mt-2"><i class="fas fa-list p-accent"></i> 発注明細</div>'
    + '<div class="overflow-x-auto"><table class="w-full text-xs"><thead class="tbl-header"><tr><th>商品名</th><th>ギフトコード</th><th>バーコード</th><th>仕入先</th><th>ストック場所</th><th>区-番地</th><th>数量</th><th>検品</th></tr></thead><tbody>'
    + items.map(function(i) {
        var scanned = inspectedBarcodes[i.barcode] || 0;
        var matched = scanned >= i.quantity;
        var loc = i.stock_location || '';
        var locDetail = (i.stock_ku != null || i.stock_banchi != null) ? (i.stock_ku||'') + '-' + (i.stock_banchi||'') : '-';
        return '<tr><td class="font-medium">' + i.product_name + '</td>'
          + '<td class="font-mono">' + (i.gift_code||'-') + '</td>'
          + '<td class="font-mono text-gray-600">' + (i.barcode||'-') + '</td>'
          + '<td>' + (i.supplier_name||'-') + '</td>'
          + '<td>' + (loc||'-') + '</td>'
          + '<td>' + locDetail + '</td>'
          + '<td class="font-bold text-right p-accent">' + i.quantity + '</td>'
          + '<td class="text-center">' + (matched ? '<i class="fas fa-check-circle text-green-500"></i> ' + scanned : '<span class="text-gray-400">' + scanned + '/' + i.quantity + '</span>') + '</td></tr>';
      }).join('')
    + '</tbody></table></div>'
    + '<div class="flex flex-wrap gap-3 mt-2">'
    + '<button onclick="printDeliverySlip(' + order.id + ')" class="btn-s text-sm"><i class="fas fa-print mr-1"></i>納品書印刷</button>'
    + '<button onclick="goInspection(' + order.id + ')" class="btn-p text-sm"><i class="fas fa-barcode mr-1"></i>検品する</button>'
    + '</div></div>';
  document.getElementById('orderModal').classList.remove('hidden');
}

async function updateStatusModal(id, status) {
  var res = await apiFetch('/api/admin/orders/' + id + '/status', {method:'PUT', body:JSON.stringify({status:status})});
  if (res.ok) { showToast('ステータスを更新しました'); loadOrders(); }
  else showToast('更新失敗', 'error');
}

// ========== 納品書印刷 ==========
async function printDeliverySlip(id) {
  var d = await (await apiFetch('/api/admin/orders/' + id)).json();
  var order = d.order, items = d.items || [];
  var slip = document.getElementById('deliverySlip');
  var content = document.getElementById('deliverySlipContent');

  content.innerHTML = '<div style="width:100%;font-family:Hiragino Sans,Meiryo,sans-serif;font-size:10pt;">'
    + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">'
    + '<div><h1 style="font-size:16pt;font-weight:bold;margin:0;">納 品 書</h1>'
    + '<p style="margin:4px 0 0;font-size:9pt;color:#555;">発注番号: ' + order.order_no + '　発注日時: ' + fmtJST(order.created_at) + '</p></div>'
    + '<div style="border:2px solid #333;width:140px;height:70px;padding:4px;text-align:center;font-size:9pt;">'
    + '<div style="font-weight:bold;margin-bottom:2px;">検品者サイン</div>'
    + '<div style="height:44px;"></div></div></div>'
    + '<table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:9pt;">'
    + '<tr><td style="padding:4px 8px;border:1px solid #ccc;background:#f5f5f5;font-weight:bold;width:100px;">発注元</td>'
    + '<td style="padding:4px 8px;border:1px solid #ccc;">' + order.store_name + (order.section_name ? ' / ' + order.section_name : '') + '</td>'
    + '<td style="padding:4px 8px;border:1px solid #ccc;background:#f5f5f5;font-weight:bold;width:100px;">担当者</td>'
    + '<td style="padding:4px 8px;border:1px solid #ccc;">' + (order.orderer_name||'-') + '</td></tr>'
    + '<tr><td style="padding:4px 8px;border:1px solid #ccc;background:#f5f5f5;font-weight:bold;">納品希望日</td>'
    + '<td style="padding:4px 8px;border:1px solid #ccc;">' + (order.desired_delivery_date||'-') + '</td>'
    + '<td style="padding:4px 8px;border:1px solid #ccc;background:#f5f5f5;font-weight:bold;">ステータス</td>'
    + '<td style="padding:4px 8px;border:1px solid #ccc;">' + (statusLabel[order.status]||order.status) + '</td></tr>'
    + (order.note ? '<tr><td style="padding:4px 8px;border:1px solid #ccc;background:#f5f5f5;font-weight:bold;">備考</td><td colspan="3" style="padding:4px 8px;border:1px solid #ccc;">' + order.note + '</td></tr>' : '')
    + '</table>'
    + '<table style="width:100%;border-collapse:collapse;font-size:9pt;">'
    + '<thead><tr style="background:#e8f0e8;">'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">ギフトコード</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">商品名</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">商品記号</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">バーコード</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">仕入先</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:left;">ストック場所</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:center;">区-番地</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:center;">数量</th>'
    + '<th style="border:1px solid #ccc;padding:5px 8px;text-align:center;width:40px;">✓</th>'
    + '</tr></thead><tbody>'
    + items.map(function(it) {
        var locDetail = (it.stock_ku != null || it.stock_banchi != null) ? (it.stock_ku||'') + '-' + (it.stock_banchi||'') : '-';
        return '<tr>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;font-family:monospace;font-weight:bold;">' + (it.gift_code||'-') + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;">' + it.product_name + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;font-family:monospace;">' + (it.product_code||'-') + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;font-family:monospace;">' + (it.barcode||'-') + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;">' + (it.supplier_name||'-') + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;">' + (it.stock_location||'-') + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;text-align:center;">' + locDetail + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;text-align:center;font-weight:bold;">' + it.quantity + '</td>'
          + '<td style="border:1px solid #ccc;padding:4px 8px;"></td></tr>';
      }).join('')
    + '</tbody></table></div>';

  slip.style.display = 'block';
  // 印刷済みステータスへ自動遷移
  await apiFetch('/api/admin/orders/' + id + '/printed', {method:'PUT'});
  window.print();
  slip.style.display = 'none';
  loadOrders();
}

function goInspection(id) { closeModal('orderModal'); window.location.href = '/admin/inspection/' + id; }

// ========== 商品マスタ ==========
var _productData = [];          // 全件キャッシュ
var _productSortKey = '';       // 現在のソートキー
var _productSortAsc = true;     // 昇順フラグ

async function loadProducts() {
  var search = document.getElementById('productSearchAdmin')?.value||'';
  var url = '/api/admin/products' + (search ? '?search=' + encodeURIComponent(search) : '');
  var data = await (await apiFetch(url)).json();
  _productData = data.products || [];
  // ソートが指定されていれば維持
  if (_productSortKey) _applyProductSort();
  else _renderProducts(_productData);
}

function _renderProducts(prods) {
  var tbody = document.getElementById('productsTbody');
  if (!tbody) return;
  if (prods.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" class="text-center py-8 text-gray-500">商品がありません</td></tr>';
    // 全選チェックとバーをリセット
    var selAll = document.getElementById('productSelAll');
    if (selAll) selAll.checked = false;
    document.getElementById('productBulkBar').classList.add('hidden');
    return;
  }
  tbody.innerHTML = prods.map(function(p) {
    return '<tr class="product-row" data-id="' + p.id + '">'
      + '<td class="text-center px-1"><input type="checkbox" class="product-chk cursor-pointer" data-id="' + p.id + '" onchange="onProductChkChange()"></td>'
      + '<td><span class="sbadge s-completed" style="padding:2px 6px;font-size:.65rem;">' + (p.category||'-') + '</span></td>'
      + '<td class="font-mono">' + (p.unified_code||'-') + '</td>'
      + '<td class="font-mono font-bold p-accent">' + (p.gift_code||'-') + '</td>'
      + '<td>' + (p.is_new ? '<span class="new-badge">N</span> ' : '') + p.product_name + '</td>'
      + '<td class="font-mono text-gray-600">' + (p.product_code||'-') + '</td>'
      + '<td class="font-mono text-gray-600">' + (p.barcode||'-') + '</td>'
      + '<td class="font-mono text-gray-600">' + (p.supplier_code||'-') + '</td>'
      + '<td>' + (p.supplier_name||'-') + '</td>'
      + '<td>' + (p.stock_location||'-') + '</td>'
      + '<td class="text-center font-mono">' + (p.stock_ku!=null && p.stock_ku!=='' ? String(p.stock_ku) : '-') + '</td>'
      + '<td class="text-center font-mono">' + (p.stock_banchi!=null && p.stock_banchi!=='' ? String(p.stock_banchi) : '-') + '</td>'
      + '<td><span class="sbadge ' + (p.is_active ? 's-completed' : 's-cancelled') + '" style="padding:2px 6px;font-size:.65rem;">' + (p.is_active ? '有効' : '無効') + '</span></td>'
      + '<td class="px-1" style="white-space:nowrap;">'
      + '<button onclick="openProductModal(' + p.id + ')" style="font-size:.65rem;padding:2px 6px;" class="btn-s"><i class="fas fa-edit"></i></button>'
      + '<button onclick="deleteProduct(' + p.id + ')" style="font-size:.65rem;padding:2px 6px;" class="btn-d"><i class="fas fa-trash"></i></button>'
      + '</td></tr>';
  }).join('');
  // 全選チェックとバーをリセット
  var selAll = document.getElementById('productSelAll');
  if (selAll) selAll.checked = false;
  document.getElementById('productBulkBar').classList.add('hidden');
}

// ソート適用
function _applyProductSort() {
  var key = _productSortKey;
  var asc = _productSortAsc;
  var sorted = _productData.slice().sort(function(a, b) {
    var va = a[key]; var vb = b[key];
    // null/undefined は末尾へ
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    // 数値比較
    if (typeof va === 'number' && typeof vb === 'number') return asc ? va - vb : vb - va;
    // 文字列比較
    var sa = String(va).toLowerCase(); var sb = String(vb).toLowerCase();
    if (sa < sb) return asc ? -1 : 1;
    if (sa > sb) return asc ? 1 : -1;
    return 0;
  });
  _renderProducts(sorted);
}

// ヘッダークリックでソート
function sortProductsBy(key) {
  if (_productSortKey === key) {
    _productSortAsc = !_productSortAsc;
  } else {
    _productSortKey = key;
    _productSortAsc = true;
  }
  // ソートアイコン更新
  var cols = ['category','unified_code','gift_code','product_name','product_code','barcode','supplier_code','supplier_name','stock_location','stock_ku','stock_banchi','is_active'];
  cols.forEach(function(c) {
    var el = document.getElementById('psh-' + c);
    if (!el) return;
    if (c === _productSortKey) {
      el.textContent = _productSortAsc ? ' ▲' : ' ▼';
      el.style.opacity = '1';
    } else {
      el.textContent = ' ⇅';
      el.style.opacity = '0.4';
    }
  });
  _applyProductSort();
}

// チェックボックス変化 → バー表示切替
function onProductChkChange() {
  var chks = document.querySelectorAll('.product-chk:checked');
  var allChks = document.querySelectorAll('.product-chk');
  var bar = document.getElementById('productBulkBar');
  var cnt = document.getElementById('productSelCount');
  var selAll = document.getElementById('productSelAll');
  cnt.textContent = chks.length + '件を選択中';
  bar.classList.toggle('hidden', chks.length === 0);
  if (selAll) selAll.checked = allChks.length > 0 && chks.length === allChks.length;
}

// 全選 / 全解除
function toggleAllProducts(checked) {
  document.querySelectorAll('.product-chk').forEach(function(el) { el.checked = checked; });
  onProductChkChange();
}

// 選択解除
function clearProductSelection() {
  document.querySelectorAll('.product-chk').forEach(function(el) { el.checked = false; });
  var selAll = document.getElementById('productSelAll');
  if (selAll) selAll.checked = false;
  onProductChkChange();
}

// 一括削除
async function bulkDeleteProducts() {
  var chks = document.querySelectorAll('.product-chk:checked');
  if (!chks.length) return;
  var ids = Array.from(chks).map(function(el) { return parseInt(el.getAttribute('data-id'), 10); });
  if (!confirm(ids.length + '件の商品をマスタから完全に削除しますか？\\nこの操作は元に戻せません。')) return;
  var res = await apiFetch('/api/admin/products/bulk-delete', {method:'POST', body:JSON.stringify({ids:ids})});
  if (res.ok) {
    var d = await res.json();
    showToast(d.deleted + '件を削除しました');
    _productSortKey = '';
    _productSortAsc = true;
    loadProducts();
  } else {
    showToast('削除に失敗しました', 'error');
  }
}

async function openProductModal(id) {
  id = id || null;
  document.getElementById('productModalTitle').textContent = id ? '商品編集' : '商品追加';
  document.getElementById('productId').value = id || '';
  ['pCategory','pUnifiedCode','pGiftCode','pName','pBarcode','pSupplierCode','pSupplierName','pStockLocation','pStockKu','pStockBanchi'].forEach(function(f){ var el = document.getElementById(f); if(el) el.value = ''; });
  document.getElementById('pActive').checked = true;
  document.getElementById('pNew').checked = false;
  if (id) {
    var data = await (await apiFetch('/api/admin/products')).json();
    var p = (data.products||[]).find(function(x){ return x.id == id; });
    if (p) {
      document.getElementById('pCategory').value = p.category||'';
      document.getElementById('pUnifiedCode').value = p.unified_code||'';
      document.getElementById('pGiftCode').value = p.gift_code||'';
      document.getElementById('pName').value = p.product_name||'';
      document.getElementById('pBarcode').value = p.barcode||'';
      document.getElementById('pSupplierCode').value = p.supplier_code||'';
      document.getElementById('pSupplierName').value = p.supplier_name||'';
      document.getElementById('pStockLocation').value = p.stock_location||'';
      document.getElementById('pStockKu').value = p.stock_ku!=null ? p.stock_ku : '';
      document.getElementById('pStockBanchi').value = p.stock_banchi!=null ? p.stock_banchi : '';
      document.getElementById('pActive').checked = !!p.is_active;
      document.getElementById('pNew').checked = !!p.is_new;
    }
  }
  document.getElementById('productModal').classList.remove('hidden');
}

async function saveProduct() {
  var id = document.getElementById('productId').value;
  var body = {
    category: document.getElementById('pCategory').value,
    unified_code: document.getElementById('pUnifiedCode').value,
    gift_code: document.getElementById('pGiftCode').value,
    product_name: document.getElementById('pName').value,
    barcode: document.getElementById('pBarcode').value,
    supplier_code: document.getElementById('pSupplierCode').value,
    supplier_name: document.getElementById('pSupplierName').value,
    stock_location: document.getElementById('pStockLocation').value,
    stock_ku: document.getElementById('pStockKu').value.trim() || null,
    stock_banchi: document.getElementById('pStockBanchi').value.trim() || null,
    is_active: document.getElementById('pActive').checked ? 1 : 0,
    is_new: document.getElementById('pNew').checked ? 1 : 0,
  };
  if (!body.product_name) { showToast('商品名は必須です', 'error'); return; }
  var url = id ? '/api/admin/products/' + id : '/api/admin/products';
  var method = id ? 'PUT' : 'POST';
  var res = await apiFetch(url, {method:method, body:JSON.stringify(body)});
  if (res.ok) { showToast('保存しました'); closeModal('productModal'); loadProducts(); }
  else { var e = await res.json(); showToast(e.error || '保存失敗', 'error'); }
}

async function deleteProduct(id) {
  if (!confirm('この商品をマスタから完全に削除しますか？\\nこの操作は元に戻せません。')) return;
  var res = await apiFetch('/api/admin/products/' + id, {method:'DELETE'});
  if (res.ok) { showToast('削除しました'); loadProducts(); }
  else showToast('削除に失敗しました', 'error');
}

// ========== 文字列セル生成ヘルパー（先頭0保持） ==========
function strCell(v) { return { t:'s', v: v == null ? '' : String(v) }; }

// ========== Excel テンプレート出力 ==========
function downloadProductTemplate() {
  var wb = XLSX.utils.book_new();
  var headers = ['カテゴリ','統一コード','ギフトコード','商品名','商品記号','バーコード','仕入先コード','仕入先名','ストック場所','区','番地'];
  // ヘッダー行も文字列セルで出力
  var ws = XLSX.utils.aoa_to_sheet([headers.map(function(h){ return strCell(h); })]);
  XLSX.utils.book_append_sheet(wb, ws, '商品マスタ');
  XLSX.writeFile(wb, '商品マスタテンプレート.xlsx');
}

// ========== 商品マスタ Excel出力 ==========
async function exportProducts() {
  var data = await (await apiFetch('/api/admin/products')).json();
  var prods = data.products || [];
  // 全セルを文字列型で出力（先頭0を保持するため）
  var headerRow = ['カテゴリ','統一コード','ギフトコード','商品名','商品記号','バーコード','仕入先コード','仕入先名','ストック場所','区','番地','状態'].map(function(h){ return strCell(h); });
  var dataRows = prods.map(function(p) {
    return [
      strCell(p.category||''),
      strCell(p.unified_code||''),
      strCell(p.gift_code||''),
      strCell(p.product_name||''),
      strCell(p.product_code||''),
      strCell(p.barcode||''),
      strCell(p.supplier_code||''),
      strCell(p.supplier_name||''),
      strCell(p.stock_location||''),
      strCell(p.stock_ku!=null ? String(p.stock_ku) : ''),
      strCell(p.stock_banchi!=null ? String(p.stock_banchi) : ''),
      strCell(p.is_active ? '有効' : '無効')
    ];
  });
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet([headerRow].concat(dataRows));
  XLSX.utils.book_append_sheet(wb, ws, '商品マスタ');
  XLSX.writeFile(wb, '商品マスタ_' + todayStr() + '.xlsx');
}

// ========== Excel取込 ==========
var importRows = [];
function openImportModal() {
  importRows = [];
  document.getElementById('importPreview').innerHTML = '';
  document.getElementById('importBtn').classList.add('hidden');
  document.getElementById('importFile').value = '';
  document.getElementById('importProgressArea').classList.add('hidden');
  document.getElementById('importActionBtns').classList.remove('hidden');
  document.getElementById('importCloseBtn').disabled = false;
  document.getElementById('importCancelBtn').disabled = false;
  document.getElementById('importDropZone').classList.remove('hidden');
  document.getElementById('importModal').classList.remove('hidden');
}

function handleImportFile(input) {
  var file = input.files[0]; if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var wb = XLSX.read(e.target.result, {type:'binary'});
    var ws = wb.Sheets[wb.SheetNames[0]];
    // raw:false で全セルを文字列として読み込む（先頭0を保持するため）
    var data = XLSX.utils.sheet_to_json(ws, {defval:'', raw:false});
    // さらに各フィールドを明示的に文字列変換（数値変換されてしまう場合の保険）
    data = data.map(function(r) {
      var row = {};
      Object.keys(r).forEach(function(k) { row[k] = r[k] != null ? String(r[k]) : ''; });
      return row;
    });
    importRows = data;
    var preview = document.getElementById('importPreview');
    var col = function(r, ja, en) { return r[ja] || r[en] || ''; };
    preview.innerHTML = '<p class="text-sm text-gray-700 mb-2">' + data.length + '件を読み込みました。</p>'
      + '<div class="overflow-x-auto max-h-48 border rounded"><table class="text-xs w-full"><thead class="tbl-header"><tr><th>カテゴリ</th><th>統一コード</th><th>ギフトコード</th><th>商品名</th><th>商品記号</th><th>バーコード</th></tr></thead><tbody>'
      + data.slice(0,10).map(function(r){ return '<tr><td>'+col(r,'カテゴリ','category')+'</td><td>'+col(r,'統一コード','unified_code')+'</td><td>'+col(r,'ギフトコード','gift_code')+'</td><td>'+col(r,'商品名','product_name')+'</td><td>'+col(r,'商品記号','product_code')+'</td><td>'+col(r,'バーコード','barcode')+'</td></tr>'; }).join('')
      + '</tbody></table></div>';
    document.getElementById('importBtn').classList.remove('hidden');
  };
  reader.readAsBinaryString(file);
}

// チャンクサイズ（1回のAPIコールで送る件数）
var IMPORT_CHUNK_SIZE = 5;

async function executeImport() {
  if (!importRows.length) return;
  var total = importRows.length;

  // UIを「取込中」状態に切り替え
  document.getElementById('importBtn').classList.add('hidden');
  document.getElementById('importDropZone').classList.add('hidden');
  document.getElementById('importCloseBtn').disabled = true;
  document.getElementById('importCancelBtn').disabled = true;
  document.getElementById('importProgressArea').classList.remove('hidden');
  _updateImportProgress(0, total);

  var totalInserted = 0;
  var totalUpdated  = 0;
  var errors = 0;

  try {
    // チャンク分割して順次送信
    for (var i = 0; i < total; i += IMPORT_CHUNK_SIZE) {
      var chunk = importRows.slice(i, i + IMPORT_CHUNK_SIZE);
      var res = await apiFetch('/api/admin/products/import', {
        method: 'POST',
        body: JSON.stringify({ rows: chunk })
      });
      var d = await res.json();
      if (res.ok) {
        totalInserted += d.inserted || 0;
        totalUpdated  += d.updated  || 0;
      } else {
        errors++;
      }
      // プログレス更新
      var done = Math.min(i + IMPORT_CHUNK_SIZE, total);
      _updateImportProgress(done, total);
    }

    // 完了メッセージ組み立て
    var resultMsg = '';
    if (totalInserted > 0 && totalUpdated > 0) {
      resultMsg = '新規追加 ' + totalInserted + '件 / 更新 ' + totalUpdated + '件';
    } else if (totalInserted > 0) {
      resultMsg = totalInserted + '件を新規追加しました';
    } else if (totalUpdated > 0) {
      resultMsg = totalUpdated + '件を更新しました';
    } else {
      resultMsg = '取込完了（変更なし）';
    }
    if (errors > 0) resultMsg += '（エラー: ' + errors + 'チャンク）';

    // 完了
    document.getElementById('importProgressBar').style.width = '100%';
    document.getElementById('importProgressText').textContent = '完了!';
    document.getElementById('importProgressDetail').textContent = resultMsg;
    document.getElementById('importProgressArea').querySelector('span').innerHTML =
      '<i class="fas fa-check-circle mr-2 text-green-500"></i>取り込み完了';
    document.getElementById('importProgressBar').style.background = 'linear-gradient(90deg,#10b981,#059669)';
    document.getElementById('importCancelBtn').disabled = false;
    document.getElementById('importCancelBtn').textContent = '閉じる';
    document.getElementById('importCloseBtn').disabled = false;

    if (errors === 0) {
      showToast(resultMsg);
    } else {
      showToast(resultMsg, 'error');
    }
    loadProducts();

  } catch (err) {
    document.getElementById('importProgressDetail').textContent = 'エラーが発生しました: ' + err.message;
    document.getElementById('importCancelBtn').disabled = false;
    document.getElementById('importCloseBtn').disabled = false;
    showToast('取込中にエラーが発生しました', 'error');
  }
}

function _updateImportProgress(done, total) {
  var pct = total > 0 ? Math.round((done / total) * 100) : 0;
  document.getElementById('importProgressBar').style.width = pct + '%';
  document.getElementById('importProgressText').textContent = pct + '%';
  document.getElementById('importProgressDetail').textContent =
    done + ' / ' + total + ' 件処理中...';
}

// ========== 発注元マスタ ==========
async function loadStores() {
  var data = await (await apiFetch('/api/admin/stores')).json();
  var stores = data.stores || [];
  var tbody = document.getElementById('storesTbody');
  if (stores.length === 0) { tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">発注元がありません</td></tr>'; return; }
  tbody.innerHTML = stores.map(function(s) {
    return '<tr>'
      + '<td class="font-medium">' + s.store_name + '</td>'
      + '<td class="text-gray-700">' + (s.section_name||'-') + '</td>'
      + '<td class="text-gray-700">' + (s.phone||'-') + '</td>'
      + '<td class="font-mono p-accent">' + s.login_id + '</td>'
      + '<td>' + (s.is_test ? '<span class="sbadge s-pending">テスト</span>' : '') + '</td>'
      + '<td class="flex items-center gap-1">'
      + '<button onclick="openStoreModal(' + s.id + ')" class="text-xs btn-s py-1 px-2"><i class="fas fa-edit mr-1"></i>編集</button>'
      + '<button onclick="deleteStore(' + s.id + ')" class="btn-d"><i class="fas fa-trash"></i></button>'
      + '</td></tr>';
  }).join('');
}

async function openStoreModal(id) {
  id = id || null;
  document.getElementById('storeModalTitle').textContent = id ? '発注元編集' : '発注元追加';
  document.getElementById('storeId').value = id || '';
  ['sName','sSection','sPhone','sFax','sLoginId','sPassword'].forEach(function(f){ document.getElementById(f).value = ''; });
  document.getElementById('sIsTest').checked = false;
  document.getElementById('sPwReq').style.display = id ? 'none' : '';
  document.getElementById('sPwNote').classList.toggle('hidden', !id);
  if (id) {
    var data = await (await apiFetch('/api/admin/stores')).json();
    var s = (data.stores||[]).find(function(x){ return x.id == id; });
    if (s) {
      document.getElementById('sName').value = s.store_name||'';
      document.getElementById('sSection').value = s.section_name||'';
      document.getElementById('sPhone').value = s.phone||'';
      document.getElementById('sFax').value = s.fax||'';
      document.getElementById('sLoginId').value = s.login_id||'';
      document.getElementById('sIsTest').checked = !!s.is_test;
    }
  }
  document.getElementById('storeModal').classList.remove('hidden');
}

async function saveStore() {
  var id = document.getElementById('storeId').value;
  var body = {
    store_name: document.getElementById('sName').value,
    section_name: document.getElementById('sSection').value,
    phone: document.getElementById('sPhone').value,
    fax: document.getElementById('sFax').value,
    login_id: document.getElementById('sLoginId').value,
    password: document.getElementById('sPassword').value,
    is_test: document.getElementById('sIsTest').checked,
  };
  var url = id ? '/api/admin/stores/' + id : '/api/admin/stores';
  var method = id ? 'PUT' : 'POST';
  var res = await apiFetch(url, {method:method, body:JSON.stringify(body)});
  if (res.ok) { showToast('保存しました'); closeModal('storeModal'); loadStores(); }
  else { var e = await res.json(); showToast(e.error || '保存失敗', 'error'); }
}

async function deleteStore(id) {
  if (!confirm('削除しますか？')) return;
  await apiFetch('/api/admin/stores/' + id, {method:'DELETE'});
  showToast('削除しました'); loadStores();
}

// ========== 履歴 ==========
var historyData = [];
function initHistory() {
  var today = new Date(); var jst = new Date(today.getTime() + 9*3600000);
  var y = jst.getUTCFullYear(), m = String(jst.getUTCMonth()+1).padStart(2,'0'), d = String(jst.getUTCDate()).padStart(2,'0');
  var todayStr = y + '-' + m + '-' + d;
  var fromEl = document.getElementById('historyFrom'), toEl = document.getElementById('historyTo');
  if (!fromEl.value) { var prev = new Date(jst); prev.setUTCDate(prev.getUTCDate()-30); fromEl.value = prev.getUTCFullYear()+'-'+String(prev.getUTCMonth()+1).padStart(2,'0')+'-'+String(prev.getUTCDate()).padStart(2,'0'); }
  if (!toEl.value) toEl.value = todayStr;
  loadHistory();
}

async function loadHistory() {
  var from = document.getElementById('historyFrom').value;
  var to   = document.getElementById('historyTo').value;
  var url = '/api/admin/orders?';
  if (from) url += 'from=' + from + '&';
  if (to)   url += 'to=' + to;
  var data = await (await apiFetch(url)).json();
  historyData = data.orders || [];

  // 各発注の明細件数は orders に含まれていないので別途表示
  var tbody = document.getElementById('historyTbody');
  if (!historyData.length) { tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-500">データがありません</td></tr>'; return; }
  tbody.innerHTML = historyData.map(function(o) {
    return '<tr class="history-row" data-id="' + o.id + '">'
      + '<td class="text-center"><input type="checkbox" class="history-chk cursor-pointer" data-id="' + o.id + '" onchange="onHistoryChkChange()"></td>'
      + '<td class="font-bold p-accent">' + o.order_no + '</td>'
      + '<td>' + o.store_name + (o.section_name ? ' / ' + o.section_name : '') + '</td>'
      + '<td>' + (o.orderer_name||'-') + '</td>'
      + '<td>' + (o.desired_delivery_date||'-') + '</td>'
      + '<td><span class="sbadge ' + (statusCls[o.status]||'') + '">' + (statusLabel[o.status]||o.status) + '</span></td>'
      + '<td>' + fmtJST(o.created_at) + '</td>'
      + '<td><button onclick="deleteHistoryOrder(' + o.id + ',\\'' + o.order_no + '\\')" class="btn-sm btn-sm-red"><i class="fas fa-trash"></i></button></td>'
      + '</tr>';
  }).join('');
  // 全選チェックをリセット
  var selAll = document.getElementById('historySelAll');
  if (selAll) selAll.checked = false;
  document.getElementById('historyBulkBar').classList.add('hidden');
}

// 単件削除
async function deleteHistoryOrder(id, orderNo) {
  if (!confirm('発注番号 ' + orderNo + ' を削除しますか？\\nこの操作は元に戻せません。')) return;
  var res = await apiFetch('/api/admin/orders/' + id, {method:'DELETE'});
  if (res.ok) { showToast('削除しました'); loadHistory(); }
  else showToast('削除に失敗しました', 'error');
}

// チェックボックス変化 → バー表示切替
function onHistoryChkChange() {
  var chks = document.querySelectorAll('.history-chk:checked');
  var bar = document.getElementById('historyBulkBar');
  var cnt = document.getElementById('historySelCount');
  var selAll = document.getElementById('historySelAll');
  var allChks = document.querySelectorAll('.history-chk');
  cnt.textContent = chks.length + '件を選択中';
  bar.classList.toggle('hidden', chks.length === 0);
  if (selAll) selAll.checked = allChks.length > 0 && chks.length === allChks.length;
}

// 全選 / 全解除
function toggleAllHistory(checked) {
  document.querySelectorAll('.history-chk').forEach(function(el) { el.checked = checked; });
  onHistoryChkChange();
}

// 選択解除
function clearHistorySelection() {
  document.querySelectorAll('.history-chk').forEach(function(el) { el.checked = false; });
  var selAll = document.getElementById('historySelAll');
  if (selAll) selAll.checked = false;
  onHistoryChkChange();
}

// 一括削除
async function bulkDeleteHistory() {
  var chks = document.querySelectorAll('.history-chk:checked');
  if (!chks.length) return;
  var ids = Array.from(chks).map(function(el) { return parseInt(el.getAttribute('data-id'), 10); });
  if (!confirm(ids.length + '件の受注履歴を削除しますか？\\nこの操作は元に戻せません。')) return;
  var res = await apiFetch('/api/admin/orders/bulk-delete', {method:'POST', body:JSON.stringify({ids:ids})});
  if (res.ok) {
    var d = await res.json();
    showToast(d.deleted + '件を削除しました');
    loadHistory();
  } else showToast('削除に失敗しました', 'error');
}

async function exportHistory(fmt) {
  if (!historyData.length) { showToast('データがありません', 'error'); return; }
  // 詳細データを取得してフラット化
  showToast('データ取得中...');
  var allRows = [['発注番号','店舗名','部署名','担当者','納品希望日','ステータス','発注日時','商品名','ギフトコード','バーコード','仕入先コード','仕入先名','ストック場所','区','番地','数量']];
  for (var i = 0; i < historyData.length; i++) {
    var o = historyData[i];
    var d = await (await apiFetch('/api/admin/orders/' + o.id)).json();
    var items = d.items || [];
    if (items.length === 0) {
      allRows.push([o.order_no, o.store_name, o.section_name||'', o.orderer_name||'', o.desired_delivery_date||'', statusLabel[o.status]||o.status, fmtJST(o.created_at),'','','','','','','','','']);
    } else {
      items.forEach(function(it) {
        allRows.push([o.order_no, o.store_name, o.section_name||'', o.orderer_name||'', o.desired_delivery_date||'', statusLabel[o.status]||o.status, fmtJST(o.created_at), it.product_name, it.gift_code||'', it.barcode||'', it.supplier_code||'', it.supplier_name||'', it.stock_location||'', it.stock_ku!=null?it.stock_ku:'', it.stock_banchi!=null?it.stock_banchi:'', it.quantity]);
      });
    }
  }
  var wb = XLSX.utils.book_new();
  var ws = XLSX.utils.aoa_to_sheet(allRows);
  XLSX.utils.book_append_sheet(wb, ws, '受注履歴');
  var filename = '受注履歴_' + todayStr() + (fmt === 'xls' ? '.xls' : '.xlsx');
  XLSX.writeFile(wb, filename, fmt === 'xls' ? {bookType:'biff8'} : {});
  showToast('出力しました');
}

// ========== お知らせ ==========
async function loadNotices() {
  var data = await (await apiFetch('/api/admin/notices')).json();
  var notices = data.notices || [];
  var tbody = document.getElementById('noticesTbody');
  if (!notices.length) { tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">お知らせがありません</td></tr>'; return; }
  tbody.innerHTML = notices.map(function(n) {
    return '<tr>'
      + '<td class="font-medium">' + n.title + '</td>'
      + '<td>' + (n.notice_type||'general') + '</td>'
      + '<td class="text-gray-600 text-xs">' + (n.expire_at ? fmtJST(n.expire_at) : '無期限') + '</td>'
      + '<td class="text-gray-600 text-xs">' + fmtJST(n.created_at) + '</td>'
      + '<td class="flex items-center gap-1">'
      + '<button onclick="openNoticeModal(' + n.id + ')" class="text-xs btn-s py-1 px-2"><i class="fas fa-edit"></i></button>'
      + '<button onclick="deleteNotice(' + n.id + ')" class="btn-d"><i class="fas fa-trash"></i></button>'
      + '</td></tr>';
  }).join('');
}

async function openNoticeModal(id) {
  id = id || null;
  document.getElementById('noticeModalTitle').textContent = id ? 'お知らせ編集' : 'お知らせ追加';
  document.getElementById('noticeId').value = id || '';
  ['nTitle','nMessage','nBody','nExpire'].forEach(function(f){ document.getElementById(f).value=''; });
  document.getElementById('nType').value = 'general';
  if (id) {
    var data = await (await apiFetch('/api/admin/notices')).json();
    var n = (data.notices||[]).find(function(x){ return x.id == id; });
    if (n) {
      document.getElementById('nTitle').value = n.title||'';
      document.getElementById('nMessage').value = n.message||'';
      document.getElementById('nBody').value = n.body||'';
      document.getElementById('nType').value = n.notice_type||'general';
      if (n.expire_at) document.getElementById('nExpire').value = n.expire_at.replace(' ','T').slice(0,16);
    }
  }
  document.getElementById('noticeModal').classList.remove('hidden');
}

async function saveNotice() {
  var id = document.getElementById('noticeId').value;
  var body = {
    title: document.getElementById('nTitle').value,
    message: document.getElementById('nMessage').value,
    body: document.getElementById('nBody').value,
    notice_type: document.getElementById('nType').value,
    expire_at: document.getElementById('nExpire').value || null,
  };
  if (!body.title) { showToast('タイトルは必須です', 'error'); return; }
  var url = id ? '/api/admin/notices/' + id : '/api/admin/notices';
  var method = id ? 'PUT' : 'POST';
  var res = await apiFetch(url, {method:method, body:JSON.stringify(body)});
  if (res.ok) { showToast('保存しました'); closeModal('noticeModal'); loadNotices(); }
  else showToast('保存失敗', 'error');
}

async function deleteNotice(id) {
  if (!confirm('削除しますか？')) return;
  await apiFetch('/api/admin/notices/' + id, {method:'DELETE'});
  showToast('削除しました'); loadNotices();
}

// ========== メール設定 ==========
async function loadEmailSettings() {
  var data = await (await apiFetch('/api/admin/email-settings')).json();
  var s = data.settings || {};
  document.getElementById('mainEmail').value = s.main_email||'';
  document.getElementById('subEmail').value = s.sub_email||'';
  document.getElementById('resendApiKey').value = s.resend_api_key||'';
}
async function saveEmailSettings() {
  var res = await apiFetch('/api/admin/email-settings', {method:'PUT', body:JSON.stringify({
    main_email: document.getElementById('mainEmail').value,
    sub_email:  document.getElementById('subEmail').value,
    resend_api_key: document.getElementById('resendApiKey').value,
  })});
  if (res.ok) showToast('保存しました'); else showToast('保存失敗', 'error');
}
async function sendTestEmail() {
  var res = await apiFetch('/api/admin/email-settings/test', {method:'POST'});
  if (res.ok) showToast('テスト送信しました'); else { var e = await res.json(); showToast(e.error || '送信失敗', 'error'); }
}

// ========== システム設定 ==========
async function loadSettings() {
  var data = await (await apiFetch('/api/admin/settings')).json();
  var s = data.settings || {};
  document.getElementById('settingSiteName').value = s.site_name||'';
  document.getElementById('settingSiteDesc').value = s.site_description||'';
  applyTheme(s.theme_preset || 'green');
  buildThemeSwatches();
}
async function saveSettings() {
  var res = await apiFetch('/api/admin/settings', {method:'PUT', body:JSON.stringify({
    site_name: document.getElementById('settingSiteName').value,
    site_description: document.getElementById('settingSiteDesc').value,
    theme_preset: currentTheme,
  })});
  if (res.ok) showToast('保存しました'); else showToast('保存失敗', 'error');
}
async function changePassword() {
  var cur = document.getElementById('curPw').value;
  var nw  = document.getElementById('newPw').value;
  var conf= document.getElementById('confirmPw').value;
  if (nw !== conf) { showToast('新しいパスワードが一致しません', 'error'); return; }
  var res = await apiFetch('/api/admin/admins/password', {method:'PUT', body:JSON.stringify({current_password:cur, new_password:nw})});
  if (res.ok) { showToast('パスワードを変更しました'); ['curPw','newPw','confirmPw'].forEach(function(f){ document.getElementById(f).value=''; }); }
  else { var e = await res.json(); showToast(e.error || '変更失敗', 'error'); }
}

// ========== ユーティリティ ==========
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }
function openDrawer()  { document.getElementById('drawerMenu').classList.add('open'); document.getElementById('drawerOverlay').classList.add('open'); }
function closeDrawer() { document.getElementById('drawerMenu').classList.remove('open'); document.getElementById('drawerOverlay').classList.remove('open'); }
function togglePw(id, btn) { var el = document.getElementById(id); el.type = el.type==='password'?'text':'password'; btn.querySelector('i').className = el.type==='password'?'fas fa-eye text-sm':'fas fa-eye-slash text-sm'; }

function showToast(msg, type) {
  var t = document.getElementById('toast'), inner = document.getElementById('toastInner');
  inner.textContent = msg;
  inner.style.background = type === 'error' ? 'linear-gradient(135deg,#e07070,#c05050)' : 'linear-gradient(135deg,var(--p1),var(--p2))';
  t.classList.remove('hidden');
  setTimeout(function(){ t.classList.add('hidden'); }, 3000);
}

function todayStr() {
  var d = new Date(), jst = new Date(d.getTime() + 9*3600000);
  return jst.getUTCFullYear() + String(jst.getUTCMonth()+1).padStart(2,'0') + String(jst.getUTCDate()).padStart(2,'0');
}

// ========== 初期化 ==========
(async function init() {
  await loadPublicSettings();
  if (!adminToken) return;
  try {
    var res = await apiFetch('/api/admin/admins');
    if (!res.ok) { adminToken = null; localStorage.removeItem('adminToken'); return; }
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('mainPage').classList.remove('hidden');
    var adData = await (await apiFetch('/api/admin/admins')).json();
    var me = adData.admins && adData.admins[0];
    currentAdminName = me ? (me.display_name || me.username) : '管理者';
    document.getElementById('adminDisplayName').textContent = currentAdminName;
    document.getElementById('drawerAdminName').textContent = currentAdminName;
    switchPage('orders');
  } catch(e) { adminToken = null; localStorage.removeItem('adminToken'); }
})();
<\/script>
</body>
</html>`;
}
