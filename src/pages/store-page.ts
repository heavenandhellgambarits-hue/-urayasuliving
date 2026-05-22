export function getStorePage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OrderFlow - 発注ポータル</title>
<script src="https://cdn.tailwindcss.com"><\/script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
:root{
  --p1:#7a9e7e; --p2:#5d8464; --p3:#3d6444;
  --p-bg1:#fdfbf7; --p-bg2:#eef2ec; --p-bg3:#e8ede8;
  --p-card-border:rgba(200,215,190,.4);
  --p-input-border:#d0dbc8;
  --p-title:#4a6b4e;
  --p-line:#c8d9c0;
  --p-step-done-bg:#e8f5e9; --p-step-done-fg:#4a7a50;
  --p-tbl-bg1:#f0f7f0; --p-tbl-bg2:#e4f0e4;
  --p-tbl-border:rgba(180,210,180,.2);
  --p-selected-bg:rgba(240,250,240,.95);
  --p-hover-row:rgba(93,132,100,.03);
  --p-focus-ring:rgba(122,158,126,.15);
}
body{background:linear-gradient(135deg,var(--p-bg1) 0%,var(--p-bg2) 50%,var(--p-bg3) 100%);min-height:100vh;
  font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;}
.card{background:rgba(255,255,255,.88);backdrop-filter:blur(8px);border-radius:14px;
  box-shadow:0 2px 16px rgba(120,140,100,.10),0 1px 4px rgba(0,0,0,.04);
  border:1px solid var(--p-card-border);}
.btn-primary{background:linear-gradient(135deg,var(--p1),var(--p2));color:#fff;border-radius:10px;
  padding:10px 24px;font-weight:700;transition:all .2s;border:none;cursor:pointer;font-size:.9rem;}
.btn-primary:hover{filter:brightness(1.07);transform:translateY(-1px);box-shadow:0 4px 12px rgba(0,0,0,.18);}
.btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none;box-shadow:none;}
.btn-secondary{background:linear-gradient(135deg,#f5f0e8,#ede7da);color:#5a5040;border-radius:10px;
  padding:10px 24px;font-weight:700;transition:all .2s;border:1px solid rgba(180,160,120,.3);cursor:pointer;font-size:.9rem;}
.btn-secondary:hover{filter:brightness(.97);transform:translateY(-1px);}
.form-input,.form-select{border:1.5px solid var(--p-input-border);border-radius:10px;padding:10px 14px;
  background:rgba(255,255,255,.9);transition:border-color .2s,box-shadow .2s;width:100%;font-size:.95rem;}
.form-input:focus,.form-select:focus{outline:none;border-color:var(--p1);box-shadow:0 0 0 3px var(--p-focus-ring);}
.section-title{font-size:1rem;font-weight:700;color:var(--p-title);display:flex;align-items:center;gap:8px;margin-bottom:14px;}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(to right,var(--p-line),transparent);}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);z-index:100;
  display:flex;align-items:center;justify-content:center;padding:16px;}
.modal-box{background:#fff;border-radius:16px;padding:28px;max-width:560px;width:100%;
  box-shadow:0 20px 60px rgba(0,0,0,.2);max-height:90vh;overflow-y:auto;}
.qty-input{border:1.5px solid var(--p-input-border);border-radius:8px;padding:6px 8px;width:72px;
  text-align:center;font-size:.95rem;background:rgba(255,255,255,.9);}
.qty-input:focus{outline:none;border-color:var(--p1);box-shadow:0 0 0 3px var(--p-focus-ring);}
.new-badge{background:linear-gradient(135deg,#ff6b6b,#ee5a24);color:#fff;font-size:.65rem;font-weight:700;
  padding:2px 6px;border-radius:6px;margin-left:4px;vertical-align:middle;}
.product-card{background:rgba(255,255,255,.85);border:1.5px solid var(--p-card-border);border-radius:10px;
  padding:10px 14px;transition:all .2s;display:flex;align-items:center;gap:12px;}
.product-card.selected{border-color:var(--p1);background:var(--p-selected-bg);
  box-shadow:0 2px 10px rgba(0,0,0,.10);}
.product-card:hover{box-shadow:0 2px 8px rgba(0,0,0,.08);border-color:var(--p1);}
.notice-accordion{background:linear-gradient(135deg,#fffbf0,#fff8e6);border:1px solid #f0d070;
  border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(240,180,40,.10);}
.notice-accordion-header{display:flex;align-items:center;justify-content:space-between;
  padding:12px 16px;cursor:pointer;user-select:none;}
.notice-accordion-header:hover{background:rgba(255,240,180,.3);}
.notice-accordion-body{padding:0 16px 14px;max-height:360px;overflow-y:auto;}
.notice-item{border:1px solid #fde68a;border-radius:10px;background:rgba(255,255,255,.7);
  padding:10px 12px;cursor:pointer;transition:all .18s;margin-bottom:6px;}
.notice-item:hover{background:rgba(255,250,230,.95);border-color:#f59e0b;transform:translateY(-1px);
  box-shadow:0 2px 8px rgba(240,180,40,.15);}
.notice-item.important{border-color:#fca5a5;background:rgba(255,241,242,.85);}
.notice-item.important:hover{background:rgba(255,228,230,.95);border-color:#f87171;}
.notice-item-title{font-size:.875rem;font-weight:700;color:#92400e;display:flex;align-items:center;gap:6px;margin-bottom:2px;}
.notice-item-preview{font-size:.75rem;color:#b45309;line-height:1.4;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;}
.notice-item.important .notice-item-title{color:#991b1b;}
.notice-item.important .notice-item-preview{color:#b91c1c;}
.status-pill{display:inline-flex;align-items:center;gap:4px;padding:4px 12px;border-radius:20px;font-size:.78rem;font-weight:700;}
.status-pending{background:#fff3cd;color:#856404;}
.status-confirmed{background:#d1ecf1;color:#0c5460;}
.status-preparing{background:#e8d5f5;color:#5a1fa2;}
.status-inspecting{background:#fce4ec;color:#8b174d;}
.status-shipped{background:#d1e7dd;color:#0a3622;}
.status-cancelled{background:#f8d7da;color:#842029;}
.cart-item{background:rgba(255,255,255,.7);border:1px solid var(--p-card-border);border-radius:10px;
  padding:12px 16px;display:flex;align-items:center;gap:10px;transition:all .2s;}
.cart-item:hover{background:rgba(255,255,255,.9);box-shadow:0 2px 8px rgba(0,0,0,.06);}
.step{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:20px;
  font-size:.82rem;font-weight:700;transition:all .3s;white-space:nowrap;}
.step.active{background:linear-gradient(135deg,var(--p1),var(--p2));color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.15);}
.step.done{background:var(--p-step-done-bg);color:var(--p-step-done-fg);}
.step.pending{background:rgba(255,255,255,.5);color:#aaa;}
.step-sep{color:#ccc;font-size:.9rem;}
.float-cart-btn{position:fixed;right:16px;top:50%;transform:translateY(-50%);z-index:50;
  display:flex;flex-direction:column;align-items:center;gap:4px;
  background:linear-gradient(135deg,var(--p1),var(--p2));color:#fff;border:none;cursor:pointer;
  border-radius:14px;padding:14px 10px;font-size:.78rem;font-weight:700;line-height:1.3;
  box-shadow:0 4px 18px rgba(0,0,0,.20);transition:all .2s;
  writing-mode:vertical-rl;text-orientation:mixed;letter-spacing:.08em;
  min-width:44px;min-height:130px;justify-content:center;}
.float-cart-btn:hover{filter:brightness(1.08);transform:translateY(-50%) translateX(-2px);}
.float-cart-btn.is-hidden{display:none;}
.float-badge{writing-mode:horizontal-tb;background:rgba(255,255,255,.28);border-radius:10px;
  padding:2px 7px;font-size:.7rem;font-weight:700;min-width:22px;text-align:center;margin-top:4px;}
.float-icon{writing-mode:horizontal-tb;font-size:1.1rem;}
.fade-in{animation:fadeIn .4s ease;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.loading{display:inline-block;width:18px;height:18px;border:2px solid #ccc;
  border-top-color:var(--p1);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
th{padding:10px 12px;text-align:left;font-size:.75rem;font-weight:700;color:var(--p-title);}
td{padding:9px 12px;font-size:.85rem;border-bottom:1px solid var(--p-tbl-border);}
tr:hover td{background:var(--p-hover-row);}
.tbl-header{background:linear-gradient(135deg,var(--p-tbl-bg1),var(--p-tbl-bg2));}
@media(max-width:640px){
  .step{padding:6px 8px;font-size:.72rem;}
  .step i{display:none;}
  .float-cart-btn{right:8px;padding:10px 8px;font-size:.72rem;min-height:110px;border-radius:10px;}
}
</style>
</head>
<body class="p-3 md:p-6">

<!-- フローティングカートボタン -->
<button id="floatCartBtn" class="float-cart-btn is-hidden" onclick="openCartModal()">
  <span class="float-icon"><i class="fas fa-shopping-cart"></i></span>
  カートへ
  <span class="float-badge" id="floatCartCount">0</span>
</button>

<!-- ログイン -->
<div id="loginPage" class="min-h-screen flex items-center justify-center p-4">
  <div class="card p-8 w-full max-w-sm fade-in">
    <div class="text-center mb-6">
      <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style="background:linear-gradient(135deg,#7a9e7e,#5d8464);">
        <i class="fas fa-box text-white text-2xl"></i>
      </div>
      <h1 id="loginSiteName" class="text-xl font-bold text-gray-800">OrderFlow</h1>
      <p class="text-xs text-gray-400 mt-1">発注ポータル</p>
    </div>
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">ログインID</label>
        <input type="text" id="loginId" class="form-input" placeholder="login-id" autocomplete="username">
      </div>
      <div>
        <label class="block text-sm font-semibold text-gray-600 mb-1">パスワード</label>
        <div class="relative">
          <input type="password" id="loginPass" class="form-input pr-10" placeholder="••••••••" autocomplete="current-password">
          <button type="button" onclick="togglePw('loginPass',this)"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <i class="fas fa-eye text-sm"></i>
          </button>
        </div>
      </div>
      <div id="loginError" class="hidden text-red-500 text-sm text-center bg-red-50 rounded-lg p-2"></div>
      <button onclick="doLogin()" id="loginBtn" class="btn-primary w-full py-3">
        <i class="fas fa-sign-in-alt mr-2"></i>ログイン
      </button>
    </div>
    <p class="text-center mt-5 text-xs text-gray-400">
      管理者の方は <a href="/admin" class="text-green-600 hover:underline font-semibold">管理者画面</a>
    </p>
  </div>
</div>

<!-- メイン -->
<div id="mainPage" class="hidden">
  <!-- ヘッダー -->
  <header class="max-w-5xl mx-auto mb-4">
    <div class="card px-5 py-4 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div style="background:linear-gradient(135deg,#7a9e7e,#5d8464);width:42px;height:42px;
          border-radius:12px;display:flex;align-items:center;justify-content:center;">
          <i class="fas fa-box text-white text-lg"></i>
        </div>
        <div>
          <h1 id="headerSiteName" class="text-lg font-bold text-gray-800 leading-tight">OrderFlow</h1>
          <p class="text-xs text-gray-400">発注ポータル</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <span id="headerStoreName" class="text-sm text-gray-600 font-semibold hidden sm:block"></span>
        <button onclick="doLogout()"
          class="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors">
          <i class="fas fa-sign-out-alt"></i><span class="hidden sm:inline ml-1">ログアウト</span>
        </button>
      </div>
    </div>
  </header>

  <!-- お知らせアコーディオン -->
  <div class="max-w-5xl mx-auto mb-4" id="noticeArea"></div>

  <!-- ステップインジケーター -->
  <div class="max-w-5xl mx-auto mb-5">
    <div class="card px-4 py-3">
      <div class="flex items-center flex-wrap gap-1">
        <div class="step active" id="stepInd1"><i class="fas fa-box-open"></i> 商品選択</div>
        <span class="step-sep">›</span>
        <div class="step pending" id="stepInd2"><i class="fas fa-list-check"></i> 発注確認</div>
        <span class="step-sep">›</span>
        <div class="step pending" id="stepInd3"><i class="fas fa-circle-check"></i> 完了</div>
        <div class="flex gap-1 ml-auto">
          <div class="step done cursor-pointer" onclick="showTab('history')"><i class="fas fa-history"></i> <span class="hidden sm:inline">履歴</span></div>
          <div class="step done cursor-pointer" onclick="showTab('notices')"><i class="fas fa-bell"></i> <span class="hidden sm:inline">お知らせ</span></div>
        </div>
      </div>
    </div>
  </div>

  <main class="max-w-5xl mx-auto">

    <!-- STEP1: 商品選択 -->
    <div id="pageStep1" class="fade-in">
      <div class="card p-5 mb-4">
        <div class="section-title"><i class="fas fa-filter text-green-600"></i> 絞り込み・検索</div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input type="text" id="productSearch" placeholder="商品名・コード・ブランドで検索..."
              class="form-input pl-9" oninput="filterProducts()">
          </div>
          <select id="catFilter" class="form-select" onchange="filterProducts()">
            <option value="">全カテゴリ</option>
          </select>
          <select id="brandFilter" class="form-select" onchange="filterProducts()">
            <option value="">全ブランド</option>
          </select>
        </div>
      </div>
      <div id="productGrid" class="flex flex-col gap-2 mb-4"></div>
      <div id="productEmpty" class="hidden card p-10 text-center text-gray-400">
        <i class="fas fa-box-open text-4xl mb-3 block text-gray-300"></i>
        商品が見つかりません
      </div>
    </div>

    <!-- STEP2: 発注確認 -->
    <div id="pageStep2" class="hidden fade-in">
      <div class="card p-6 mb-4">
        <div class="section-title"><i class="fas fa-user text-green-600"></i> 担当者・配送情報</div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-1">担当者名</label>
            <input type="text" id="ordererName" class="form-input" placeholder="例：山田 太郎">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-600 mb-1">納品希望日</label>
            <input type="date" id="deliveryDate" class="form-input">
          </div>
          <div class="sm:col-span-2">
            <label class="block text-sm font-semibold text-gray-600 mb-1">備考・特記事項</label>
            <textarea id="orderNote" rows="3" class="form-input resize-none"
              placeholder="特記事項があればご記入ください"></textarea>
          </div>
        </div>
      </div>
      <div class="card p-6 mb-4">
        <div class="section-title"><i class="fas fa-shopping-cart text-green-600"></i> 発注内容確認</div>
        <div id="cartReview" class="space-y-2 mb-4"></div>
        <div class="bg-green-50 rounded-xl p-4 text-sm text-green-800 border border-green-200">
          <i class="fas fa-info-circle mr-2"></i>内容をご確認の上「発注する」ボタンを押してください
        </div>
      </div>
      <div class="flex gap-3 justify-between">
        <button onclick="showTab('products')" class="btn-secondary">
          <i class="fas fa-arrow-left mr-2"></i>商品選択に戻る
        </button>
        <button onclick="submitOrder()" id="submitOrderBtn" class="btn-primary">
          <i class="fas fa-paper-plane mr-2"></i>発注する
        </button>
      </div>
    </div>

    <!-- STEP3: 完了 -->
    <div id="pageStep3" class="hidden fade-in">
      <div class="card p-10 text-center">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style="background:linear-gradient(135deg,#7a9e7e,#5d8464);">
          <i class="fas fa-check text-white text-3xl"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">発注が完了しました</h2>
        <p class="text-gray-500 mb-2">発注番号：<span id="completedOrderNo"
          class="font-bold text-green-700 text-lg"></span></p>
        <p class="text-sm text-gray-400 mb-8">担当者が確認次第、進捗をご案内いたします。</p>
        <div class="flex gap-3 justify-center flex-wrap">
          <button onclick="startNewOrder()" class="btn-primary">
            <i class="fas fa-plus mr-2"></i>続けて発注
          </button>
          <button onclick="showTab('history')" class="btn-secondary">
            <i class="fas fa-history mr-2"></i>発注履歴を確認
          </button>
        </div>
      </div>
    </div>

    <!-- 発注履歴 -->
    <div id="pageHistory" class="hidden fade-in">
      <div class="card p-6">
        <div class="section-title">
          <i class="fas fa-history text-green-600"></i> 発注履歴
          <button onclick="loadOrders()" class="ml-2 text-xs text-gray-400 hover:text-gray-600 font-normal">
            <i class="fas fa-sync mr-1"></i>更新
          </button>
          <button onclick="showTab('products')" class="ml-auto btn-primary" style="padding:6px 14px;font-size:.8rem;">
            <i class="fas fa-arrow-left mr-1"></i>商品選択に戻る
          </button>
        </div>
        <div id="historyBody">
          <div class="text-center py-8 text-gray-400"><span class="loading"></span></div>
        </div>
      </div>
    </div>

    <!-- お知らせ一覧 -->
    <div id="pageNotices" class="hidden fade-in">
      <div class="card p-6">
        <div class="section-title">
          <i class="fas fa-bell text-green-600"></i> お知らせ一覧
          <button onclick="showTab('products')" class="ml-auto btn-primary" style="padding:6px 14px;font-size:.8rem;">
            <i class="fas fa-arrow-left mr-1"></i>商品選択に戻る
          </button>
        </div>
        <div id="noticesFullBody"></div>
      </div>
    </div>

  </main>
</div>

<!-- カートモーダル -->
<div id="cartModal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
        <i class="fas fa-shopping-cart text-green-600"></i>発注カート
      </h2>
      <button onclick="closeModal('cartModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="cartModalItems" class="space-y-2 max-h-60 overflow-y-auto mb-4"></div>
    <div id="cartModalEmpty" class="text-center py-6 text-gray-400 hidden">
      <i class="fas fa-shopping-cart text-3xl mb-2 block text-gray-300"></i>カートは空です
    </div>
    <div class="flex gap-3 mt-2">
      <button onclick="closeModal('cartModal')" class="btn-secondary flex-1">閉じる</button>
      <button onclick="goToConfirm()" class="btn-primary flex-1">
        <i class="fas fa-arrow-right mr-2"></i>発注確認へ
      </button>
    </div>
  </div>
</div>

<!-- 発注詳細モーダル -->
<div id="orderDetailModal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:600px">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold text-gray-800 flex items-center gap-2">
        <i class="fas fa-file-alt text-green-600"></i>発注詳細
      </h2>
      <button onclick="closeModal('orderDetailModal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="orderDetailContent"></div>
  </div>
</div>

<!-- お知らせ詳細モーダル -->
<div id="noticeDetailModal" class="modal-overlay hidden" style="z-index:200">
  <div class="modal-box" style="max-width:520px">
    <div class="flex items-start justify-between mb-4 gap-3">
      <h3 id="noticeDetailTitle" class="text-base font-bold text-gray-800 leading-snug"></h3>
      <button onclick="closeModal('noticeDetailModal')"
        class="text-gray-400 hover:text-gray-600 text-xl flex-shrink-0"><i class="fas fa-times"></i></button>
    </div>
    <div id="noticeDetailBody" class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap"></div>
    <p id="noticeDetailDate" class="text-xs text-gray-400 mt-4"></p>
  </div>
</div>

<!-- トースト -->
<div id="toast" class="fixed bottom-6 right-6 z-[300] hidden">
  <div id="toastInner" class="px-5 py-3 rounded-xl shadow-lg text-white font-semibold flex items-center gap-2 text-sm">
    <i id="toastIcon" class="fas fa-check-circle"></i><span id="toastMsg"></span>
  </div>
</div>

<script>
var token = localStorage.getItem('store_token');
var storeInfo = JSON.parse(localStorage.getItem('store_info') || 'null');
var allProducts = [];
var cart = {};
var allNotices = [];
var siteName = 'OrderFlow';

async function init() {
  await loadPublicSettings();
  if (token && storeInfo) {
    showMain();
  } else {
    document.getElementById('loginPage').classList.remove('hidden');
  }
}

async function loadPublicSettings() {
  try {
    var d = await (await fetch('/api/settings')).json();
    siteName = d.settings.site_name || 'OrderFlow';
    document.getElementById('loginSiteName').textContent = siteName;
    document.title = siteName + ' - 発注ポータル';
    applyTheme(d.settings.theme_preset || 'green');
  } catch(e) {}
}

var THEMES = {
  green:   {p1:'#7a9e7e',p2:'#5d8464',p3:'#3d6444',bg1:'#fdfbf7',bg2:'#eef2ec',bg3:'#e8ede8',cb:'rgba(200,215,190,.4)',ib:'#d0dbc8',tt:'#4a6b4e',ln:'#c8d9c0',sdb:'#e8f5e9',sdf:'#4a7a50',tb1:'#f0f7f0',tb2:'#e4f0e4',tbr:'rgba(180,210,180,.2)',sel:'rgba(240,250,240,.95)',hr:'rgba(93,132,100,.03)',fr:'rgba(122,158,126,.15)'},
  blue:    {p1:'#5b8dd9',p2:'#3a6bbf',p3:'#1e4d9e',bg1:'#f7f9fd',bg2:'#ecf1fb',bg3:'#e4ecf7',cb:'rgba(180,200,230,.4)',ib:'#c8d5e8',tt:'#1e3a6e',ln:'#b0c4e0',sdb:'#e8f0fd',sdf:'#1e4d9e',tb1:'#eef3fd',tb2:'#dde9fb',tbr:'rgba(160,190,230,.2)',sel:'rgba(235,243,255,.95)',hr:'rgba(58,107,191,.03)',fr:'rgba(91,141,217,.15)'},
  purple:  {p1:'#8b72c8',p2:'#6a52a8',p3:'#4e3888',bg1:'#faf8fd',bg2:'#f0ecfb',bg3:'#e8e2f5',cb:'rgba(200,180,230,.4)',ib:'#d0c8e8',tt:'#3d2878',ln:'#c0b0e0',sdb:'#f0ecfd',sdf:'#4e3888',tb1:'#f4f0fd',tb2:'#e8e0fb',tbr:'rgba(180,160,220,.2)',sel:'rgba(248,243,255,.95)',hr:'rgba(106,82,168,.03)',fr:'rgba(139,114,200,.15)'},
  orange:  {p1:'#e0863a',p2:'#c06820',p3:'#a05010',bg1:'#fefaf5',bg2:'#fdf0e0',bg3:'#f8e8d0',cb:'rgba(230,200,160,.4)',ib:'#e8d0b0',tt:'#7a3a10',ln:'#e0c090',sdb:'#fdf0e0',sdf:'#8a4010',tb1:'#fdf4e8',tb2:'#fbe8d0',tbr:'rgba(220,180,130,.2)',sel:'rgba(255,245,235,.95)',hr:'rgba(192,104,32,.03)',fr:'rgba(224,134,58,.15)'},
  slate:   {p1:'#607d8b',p2:'#455a64',p3:'#2e3f46',bg1:'#f8fafc',bg2:'#eef2f5',bg3:'#e4eaee',cb:'rgba(180,200,210,.4)',ib:'#c0d0d8',tt:'#2e3f46',ln:'#b0c4cc',sdb:'#e8f0f4',sdf:'#2e3f46',tb1:'#eef4f8',tb2:'#dce8ee',tbr:'rgba(160,190,205,.2)',sel:'rgba(236,244,248,.95)',hr:'rgba(69,90,100,.03)',fr:'rgba(96,125,139,.15)'},
  rose:    {p1:'#d4748a',p2:'#b85070',p3:'#943050',bg1:'#fdf7f8',bg2:'#fbeef0',bg3:'#f5e4e8',cb:'rgba(220,180,190,.4)',ib:'#e0c0c8',tt:'#7a2038',ln:'#e0b0c0',sdb:'#fdeef2',sdf:'#943050',tb1:'#fdf0f4',tb2:'#fae0e8',tbr:'rgba(220,170,185,.2)',sel:'rgba(255,243,247,.95)',hr:'rgba(184,80,112,.03)',fr:'rgba(212,116,138,.15)'}
};

function applyTheme(preset) {
  var t = THEMES[preset] || THEMES.green;
  var r = document.documentElement.style;
  r.setProperty('--p1',     t.p1);
  r.setProperty('--p2',     t.p2);
  r.setProperty('--p3',     t.p3);
  r.setProperty('--p-bg1',  t.bg1);
  r.setProperty('--p-bg2',  t.bg2);
  r.setProperty('--p-bg3',  t.bg3);
  r.setProperty('--p-card-border',   t.cb);
  r.setProperty('--p-input-border',  t.ib);
  r.setProperty('--p-title',         t.tt);
  r.setProperty('--p-line',          t.ln);
  r.setProperty('--p-step-done-bg',  t.sdb);
  r.setProperty('--p-step-done-fg',  t.sdf);
  r.setProperty('--p-tbl-bg1',       t.tb1);
  r.setProperty('--p-tbl-bg2',       t.tb2);
  r.setProperty('--p-tbl-border',    t.tbr);
  r.setProperty('--p-selected-bg',   t.sel);
  r.setProperty('--p-hover-row',     t.hr);
  r.setProperty('--p-focus-ring',    t.fr);
}

function togglePw(id, btn) {
  var el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
  btn.querySelector('i').className = el.type === 'password' ? 'fas fa-eye text-sm' : 'fas fa-eye-slash text-sm';
}

async function doLogin() {
  var lid = document.getElementById('loginId').value.trim();
  var pw  = document.getElementById('loginPass').value;
  var err = document.getElementById('loginError');
  var btn = document.getElementById('loginBtn');
  err.classList.add('hidden');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading"></span>';
  try {
    var res = await fetch('/api/auth/store/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({login_id: lid, password: pw})
    });
    var data = await res.json();
    if (!res.ok) { err.textContent = data.error || 'ログインに失敗しました'; err.classList.remove('hidden'); return; }
    token = data.token; storeInfo = data.store;
    localStorage.setItem('store_token', token);
    localStorage.setItem('store_info', JSON.stringify(storeInfo));
    showMain();
  } catch(e) {
    err.textContent = 'ネットワークエラーが発生しました'; err.classList.remove('hidden');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-sign-in-alt mr-2"></i>ログイン';
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter' && !document.getElementById('loginPage').classList.contains('hidden')) doLogin();
});

function doLogout() {
  if (!confirm('ログアウトしますか？')) return;
  localStorage.removeItem('store_token'); localStorage.removeItem('store_info');
  location.reload();
}

function showMain() {
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('mainPage').classList.remove('hidden');
  document.getElementById('headerSiteName').textContent = siteName;
  if (storeInfo) {
    var label = storeInfo.store_name + (storeInfo.section_name ? ' / ' + storeInfo.section_name : '');
    document.getElementById('headerStoreName').textContent = label;
  }
  loadProducts();
  loadNotices();
  showTab('products');
}

function showTab(tab) {
  ['pageStep1','pageStep2','pageStep3','pageHistory','pageNotices'].forEach(function(id) {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById('floatCartBtn').classList.add('is-hidden');
  ['stepInd1','stepInd2','stepInd3'].forEach(function(id) {
    var el = document.getElementById(id);
    el.classList.remove('active','done'); el.classList.add('pending');
  });

  if (tab === 'products') {
    document.getElementById('pageStep1').classList.remove('hidden');
    var s1 = document.getElementById('stepInd1');
    s1.classList.remove('pending'); s1.classList.add('active');
    document.getElementById('floatCartBtn').classList.remove('is-hidden');
    updateFloatCart();
  } else if (tab === 'confirm') {
    buildCartReview();
    document.getElementById('pageStep2').classList.remove('hidden');
    var si1 = document.getElementById('stepInd1'); si1.classList.remove('pending'); si1.classList.add('done');
    var si2 = document.getElementById('stepInd2'); si2.classList.remove('pending'); si2.classList.add('active');
  } else if (tab === 'complete') {
    document.getElementById('pageStep3').classList.remove('hidden');
    ['stepInd1','stepInd2'].forEach(function(id){ var el=document.getElementById(id); el.classList.remove('pending'); el.classList.add('done'); });
    var si3 = document.getElementById('stepInd3'); si3.classList.remove('pending'); si3.classList.add('active');
  } else if (tab === 'history') {
    document.getElementById('pageHistory').classList.remove('hidden');
    loadOrders();
  } else if (tab === 'notices') {
    document.getElementById('pageNotices').classList.remove('hidden');
    renderNoticesFull();
  }
  window.scrollTo({top:0,behavior:'smooth'});
}

function goToConfirm() {
  var items = Object.keys(cart).filter(function(id){ return cart[id] > 0; });
  if (items.length === 0) { showToast('商品を選択してください','warn'); return; }
  closeModal('cartModal');
  showTab('confirm');
}
function startNewOrder() { cart = {}; updateFloatCart(); showTab('products'); }

async function loadProducts() {
  var res = await apiFetch('/api/store/products');
  if (!res.ok) return;
  var data = await res.json();
  allProducts = data.products || [];
  buildFilters();
  filterProducts();
}

function buildFilters() {
  var cats   = [...new Set(allProducts.map(function(p){ return p.category; }).filter(Boolean))].sort();
  var brands = [...new Set(allProducts.map(function(p){ return p.brand; }).filter(Boolean))].sort();
  document.getElementById('catFilter').innerHTML   = '<option value="">全カテゴリ</option>'   + cats.map(function(c){ return '<option>'+c+'</option>'; }).join('');
  document.getElementById('brandFilter').innerHTML = '<option value="">全ブランド</option>' + brands.map(function(b){ return '<option>'+b+'</option>'; }).join('');
}

function filterProducts() {
  var q     = document.getElementById('productSearch').value.toLowerCase();
  var cat   = document.getElementById('catFilter').value;
  var brand = document.getElementById('brandFilter').value;
  var filtered = allProducts.filter(function(p) {
    var mq = !q || [p.product_name,p.product_code,p.brand,p.category,p.barcode].some(function(v){ return v && v.toLowerCase().includes(q); });
    return mq && (!cat || p.category===cat) && (!brand || p.brand===brand);
  });
  renderProducts(filtered);
}

function renderProducts(list) {
  var grid  = document.getElementById('productGrid');
  var empty = document.getElementById('productEmpty');
  if (list.length === 0) { grid.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(function(p) {
    var qty = cart[p.id] || 0;
    var sel = qty > 0;
    return '<div class="product-card ' + (sel ? 'selected' : '') + '" id="pc-' + p.id + '">'
      + '<div class="flex-shrink-0 w-8 text-center">'
      + (sel ? '<i class="fas fa-check-circle text-green-500 text-xl"></i>' : '<i class="far fa-circle text-gray-300 text-xl"></i>')
      + '</div>'
      + '<div class="flex-1 min-w-0">'
      + '<div class="flex items-center gap-1 flex-wrap">'
      + '<p class="font-bold text-gray-800 text-sm leading-snug">' + p.product_name + '</p>'
      + (p.is_new ? '<span class="new-badge">NEW</span>' : '')
      + '</div>'
      + '<div class="flex items-center gap-2 mt-0.5 flex-wrap">'
      + (p.brand ? '<span class="text-xs text-gray-500">' + p.brand + '</span>' : '')
      + (p.category ? '<span class="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-semibold border border-green-200">' + p.category + '</span>' : '')
      + (p.product_code ? '<span class="text-xs text-gray-400 font-mono">' + p.product_code + '</span>' : '')
      + '</div>'
      + '</div>'
      + '<div class="flex items-center gap-2 flex-shrink-0" onclick="event.stopPropagation()">'
      + '<button onclick="changeQty(' + p.id + ',-1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 font-bold flex items-center justify-center transition-colors"><i class="fas fa-minus text-xs"></i></button>'
      + '<input class="qty-input" type="number" min="0" value="' + qty + '" id="qty-' + p.id + '" onchange="setQty(' + p.id + ',parseInt(this.value)||0)">'
      + '<button onclick="changeQty(' + p.id + ',1)" class="w-8 h-8 rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-700 font-bold flex items-center justify-center transition-colors"><i class="fas fa-plus text-xs"></i></button>'
      + '<span class="text-xs text-gray-400 ml-0.5">' + (p.unit||'個') + '</span>'
      + '</div>'
      + '</div>';
  }).join('');
}

function changeQty(id, delta) { setQty(id, Math.max(0, (cart[id]||0) + delta)); }

function setQty(id, qty) {
  qty = Math.max(0, qty);
  if (qty === 0) delete cart[id]; else cart[id] = qty;
  var card = document.getElementById('pc-' + id);
  if (card) {
    card.classList.toggle('selected', qty > 0);
    var icon = card.querySelector('.fa-check-circle,.fa-circle');
    if (icon) icon.className = qty > 0 ? 'fas fa-check-circle text-green-500 text-lg' : 'far fa-circle text-gray-300 text-lg';
    var inp = document.getElementById('qty-' + id);
    if (inp) inp.value = qty;
  }
  updateFloatCart();
}

function updateFloatCart() {
  var count = Object.values(cart).reduce(function(s,q){ return s+q; }, 0);
  document.getElementById('floatCartCount').textContent = count;
  var btn = document.getElementById('floatCartBtn');
  if (count > 0) btn.classList.remove('is-hidden'); else btn.classList.add('is-hidden');
}

function openCartModal() {
  var items  = Object.entries(cart).filter(function(e){ return e[1]>0; });
  var el     = document.getElementById('cartModalItems');
  var emptyEl= document.getElementById('cartModalEmpty');
  if (items.length === 0) { el.innerHTML=''; emptyEl.classList.remove('hidden'); }
  else {
    emptyEl.classList.add('hidden');
    el.innerHTML = items.map(function(e) {
      var id=e[0], qty=e[1];
      var p = allProducts.find(function(x){ return x.id==id; });
      if (!p) return '';
      return '<div class="cart-item">'
        + '<div class="flex-1 min-w-0"><p class="font-semibold text-sm text-gray-800 truncate">'+p.product_name+'</p>'
        + '<p class="text-xs text-gray-500">'+(p.brand||'')+(p.unit?' / '+p.unit:'')+'</p></div>'
        + '<div class="flex items-center gap-2 flex-shrink-0">'
        + '<button onclick="changeQty('+id+',-1);openCartModal()" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center"><i class="fas fa-minus text-xs text-gray-500"></i></button>'
        + '<span class="font-bold text-green-700 w-8 text-center">'+qty+'</span>'
        + '<button onclick="changeQty('+id+',1);openCartModal()" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-green-100 flex items-center justify-center"><i class="fas fa-plus text-xs text-gray-500"></i></button>'
        + '<span class="text-xs text-gray-400">'+(p.unit||'個')+'</span>'
        + '<button onclick="setQty('+id+',0);openCartModal()" class="ml-2 text-red-400 hover:text-red-600"><i class="fas fa-trash text-xs"></i></button>'
        + '</div></div>';
    }).join('');
  }
  document.getElementById('cartModal').classList.remove('hidden');
}

function buildCartReview() {
  var items = Object.entries(cart).filter(function(e){ return e[1]>0; });
  document.getElementById('cartReview').innerHTML = items.map(function(e) {
    var id=e[0], qty=e[1];
    var p = allProducts.find(function(x){ return x.id==id; });
    if (!p) return '';
    return '<div class="cart-item">'
      + '<div class="flex-1 min-w-0"><p class="font-semibold text-sm text-gray-800">'+p.product_name+'</p>'
      + '<p class="text-xs text-gray-500">'+(p.brand||'')+(p.category?' / '+p.category:'')+'</p>'
      + (p.product_code ? '<p class="text-xs text-gray-400 font-mono">'+p.product_code+'</p>' : '')
      + '</div><div class="flex items-center gap-2 flex-shrink-0">'
      + '<span class="font-bold text-green-700">'+qty+'</span>'
      + '<span class="text-xs text-gray-400">'+(p.unit||'個')+'</span>'
      + '</div></div>';
  }).join('');
}

async function submitOrder() {
  var items = Object.entries(cart).filter(function(e){ return e[1]>0; })
    .map(function(e){ return {product_id:parseInt(e[0]),quantity:e[1]}; });
  if (items.length === 0) { showToast('発注商品がありません','warn'); return; }
  var btn = document.getElementById('submitOrderBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="loading mr-2"></span>送信中...';
  try {
    var res = await apiFetch('/api/store/orders', {
      method:'POST',
      body: JSON.stringify({
        orderer_name:       document.getElementById('ordererName').value,
        desired_delivery_date: document.getElementById('deliveryDate').value,
        note:               document.getElementById('orderNote').value,
        items: items
      })
    });
    var data = await res.json();
    if (!res.ok) { showToast(data.error||'発注に失敗しました','error'); return; }
    document.getElementById('completedOrderNo').textContent = data.order_no;
    cart = {}; updateFloatCart();
    showTab('complete');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>発注する';
  }
}

async function loadOrders() {
  document.getElementById('historyBody').innerHTML = '<div class="text-center py-8 text-gray-400"><span class="loading"></span></div>';
  var res = await apiFetch('/api/store/orders');
  if (!res.ok) return;
  var data = await res.json();
  var orders = data.orders || [];
  var statusLabel = {pending:'未確認',confirmed:'受注確認済',preparing:'出荷準備中',inspecting:'検品中',shipped:'出荷完了',cancelled:'キャンセル'};
  var statusClass = {pending:'status-pending',confirmed:'status-confirmed',preparing:'status-preparing',inspecting:'status-inspecting',shipped:'status-shipped',cancelled:'status-cancelled'};
  if (orders.length === 0) {
    document.getElementById('historyBody').innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-inbox text-4xl mb-3 block text-gray-300"></i>発注履歴がありません</div>';
    return;
  }
  document.getElementById('historyBody').innerHTML = '<div class="overflow-x-auto"><table class="w-full"><thead class="tbl-header"><tr><th>発注番号</th><th>担当者</th><th>納品希望日</th><th>ステータス</th><th>発注日時</th><th></th></tr></thead><tbody>'
    + orders.map(function(o) {
      return '<tr><td><span class="font-bold text-green-700">'+o.order_no+'</span></td>'
        + '<td>'+(o.orderer_name||'-')+'</td>'
        + '<td>'+(o.desired_delivery_date||'-')+'</td>'
        + '<td><span class="status-pill '+(statusClass[o.status]||'')+'">'+( statusLabel[o.status]||o.status)+'</span></td>'
        + '<td class="text-xs text-gray-500">'+fmtDate(o.created_at)+'</td>'
        + '<td><button onclick="showOrderDetail('+o.id+')" class="text-xs text-green-600 hover:underline font-semibold">詳細</button></td></tr>';
    }).join('')
    + '</tbody></table></div>';
}

async function showOrderDetail(id) {
  var res = await apiFetch('/api/store/orders/' + id);
  var d = await res.json();
  var order = d.order; var items = d.items;
  var statusLabel = {pending:'未確認',confirmed:'受注確認済',preparing:'出荷準備中',inspecting:'検品中',shipped:'出荷完了',cancelled:'キャンセル'};
  var statusClass = {pending:'status-pending',confirmed:'status-confirmed',preparing:'status-preparing',inspecting:'status-inspecting',shipped:'status-shipped',cancelled:'status-cancelled'};
  document.getElementById('orderDetailContent').innerHTML =
    '<div class="space-y-4">'
    + '<div class="grid grid-cols-2 gap-3 text-sm">'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">発注番号</p><p class="font-bold text-green-700">'+order.order_no+'</p></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">ステータス</p><span class="status-pill '+(statusClass[order.status]||'')+'">'+( statusLabel[order.status]||order.status)+'</span></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">発注日時</p><p>'+fmtDate(order.created_at)+'</p></div>'
    + '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">担当者</p><p>'+(order.orderer_name||'-')+'</p></div>'
    + (order.desired_delivery_date ? '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">納品希望日</p><p>'+order.desired_delivery_date+'</p></div>' : '')
    + (order.worker_name ? '<div class="bg-gray-50 rounded-lg p-3"><p class="text-xs text-gray-500 mb-1">作業担当</p><p>'+order.worker_name+'</p></div>' : '')
    + '</div>'
    + (order.note ? '<div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm"><p class="text-xs text-amber-600 mb-1 font-semibold">備考</p><p>'+order.note+'</p></div>' : '')
    + '<div class="section-title mt-2"><i class="fas fa-list text-green-600"></i> 発注明細</div>'
    + '<div class="overflow-x-auto"><table class="w-full text-sm"><thead class="tbl-header"><tr><th>商品名</th><th>ブランド</th><th>数量</th></tr></thead><tbody>'
    + items.map(function(i){ return '<tr><td>'+i.product_name+'</td><td class="text-gray-500">'+(i.brand||'-')+'</td><td class="font-bold text-green-700 text-right">'+i.quantity+(i.unit||'')+'</td></tr>'; }).join('')
    + '</tbody></table></div>'
    + (order.is_completed ? '<div class="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700 font-semibold"><i class="fas fa-check-circle mr-2"></i>出荷完了済み</div>' : '')
    + '</div>';
  document.getElementById('orderDetailModal').classList.remove('hidden');
}

async function loadNotices() {
  var res = await apiFetch('/api/store/notices');
  if (!res.ok) return;
  var d = await res.json();
  allNotices = d.notices || [];
  renderNoticeAccordion();
}

function renderNoticeAccordion() {
  var area = document.getElementById('noticeArea');
  if (allNotices.length === 0) { area.innerHTML = ''; return; }
  var typeIcon = {general:'<i class="fas fa-info-circle text-amber-500"></i>',important:'<i class="fas fa-exclamation-circle text-red-500"></i>',info:'<i class="fas fa-check-circle text-green-500"></i>'};
  area.innerHTML = '<div class="notice-accordion">'
    + '<div class="notice-accordion-header" onclick="toggleNoticeAccordion()">'
    + '<div class="flex items-center gap-2"><i class="fas fa-bell text-amber-500"></i>'
    + '<span class="font-bold text-amber-800 text-sm">お知らせ（'+allNotices.length+'件）</span></div>'
    + '<i class="fas fa-chevron-down text-amber-500 text-sm" id="noticeChevron"></i></div>'
    + '<div class="notice-accordion-body hidden" id="noticeAccordionBody">'
    + '<div class="space-y-0">'
    + allNotices.map(function(n) {
      return '<div class="notice-item '+(n.notice_type==='important'?'important':'')+'" onclick="showNoticeDetail('+n.id+')">'
        + '<div class="notice-item-title">'+(typeIcon[n.notice_type]||typeIcon.general)+' '+n.title+'</div>'
        + (n.message ? '<div class="notice-item-preview">'+n.message+'</div>' : '')
        + '</div>';
    }).join('')
    + '</div></div></div>';
}

function toggleNoticeAccordion() {
  var body    = document.getElementById('noticeAccordionBody');
  var chevron = document.getElementById('noticeChevron');
  body.classList.toggle('hidden');
  chevron.style.transform = body.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

function renderNoticesFull() {
  var el = document.getElementById('noticesFullBody');
  if (allNotices.length === 0) {
    el.innerHTML = '<div class="text-center py-8 text-gray-400"><i class="fas fa-bell-slash text-4xl mb-3 block text-gray-300"></i>お知らせはありません</div>';
    return;
  }
  var typeIcon = {general:'<i class="fas fa-info-circle text-blue-400 mt-0.5"></i>',important:'<i class="fas fa-exclamation-circle text-red-400 mt-0.5"></i>',info:'<i class="fas fa-check-circle text-green-500 mt-0.5"></i>'};
  el.innerHTML = '<div class="space-y-3">'
    + allNotices.map(function(n) {
      return '<div class="notice-item '+(n.notice_type==='important'?'important':'')+' cursor-pointer" onclick="showNoticeDetail('+n.id+')">'
        + '<div class="flex gap-3">'+(typeIcon[n.notice_type]||typeIcon.general)
        + '<div class="flex-1 min-w-0"><p class="font-bold text-sm text-gray-800">'+n.title+'</p>'
        + (n.message ? '<p class="text-xs text-gray-600 mt-0.5">'+n.message+'</p>' : '')
        + '<p class="text-xs text-gray-400 mt-1">'+fmtDate(n.created_at)+'</p>'
        + '</div></div></div>';
    }).join('')
    + '</div>';
}

function showNoticeDetail(id) {
  var n = allNotices.find(function(x){ return x.id===id; });
  if (!n) return;
  document.getElementById('noticeDetailTitle').textContent = n.title;
  document.getElementById('noticeDetailBody').textContent  = n.body || n.message || '';
  document.getElementById('noticeDetailDate').textContent  = fmtDate(n.created_at);
  document.getElementById('noticeDetailModal').classList.remove('hidden');
}

async function apiFetch(url, opts) {
  opts = opts || {};
  var h = {'Content-Type':'application/json'};
  if (opts.headers) Object.assign(h, opts.headers);
  if (token) h['Authorization'] = 'Bearer ' + token;
  return fetch(url, Object.assign({}, opts, {headers: h}));
}

function fmtDate(s) {
  if (!s) return '-';
  return new Date(s).toLocaleString('ja-JP',{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
}

function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

var toastTimer;
function showToast(msg, type) {
  type = type || 'success';
  var colors = {success:'background:linear-gradient(135deg,#5d8464,#3d6444)',error:'background:#dc2626',warn:'background:#d97706'};
  var icons  = {success:'fas fa-check-circle',error:'fas fa-times-circle',warn:'fas fa-exclamation-circle'};
  document.getElementById('toastInner').style.cssText = colors[type]||colors.success;
  document.getElementById('toastIcon').className = icons[type]||icons.success;
  document.getElementById('toastMsg').textContent = msg;
  document.getElementById('toast').classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ document.getElementById('toast').classList.add('hidden'); }, 3500);
}

init();
<\/script>
</body>
</html>`;
}
