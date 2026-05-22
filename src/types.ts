export type Bindings = {
  DB: D1Database;
  JWT_SECRET?: string;
};

export type Variables = {
  storeId?: number;
  storeName?: string;
  adminId?: number;
  adminUsername?: string;
  userType?: 'store' | 'admin';
};

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'inspecting'
  | 'shipped'
  | 'cancelled';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '未確認',
  confirmed: '受注確認済',
  preparing: '出荷準備中',
  inspecting: '検品中',
  shipped: '出荷完了',
  cancelled: 'キャンセル',
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  preparing: '#8b5cf6',
  inspecting: '#ec4899',
  shipped: '#10b981',
  cancelled: '#6b7280',
};
