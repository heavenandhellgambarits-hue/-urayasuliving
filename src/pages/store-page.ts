export function getStorePage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OrderFlow - 発注ポータル</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
  :root { --primary: #2563eb; }
  .btn-primary { background: var(--primary); color: #fff; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: opacity .2s; }
  .btn-primary:hover { opacity: .85; }
  .btn-secondary { background: #e5e7eb; color: #374151; padding: 0.5rem 1.25rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: opacity .2s; }
  .btn-secondary:hover { opacity: .85; }
  .card { background: #fff; border-radius: 0.75rem; box-shadow: 0 1px 4px rgba(0,0,0,.08); }
  .badge { display:inline-block; padding:2px 10px; border-radius:999px; font-size:.75rem; font-weight:600; }
  .tab-btn { padding:.5rem 1rem; border-radius:.5rem .5rem 0 0; font-weight:600; cursor:pointer; transition:background .2s; }
  .tab-btn.active { background:var(--primary); color:#fff; }
  .tab-btn:not(.active) { background:#e5e7eb; color:#374151; }
  #cart-count { background:#ef4444; color:#fff; border-radius:999px; padding:1px 6px; font-size:.7rem; vertical-align:top; margin-left:2px; }
  .product-card { border:2px solid transparent; transition:border-color .15s; cursor:pointer; }
  .product-card:hover { border-color:var(--primary); }
  .product-card.selected { border-color:var(--primary); background:#eff6ff; }
  .qty-input { width:4rem; text-align:center; border:1px solid #d1d5db; border-radius:.375rem; padding:.25rem; }
  .status-badge-pending { background:#fef3c7; color:#92400e; }
  .status-badge-confirmed { background:#dbeafe; color:#1e40af; }
  .status-badge-preparing { background:#ede9fe; color:#5b21b6; }
  .status-badge-inspecting { background:#fce7f3; color:#9d174d; }
  .status-badge-shipped { background:#d1fae5; color:#065f46; }
  .status-badge-cancelled { background:#f3f4f6; color:#374151; }
  .notice-general { border-left: 4px solid #3b82f6; }
  .notice-important { border-left: 4px solid #ef4444; }
  .notice-info { border-left: 4px solid #10b981; }
  .modal-overlay { position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:50;display:flex;align-items:center;justify-content:center; }
  .modal-box { background:#fff;border-radius:1rem;padding:2rem;max-width:600px;width:95%;max-height:90vh;overflow-y:auto; }
  [v-cloak] { display:none; }
</style>
</head>
<body class="bg-gray-50 min-h-screen">

<!-- ログイン画面 -->
<div id="login-view" class="min-h-screen flex items-center justify-center p-4">
  <div class="card p-8 w-full max-w-md">
    <div class="text-center mb-8">
      <div id="site-icon" class="text-5xl mb-3">📦</div>
      <h1 id="site-name-login" class="text-2xl font-bold text-gray-800">OrderFlow</h1>
      <p class="text-gray-500 text-sm mt-1">発注ポータル</p>
    </div>
    <div id="login-error" class="hidden bg-red-50 text-red-700 rounded-lg p-3 mb-4 text-sm"></div>
    <form id="login-form">
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-1">ログインID</label>
        <input id="login-id" type="text" class="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="ログインIDを入力" required>
      </div>
      <div class="mb-6">
        <label class="block text-sm font-medium text-gray-700 mb-1">パスワード</label>
        <div class="relative">
          <input id="login-password" type="password" class="w-full border border-gray-300 rounded-lg p-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="パスワードを入力" required>
          <button type="button" onclick="togglePassword('login-password')" class="absolute right-3 top-3 text-gray-400 hover:text-gray-600"><i class="fas fa-eye"></i></button>
        </div>
      </div>
      <button type="submit" class="btn-primary w-full py-3 text-base">
        <i class="fas fa-sign-in-alt mr-2"></i>ログイン
      </button>
    </form>
    <p class="text-center text-xs text-gray-400 mt-6">管理者の方は <a href="/admin" class="text-blue-500 hover:underline">管理者画面</a></p>
  </div>
</div>

<!-- メイン画面 -->
<div id="main-view" class="hidden">
  <!-- ヘッダー -->
  <header class="bg-white shadow-sm sticky top-0 z-40">
    <div class="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <span class="text-xl">📦</span>
        <span id="site-name-header" class="font-bold text-gray-800">OrderFlow</span>
      </div>
      <div class="flex items-center gap-4">
        <span id="store-name-display" class="text-sm text-gray-600"></span>
        <button onclick="openCart()" class="btn-primary text-sm py-2 px-4 relative">
          <i class="fas fa-shopping-cart mr-1"></i>カート
          <span id="cart-count" class="hidden">0</span>
        </button>
        <button onclick="logout()" class="text-sm text-gray-500 hover:text-gray-700">
          <i class="fas fa-sign-out-alt"></i>
        </button>
      </div>
    </div>
  </header>

  <!-- タブ -->
  <div class="bg-white border-b">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex gap-1 pt-2">
        <button class="tab-btn active" onclick="showTab('products')" id="tab-products">
          <i class="fas fa-box mr-1"></i>商品一覧
        </button>
        <button class="tab-btn" onclick="showTab('orders')" id="tab-orders">
          <i class="fas fa-list mr-1"></i>発注履歴
        </button>
        <button class="tab-btn" onclick="showTab('notices')" id="tab-notices">
          <i class="fas fa-bell mr-1"></i>お知らせ
        </button>
      </div>
    </div>
  </div>

  <main class="max-w-6xl mx-auto px-4 py-6">

    <!-- 商品一覧タブ -->
    <div id="tab-content-products">
      <div class="flex flex-wrap gap-3 mb-5 items-center">
        <div class="relative flex-1 min-w-[200px]">
          <i class="fas fa-search absolute left-3 top-3 text-gray-400"></i>
          <input id="product-search" type="text" placeholder="商品名・コード・ブランドで検索..." class="w-full border border-gray-300 rounded-lg pl-9 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" oninput="filterProducts()">
        </div>
        <select id="category-filter" class="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" onchange="filterProducts()">
          <option value="">全カテゴリ</option>
        </select>
        <select id="brand-filter" class="border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400" onchange="filterProducts()">
          <option value="">全ブランド</option>
        </select>
      </div>

      <div id="product-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"></div>
      <div id="product-empty" class="hidden text-center py-16 text-gray-400">
        <i class="fas fa-box-open text-5xl mb-3 block"></i>
        商品が見つかりません
      </div>
    </div>

    <!-- 発注履歴タブ -->
    <div id="tab-content-orders" class="hidden">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-bold text-gray-800">発注履歴</h2>
        <button onclick="loadOrders()" class="btn-secondary text-sm py-2">
          <i class="fas fa-sync-alt mr-1"></i>更新
        </button>
      </div>
      <div id="orders-list" class="space-y-3"></div>
      <div id="orders-empty" class="hidden text-center py-16 text-gray-400">
        <i class="fas fa-inbox text-5xl mb-3 block"></i>
        発注履歴がありません
      </div>
    </div>

    <!-- お知らせタブ -->
    <div id="tab-content-notices" class="hidden">
      <h2 class="text-lg font-bold text-gray-800 mb-4">お知らせ</h2>
      <div id="notices-list" class="space-y-3"></div>
      <div id="notices-empty" class="hidden text-center py-16 text-gray-400">
        <i class="fas fa-bell-slash text-5xl mb-3 block"></i>
        お知らせはありません
      </div>
    </div>

  </main>
</div>

<!-- カートモーダル -->
<div id="cart-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-shopping-cart mr-2"></i>発注カート</h2>
      <button onclick="closeCart()" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="cart-items" class="space-y-2 mb-4 max-h-60 overflow-y-auto"></div>
    <div id="cart-empty-msg" class="text-center py-8 text-gray-400 hidden">カートは空です</div>
    <hr class="my-4">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">担当者名</label>
        <input id="orderer-name" type="text" class="w-full border rounded-lg p-2" placeholder="担当者名">
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">納品希望日</label>
        <input id="delivery-date" type="date" class="w-full border rounded-lg p-2">
      </div>
    </div>
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">備考</label>
      <textarea id="order-note" rows="2" class="w-full border rounded-lg p-2 resize-none" placeholder="備考・特記事項"></textarea>
    </div>
    <div class="flex gap-3">
      <button onclick="closeCart()" class="btn-secondary flex-1">キャンセル</button>
      <button onclick="submitOrder()" id="submit-order-btn" class="btn-primary flex-1">
        <i class="fas fa-paper-plane mr-1"></i>発注する
      </button>
    </div>
  </div>
</div>

<!-- 発注詳細モーダル -->
<div id="order-detail-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-file-alt mr-2"></i>発注詳細</h2>
      <button onclick="closeOrderDetail()" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="order-detail-content"></div>
  </div>
</div>

<!-- お知らせ詳細モーダル -->
<div id="notice-detail-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold" id="notice-detail-title"></h2>
      <button onclick="document.getElementById('notice-detail-modal').classList.add('hidden')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="notice-detail-body" class="text-gray-700 leading-relaxed"></div>
    <p id="notice-detail-date" class="text-xs text-gray-400 mt-4"></p>
  </div>
</div>

<!-- 成功トースト -->
<div id="toast" class="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-50 hidden transition-all">
  <i class="fas fa-check-circle mr-2"></i><span id="toast-msg"></span>
</div>

<script>
// ============ 状態管理 ============
let token = localStorage.getItem('store_token');
let storeInfo = JSON.parse(localStorage.getItem('store_info') || 'null');
let products = [];
let cart = {}; // productId -> quantity
let orders = [];
let notices = [];
let siteName = 'OrderFlow';

// ============ 初期化 ============
async function init() {
  await loadSiteSettings();
  if (token && storeInfo) {
    showMain();
  } else {
    document.getElementById('login-view').classList.remove('hidden');
  }
}

async function loadSiteSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    siteName = data.settings.site_name || 'OrderFlow';
    const color = data.settings.primary_color || '#2563eb';
    document.documentElement.style.setProperty('--primary', color);
    document.getElementById('site-name-login').textContent = siteName;
    const h = document.getElementById('site-name-header');
    if (h) h.textContent = siteName;
    document.title = siteName + ' - 発注ポータル';
  } catch {}
}

// ============ 認証 ============
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const login_id = document.getElementById('login-id').value;
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');

  try {
    const res = await fetch('/api/auth/store/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ login_id, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      errEl.textContent = data.error || 'ログインに失敗しました';
      errEl.classList.remove('hidden');
      return;
    }
    token = data.token;
    storeInfo = data.store;
    localStorage.setItem('store_token', token);
    localStorage.setItem('store_info', JSON.stringify(storeInfo));
    showMain();
  } catch {
    errEl.textContent = 'ネットワークエラーが発生しました';
    errEl.classList.remove('hidden');
  }
});

function logout() {
  if (!confirm('ログアウトしますか？')) return;
  token = null; storeInfo = null;
  localStorage.removeItem('store_token');
  localStorage.removeItem('store_info');
  location.reload();
}

function showMain() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('main-view').classList.remove('hidden');
  if (storeInfo) {
    const disp = storeInfo.store_name + (storeInfo.section_name ? ' / ' + storeInfo.section_name : '');
    document.getElementById('store-name-display').textContent = disp;
  }
  const h = document.getElementById('site-name-header');
  if (h) h.textContent = siteName;
  loadProducts();
  loadNotices();
}

// ============ タブ ============
function showTab(tab) {
  ['products','orders','notices'].forEach(t => {
    document.getElementById('tab-content-' + t).classList.toggle('hidden', t !== tab);
    document.getElementById('tab-' + t).classList.toggle('active', t === tab);
  });
  if (tab === 'orders') loadOrders();
  if (tab === 'notices') loadNotices();
}

// ============ 商品 ============
async function loadProducts() {
  const res = await apiFetch('/api/store/products');
  if (!res.ok) return;
  const data = await res.json();
  products = data.products || [];

  // カテゴリ・ブランドフィルター生成
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))];
  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const catSel = document.getElementById('category-filter');
  const brandSel = document.getElementById('brand-filter');
  catSel.innerHTML = '<option value="">全カテゴリ</option>';
  brandSel.innerHTML = '<option value="">全ブランド</option>';
  categories.sort().forEach(c => catSel.innerHTML += \`<option>\${c}</option>\`);
  brands.sort().forEach(b => brandSel.innerHTML += \`<option>\${b}</option>\`);

  renderProducts(products);
}

function filterProducts() {
  const q = document.getElementById('product-search').value.toLowerCase();
  const cat = document.getElementById('category-filter').value;
  const brand = document.getElementById('brand-filter').value;
  const filtered = products.filter(p => {
    const matchQ = !q || [p.product_name, p.product_code, p.brand, p.category, p.barcode].some(v => v && v.toLowerCase().includes(q));
    const matchCat = !cat || p.category === cat;
    const matchBrand = !brand || p.brand === brand;
    return matchQ && matchCat && matchBrand;
  });
  renderProducts(filtered);
}

function renderProducts(list) {
  const grid = document.getElementById('product-grid');
  const empty = document.getElementById('product-empty');
  if (list.length === 0) {
    grid.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  grid.innerHTML = list.map(p => {
    const qty = cart[p.id] || 0;
    const selected = qty > 0 ? 'selected' : '';
    return \`
    <div class="card product-card p-4 \${selected}" id="pc-\${p.id}" onclick="toggleProduct(\${p.id})">
      <div class="flex justify-between items-start mb-2">
        <div class="flex gap-2 flex-wrap">
          \${p.is_new ? '<span class="badge bg-red-100 text-red-700">NEW</span>' : ''}
          \${p.category ? \`<span class="badge bg-blue-50 text-blue-700">\${p.category}</span>\` : ''}
        </div>
        \${qty > 0 ? \`<i class="fas fa-check-circle text-blue-500"></i>\` : ''}
      </div>
      <p class="font-bold text-gray-800 mb-1">\${p.product_name}</p>
      \${p.brand ? \`<p class="text-xs text-gray-500 mb-1">\${p.brand}</p>\` : ''}
      \${p.product_code ? \`<p class="text-xs text-gray-400">コード: \${p.product_code}</p>\` : ''}
      <div class="mt-3 flex items-center gap-2" onclick="event.stopPropagation()">
        <label class="text-xs text-gray-600">数量</label>
        <button onclick="setQty(\${p.id}, (cart[\${p.id}]||0)-1)" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-bold">-</button>
        <input class="qty-input" type="number" min="0" value="\${qty}" onchange="setQty(\${p.id}, parseInt(this.value)||0)" id="qty-\${p.id}">
        <button onclick="setQty(\${p.id}, (cart[\${p.id}]||0)+1)" class="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-bold">+</button>
        <span class="text-xs text-gray-500">\${p.unit || '個'}</span>
      </div>
    </div>\`;
  }).join('');
}

function toggleProduct(id) {
  const qty = cart[id] || 0;
  setQty(id, qty === 0 ? 1 : 0);
}

function setQty(id, qty) {
  qty = Math.max(0, qty);
  if (qty === 0) delete cart[id];
  else cart[id] = qty;
  updateCartCount();
  const card = document.getElementById('pc-' + id);
  if (card) {
    card.classList.toggle('selected', qty > 0);
    const icon = card.querySelector('.fa-check-circle');
    const checkHtml = '<i class="fas fa-check-circle text-blue-500"></i>';
    const topDiv = card.querySelector('.flex.justify-between');
    if (qty > 0 && topDiv && !icon) topDiv.innerHTML += checkHtml;
    else if (qty === 0 && icon) icon.remove();
  }
  const qtyInput = document.getElementById('qty-' + id);
  if (qtyInput) qtyInput.value = qty;
}

function updateCartCount() {
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  const el = document.getElementById('cart-count');
  if (count > 0) { el.textContent = count; el.classList.remove('hidden'); }
  else el.classList.add('hidden');
}

// ============ カート ============
function openCart() {
  const items = Object.entries(cart);
  const itemsEl = document.getElementById('cart-items');
  const emptyMsg = document.getElementById('cart-empty-msg');

  if (items.length === 0) {
    itemsEl.innerHTML = '';
    emptyMsg.classList.remove('hidden');
  } else {
    emptyMsg.classList.add('hidden');
    itemsEl.innerHTML = items.map(([id, qty]) => {
      const p = products.find(x => x.id == id);
      if (!p) return '';
      return \`
      <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
        <div>
          <p class="font-medium text-sm">\${p.product_name}</p>
          <p class="text-xs text-gray-500">\${p.brand || ''} / \${p.unit || '個'}</p>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-bold text-blue-600">\${qty}\${p.unit || '個'}</span>
          <button onclick="setQty(\${id}, 0); openCart();" class="text-red-400 hover:text-red-600"><i class="fas fa-trash text-xs"></i></button>
        </div>
      </div>\`;
    }).join('');
  }
  document.getElementById('cart-modal').classList.remove('hidden');
}

function closeCart() {
  document.getElementById('cart-modal').classList.add('hidden');
}

async function submitOrder() {
  const items = Object.entries(cart).map(([id, qty]) => ({ product_id: parseInt(id), quantity: qty }));
  if (items.length === 0) { showToast('商品をカートに追加してください', 'error'); return; }

  const btn = document.getElementById('submit-order-btn');
  btn.disabled = true;
  btn.textContent = '送信中...';

  try {
    const res = await apiFetch('/api/store/orders', {
      method: 'POST',
      body: JSON.stringify({
        orderer_name: document.getElementById('orderer-name').value,
        desired_delivery_date: document.getElementById('delivery-date').value,
        note: document.getElementById('order-note').value,
        items,
      }),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error || '発注に失敗しました', 'error'); return; }

    cart = {};
    updateCartCount();
    closeCart();
    showToast(\`発注完了！発注番号: \${data.order_no}\`);
    renderProducts(products);
    document.getElementById('orderer-name').value = '';
    document.getElementById('delivery-date').value = '';
    document.getElementById('order-note').value = '';
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane mr-1"></i>発注する';
  }
}

// ============ 発注履歴 ============
async function loadOrders() {
  const res = await apiFetch('/api/store/orders');
  if (!res.ok) return;
  const data = await res.json();
  orders = data.orders || [];
  renderOrders();
}

const statusLabel = {pending:'未確認',confirmed:'受注確認済',preparing:'出荷準備中',inspecting:'検品中',shipped:'出荷完了',cancelled:'キャンセル'};
const statusBadgeClass = {pending:'status-badge-pending',confirmed:'status-badge-confirmed',preparing:'status-badge-preparing',inspecting:'status-badge-inspecting',shipped:'status-badge-shipped',cancelled:'status-badge-cancelled'};

function renderOrders() {
  const list = document.getElementById('orders-list');
  const empty = document.getElementById('orders-empty');
  if (orders.length === 0) { list.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  list.innerHTML = orders.map(o => \`
    <div class="card p-4 hover:shadow-md transition-shadow cursor-pointer" onclick="showOrderDetail(\${o.id})">
      <div class="flex flex-wrap justify-between items-center gap-2">
        <div>
          <p class="font-bold text-blue-700">\${o.order_no}</p>
          <p class="text-xs text-gray-500 mt-1">\${formatDate(o.created_at)}</p>
        </div>
        <span class="badge \${statusBadgeClass[o.status] || ''}">\${statusLabel[o.status] || o.status}</span>
      </div>
      \${o.desired_delivery_date ? \`<p class="text-xs text-gray-600 mt-2"><i class="fas fa-truck mr-1"></i>納品希望: \${o.desired_delivery_date}</p>\` : ''}
      \${o.note ? \`<p class="text-xs text-gray-500 mt-1 truncate">備考: \${o.note}</p>\` : ''}
    </div>
  \`).join('');
}

async function showOrderDetail(id) {
  const res = await apiFetch(\`/api/store/orders/\${id}\`);
  if (!res.ok) return;
  const { order, items } = await res.json();
  const content = document.getElementById('order-detail-content');
  content.innerHTML = \`
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-3 text-sm">
        <div><span class="text-gray-500">発注番号</span><p class="font-bold text-blue-700">\${order.order_no}</p></div>
        <div><span class="text-gray-500">ステータス</span><p><span class="badge \${statusBadgeClass[order.status]}">\${statusLabel[order.status]||order.status}</span></p></div>
        <div><span class="text-gray-500">発注日時</span><p>\${formatDate(order.created_at)}</p></div>
        <div><span class="text-gray-500">担当者</span><p>\${order.orderer_name || '-'}</p></div>
        \${order.desired_delivery_date ? \`<div><span class="text-gray-500">納品希望日</span><p>\${order.desired_delivery_date}</p></div>\` : ''}
        \${order.worker_name ? \`<div><span class="text-gray-500">担当者(管理側)</span><p>\${order.worker_name}</p></div>\` : ''}
      </div>
      \${order.note ? \`<div class="bg-gray-50 p-3 rounded-lg text-sm"><p class="text-gray-500 mb-1">備考</p><p>\${order.note}</p></div>\` : ''}
      <h3 class="font-bold text-gray-800 mt-4">発注明細</h3>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead><tr class="bg-gray-50"><th class="p-2 text-left">商品名</th><th class="p-2 text-left">ブランド</th><th class="p-2 text-right">数量</th></tr></thead>
          <tbody>\${items.map(i => \`<tr class="border-b"><td class="p-2">\${i.product_name}</td><td class="p-2 text-gray-500">\${i.brand||'-'}</td><td class="p-2 text-right font-bold">\${i.quantity}\${i.unit||''}</td></tr>\`).join('')}</tbody>
        </table>
      </div>
      \${order.is_completed ? '<div class="bg-green-50 text-green-700 rounded-lg p-3 text-sm font-medium"><i class="fas fa-check-circle mr-2"></i>出荷完了済み</div>' : ''}
    </div>
  \`;
  document.getElementById('order-detail-modal').classList.remove('hidden');
}

function closeOrderDetail() {
  document.getElementById('order-detail-modal').classList.add('hidden');
}

// ============ お知らせ ============
async function loadNotices() {
  const res = await apiFetch('/api/store/notices');
  if (!res.ok) return;
  const data = await res.json();
  notices = data.notices || [];
  renderNotices();
}

function renderNotices() {
  const list = document.getElementById('notices-list');
  const empty = document.getElementById('notices-empty');
  if (notices.length === 0) { list.innerHTML = ''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');
  const typeClass = {general:'notice-general',important:'notice-important',info:'notice-info'};
  const typeIcon = {general:'fas fa-info-circle text-blue-500',important:'fas fa-exclamation-circle text-red-500',info:'fas fa-check-circle text-green-500'};
  list.innerHTML = notices.map(n => \`
    <div class="card p-4 \${typeClass[n.notice_type]||'notice-general'} cursor-pointer hover:shadow-md transition-shadow" onclick="showNoticeDetail(\${n.id})">
      <div class="flex items-start gap-3">
        <i class="\${typeIcon[n.notice_type]||typeIcon.general} mt-0.5"></i>
        <div>
          <p class="font-bold text-gray-800">\${n.title}</p>
          \${n.message ? \`<p class="text-sm text-gray-600 mt-1">\${n.message}</p>\` : ''}
          <p class="text-xs text-gray-400 mt-2">\${formatDate(n.created_at)}</p>
        </div>
      </div>
    </div>
  \`).join('');
}

function showNoticeDetail(id) {
  const n = notices.find(x => x.id === id);
  if (!n) return;
  document.getElementById('notice-detail-title').textContent = n.title;
  document.getElementById('notice-detail-body').innerHTML = (n.body || n.message || '').replace(/\\n/g,'<br>');
  document.getElementById('notice-detail-date').textContent = formatDate(n.created_at);
  document.getElementById('notice-detail-modal').classList.remove('hidden');
}

// ============ ユーティリティ ============
async function apiFetch(url, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  if (token) headers['Authorization'] = 'Bearer ' + token;
  return fetch(url, { ...opts, headers });
}

function formatDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleString('ja-JP', {year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.className = \`fixed bottom-6 right-6 \${type==='error'?'bg-red-600':'bg-green-600'} text-white px-5 py-3 rounded-xl shadow-lg z-50 transition-all\`;
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

function togglePassword(id) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

// 起動
init();
</script>
</body>
</html>`;
}
