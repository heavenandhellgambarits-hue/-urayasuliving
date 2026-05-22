export function getInspectionPage(orderId: string): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<title>バーコード検品 - OrderFlow</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<script src="https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js"></script>
<style>
:root{
  --ip1:#5d8464; --ip2:#3d6444; --ip3:#2a4a30;
  --i-bg1:#f0f4f0; --i-bg2:#e4ece4;
  --i-card-border:rgba(180,210,180,.4);
  --i-input-border:#c8d8c0;
  --i-title:#4a6b4e;
  --i-line:#c8d9c0;
  --i-header-bg:linear-gradient(135deg,#4a7a50,#2d5a34);
  --i-prog-track:#ddeedd;
  --i-prog-fill:linear-gradient(to right,#7ab87a,#4a8a50);
  --i-item-border:#d4e4cc;
  --i-mode-inactive-border:rgba(180,210,180,.5);
  --i-focus-ring:rgba(122,158,126,.15);
}
body{
  background:linear-gradient(135deg,var(--i-bg1) 0%,var(--i-bg2) 100%);
  min-height:100vh;
  font-family:'Hiragino Sans','Hiragino Kaku Gothic ProN','Noto Sans JP',sans-serif;
  touch-action:manipulation;
}
.card{
  background:rgba(255,255,255,.88);
  backdrop-filter:blur(8px);
  border-radius:14px;
  box-shadow:0 2px 16px rgba(80,110,80,.10),0 1px 4px rgba(0,0,0,.04);
  border:1px solid var(--i-card-border);
}
.btn-p{
  background:linear-gradient(135deg,var(--ip1),var(--ip2));
  color:#fff;border-radius:10px;
  padding:10px 20px;font-weight:700;transition:all .2s;
  border:none;cursor:pointer;font-size:.9rem;
}
.btn-p:hover{filter:brightness(1.08);transform:translateY(-1px);}
.btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.btn-s{
  background:linear-gradient(135deg,#f0ece4,#e4ddd0);
  color:#5a5040;border-radius:10px;
  padding:10px 20px;font-weight:700;transition:all .2s;
  border:1px solid rgba(160,140,100,.3);cursor:pointer;font-size:.9rem;
}
.btn-s:hover{filter:brightness(.97);transform:translateY(-1px);}
.form-input{
  border:1.5px solid var(--i-input-border);border-radius:10px;padding:10px 14px;
  background:rgba(255,255,255,.9);transition:border-color .2s,box-shadow .2s;
  width:100%;font-size:.95rem;
}
.form-input:focus{outline:none;border-color:var(--ip1);box-shadow:0 0 0 3px var(--i-focus-ring);}
.section-title{
  font-size:1rem;font-weight:700;color:var(--i-title);
  display:flex;align-items:center;gap:8px;margin-bottom:14px;
}
.section-title::after{content:'';flex:1;height:1px;background:linear-gradient(to right,var(--i-line),transparent);}

/* ヘッダー */
.app-header{
  background:var(--i-header-bg);
  color:#fff;
  box-shadow:0 2px 12px rgba(40,90,40,.25);
  position:sticky;top:0;z-index:40;
}

/* スキャンモードボタン */
.mode-btn{
  flex:1;padding:10px;border-radius:10px;font-weight:700;font-size:.875rem;
  transition:all .2s;border:none;cursor:pointer;
}
.mode-btn.active-camera{
  background:linear-gradient(135deg,var(--ip1),var(--ip2));color:#fff;
  box-shadow:0 2px 8px rgba(60,100,60,.25);
}
.mode-btn.active-hid{
  background:linear-gradient(135deg,#c8820a,#a06a00);color:#fff;
  box-shadow:0 2px 8px rgba(180,120,0,.25);
}
.mode-btn.inactive{
  background:rgba(255,255,255,.6);color:#6b7280;
  border:1.5px solid var(--i-mode-inactive-border);
}

/* 発注明細アイテム */
.item-row{
  display:flex;align-items:center;gap:.75rem;
  padding:.65rem .8rem;border-radius:10px;border:1.5px solid var(--i-item-border);
  margin-bottom:.5rem;background:rgba(255,255,255,.6);transition:all .2s;
}
.item-row.matched{
  border-color:#7ab87a;background:linear-gradient(135deg,rgba(122,184,122,.12),rgba(100,160,100,.06));
}
.item-row.missing{
  border-color:#e0b8b8;background:rgba(239,68,68,.04);
}

/* スキャン履歴 */
.history-row{
  display:flex;align-items:center;gap:.5rem;
  font-size:.8rem;padding:.4rem .6rem;border-radius:8px;margin-bottom:.3rem;
}
.history-row.ok{background:rgba(122,184,122,.12);border:1px solid rgba(122,184,122,.3);}
.history-row.ng{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);}

/* プログレスバー */
.progress-track{height:10px;background:var(--i-prog-track);border-radius:999px;overflow:hidden;margin-top:10px;}
.progress-fill{height:10px;background:var(--i-prog-fill);border-radius:999px;transition:width .5s ease;}

/* バッジ */
.badge-done{background:linear-gradient(135deg,var(--ip1),var(--ip2));color:#fff;border-radius:999px;padding:2px 10px;font-size:.75rem;font-weight:700;}
.badge-pending{background:rgba(239,68,68,.1);color:#c05050;border:1px solid rgba(220,80,80,.3);border-radius:999px;padding:2px 10px;font-size:.75rem;font-weight:700;}

/* HIDモード枠 */
.hid-active-box{
  border:2.5px solid #c8820a;border-radius:12px;padding:24px;text-align:center;
  background:linear-gradient(135deg,rgba(255,220,100,.08),rgba(255,200,50,.04));
}

/* スキャン結果オーバーレイ */
.result-overlay{
  position:fixed;inset:0;display:flex;flex-direction:column;
  align-items:center;justify-content:center;z-index:100;
  pointer-events:none;opacity:0;transition:opacity .3s;
}
.result-overlay.show{opacity:1;}
.result-overlay.success{background:rgba(74,138,74,.93);}
.result-overlay.error{background:rgba(180,50,50,.92);}
.face-emoji{font-size:9rem;line-height:1;animation:pop .3s cubic-bezier(.17,.67,.6,1.4);}
@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}

/* 完了ボタン */
.complete-btn-active{
  background:linear-gradient(135deg,var(--ip1),var(--ip2));
  color:#fff;width:100%;padding:18px;border-radius:14px;
  font-weight:700;font-size:1.1rem;border:none;cursor:pointer;
  box-shadow:0 4px 16px rgba(50,120,50,.3);transition:all .2s;
}
.complete-btn-active:hover{filter:brightness(1.07);transform:translateY(-2px);box-shadow:0 6px 20px rgba(50,120,50,.4);}
.complete-btn-disabled{
  background:rgba(200,210,200,.5);color:#9aaa9a;
  width:100%;padding:18px;border-radius:14px;
  font-weight:700;font-size:1.1rem;border:none;cursor:not-allowed;
}

/* モーダル */
.modal-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.35);z-index:50;
  display:flex;align-items:center;justify-content:center;padding:16px;
}
#reader{width:100%;border-radius:10px;overflow:hidden;}
#reader video{border-radius:10px;}

/* スキャン入力（HID用不可視） */
.scan-input{width:0;height:0;opacity:0;position:absolute;}
</style>
</head>
<body class="min-h-screen">

<!-- ヘッダー -->
<header class="app-header px-4 py-3 flex items-center justify-between">
  <a href="/admin" onclick="cleanup()" class="text-green-100 hover:text-white flex items-center gap-2 text-sm font-medium">
    <i class="fas fa-arrow-left"></i>管理者画面へ
  </a>
  <div class="flex items-center gap-2">
    <i class="fas fa-barcode text-green-200"></i>
    <h1 class="font-bold text-white text-sm">バーコード検品</h1>
  </div>
  <span id="order-no-header" class="text-xs text-green-200 font-mono"></span>
</header>

<div class="max-w-2xl mx-auto p-4 space-y-4 pb-10">

  <!-- 発注情報カード -->
  <div class="card p-5">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-xs text-gray-400 font-medium mb-1">発注番号</p>
        <p id="order-no" class="font-bold text-green-700 text-xl tracking-wide"></p>
        <p id="store-info" class="text-sm text-gray-500 mt-1"></p>
      </div>
      <div class="text-right">
        <p class="text-xs text-gray-400 font-medium mb-1">進捗</p>
        <p id="progress-text" class="font-bold text-2xl text-green-600">-/-</p>
      </div>
    </div>
    <div class="progress-track">
      <div id="progress-bar" class="progress-fill" style="width:0%"></div>
    </div>
    <p id="progress-hint" class="text-xs text-gray-400 mt-2 text-right">スキャン待機中</p>
  </div>

  <!-- スキャンモード -->
  <div class="card p-4">
    <div class="section-title"><i class="fas fa-qrcode text-green-600"></i>スキャンモード</div>
    <div class="flex gap-2 mb-4">
      <button id="btn-camera" onclick="setMode('camera')" class="mode-btn active-camera">
        <i class="fas fa-camera mr-1"></i>カメラ
      </button>
      <button id="btn-hid" onclick="setMode('hid')" class="mode-btn inactive">
        <i class="fas fa-keyboard mr-1"></i>外付けリーダー
      </button>
    </div>

    <!-- カメラスキャン -->
    <div id="camera-mode">
      <div id="reader" class="mb-3"></div>
      <div id="camera-status" class="text-center text-sm text-gray-400 py-2 bg-green-50 rounded-lg">
        <i class="fas fa-spinner fa-spin mr-1"></i>カメラを初期化中...
      </div>
    </div>

    <!-- HIDモード -->
    <div id="hid-mode" class="hidden">
      <div class="hid-active-box">
        <i class="fas fa-barcode text-5xl text-yellow-600 mb-3 block"></i>
        <p class="font-bold text-yellow-700 text-lg">HIDモード有効</p>
        <p class="text-sm text-gray-500 mt-2">バーコードリーダーでスキャンしてください</p>
        <p class="text-xs text-gray-400 mt-1">（このエリアをクリックしてフォーカスを当てる）</p>
        <input id="hid-input" class="scan-input" type="text" autocomplete="off">
      </div>
    </div>

    <!-- 手動入力 -->
    <div class="mt-4 flex gap-2">
      <input id="manual-input" type="text" placeholder="バーコードを手入力..."
        class="form-input" style="border-radius:10px;">
      <button onclick="manualScan()" class="btn-p px-4" style="white-space:nowrap;">
        <i class="fas fa-check mr-1"></i>確認
      </button>
    </div>
  </div>

  <!-- 発注明細 -->
  <div class="card p-4">
    <div class="section-title">
      <i class="fas fa-list-check text-green-600"></i>発注明細
      <button onclick="resetInspection()" class="ml-auto text-xs text-red-400 hover:text-red-600 font-medium" style="margin-left:auto;">
        <i class="fas fa-redo mr-1"></i>リセット
      </button>
    </div>
    <div id="items-list"></div>
  </div>

  <!-- スキャン履歴 -->
  <div class="card p-4">
    <div class="section-title"><i class="fas fa-history text-green-600"></i>スキャン履歴</div>
    <div id="scan-history" class="max-h-48 overflow-y-auto"></div>
    <p id="history-empty" class="text-gray-400 text-sm text-center py-4">
      <i class="fas fa-inbox mr-1"></i>スキャン履歴なし
    </p>
  </div>

  <!-- 出荷完了ボタン -->
  <div class="pb-4">
    <button id="complete-btn" onclick="completeShipment()" class="complete-btn-disabled" disabled>
      <i class="fas fa-shipping-fast mr-2"></i>出荷完了にする
    </button>
    <p id="complete-hint" class="text-center text-xs text-gray-400 mt-2">全品スキャン完了後に有効になります</p>
  </div>

</div>

<!-- スキャン結果オーバーレイ -->
<div id="result-overlay" class="result-overlay">
  <div id="result-face" class="face-emoji">😊</div>
  <p id="result-text" class="text-white font-bold text-3xl mt-4 drop-shadow-lg"></p>
  <p id="result-sub" class="text-white/85 text-base mt-3 px-8 text-center"></p>
</div>

<!-- 出荷完了確認モーダル -->
<div id="complete-modal" class="modal-overlay hidden">
  <div class="card p-6 max-w-sm w-full text-center">
    <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
      <i class="fas fa-shipping-fast text-2xl text-green-600"></i>
    </div>
    <h2 class="text-xl font-bold text-gray-800 mb-2">出荷完了確認</h2>
    <p class="text-gray-500 text-sm mb-6">全商品の検品が完了しています。<br>出荷完了ステータスに変更しますか？</p>
    <div class="flex gap-3">
      <button onclick="document.getElementById('complete-modal').classList.add('hidden')"
        class="btn-s flex-1">キャンセル</button>
      <button onclick="confirmComplete()" class="btn-p flex-1">
        <i class="fas fa-check mr-1"></i>出荷完了
      </button>
    </div>
  </div>
</div>

<script>
var ORDER_ID = '${orderId}';
var adminToken = localStorage.getItem('admin_token');
var orderItems = [];
var inspectedBarcodes = new Set();
var scanHistory = [];
var html5QrCode = null;
var currentMode = 'camera';
var hidBuffer = '';

// ============ カラーテーマ ============
var THEMES_INSP = {
  green:  {p1:'#5d8464',p2:'#3d6444',bg1:'#f0f4f0',bg2:'#e4ece4',cb:'rgba(180,210,180,.4)',ib:'#c8d8c0',tt:'#4a6b4e',ln:'#c8d9c0',hbg:'linear-gradient(135deg,#4a7a50,#2d5a34)',pt:'#ddeedd',ib2:'#d4e4cc',mib:'rgba(180,210,180,.5)',fr:'rgba(122,158,126,.15)'},
  blue:   {p1:'#3a6bbf',p2:'#1e4d9e',bg1:'#f0f4fc',bg2:'#e4ecf8',cb:'rgba(160,190,230,.4)',ib:'#b8cce0',tt:'#1e3a6e',ln:'#b0c4e0',hbg:'linear-gradient(135deg,#1e4d9e,#0f3070)',pt:'#d8e8f8',ib2:'#c0d4e8',mib:'rgba(160,190,230,.5)',fr:'rgba(91,141,217,.15)'},
  purple: {p1:'#6a52a8',p2:'#4e3888',bg1:'#f5f0fc',bg2:'#ece4f8',cb:'rgba(190,170,225,.4)',ib:'#c8b8e0',tt:'#3d2878',ln:'#c0b0e0',hbg:'linear-gradient(135deg,#4e3888,#361c6c)',pt:'#e0d8f0',ib2:'#d0c0e4',mib:'rgba(190,170,225,.5)',fr:'rgba(139,114,200,.15)'},
  orange: {p1:'#c06820',p2:'#a05010',bg1:'#fef5ec',bg2:'#fde8d4',cb:'rgba(225,185,145,.4)',ib:'#e8c898',tt:'#7a3a10',ln:'#e0c090',hbg:'linear-gradient(135deg,#a05010,#803808)',pt:'#f8e8c8',ib2:'#e8d0a8',mib:'rgba(225,185,145,.5)',fr:'rgba(224,134,58,.15)'},
  slate:  {p1:'#455a64',p2:'#2e3f46',bg1:'#f2f5f7',bg2:'#e6ebed',cb:'rgba(170,190,200,.4)',ib:'#b8ccd4',tt:'#2e3f46',ln:'#b0c4cc',hbg:'linear-gradient(135deg,#2e3f46,#1c2b30)',pt:'#dce8ee',ib2:'#c4d8e0',mib:'rgba(170,190,200,.5)',fr:'rgba(96,125,139,.15)'},
  rose:   {p1:'#b85070',p2:'#943050',bg1:'#fdf4f6',bg2:'#f8e8ec',cb:'rgba(218,168,178,.4)',ib:'#e0b0c0',tt:'#7a2038',ln:'#e0b8c8',hbg:'linear-gradient(135deg,#943050,#701838)',pt:'#f5dde4',ib2:'#e8c0cc',mib:'rgba(218,168,178,.5)',fr:'rgba(212,116,138,.15)'}
};
function applyThemeInsp(preset) {
  var t = THEMES_INSP[preset] || THEMES_INSP.green;
  var r = document.documentElement.style;
  r.setProperty('--ip1',                   t.p1);
  r.setProperty('--ip2',                   t.p2);
  r.setProperty('--i-bg1',                 t.bg1);
  r.setProperty('--i-bg2',                 t.bg2);
  r.setProperty('--i-card-border',         t.cb);
  r.setProperty('--i-input-border',        t.ib);
  r.setProperty('--i-title',               t.tt);
  r.setProperty('--i-line',                t.ln);
  r.setProperty('--i-header-bg',           t.hbg);
  r.setProperty('--i-prog-track',          t.pt);
  r.setProperty('--i-item-border',         t.ib2);
  r.setProperty('--i-mode-inactive-border',t.mib);
  r.setProperty('--i-focus-ring',          t.fr);
  r.setProperty('--i-prog-fill',           'linear-gradient(to right,' + t.p1 + ',' + t.p2 + ')');
}

// ============ 初期化 ============
async function init() {
  if (!adminToken) { window.location.href = '/admin'; return; }
  try {
    var sd = await (await fetch('/api/settings')).json();
    applyThemeInsp(sd.settings.theme_preset || 'green');
  } catch(e) {}
  await loadOrder();
  setMode('camera');
  setupHidInput();
}

async function loadOrder() {
  try {
    var res = await apiFetch('/api/admin/orders/' + ORDER_ID);
    var data = await res.json();
    var order = data.order;
    var items = data.items;
    var inspections = data.inspections;

    document.getElementById('order-no').textContent = order.order_no;
    document.getElementById('order-no-header').textContent = order.order_no;
    document.getElementById('store-info').textContent = order.store_name + (order.section_name ? ' / ' + order.section_name : '');

    orderItems = items || [];
    inspectedBarcodes = new Set((inspections || []).filter(function(i){ return i.is_match; }).map(function(i){ return i.barcode_scanned; }));

    renderItems();
    updateProgress();
  } catch(e) {
    console.error(e);
  }
}

// ============ スキャン処理 ============
async function processScan(barcode) {
  barcode = barcode.trim();
  if (!barcode) return;

  try {
    var res = await apiFetch('/api/admin/orders/' + ORDER_ID + '/inspect', {
      method: 'POST',
      body: JSON.stringify({ barcode_scanned: barcode, scanned_by: '' }),
    });
    var data = await res.json();

    if (data.is_match) {
      inspectedBarcodes.add(barcode);
      playSound('success');
      showOverlay('success', '😊', '一致！', data.product ? data.product.product_name : barcode);
      addHistory(barcode, true, data.product ? data.product.product_name : '');
    } else {
      playSound('error');
      showOverlay('error', '👹', '不一致！', barcode + ' - 発注リストにありません');
      addHistory(barcode, false, '');
    }

    renderItems();
    updateProgress();
  } catch(e) {
    console.error(e);
  }
}

function manualScan() {
  var input = document.getElementById('manual-input');
  var val = input.value.trim();
  if (val) { processScan(val); input.value = ''; }
}

document.getElementById('manual-input').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') manualScan();
});

// ============ HID入力 ============
function setupHidInput() {
  var input = document.getElementById('hid-input');
  input.addEventListener('input', function(e) {
    hidBuffer = e.target.value;
  });
  input.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && hidBuffer.trim()) {
      processScan(hidBuffer.trim());
      e.target.value = '';
      hidBuffer = '';
    }
  });
  document.addEventListener('keydown', function(e) {
    if (currentMode === 'hid' && e.target !== document.getElementById('manual-input')) {
      input.focus();
    }
  });
}

// ============ カメラ ============
async function startCamera() {
  var status = document.getElementById('camera-status');
  try {
    html5QrCode = new Html5Qrcode('reader');
    var devices = await Html5Qrcode.getCameras();
    if (!devices || devices.length === 0) {
      status.innerHTML = '<i class="fas fa-exclamation-triangle mr-1 text-yellow-500"></i>カメラが見つかりません';
      return;
    }
    var backCam = devices.find(function(d){ return /back|rear|environment/i.test(d.label); }) || devices[devices.length - 1];
    await html5QrCode.start(
      { deviceId: backCam.id },
      { fps: 10, qrbox: { width: 280, height: 180 } },
      function(decodedText) { processScan(decodedText); },
      function() {}
    );
    status.innerHTML = '<i class="fas fa-circle text-green-500 mr-1"></i>スキャン待機中...';
    status.className = 'text-center text-sm text-green-600 py-2 bg-green-50 rounded-lg font-medium';
  } catch(e) {
    status.innerHTML = '<i class="fas fa-times-circle mr-1 text-red-400"></i>カメラエラー: ' + e.message;
    status.className = 'text-center text-sm text-red-400 py-2 bg-red-50 rounded-lg';
    console.error(e);
  }
}

async function stopCamera() {
  if (html5QrCode) {
    try { await html5QrCode.stop(); } catch(e) {}
    html5QrCode = null;
  }
}

// ============ モード切替 ============
async function setMode(mode) {
  currentMode = mode;
  var btnCamera = document.getElementById('btn-camera');
  var btnHid = document.getElementById('btn-hid');
  var cameraDiv = document.getElementById('camera-mode');
  var hidDiv = document.getElementById('hid-mode');

  if (mode === 'camera') {
    btnCamera.className = 'mode-btn active-camera';
    btnHid.className = 'mode-btn inactive';
    cameraDiv.classList.remove('hidden');
    hidDiv.classList.add('hidden');
    await startCamera();
  } else {
    btnCamera.className = 'mode-btn inactive';
    btnHid.className = 'mode-btn active-hid';
    cameraDiv.classList.add('hidden');
    hidDiv.classList.remove('hidden');
    await stopCamera();
    document.getElementById('hid-input').focus();
  }
}

// ============ UI更新 ============
function renderItems() {
  var list = document.getElementById('items-list');
  if (!orderItems.length) {
    list.innerHTML = '<p class="text-gray-400 text-sm text-center py-4">明細データなし</p>';
    return;
  }
  list.innerHTML = orderItems.map(function(item) {
    var matched = item.barcode && inspectedBarcodes.has(item.barcode);
    return '<div class="item-row ' + (matched ? 'matched' : 'missing') + '">' +
      '<div class="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ' +
        (matched ? 'bg-green-100 border-2 border-green-500' : 'bg-red-50 border-2 border-red-300') + '">' +
        '<i class="fas ' + (matched ? 'fa-check text-green-600' : 'fa-times text-red-400') + ' text-sm"></i>' +
      '</div>' +
      '<div class="flex-1 min-w-0">' +
        '<p class="font-semibold text-sm text-gray-800 truncate">' + (item.product_name || '') + '</p>' +
        '<p class="text-xs text-gray-400">' + (item.brand || '') + ' / ' + item.quantity + (item.unit || '個') + '</p>' +
        (item.barcode
          ? '<p class="text-xs font-mono text-gray-400">' + item.barcode + '</p>'
          : '<p class="text-xs text-yellow-600"><i class="fas fa-exclamation-triangle mr-1"></i>バーコードなし</p>') +
      '</div>' +
      '<span class="' + (matched ? 'badge-done' : 'badge-pending') + '">' +
        (matched ? '<i class="fas fa-check mr-1"></i>済' : '未') +
      '</span>' +
    '</div>';
  }).join('');
}

function updateProgress() {
  var total = orderItems.filter(function(i){ return i.barcode; }).length;
  var matched = orderItems.filter(function(i){ return i.barcode && inspectedBarcodes.has(i.barcode); }).length;
  var pct = total > 0 ? Math.round(matched / total * 100) : 0;

  document.getElementById('progress-text').textContent = matched + '/' + total;
  document.getElementById('progress-bar').style.width = pct + '%';

  var allDone = total > 0 && matched === total;
  var btn = document.getElementById('complete-btn');
  var hint = document.getElementById('complete-hint');
  var phint = document.getElementById('progress-hint');

  if (allDone) {
    btn.disabled = false;
    btn.className = 'complete-btn-active';
    hint.innerHTML = '<i class="fas fa-check-circle mr-1 text-green-500"></i>全品スキャン完了！出荷完了にできます';
    hint.className = 'text-center text-xs text-green-600 mt-2 font-semibold';
    phint.textContent = '完了！全品スキャン済み';
    phint.className = 'text-xs text-green-600 mt-2 text-right font-semibold';
  } else {
    btn.disabled = true;
    btn.className = 'complete-btn-disabled';
    hint.textContent = '残り' + (total - matched) + '点のスキャンが必要です';
    hint.className = 'text-center text-xs text-gray-400 mt-2';
    phint.textContent = pct + '% 完了';
    phint.className = 'text-xs text-gray-400 mt-2 text-right';
  }
}

function addHistory(barcode, isMatch, productName) {
  scanHistory.unshift({ barcode: barcode, isMatch: isMatch, productName: productName || '', time: new Date() });
  var el = document.getElementById('scan-history');
  var empty = document.getElementById('history-empty');
  empty.classList.add('hidden');
  el.innerHTML = scanHistory.slice(0, 20).map(function(h) {
    return '<div class="history-row ' + (h.isMatch ? 'ok' : 'ng') + '">' +
      '<i class="fas ' + (h.isMatch ? 'fa-check-circle text-green-500' : 'fa-times-circle text-red-400') + '"></i>' +
      '<span class="font-mono flex-1 truncate text-gray-700">' + h.barcode + '</span>' +
      (h.productName ? '<span class="text-gray-400 truncate" style="max-width:120px">' + h.productName + '</span>' : '') +
      '<span class="text-gray-300 flex-shrink-0">' + h.time.toLocaleTimeString('ja-JP') + '</span>' +
    '</div>';
  }).join('');
}

// ============ オーバーレイ ============
var overlayTimer = null;
function showOverlay(type, face, text, sub) {
  var overlay = document.getElementById('result-overlay');
  document.getElementById('result-face').textContent = face;
  document.getElementById('result-text').textContent = text;
  document.getElementById('result-sub').textContent = sub;
  overlay.className = 'result-overlay show ' + type;
  if (overlayTimer) clearTimeout(overlayTimer);
  overlayTimer = setTimeout(function() { overlay.className = 'result-overlay'; }, 1500);
}

// ============ サウンド ============
function playSound(type) {
  try {
    var ctx = new (window.AudioContext || window.webkitAudioContext)();
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    if (type === 'success') {
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.setValueAtTime(1320, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    } else {
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(160, ctx.currentTime + 0.1);
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch(e) {}
}

// ============ 出荷完了 ============
function completeShipment() {
  document.getElementById('complete-modal').classList.remove('hidden');
}

async function confirmComplete() {
  document.getElementById('complete-modal').classList.add('hidden');
  try {
    var res = await apiFetch('/api/admin/orders/' + ORDER_ID + '/status', {
      method: 'PUT',
      body: JSON.stringify({ status: 'shipped' }),
    });
    if (res.ok) {
      showOverlay('success', '🚀', '出荷完了！', 'ステータスを更新しました');
      setTimeout(function() { window.location.href = '/admin'; }, 1800);
    }
  } catch(e) {
    alert('エラーが発生しました');
  }
}

async function resetInspection() {
  if (!confirm('検品ログをリセットしますか？')) return;
  try {
    await apiFetch('/api/admin/orders/' + ORDER_ID + '/inspections', { method: 'DELETE' });
    inspectedBarcodes = new Set();
    scanHistory = [];
    document.getElementById('scan-history').innerHTML = '';
    document.getElementById('history-empty').classList.remove('hidden');
    renderItems();
    updateProgress();
  } catch(e) {
    alert('リセットに失敗しました');
  }
}

function cleanup() {
  stopCamera();
}

// ============ ユーティリティ ============
async function apiFetch(url, opts) {
  opts = opts || {};
  var headers = { 'Content-Type': 'application/json' };
  if (opts.headers) Object.assign(headers, opts.headers);
  if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
  return fetch(url, Object.assign({}, opts, { headers: headers }));
}

window.addEventListener('beforeunload', function() { stopCamera(); });
init();
</script>
</body>
</html>`;
}
