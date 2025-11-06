// Base interfaces for pagination
export interface ITransferStockMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Base transfer stock item (from list API)
export interface ITransferStockItem {
  id: string;
  storeFromId: string;
  storeToId: string;
  storeCreatedBy: string;
  transactionCode: string;
  status: 'drafted' | 'approved' | 'shipped' | 'received' | 'rejected' | 'canceled';
  note?: string;
  draftedBy: number;
  draftedAt: string;
  approvedBy: number | null;
  approvedAt: string | null;
  canceledBy: number | null;
  canceledAt: string | null;
  canceledNote: string | null;
  rejectedBy: number | null;
  rejectedAt: string | null;
  rejectedNote: string | null;
  shippedBy: number | null;
  shippedAt: string | null;
  receivedBy: number | null;
  receivedAt: string | null;
  deliveryNote: string | null;
  logisticProvider: string | null;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  draftedUser: {
    id: number;
    fullname: string;
    email: string;
  };
  approvedUser: {
    id: number;
    fullname: string;
    email: string;
  } | null;
  shippedUser: {
    id: number;
    fullname: string;
    email: string;
  } | null;
  receivedUser: {
    id: number;
    fullname: string;
    email: string;
  } | null;
  canceledUser: {
    id: number;
    fullname: string;
    email: string;
  } | null;
  rejectedUser: {
    id: number;
    fullname: string;
    email: string;
  } | null;
}

// Transfer stock detail (same structure as list item)
export type ITransferStockDetail = ITransferStockItem;

// Response interfaces
export interface ITransferStockListResponse {
  statusCode: number;
  message: string;
  data: {
    items: ITransferStockItem[];
    meta: ITransferStockMeta;
  };
}

export interface ITransferStockDetailResponse {
  statusCode: number;
  message: string;
  data: ITransferStockDetail;
}

export interface ITransferStockCreateResponse {
  statusCode: number;
  message: string;
  data: ITransferStockDetail;
}

export interface ITransferStockActionResponse {
  statusCode: number;
  message: string;
  data?: Record<string, unknown>;
}

// Create Transfer Stock Payload
export interface ITransferStockCreatePayload {
  store_to_id: string;
  items: Array<{
    itemId: string;
    qty: number;
  }>;
  note?: string;
}

// Update Transfer Stock Payload
export interface ITransferStockUpdatePayload {
  transfer_stock_id: string;
  store_to_id: string;
  items: Array<{
    itemId: string;
    qty: number;
  }>;
  note?: string;
}

// Change Status Payloads
export interface ITransferStockApprovePayload {
  status: 'approve';
}

export interface ITransferStockCancelPayload {
  status: 'cancel';
  note: string;
}

export interface ITransferStockShipPayload {
  status: 'ship';
  logistic_provider?: string;
  tracking_number?: string;
  delivery_note?: string;
}

export interface ITransferStockReceivePayload {
  status: 'receive';
}

export interface ITransferStockRejectPayload {
  status: 'reject';
  note: string;
}

// Request query params
export interface ITransferStockListRequestQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  status?: string;
  fromStoreId?: string;
  toStoreId?: string;
}

// Store state interface
export interface ITransferStockStateStore {
  transferStock_data: ITransferStockDetail | null;
  transferStock_isLoading: boolean;
  transferStock_lists: {
    items: ITransferStockItem[];
    meta: ITransferStockMeta;
  } | null;
}