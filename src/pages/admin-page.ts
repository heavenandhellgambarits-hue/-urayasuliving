export function getAdminPage(): string {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OrderFlow - 管理者画面</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
<style>
  :root{--primary:#2563eb;--sidebar:#1e293b}
  body{font-family:'Noto Sans JP',sans-serif}
  .sidebar{width:240px;background:var(--sidebar);color:#fff;min-height:100vh;position:fixed;top:0;left:0;z-index:30;transition:transform .3s}
  .sidebar-item{display:flex;align-items:center;gap:.75rem;padding:.65rem 1.25rem;border-radius:.5rem;cursor:pointer;transition:background .15s;font-size:.9rem;color:#cbd5e1}
  .sidebar-item:hover,.sidebar-item.active{background:rgba(255,255,255,.1);color:#fff}
  .sidebar-item.active{background:var(--primary);color:#fff}
  .main-content{margin-left:240px;padding:1.5rem;min-height:100vh;background:#f1f5f9}
  .card{background:#fff;border-radius:.75rem;box-shadow:0 1px 4px rgba(0,0,0,.08)}
  .btn-primary{background:var(--primary);color:#fff;padding:.5rem 1.25rem;border-radius:.5rem;font-weight:600;cursor:pointer;transition:opacity .2s;border:none}
  .btn-primary:hover{opacity:.85}
  .btn-secondary{background:#e5e7eb;color:#374151;padding:.5rem 1.25rem;border-radius:.5rem;font-weight:600;cursor:pointer;border:none}
  .btn-danger{background:#ef4444;color:#fff;padding:.5rem 1.25rem;border-radius:.5rem;font-weight:600;cursor:pointer;border:none}
  .btn-success{background:#10b981;color:#fff;padding:.5rem 1.25rem;border-radius:.5rem;font-weight:600;cursor:pointer;border:none}
  .badge{display:inline-block;padding:2px 10px;border-radius:999px;font-size:.75rem;font-weight:600}
  .form-input{width:100%;border:1px solid #d1d5db;border-radius:.5rem;padding:.6rem .75rem;font-size:.9rem}
  .form-input:focus{outline:none;ring:2px;border-color:var(--primary)}
  .form-label{display:block;font-size:.875rem;font-weight:500;color:#374151;margin-bottom:.25rem}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:50;display:flex;align-items:center;justify-content:center}
  .modal-box{background:#fff;border-radius:1rem;padding:2rem;max-width:640px;width:95%;max-height:90vh;overflow-y:auto}
  .status-badge-pending{background:#fef3c7;color:#92400e}
  .status-badge-confirmed{background:#dbeafe;color:#1e40af}
  .status-badge-preparing{background:#ede9fe;color:#5b21b6}
  .status-badge-inspecting{background:#fce7f3;color:#9d174d}
  .status-badge-shipped{background:#d1fae5;color:#065f46}
  .status-badge-cancelled{background:#f3f4f6;color:#374151}
  table{width:100%;border-collapse:collapse}
  th{padding:.6rem .75rem;background:#f8fafc;text-align:left;font-size:.8rem;font-weight:600;color:#64748b;border-bottom:1px solid #e2e8f0}
  td{padding:.7rem .75rem;border-bottom:1px solid #f1f5f9;font-size:.875rem}
  tr:hover td{background:#f8fafc}
  .section-hidden{display:none}
  @media(max-width:768px){
    .sidebar{transform:translateX(-100%)}
    .sidebar.open{transform:translateX(0)}
    .main-content{margin-left:0}
  }
</style>
</head>
<body class="bg-slate-100">

<!-- サイドバー -->
<aside class="sidebar" id="sidebar">
  <div class="p-5 border-b border-slate-700">
    <div class="flex items-center gap-2">
      <span class="text-2xl">📦</span>
      <div>
        <p id="admin-site-name" class="font-bold text-white text-sm">OrderFlow</p>
        <p class="text-xs text-slate-400">管理者画面</p>
      </div>
    </div>
  </div>
  <nav class="p-3 space-y-1">
    <div class="sidebar-item active" onclick="showSection('dashboard')" id="nav-dashboard">
      <i class="fas fa-tachometer-alt w-4"></i>ダッシュボード
    </div>
    <div class="sidebar-item" onclick="showSection('orders')" id="nav-orders">
      <i class="fas fa-clipboard-list w-4"></i>受注管理
    </div>
    <div class="sidebar-item" onclick="showSection('products')" id="nav-products">
      <i class="fas fa-box w-4"></i>商品マスタ
    </div>
    <div class="sidebar-item" onclick="showSection('stores')" id="nav-stores">
      <i class="fas fa-store w-4"></i>発注元マスタ
    </div>
    <div class="sidebar-item" onclick="showSection('notices')" id="nav-notices">
      <i class="fas fa-bell w-4"></i>お知らせ管理
    </div>
    <div class="sidebar-item" onclick="showSection('email')" id="nav-email">
      <i class="fas fa-envelope w-4"></i>メール設定
    </div>
    <div class="sidebar-item" onclick="showSection('settings')" id="nav-settings">
      <i class="fas fa-cog w-4"></i>システム設定
    </div>
    <hr class="border-slate-700 my-2">
    <div class="sidebar-item" onclick="logout()">
      <i class="fas fa-sign-out-alt w-4"></i>ログアウト
    </div>
  </nav>
</aside>

<!-- ログイン -->
<div id="login-view" class="min-h-screen flex items-center justify-center p-4 bg-slate-100">
  <div class="card p-8 w-full max-w-md">
    <div class="text-center mb-8">
      <div class="text-5xl mb-3">🔐</div>
      <h1 class="text-2xl font-bold text-gray-800">管理者ログイン</h1>
      <p id="admin-site-name-login" class="text-gray-500 text-sm mt-1">OrderFlow</p>
    </div>
    <div id="login-error" class="hidden bg-red-50 text-red-700 rounded-lg p-3 mb-4 text-sm"></div>
    <form id="login-form">
      <div class="mb-4">
        <label class="form-label">ユーザー名</label>
        <input id="admin-username" type="text" class="form-input" placeholder="admin" required>
      </div>
      <div class="mb-6">
        <label class="form-label">パスワード</label>
        <input id="admin-password" type="password" class="form-input" placeholder="パスワード" required>
      </div>
      <button type="submit" class="btn-primary w-full py-3 text-base">
        <i class="fas fa-sign-in-alt mr-2"></i>ログイン
      </button>
    </form>
    <p class="text-center text-xs text-gray-400 mt-6"><a href="/" class="text-blue-500 hover:underline">← 発注ポータルへ</a></p>
  </div>
</div>

<!-- メイン -->
<div id="main-view" class="hidden">
  <div class="main-content">
    <!-- ヘッダー -->
    <header class="flex items-center justify-between mb-6">
      <button class="md:hidden btn-secondary p-2" onclick="toggleSidebar()"><i class="fas fa-bars"></i></button>
      <h1 id="section-title" class="text-xl font-bold text-gray-800">ダッシュボード</h1>
      <span id="admin-display" class="text-sm text-gray-500"></span>
    </header>

    <!-- ダッシュボード -->
    <section id="section-dashboard">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="card p-5 cursor-pointer hover:shadow-md" onclick="showSection('orders')">
          <p class="text-xs text-gray-500 mb-1">未確認の発注</p>
          <p id="stat-pending" class="text-3xl font-bold text-amber-500">-</p>
        </div>
        <div class="card p-5 cursor-pointer hover:shadow-md" onclick="showSection('orders')">
          <p class="text-xs text-gray-500 mb-1">対応中</p>
          <p id="stat-preparing" class="text-3xl font-bold text-blue-500">-</p>
        </div>
        <div class="card p-5 cursor-pointer hover:shadow-md" onclick="showSection('orders')">
          <p class="text-xs text-gray-500 mb-1">出荷完了（累計）</p>
          <p id="stat-shipped" class="text-3xl font-bold text-green-500">-</p>
        </div>
        <div class="card p-5">
          <p class="text-xs text-gray-500 mb-1">登録商品数</p>
          <p id="stat-products" class="text-3xl font-bold text-purple-500">-</p>
        </div>
      </div>
      <div class="card p-6">
        <h2 class="font-bold text-gray-800 mb-4">最新の受注</h2>
        <div id="recent-orders" class="space-y-2"></div>
      </div>
    </section>

    <!-- 受注管理 -->
    <section id="section-orders" class="section-hidden">
      <div class="flex flex-wrap gap-3 mb-4 items-center">
        <div class="relative flex-1 min-w-[180px]">
          <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
          <input id="order-search" type="text" placeholder="発注番号・店舗名・担当者検索" class="form-input pl-9" oninput="loadOrders()">
        </div>
        <select id="order-status-filter" class="form-input w-auto" onchange="loadOrders()">
          <option value="">全ステータス</option>
          <option value="pending">未確認</option>
          <option value="confirmed">受注確認済</option>
          <option value="preparing">出荷準備中</option>
          <option value="inspecting">検品中</option>
          <option value="shipped">出荷完了</option>
          <option value="cancelled">キャンセル</option>
        </select>
        <button onclick="loadOrders()" class="btn-secondary"><i class="fas fa-sync-alt"></i></button>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table>
            <thead><tr>
              <th>発注番号</th><th>店舗/部署</th><th>担当者</th><th>納品希望日</th>
              <th>ステータス</th><th>発注日時</th><th>操作</th>
            </tr></thead>
            <tbody id="orders-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 商品マスタ -->
    <section id="section-products" class="section-hidden">
      <div class="flex flex-wrap gap-3 mb-4 items-center">
        <div class="relative flex-1 min-w-[180px]">
          <i class="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
          <input id="product-search-admin" type="text" placeholder="商品名・コード・バーコード検索" class="form-input pl-9" oninput="loadProducts()">
        </div>
        <button onclick="openProductModal()" class="btn-primary"><i class="fas fa-plus mr-1"></i>商品追加</button>
        <button onclick="openImportModal()" class="btn-secondary"><i class="fas fa-file-import mr-1"></i>CSV取込</button>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table>
            <thead><tr>
              <th>カテゴリ</th><th>ブランド</th><th>商品名</th><th>商品コード</th>
              <th>バーコード</th><th>単位</th><th>状態</th><th>操作</th>
            </tr></thead>
            <tbody id="products-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- 発注元マスタ -->
    <section id="section-stores" class="section-hidden">
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-500">発注元（店舗/部署）の管理</p>
        <button onclick="openStoreModal()" class="btn-primary"><i class="fas fa-plus mr-1"></i>発注元追加</button>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table>
            <thead><tr><th>店舗名</th><th>部署名</th><th>電話番号</th><th>ログインID</th><th>テスト</th><th>操作</th></tr></thead>
            <tbody id="stores-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- お知らせ管理 -->
    <section id="section-notices" class="section-hidden">
      <div class="flex justify-between items-center mb-4">
        <p class="text-sm text-gray-500">発注者へのお知らせ管理</p>
        <button onclick="openNoticeModal()" class="btn-primary"><i class="fas fa-plus mr-1"></i>お知らせ追加</button>
      </div>
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table>
            <thead><tr><th>タイトル</th><th>種類</th><th>有効期限</th><th>作成日</th><th>操作</th></tr></thead>
            <tbody id="notices-tbody"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- メール設定 -->
    <section id="section-email" class="section-hidden">
      <div class="card p-6 max-w-xl">
        <h2 class="font-bold text-gray-800 mb-4"><i class="fas fa-envelope mr-2 text-blue-500"></i>メール設定（Resend API）</h2>
        <div class="space-y-4">
          <div>
            <label class="form-label">メイン通知先メールアドレス</label>
            <input id="main-email" type="email" class="form-input" placeholder="admin@example.com">
          </div>
          <div>
            <label class="form-label">サブ通知先メールアドレス（任意）</label>
            <input id="sub-email" type="email" class="form-input" placeholder="sub@example.com">
          </div>
          <div>
            <label class="form-label">Resend APIキー</label>
            <div class="relative">
              <input id="resend-api-key" type="password" class="form-input pr-10" placeholder="re_xxxxx">
              <button type="button" onclick="toggleInputType('resend-api-key')" class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"><i class="fas fa-eye"></i></button>
            </div>
            <p class="text-xs text-gray-400 mt-1">Resend（<a href="https://resend.com" target="_blank" class="text-blue-500">resend.com</a>）でAPIキーを取得してください</p>
          </div>
        </div>
        <div class="flex gap-3 mt-6">
          <button onclick="saveEmailSettings()" class="btn-primary"><i class="fas fa-save mr-1"></i>保存</button>
          <button onclick="sendTestEmail()" class="btn-secondary"><i class="fas fa-paper-plane mr-1"></i>テスト送信</button>
        </div>
      </div>
    </section>

    <!-- システム設定 -->
    <section id="section-settings" class="section-hidden">
      <div class="grid gap-6 max-w-xl">
        <div class="card p-6">
          <h2 class="font-bold text-gray-800 mb-4"><i class="fas fa-cog mr-2 text-gray-500"></i>一般設定</h2>
          <div class="space-y-4">
            <div>
              <label class="form-label">システム名</label>
              <input id="setting-site-name" type="text" class="form-input" placeholder="OrderFlow">
            </div>
            <div>
              <label class="form-label">システム説明文</label>
              <input id="setting-site-description" type="text" class="form-input" placeholder="汎用発注システム">
            </div>
            <div>
              <label class="form-label">テーマカラー</label>
              <div class="flex gap-3 items-center">
                <input id="setting-primary-color" type="color" class="w-12 h-10 rounded cursor-pointer border border-gray-300" value="#2563eb">
                <input id="setting-primary-color-hex" type="text" class="form-input w-32" placeholder="#2563eb" oninput="syncColor(this)">
              </div>
            </div>
          </div>
          <button onclick="saveSettings()" class="btn-primary mt-5"><i class="fas fa-save mr-1"></i>設定を保存</button>
        </div>
        <div class="card p-6">
          <h2 class="font-bold text-gray-800 mb-4"><i class="fas fa-lock mr-2 text-red-500"></i>パスワード変更</h2>
          <div class="space-y-4">
            <div>
              <label class="form-label">現在のパスワード</label>
              <input id="current-password" type="password" class="form-input">
            </div>
            <div>
              <label class="form-label">新しいパスワード</label>
              <input id="new-password" type="password" class="form-input">
            </div>
            <div>
              <label class="form-label">新しいパスワード（確認）</label>
              <input id="confirm-password" type="password" class="form-input">
            </div>
          </div>
          <button onclick="changePassword()" class="btn-danger mt-5"><i class="fas fa-key mr-1"></i>パスワード変更</button>
        </div>
      </div>
    </section>

  </div>
</div>

<!-- 発注詳細モーダル -->
<div id="order-modal" class="modal-overlay hidden">
  <div class="modal-box" style="max-width:800px">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-clipboard-list mr-2"></i>発注詳細</h2>
      <button onclick="closeModal('order-modal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <div id="order-modal-content"></div>
  </div>
</div>

<!-- 商品モーダル -->
<div id="product-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold" id="product-modal-title">商品追加</h2>
      <button onclick="closeModal('product-modal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <form id="product-form" class="space-y-4">
      <input type="hidden" id="product-id">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="form-label">カテゴリ</label><input id="p-category" type="text" class="form-input" placeholder="飲料"></div>
        <div><label class="form-label">ブランド</label><input id="p-brand" type="text" class="form-input" placeholder="メーカー名"></div>
      </div>
      <div><label class="form-label">商品名 <span class="text-red-500">*</span></label><input id="p-name" type="text" class="form-input" required></div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="form-label">商品コード</label><input id="p-code" type="text" class="form-input" placeholder="SKU-001"></div>
        <div><label class="form-label">バーコード（JAN等）</label><input id="p-barcode" type="text" class="form-input" placeholder="4901234567890"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="form-label">単位</label><input id="p-unit" type="text" class="form-input" placeholder="個"></div>
        <div class="flex gap-4 items-end pb-2">
          <label class="flex items-center gap-2 cursor-pointer"><input id="p-is-active" type="checkbox" checked class="w-4 h-4"> <span class="text-sm">有効</span></label>
          <label class="flex items-center gap-2 cursor-pointer"><input id="p-is-new" type="checkbox" class="w-4 h-4"> <span class="text-sm">NEW</span></label>
        </div>
      </div>
      <div class="flex gap-3 mt-4">
        <button type="button" onclick="closeModal('product-modal')" class="btn-secondary flex-1">キャンセル</button>
        <button type="submit" class="btn-primary flex-1">保存</button>
      </div>
    </form>
  </div>
</div>

<!-- CSV取込モーダル -->
<div id="import-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold"><i class="fas fa-file-import mr-2"></i>商品CSV取込</h2>
      <button onclick="closeModal('import-modal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <p class="text-sm text-gray-600 mb-3">CSV形式: <code class="bg-gray-100 px-2 py-0.5 rounded">category,brand,product_name,product_code,barcode,unit</code></p>
    <textarea id="csv-input" rows="10" class="form-input font-mono text-xs" placeholder="category,brand,product_name,product_code,barcode,unit
飲料,サントリー,プレミアムモルツ,DRK-001,4901777317871,缶"></textarea>
    <div class="flex gap-3 mt-4">
      <button onclick="closeModal('import-modal')" class="btn-secondary flex-1">キャンセル</button>
      <button onclick="importCSV()" class="btn-primary flex-1"><i class="fas fa-upload mr-1"></i>インポート</button>
    </div>
  </div>
</div>

<!-- 発注元モーダル -->
<div id="store-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold" id="store-modal-title">発注元追加</h2>
      <button onclick="closeModal('store-modal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <form id="store-form" class="space-y-4">
      <input type="hidden" id="store-id">
      <div class="grid grid-cols-2 gap-4">
        <div><label class="form-label">店舗名 <span class="text-red-500">*</span></label><input id="s-name" type="text" class="form-input" required></div>
        <div><label class="form-label">部署名</label><input id="s-section" type="text" class="form-input"></div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div><label class="form-label">電話番号</label><input id="s-phone" type="text" class="form-input"></div>
        <div><label class="form-label">FAX</label><input id="s-fax" type="text" class="form-input"></div>
      </div>
      <div><label class="form-label">ログインID <span class="text-red-500">*</span></label><input id="s-login-id" type="text" class="form-input" required></div>
      <div>
        <label class="form-label">パスワード <span id="s-pw-required" class="text-red-500">*</span></label>
        <div class="relative">
          <input id="s-password" type="password" class="form-input pr-10">
          <button type="button" onclick="toggleInputType('s-password')" class="absolute right-3 top-2.5 text-gray-400"><i class="fas fa-eye"></i></button>
        </div>
        <p id="s-pw-note" class="text-xs text-gray-400 mt-1 hidden">変更する場合のみ入力</p>
      </div>
      <label class="flex items-center gap-2 cursor-pointer"><input id="s-is-test" type="checkbox" class="w-4 h-4"> <span class="text-sm">テスト店舗</span></label>
      <div class="flex gap-3 mt-4">
        <button type="button" onclick="closeModal('store-modal')" class="btn-secondary flex-1">キャンセル</button>
        <button type="submit" class="btn-primary flex-1">保存</button>
      </div>
    </form>
  </div>
</div>

<!-- お知らせモーダル -->
<div id="notice-modal" class="modal-overlay hidden">
  <div class="modal-box">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold" id="notice-modal-title">お知らせ追加</h2>
      <button onclick="closeModal('notice-modal')" class="text-gray-400 hover:text-gray-600 text-xl"><i class="fas fa-times"></i></button>
    </div>
    <form id="notice-form" class="space-y-4">
      <input type="hidden" id="notice-id">
      <div><label class="form-label">タイトル <span class="text-red-500">*</span></label><input id="n-title" type="text" class="form-input" required></div>
      <div><label class="form-label">概要（一覧表示用）</label><input id="n-message" type="text" class="form-input" placeholder="短い説明文"></div>
      <div><label class="form-label">本文</label><textarea id="n-body" rows="5" class="form-input resize-none"></textarea></div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="form-label">種類</label>
          <select id="n-type" class="form-input">
            <option value="general">一般</option>
            <option value="important">重要</option>
            <option value="info">情報</option>
          </select>
        </div>
        <div><label class="form-label">有効期限</label><input id="n-expire" type="datetime-local" class="form-input"></div>
      </div>
      <div class="flex gap-3 mt-4">
        <button type="button" onclick="closeModal('notice-modal')" class="btn-secondary flex-1">キャンセル</button>
        <button type="submit" class="btn-primary flex-1">保存</button>
      </div>
    </form>
  </div>
</div>

<!-- トースト -->
<div id="toast" class="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg z-[100] hidden">
  <i class="fas fa-check-circle mr-2"></i><span id="toast-msg"></span>
</div>

<script>
// ============ 状態 ============
let adminToken = localStorage.getItem('admin_token');
let adminInfo = JSON.parse(localStorage.getItem('admin_info') || 'null');
let currentSection = 'dashboard';

// ============ 初期化 ============
async function init() {
  await loadPublicSettings();
  if (adminToken && adminInfo) {
    showMain();
  } else {
    document.getElementById('login-view').classList.remove('hidden');
  }
}

async function loadPublicSettings() {
  try {
    const res = await fetch('/api/settings');
    const data = await res.json();
    const name = data.settings.site_name || 'OrderFlow';
    const color = data.settings.primary_color || '#2563eb';
    document.querySelectorAll('#admin-site-name,#admin-site-name-login').forEach(el => el.textContent = name);
    document.title = name + ' - 管理者画面';
    document.documentElement.style.setProperty('--primary', color);
  } catch {}
}

// ============ 認証 ============
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('admin-username').value;
  const password = document.getElementById('admin-password').value;
  const errEl = document.getElementById('login-error');
  errEl.classList.add('hidden');
  try {
    const res = await fetch('/api/auth/admin/login', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username, password}),
    });
    const data = await res.json();
    if (!res.ok) { errEl.textContent = data.error || 'ログイン失敗'; errEl.classList.remove('hidden'); return; }
    adminToken = data.token;
    adminInfo = data.admin;
    localStorage.setItem('admin_token', adminToken);
    localStorage.setItem('admin_info', JSON.stringify(adminInfo));
    showMain();
  } catch { errEl.textContent = 'ネットワークエラー'; errEl.classList.remove('hidden'); }
});

function logout() {
  if (!confirm('ログアウトしますか？')) return;
  adminToken = null; adminInfo = null;
  localStorage.removeItem('admin_token'); localStorage.removeItem('admin_info');
  location.reload();
}

function showMain() {
  document.getElementById('login-view').classList.add('hidden');
  document.getElementById('main-view').classList.remove('hidden');
  document.getElementById('sidebar').classList.remove('hidden');
  if (adminInfo) document.getElementById('admin-display').textContent = adminInfo.display_name || adminInfo.username;
  loadDashboard();
}

// ============ ナビゲーション ============
function showSection(name) {
  document.querySelectorAll('section[id^="section-"]').forEach(el => el.classList.add('section-hidden'));
  document.querySelectorAll('.sidebar-item').forEach(el => el.classList.remove('active'));
  document.getElementById('section-' + name).classList.remove('section-hidden');
  document.getElementById('nav-' + name)?.classList.add('active');
  const titles = {dashboard:'ダッシュボード',orders:'受注管理',products:'商品マスタ',stores:'発注元マスタ',notices:'お知らせ管理',email:'メール設定',settings:'システム設定'};
  document.getElementById('section-title').textContent = titles[name] || name;
  currentSection = name;
  document.getElementById('sidebar').classList.remove('open');

  if (name === 'orders') loadOrders();
  if (name === 'products') loadProducts();
  if (name === 'stores') loadStores();
  if (name === 'notices') loadNoticesAdmin();
  if (name === 'email') loadEmailSettings();
  if (name === 'settings') loadSettings();
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

// ============ API ============
async function apiFetch(url, opts = {}) {
  const headers = {'Content-Type':'application/json', ...opts.headers};
  if (adminToken) headers['Authorization'] = 'Bearer ' + adminToken;
  const res = await fetch(url, {...opts, headers});
  if (res.status === 401) { logout(); throw new Error('Unauthorized'); }
  return res;
}

// ============ ダッシュボード ============
async function loadDashboard() {
  try {
    const res = await apiFetch('/api/admin/stats');
    const data = await res.json();
    document.getElementById('stat-pending').textContent = data.orders.pending;
    document.getElementById('stat-preparing').textContent = data.orders.preparing;
    document.getElementById('stat-shipped').textContent = data.orders.shipped;
    document.getElementById('stat-products').textContent = data.products;

    const res2 = await apiFetch('/api/admin/orders?status=pending');
    const data2 = await res2.json();
    const recent = (data2.orders || []).slice(0,5);
    const el = document.getElementById('recent-orders');
    if (recent.length === 0) { el.innerHTML = '<p class="text-gray-400 text-sm">未確認の発注はありません</p>'; return; }
    el.innerHTML = recent.map(o => \`
      <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-blue-50" onclick="showSection('orders');setTimeout(()=>showOrderDetail(\${o.id}),300)">
        <div>
          <p class="font-bold text-sm text-blue-700">\${o.order_no}</p>
          <p class="text-xs text-gray-500">\${o.store_name} \${o.section_name||''}</p>
        </div>
        <span class="badge status-badge-\${o.status}">\${statusLabel[o.status]||o.status}</span>
      </div>
    \`).join('');
  } catch {}
}

// ============ 受注管理 ============
const statusLabel = {pending:'未確認',confirmed:'受注確認済',preparing:'出荷準備中',inspecting:'検品中',shipped:'出荷完了',cancelled:'キャンセル'};

async function loadOrders() {
  const search = document.getElementById('order-search')?.value || '';
  const status = document.getElementById('order-status-filter')?.value || '';
  let url = '/api/admin/orders?';
  if (search) url += 'search=' + encodeURIComponent(search) + '&';
  if (status) url += 'status=' + status;

  const res = await apiFetch(url);
  const data = await res.json();
  const tbody = document.getElementById('orders-tbody');
  if (!data.orders || data.orders.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" class="text-center py-8 text-gray-400">発注はありません</td></tr>';
    return;
  }
  tbody.innerHTML = data.orders.map(o => \`
    <tr>
      <td><span class="font-bold text-blue-700 cursor-pointer hover:underline" onclick="showOrderDetail(\${o.id})">\${o.order_no}</span></td>
      <td>\${o.store_name}<br><span class="text-xs text-gray-400">\${o.section_name||''}</span></td>
      <td>\${o.orderer_name||'-'}</td>
      <td>\${o.desired_delivery_date||'-'}</td>
      <td><span class="badge status-badge-\${o.status}">\${statusLabel[o.status]||o.status}</span></td>
      <td class="text-xs text-gray-500">\${formatDate(o.created_at)}</td>
      <td>
        <select class="text-xs border rounded p-1" onchange="updateStatus(\${o.id}, this.value)">
          \${['pending','confirmed','preparing','inspecting','shipped','cancelled'].map(s => \`<option value="\${s}" \${s===o.status?'selected':''}>\${statusLabel[s]}</option>\`).join('')}
        </select>
        <button onclick="showOrderDetail(\${o.id})" class="text-blue-500 hover:text-blue-700 ml-2 text-xs"><i class="fas fa-eye"></i></button>
      </td>
    </tr>
  \`).join('');
}

async function updateStatus(orderId, status) {
  const res = await apiFetch(\`/api/admin/orders/\${orderId}/status\`, {
    method: 'PUT',
    body: JSON.stringify({status}),
  });
  if (res.ok) showToast('ステータスを更新しました');
  else showToast('更新に失敗しました', 'error');
  loadOrders();
}

async function showOrderDetail(id) {
  const res = await apiFetch(\`/api/admin/orders/\${id}\`);
  const {order, items, inspections} = await res.json();
  const content = document.getElementById('order-modal-content');
  
  const inspectedBarcodes = new Set((inspections||[]).filter(i => i.is_match).map(i => i.barcode_scanned));
  
  content.innerHTML = \`
    <div class="space-y-4">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
        <div><span class="text-gray-500 text-xs">発注番号</span><p class="font-bold text-blue-700">\${order.order_no}</p></div>
        <div><span class="text-gray-500 text-xs">ステータス</span>
          <div class="mt-1">
            <select class="text-xs border rounded p-1" onchange="updateStatus(\${order.id},this.value);document.getElementById('order-modal').classList.add('hidden')">
              \${['pending','confirmed','preparing','inspecting','shipped','cancelled'].map(s => \`<option value="\${s}" \${s===order.status?'selected':''}>\${statusLabel[s]}</option>\`).join('')}
            </select>
          </div>
        </div>
        <div><span class="text-gray-500 text-xs">発注日時</span><p>\${formatDate(order.created_at)}</p></div>
        <div><span class="text-gray-500 text-xs">店舗/部署</span><p>\${order.store_name} \${order.section_name||''}</p></div>
        <div><span class="text-gray-500 text-xs">担当者</span><p>\${order.orderer_name||'-'}</p></div>
        <div><span class="text-gray-500 text-xs">納品希望日</span><p>\${order.desired_delivery_date||'-'}</p></div>
        \${order.worker_name ? \`<div><span class="text-gray-500 text-xs">作業者</span><p>\${order.worker_name}</p></div>\` : ''}
      </div>
      \${order.note ? \`<div class="bg-gray-50 p-3 rounded-lg text-sm"><p class="text-gray-500 text-xs mb-1">備考</p><p>\${order.note}</p></div>\` : ''}
      
      <h3 class="font-bold text-gray-800">発注明細</h3>
      <div class="overflow-x-auto">
        <table class="text-sm">
          <thead><tr><th>商品名</th><th>ブランド</th><th>商品コード</th><th>バーコード</th><th>数量</th><th>検品</th></tr></thead>
          <tbody>\${items.map(i => \`
            <tr>
              <td>\${i.product_name}</td>
              <td class="text-gray-500">\${i.brand||'-'}</td>
              <td class="text-xs text-gray-400">\${i.product_code||'-'}</td>
              <td class="text-xs text-gray-400 font-mono">\${i.barcode||'-'}</td>
              <td class="font-bold text-right">\${i.quantity}\${i.unit||''}</td>
              <td class="text-center">\${i.barcode && inspectedBarcodes.has(i.barcode) ? '<i class="fas fa-check-circle text-green-500"></i>' : '<i class="fas fa-circle text-gray-200"></i>'}</td>
            </tr>
          \`).join('')}</tbody>
        </table>
      </div>
      
      <div class="flex flex-wrap gap-3 mt-4">
        <button onclick="printOrder(\${order.id})" class="btn-secondary text-sm"><i class="fas fa-print mr-1"></i>印刷</button>
        <button onclick="goInspection(\${order.id})" class="btn-primary text-sm"><i class="fas fa-barcode mr-1"></i>検品する</button>
      </div>
    </div>
  \`;
  document.getElementById('order-modal').classList.remove('hidden');
}

function printOrder(id) {
  apiFetch(\`/api/admin/orders/\${id}/printed\`, {method:'PUT'});
  window.print();
}

function goInspection(orderId) {
  closeModal('order-modal');
  window.location.href = '/admin/inspection/' + orderId;
}

// ============ 商品マスタ ============
async function loadProducts() {
  const search = document.getElementById('product-search-admin')?.value || '';
  const res = await apiFetch('/api/admin/products' + (search ? '?search=' + encodeURIComponent(search) : ''));
  const data = await res.json();
  const tbody = document.getElementById('products-tbody');
  if (!data.products || data.products.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" class="text-center py-8 text-gray-400">商品がありません</td></tr>';
    return;
  }
  tbody.innerHTML = data.products.map(p => \`
    <tr>
      <td><span class="badge bg-blue-50 text-blue-700">\${p.category||'-'}</span></td>
      <td class="text-gray-500">\${p.brand||'-'}</td>
      <td class="font-medium">\${p.product_name} \${p.is_new?'<span class="badge bg-red-50 text-red-600 ml-1">NEW</span>':''}</td>
      <td class="text-xs text-gray-400 font-mono">\${p.product_code||'-'}</td>
      <td class="text-xs text-gray-400 font-mono">\${p.barcode||'-'}</td>
      <td>\${p.unit||'個'}</td>
      <td><span class="badge \${p.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}">\${p.is_active ? '有効' : '無効'}</span></td>
      <td>
        <button onclick="openProductModal(\${p.id})" class="text-blue-500 hover:text-blue-700 mr-2 text-sm"><i class="fas fa-edit"></i></button>
        <button onclick="deleteProduct(\${p.id})" class="text-red-400 hover:text-red-600 text-sm"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  \`).join('');
}

async function openProductModal(id = null) {
  document.getElementById('product-modal-title').textContent = id ? '商品編集' : '商品追加';
  document.getElementById('product-id').value = id || '';
  if (id) {
    const res = await apiFetch('/api/admin/products');
    const data = await res.json();
    const p = data.products.find(x => x.id === id);
    if (p) {
      document.getElementById('p-category').value = p.category || '';
      document.getElementById('p-brand').value = p.brand || '';
      document.getElementById('p-name').value = p.product_name || '';
      document.getElementById('p-code').value = p.product_code || '';
      document.getElementById('p-barcode').value = p.barcode || '';
      document.getElementById('p-unit').value = p.unit || '個';
      document.getElementById('p-is-active').checked = !!p.is_active;
      document.getElementById('p-is-new').checked = !!p.is_new;
    }
  } else {
    document.getElementById('product-form').reset();
    document.getElementById('p-unit').value = '個';
    document.getElementById('p-is-active').checked = true;
  }
  document.getElementById('product-modal').classList.remove('hidden');
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('product-id').value;
  const body = {
    category: document.getElementById('p-category').value,
    brand: document.getElementById('p-brand').value,
    product_name: document.getElementById('p-name').value,
    product_code: document.getElementById('p-code').value,
    barcode: document.getElementById('p-barcode').value,
    unit: document.getElementById('p-unit').value || '個',
    is_active: document.getElementById('p-is-active').checked ? 1 : 0,
    is_new: document.getElementById('p-is-new').checked ? 1 : 0,
  };
  const url = id ? \`/api/admin/products/\${id}\` : '/api/admin/products';
  const method = id ? 'PUT' : 'POST';
  const res = await apiFetch(url, {method, body: JSON.stringify(body)});
  if (res.ok) { showToast(id ? '商品を更新しました' : '商品を追加しました'); closeModal('product-modal'); loadProducts(); }
  else showToast('保存に失敗しました', 'error');
});

async function deleteProduct(id) {
  if (!confirm('この商品を無効にしますか？')) return;
  await apiFetch(\`/api/admin/products/\${id}\`, {method:'DELETE'});
  showToast('商品を無効にしました'); loadProducts();
}

function openImportModal() {
  document.getElementById('csv-input').value = '';
  document.getElementById('import-modal').classList.remove('hidden');
}

async function importCSV() {
  const csv = document.getElementById('csv-input').value.trim();
  if (!csv) return;
  const lines = csv.split('\\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = vals[i] || '');
    return obj;
  });
  const res = await apiFetch('/api/admin/products/import', {method:'POST', body: JSON.stringify({rows})});
  const data = await res.json();
  if (res.ok) { showToast(\`\${data.imported}件インポートしました\`); closeModal('import-modal'); loadProducts(); }
  else showToast('インポートに失敗しました', 'error');
}

// ============ 発注元マスタ ============
async function loadStores() {
  const res = await apiFetch('/api/admin/stores');
  const data = await res.json();
  const tbody = document.getElementById('stores-tbody');
  if (!data.stores || data.stores.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400">発注元がありません</td></tr>';
    return;
  }
  tbody.innerHTML = data.stores.map(s => \`
    <tr>
      <td class="font-medium">\${s.store_name}</td>
      <td class="text-gray-500">\${s.section_name||'-'}</td>
      <td class="text-gray-500">\${s.phone||'-'}</td>
      <td class="font-mono text-sm text-blue-600">\${s.login_id}</td>
      <td>\${s.is_test ? '<span class="badge bg-yellow-100 text-yellow-700">テスト</span>' : ''}</td>
      <td>
        <button onclick="openStoreModal(\${s.id})" class="text-blue-500 hover:text-blue-700 mr-2 text-sm"><i class="fas fa-edit"></i></button>
        <button onclick="deleteStore(\${s.id})" class="text-red-400 hover:text-red-600 text-sm"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  \`).join('');
}

let allStores = [];
async function openStoreModal(id = null) {
  document.getElementById('store-modal-title').textContent = id ? '発注元編集' : '発注元追加';
  document.getElementById('store-id').value = id || '';
  const pwNote = document.getElementById('s-pw-note');
  const pwReq = document.getElementById('s-pw-required');
  if (id) {
    const res = await apiFetch('/api/admin/stores');
    const data = await res.json();
    const s = data.stores.find(x => x.id === id);
    if (s) {
      document.getElementById('s-name').value = s.store_name || '';
      document.getElementById('s-section').value = s.section_name || '';
      document.getElementById('s-phone').value = s.phone || '';
      document.getElementById('s-fax').value = s.fax || '';
      document.getElementById('s-login-id').value = s.login_id || '';
      document.getElementById('s-password').value = '';
      document.getElementById('s-is-test').checked = !!s.is_test;
    }
    pwNote.classList.remove('hidden');
    pwReq.classList.add('hidden');
  } else {
    document.getElementById('store-form').reset();
    pwNote.classList.add('hidden');
    pwReq.classList.remove('hidden');
  }
  document.getElementById('store-modal').classList.remove('hidden');
}

document.getElementById('store-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('store-id').value;
  const body = {
    store_name: document.getElementById('s-name').value,
    section_name: document.getElementById('s-section').value,
    phone: document.getElementById('s-phone').value,
    fax: document.getElementById('s-fax').value,
    login_id: document.getElementById('s-login-id').value,
    password: document.getElementById('s-password').value,
    is_test: document.getElementById('s-is-test').checked,
  };
  const url = id ? \`/api/admin/stores/\${id}\` : '/api/admin/stores';
  const method = id ? 'PUT' : 'POST';
  const res = await apiFetch(url, {method, body: JSON.stringify(body)});
  if (res.ok) { showToast(id ? '発注元を更新しました' : '発注元を追加しました'); closeModal('store-modal'); loadStores(); }
  else { const d = await res.json(); showToast(d.error || '保存に失敗しました', 'error'); }
});

async function deleteStore(id) {
  if (!confirm('この発注元を削除しますか？発注履歴は残ります。')) return;
  await apiFetch(\`/api/admin/stores/\${id}\`, {method:'DELETE'});
  showToast('削除しました'); loadStores();
}

// ============ お知らせ管理 ============
async function loadNoticesAdmin() {
  const res = await apiFetch('/api/admin/notices');
  const data = await res.json();
  const tbody = document.getElementById('notices-tbody');
  const typeLabel = {general:'一般',important:'重要',info:'情報'};
  const typeBadge = {general:'bg-blue-50 text-blue-700',important:'bg-red-50 text-red-700',info:'bg-green-50 text-green-700'};
  if (!data.notices || data.notices.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-400">お知らせがありません</td></tr>';
    return;
  }
  tbody.innerHTML = data.notices.map(n => \`
    <tr>
      <td class="font-medium">\${n.title}</td>
      <td><span class="badge \${typeBadge[n.notice_type]||typeBadge.general}">\${typeLabel[n.notice_type]||n.notice_type}</span></td>
      <td class="text-xs text-gray-400">\${n.expire_at ? formatDate(n.expire_at) : '無期限'}</td>
      <td class="text-xs text-gray-400">\${formatDate(n.created_at)}</td>
      <td>
        <button onclick="openNoticeModal(\${n.id})" class="text-blue-500 hover:text-blue-700 mr-2 text-sm"><i class="fas fa-edit"></i></button>
        <button onclick="deleteNotice(\${n.id})" class="text-red-400 hover:text-red-600 text-sm"><i class="fas fa-trash"></i></button>
      </td>
    </tr>
  \`).join('');
}

let allNotices = [];
async function openNoticeModal(id = null) {
  document.getElementById('notice-modal-title').textContent = id ? 'お知らせ編集' : 'お知らせ追加';
  document.getElementById('notice-id').value = id || '';
  if (id) {
    const res = await apiFetch('/api/admin/notices');
    const data = await res.json();
    const n = data.notices.find(x => x.id === id);
    if (n) {
      document.getElementById('n-title').value = n.title || '';
      document.getElementById('n-message').value = n.message || '';
      document.getElementById('n-body').value = n.body || '';
      document.getElementById('n-type').value = n.notice_type || 'general';
      document.getElementById('n-expire').value = n.expire_at ? n.expire_at.slice(0,16) : '';
    }
  } else {
    document.getElementById('notice-form').reset();
  }
  document.getElementById('notice-modal').classList.remove('hidden');
}

document.getElementById('notice-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const id = document.getElementById('notice-id').value;
  const body = {
    title: document.getElementById('n-title').value,
    message: document.getElementById('n-message').value,
    body: document.getElementById('n-body').value,
    notice_type: document.getElementById('n-type').value,
    expire_at: document.getElementById('n-expire').value || null,
  };
  const url = id ? \`/api/admin/notices/\${id}\` : '/api/admin/notices';
  const method = id ? 'PUT' : 'POST';
  const res = await apiFetch(url, {method, body: JSON.stringify(body)});
  if (res.ok) { showToast(id ? 'お知らせを更新しました' : 'お知らせを追加しました'); closeModal('notice-modal'); loadNoticesAdmin(); }
  else showToast('保存に失敗しました', 'error');
});

async function deleteNotice(id) {
  if (!confirm('このお知らせを削除しますか？')) return;
  await apiFetch(\`/api/admin/notices/\${id}\`, {method:'DELETE'});
  showToast('削除しました'); loadNoticesAdmin();
}

// ============ メール設定 ============
async function loadEmailSettings() {
  const res = await apiFetch('/api/admin/email-settings');
  const data = await res.json();
  if (data.settings) {
    document.getElementById('main-email').value = data.settings.main_email || '';
    document.getElementById('sub-email').value = data.settings.sub_email || '';
    document.getElementById('resend-api-key').value = data.settings.resend_api_key || '';
  }
}

async function saveEmailSettings() {
  const body = {
    main_email: document.getElementById('main-email').value,
    sub_email: document.getElementById('sub-email').value,
    resend_api_key: document.getElementById('resend-api-key').value,
  };
  const res = await apiFetch('/api/admin/email-settings', {method:'PUT', body: JSON.stringify(body)});
  if (res.ok) showToast('メール設定を保存しました');
  else showToast('保存に失敗しました', 'error');
}

async function sendTestEmail() {
  const res = await apiFetch('/api/admin/email-settings/test', {method:'POST'});
  const data = await res.json();
  if (res.ok) showToast('テストメールを送信しました');
  else showToast(data.error || 'テスト送信に失敗しました', 'error');
}

// ============ システム設定 ============
async function loadSettings() {
  const res = await apiFetch('/api/admin/settings');
  const data = await res.json();
  const s = data.settings;
  document.getElementById('setting-site-name').value = s.site_name || '';
  document.getElementById('setting-site-description').value = s.site_description || '';
  const color = s.primary_color || '#2563eb';
  document.getElementById('setting-primary-color').value = color;
  document.getElementById('setting-primary-color-hex').value = color;
}

document.getElementById('setting-primary-color').addEventListener('input', (e) => {
  document.getElementById('setting-primary-color-hex').value = e.target.value;
  document.documentElement.style.setProperty('--primary', e.target.value);
});

function syncColor(input) {
  const val = input.value;
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    document.getElementById('setting-primary-color').value = val;
    document.documentElement.style.setProperty('--primary', val);
  }
}

async function saveSettings() {
  const body = {
    site_name: document.getElementById('setting-site-name').value,
    site_description: document.getElementById('setting-site-description').value,
    primary_color: document.getElementById('setting-primary-color').value,
  };
  const res = await apiFetch('/api/admin/settings', {method:'PUT', body: JSON.stringify(body)});
  if (res.ok) {
    showToast('設定を保存しました');
    document.querySelectorAll('#admin-site-name').forEach(el => el.textContent = body.site_name);
    document.title = body.site_name + ' - 管理者画面';
  } else showToast('保存に失敗しました', 'error');
}

async function changePassword() {
  const current = document.getElementById('current-password').value;
  const newPw = document.getElementById('new-password').value;
  const confirm = document.getElementById('confirm-password').value;
  if (!current || !newPw) { showToast('パスワードを入力してください', 'error'); return; }
  if (newPw !== confirm) { showToast('新しいパスワードが一致しません', 'error'); return; }
  const res = await apiFetch('/api/admin/admins/password', {method:'PUT', body: JSON.stringify({current_password:current, new_password:newPw})});
  const data = await res.json();
  if (res.ok) { showToast('パスワードを変更しました'); document.getElementById('current-password').value = ''; document.getElementById('new-password').value = ''; document.getElementById('confirm-password').value = ''; }
  else showToast(data.error || 'パスワード変更に失敗しました', 'error');
}

// ============ ユーティリティ ============
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

function formatDate(str) {
  if (!str) return '-';
  return new Date(str).toLocaleString('ja-JP', {year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.className = \`fixed bottom-6 right-6 \${type==='error'?'bg-red-600':'bg-green-600'} text-white px-5 py-3 rounded-xl shadow-lg z-[100]\`;
  document.getElementById('toast-msg').textContent = msg;
  toast.classList.remove('hidden');
  setTimeout(() => toast.classList.add('hidden'), 3500);
}

function toggleInputType(id) {
  const el = document.getElementById(id);
  el.type = el.type === 'password' ? 'text' : 'password';
}

// 起動
init();
</script>
</body>
</html>`;
}
