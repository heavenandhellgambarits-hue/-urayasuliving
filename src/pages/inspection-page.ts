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
  :root{--primary:#2563eb}
  body{background:#0f172a;color:#f8fafc;font-family:'Noto Sans JP',sans-serif;touch-action:manipulation}
  .card{background:#1e293b;border-radius:.75rem;border:1px solid #334155}
  .badge{display:inline-block;padding:3px 10px;border-radius:999px;font-size:.75rem;font-weight:700}
  #reader{width:100%;border-radius:.5rem;overflow:hidden}
  #reader video{border-radius:.5rem}
  .result-overlay{position:fixed;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:100;pointer-events:none;opacity:0;transition:opacity .3s}
  .result-overlay.show{opacity:1}
  .result-overlay.success{background:rgba(16,185,129,.92)}
  .result-overlay.error{background:rgba(239,68,68,.92)}
  .face-emoji{font-size:8rem;line-height:1;animation:pop .3s ease-out}
  @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
  .item-row{display:flex;align-items:center;gap:.75rem;padding:.6rem .75rem;border-radius:.5rem;border:1px solid #334155;margin-bottom:.5rem}
  .item-row.matched{border-color:#10b981;background:rgba(16,185,129,.1)}
  .item-row.missing{border-color:#ef4444;background:rgba(239,68,68,.05)}
  .scan-input{width:0;height:0;opacity:0;position:absolute}
  .hid-mode-active{border:2px solid #f59e0b;border-radius:.5rem}
  @media(prefers-color-scheme:light){
    body{background:#f1f5f9;color:#0f172a}
    .card{background:#fff;border-color:#e2e8f0}
    .item-row{border-color:#e2e8f0}
  }
</style>
</head>
<body class="min-h-screen">

<!-- ヘッダー -->
<header class="bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
  <a href="/admin" onclick="cleanup()" class="text-slate-400 hover:text-white">
    <i class="fas fa-arrow-left mr-2"></i>管理者画面
  </a>
  <h1 class="font-bold text-white text-sm">バーコード検品</h1>
  <span id="order-no-header" class="text-xs text-slate-400"></span>
</header>

<div class="max-w-2xl mx-auto p-4 space-y-4">

  <!-- 発注情報 -->
  <div class="card p-4">
    <div class="flex justify-between items-start">
      <div>
        <p class="text-xs text-slate-400">発注番号</p>
        <p id="order-no" class="font-bold text-blue-400 text-lg"></p>
        <p id="store-info" class="text-sm text-slate-400 mt-1"></p>
      </div>
      <div class="text-right">
        <p class="text-xs text-slate-400">進捗</p>
        <p id="progress-text" class="font-bold text-xl text-emerald-400">-/-</p>
      </div>
    </div>
    <div class="mt-3 h-2 bg-slate-700 rounded-full overflow-hidden">
      <div id="progress-bar" class="h-2 bg-emerald-500 rounded-full transition-all" style="width:0%"></div>
    </div>
  </div>

  <!-- スキャンモード切替 -->
  <div class="card p-4">
    <div class="flex gap-2 mb-4">
      <button id="btn-camera" onclick="setMode('camera')" class="flex-1 py-2 rounded-lg font-bold text-sm bg-blue-600 text-white">
        <i class="fas fa-camera mr-1"></i>カメラ
      </button>
      <button id="btn-hid" onclick="setMode('hid')" class="flex-1 py-2 rounded-lg font-bold text-sm bg-slate-700 text-slate-300">
        <i class="fas fa-keyboard mr-1"></i>外付けリーダー
      </button>
    </div>

    <!-- カメラスキャン -->
    <div id="camera-mode">
      <div id="reader" class="mb-3"></div>
      <div id="camera-status" class="text-center text-sm text-slate-400 py-2">
        カメラを初期化中...
      </div>
    </div>

    <!-- HIDモード -->
    <div id="hid-mode" class="hidden">
      <div class="text-center p-6 hid-mode-active rounded-xl">
        <i class="fas fa-barcode text-5xl text-yellow-400 mb-3 block"></i>
        <p class="font-bold text-yellow-400 text-lg">HIDモード有効</p>
        <p class="text-sm text-slate-400 mt-2">バーコードリーダーでスキャンしてください</p>
        <p class="text-xs text-slate-500 mt-1">（このエリアをクリックしてフォーカスを当てる）</p>
        <input id="hid-input" class="scan-input" type="text" autocomplete="off">
      </div>
    </div>

    <!-- 手動入力 -->
    <div class="mt-3 flex gap-2">
      <input id="manual-input" type="text" placeholder="バーコードを手入力..." 
        class="flex-1 bg-slate-700 text-white rounded-lg px-3 py-2 text-sm border border-slate-600 focus:outline-none focus:border-blue-500">
      <button onclick="manualScan()" class="btn-primary px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-sm">
        <i class="fas fa-check"></i>
      </button>
    </div>
  </div>

  <!-- 発注明細 -->
  <div class="card p-4">
    <div class="flex justify-between items-center mb-3">
      <h2 class="font-bold"><i class="fas fa-list mr-2 text-blue-400"></i>発注明細</h2>
      <button onclick="resetInspection()" class="text-xs text-red-400 hover:text-red-300">
        <i class="fas fa-redo mr-1"></i>リセット
      </button>
    </div>
    <div id="items-list"></div>
  </div>

  <!-- スキャン履歴 -->
  <div class="card p-4">
    <h2 class="font-bold mb-3"><i class="fas fa-history mr-2 text-purple-400"></i>スキャン履歴</h2>
    <div id="scan-history" class="space-y-1 max-h-48 overflow-y-auto"></div>
    <p id="history-empty" class="text-slate-500 text-sm text-center py-4">スキャン履歴なし</p>
  </div>

  <!-- 出荷完了ボタン -->
  <div class="pb-8">
    <button id="complete-btn" onclick="completeShipment()" 
      class="w-full py-4 rounded-xl font-bold text-lg text-white bg-slate-700 cursor-not-allowed opacity-50 transition-all" disabled>
      <i class="fas fa-shipping-fast mr-2"></i>出荷完了にする
    </button>
    <p id="complete-hint" class="text-center text-xs text-slate-500 mt-2">全品スキャン完了後に有効になります</p>
  </div>

</div>

<!-- スキャン結果オーバーレイ -->
<div id="result-overlay" class="result-overlay">
  <div id="result-face" class="face-emoji">😊</div>
  <p id="result-text" class="text-white font-bold text-2xl mt-4"></p>
  <p id="result-sub" class="text-white/80 text-sm mt-2"></p>
</div>

<!-- 完了モーダル -->
<div id="complete-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
  <div class="card p-6 max-w-sm w-full text-center">
    <div class="text-5xl mb-4">🚀</div>
    <h2 class="text-xl font-bold mb-2">出荷完了確認</h2>
    <p class="text-slate-400 text-sm mb-6">全商品の検品が完了しています。<br>出荷完了ステータスに変更しますか？</p>
    <div class="flex gap-3">
      <button onclick="document.getElementById('complete-modal').classList.add('hidden')" class="flex-1 py-3 bg-slate-700 rounded-xl font-bold">キャンセル</button>
      <button onclick="confirmComplete()" class="flex-1 py-3 bg-emerald-600 rounded-xl font-bold text-white">出荷完了</button>
    </div>
  </div>
</div>

<script>
const ORDER_ID = '${orderId}';
let adminToken = localStorage.getItem('admin_token');
let orderItems = [];
let inspectedBarcodes = new Set();
let scanHistory = [];
let html5QrCode = null;
let currentMode = 'camera';
let hidBuffer = '';
let hidTimer = null;

// ============ 初期化 ============
async function init() {
  if (!adminToken) { window.location.href = '/admin'; return; }
  await loadOrder();
  setMode('camera');
  setupHidInput();
}

async function loadOrder() {
  try {
    const res = await apiFetch(\`/api/admin/orders/\${ORDER_ID}\`);
    const { order, items, inspections } = await res.json();
    
    document.getElementById('order-no').textContent = order.order_no;
    document.getElementById('order-no-header').textContent = order.order_no;
    document.getElementById('store-info').textContent = order.store_name + (order.section_name ? ' / ' + order.section_name : '');
    
    orderItems = items || [];
    inspectedBarcodes = new Set((inspections || []).filter(i => i.is_match).map(i => i.barcode_scanned));
    
    renderItems();
    updateProgress();
  } catch (e) {
    console.error(e);
  }
}

// ============ スキャン ============
async function processScan(barcode) {
  barcode = barcode.trim();
  if (!barcode) return;

  const res = await apiFetch(\`/api/admin/orders/\${ORDER_ID}/inspect\`, {
    method: 'POST',
    body: JSON.stringify({ barcode_scanned: barcode, scanned_by: '' }),
  });
  const data = await res.json();

  if (data.is_match) {
    inspectedBarcodes.add(barcode);
    playSound('success');
    showOverlay('success', '😊', '一致！', data.product?.product_name || barcode);
    addHistory(barcode, true, data.product?.product_name);
  } else {
    playSound('error');
    showOverlay('error', '👹', '不一致！', \`\${barcode} - 発注リストにありません\`);
    addHistory(barcode, false);
  }

  renderItems();
  updateProgress();
}

function manualScan() {
  const input = document.getElementById('manual-input');
  const val = input.value.trim();
  if (val) { processScan(val); input.value = ''; }
}

document.getElementById('manual-input').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') manualScan();
});

// HID（外付けバーコードリーダー）
function setupHidInput() {
  const input = document.getElementById('hid-input');
  input.addEventListener('input', (e) => {
    hidBuffer = e.target.value;
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && hidBuffer.trim()) {
      processScan(hidBuffer.trim());
      e.target.value = '';
      hidBuffer = '';
    }
  });
  // グローバルキーイベントでHID入力を検知
  document.addEventListener('keydown', (e) => {
    if (currentMode === 'hid' && e.target !== document.getElementById('manual-input')) {
      input.focus();
    }
  });
}

// ============ カメラ ============
async function startCamera() {
  const status = document.getElementById('camera-status');
  try {
    html5QrCode = new Html5Qrcode('reader');
    const devices = await Html5Qrcode.getCameras();
    if (!devices || devices.length === 0) {
      status.textContent = 'カメラが見つかりません';
      return;
    }
    // 背面カメラ優先
    const backCam = devices.find(d => /back|rear|environment/i.test(d.label)) || devices[devices.length - 1];
    
    await html5QrCode.start(
      { deviceId: backCam.id },
      { fps: 10, qrbox: { width: 280, height: 180 } },
      (decodedText) => {
        processScan(decodedText);
      },
      () => {}
    );
    status.textContent = 'スキャン待機中...';
  } catch (e) {
    status.textContent = 'カメラエラー: ' + e.message;
    console.error(e);
  }
}

async function stopCamera() {
  if (html5QrCode) {
    try { await html5QrCode.stop(); } catch {}
    html5QrCode = null;
  }
}

// ============ モード切替 ============
async function setMode(mode) {
  currentMode = mode;
  const btnCamera = document.getElementById('btn-camera');
  const btnHid = document.getElementById('btn-hid');
  const cameraDiv = document.getElementById('camera-mode');
  const hidDiv = document.getElementById('hid-mode');

  if (mode === 'camera') {
    btnCamera.className = 'flex-1 py-2 rounded-lg font-bold text-sm bg-blue-600 text-white';
    btnHid.className = 'flex-1 py-2 rounded-lg font-bold text-sm bg-slate-700 text-slate-300';
    cameraDiv.classList.remove('hidden');
    hidDiv.classList.add('hidden');
    await startCamera();
  } else {
    btnCamera.className = 'flex-1 py-2 rounded-lg font-bold text-sm bg-slate-700 text-slate-300';
    btnHid.className = 'flex-1 py-2 rounded-lg font-bold text-sm bg-yellow-500 text-black';
    cameraDiv.classList.add('hidden');
    hidDiv.classList.remove('hidden');
    await stopCamera();
    document.getElementById('hid-input').focus();
  }
}

// ============ UI更新 ============
function renderItems() {
  const list = document.getElementById('items-list');
  list.innerHTML = orderItems.map(item => {
    const matched = item.barcode && inspectedBarcodes.has(item.barcode);
    return \`
    <div class="item-row \${matched ? 'matched' : 'missing'}">
      <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
        \${matched ? 'bg-emerald-500' : 'bg-red-500/20 border border-red-500'}">
        <i class="fas \${matched ? 'fa-check text-white' : 'fa-times text-red-400'} text-sm"></i>
      </div>
      <div class="flex-1 min-w-0">
        <p class="font-medium text-sm truncate">\${item.product_name}</p>
        <p class="text-xs text-slate-400">\${item.brand||''} / \${item.quantity}\${item.unit||'個'}</p>
        \${item.barcode ? \`<p class="text-xs font-mono text-slate-500">\${item.barcode}</p>\` : '<p class="text-xs text-orange-400">バーコードなし</p>'}
      </div>
      <span class="badge \${matched ? 'bg-emerald-900 text-emerald-300' : 'bg-red-900/30 text-red-400'}">
        \${matched ? 'スキャン済' : '未スキャン'}
      </span>
    </div>\`;
  }).join('');
}

function updateProgress() {
  const total = orderItems.filter(i => i.barcode).length;
  const matched = orderItems.filter(i => i.barcode && inspectedBarcodes.has(i.barcode)).length;
  const pct = total > 0 ? Math.round(matched / total * 100) : 0;
  
  document.getElementById('progress-text').textContent = \`\${matched}/\${total}\`;
  document.getElementById('progress-bar').style.width = pct + '%';

  const allDone = total > 0 && matched === total;
  const btn = document.getElementById('complete-btn');
  const hint = document.getElementById('complete-hint');
  if (allDone) {
    btn.disabled = false;
    btn.className = 'w-full py-4 rounded-xl font-bold text-lg text-white bg-emerald-600 hover:bg-emerald-500 cursor-pointer transition-all';
    hint.textContent = '全品スキャン完了！出荷完了にできます';
    hint.className = 'text-center text-xs text-emerald-400 mt-2';
  } else {
    btn.disabled = true;
    btn.className = 'w-full py-4 rounded-xl font-bold text-lg text-white bg-slate-700 cursor-not-allowed opacity-50 transition-all';
    hint.textContent = \`残り\${total - matched}点のスキャンが必要です\`;
    hint.className = 'text-center text-xs text-slate-500 mt-2';
  }
}

function addHistory(barcode, isMatch, productName = '') {
  scanHistory.unshift({barcode, isMatch, productName, time: new Date()});
  const el = document.getElementById('scan-history');
  const empty = document.getElementById('history-empty');
  empty.classList.add('hidden');
  el.innerHTML = scanHistory.slice(0,20).map(h => \`
    <div class="flex items-center gap-2 text-xs p-2 rounded \${h.isMatch ? 'bg-emerald-900/30' : 'bg-red-900/30'}">
      <i class="fas \${h.isMatch ? 'fa-check text-emerald-400' : 'fa-times text-red-400'}"></i>
      <span class="font-mono flex-1 truncate">\${h.barcode}</span>
      \${h.productName ? \`<span class="text-slate-400 truncate max-w-[100px]">\${h.productName}</span>\` : ''}
      <span class="text-slate-500">\${h.time.toLocaleTimeString('ja-JP')}</span>
    </div>
  \`).join('');
}

// ============ オーバーレイ ============
let overlayTimer = null;
function showOverlay(type, face, text, sub) {
  const overlay = document.getElementById('result-overlay');
  document.getElementById('result-face').textContent = face;
  document.getElementById('result-text').textContent = text;
  document.getElementById('result-sub').textContent = sub;
  overlay.className = 'result-overlay show ' + type;
  if (overlayTimer) clearTimeout(overlayTimer);
  overlayTimer = setTimeout(() => { overlay.className = 'result-overlay'; }, 1500);
}

// ============ 音声 ============
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
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
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    }
  } catch (e) {}
}

// ============ 出荷完了 ============
function completeShipment() {
  document.getElementById('complete-modal').classList.remove('hidden');
}

async function confirmComplete() {
  document.getElementById('complete-modal').classList.add('hidden');
  const res = await apiFetch(\`/api/admin/orders/\${ORDER_ID}/status\`, {
    method: 'PUT',
    body: JSON.stringify({status: 'shipped'}),
  });
  if (res.ok) {
    alert('出荷完了にしました！');
    window.location.href = '/admin';
  }
}

async function resetInspection() {
  if (!confirm('検品ログをリセットしますか？')) return;
  await apiFetch(\`/api/admin/orders/\${ORDER_ID}/inspections\`, {method:'DELETE'});
  inspectedBarcodes.clear();
  scanHistory = [];
  document.getElementById('scan-history').innerHTML = '';
  document.getElementById('history-empty').classList.remove('hidden');
  renderItems();
  updateProgress();
}

function cleanup() {
  stopCamera();
}

// ============ ユーティリティ ============
async function apiFetch(url, opts = {}) {
  const headers = {'Content-Type':'application/json', ...opts.headers};
  if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
  return fetch(url, {...opts, headers});
}

window.addEventListener('beforeunload', stopCamera);
init();
</script>
</body>
</html>`;
}
