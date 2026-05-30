export type Bindings = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  JWT_SECRET?: string;
};

export type Variables = {
  storeId?: number;
  storeName?: string;
  adminId?: number;
  adminUsername?: string;
  userType?: 'store' | 'admin';
};

// 新ステータス体系: 未確認→印刷済→完了 / キャンセル依頼→キャンセル済
export type OrderStatus =
  | 'pending'        // 未確認
  | 'printed'        // 印刷済（旧confirmed/preparing）
  | 'inspecting'     // 検品中
  | 'completed'      // 完了（旧shipped）
  | 'cancel_request' // キャンセル依頼
  | 'cancelled';     // キャンセル済

export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: '未確認',
  printed: '印刷済',
  inspecting: '検品中',
  completed: '完了',
  cancel_request: 'キャンセル依頼',
  cancelled: 'キャンセル済',
};

export const ORDER_STATUS_COLOR: Record<string, string> = {
  pending: '#f59e0b',
  printed: '#3b82f6',
  inspecting: '#ec4899',
  completed: '#10b981',
  cancel_request: '#f97316',
  cancelled: '#6b7280',
};

// 日本時間ユーティリティ
export function nowJST(): string {
  const d = new Date();
  // UTC+9
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.toISOString().replace('T', ' ').slice(0, 19);
}

export function ymdJST(): string {
  const d = new Date();
  const jst = new Date(d.getTime() + 9 * 3600 * 1000);
  return jst.toISOString().slice(0, 10).replace(/-/g, '');
}
