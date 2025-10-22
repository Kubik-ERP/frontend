export type TransferStockStatus =
  | 'requested'
  | 'approved'
  | 'shipped'
  | 'received'
  | 'received_with_issue'
  | 'rejected'
  | 'canceled';

export interface ITransferStockUserReference {
  id: number;
  fullname: string | null;
  email: string | null;
}

export interface ITransferStockRecord {
  id: string;
  transactionCode: string;
  storeFromId: string;
  storeToId: string | null;
  status: TransferStockStatus;
  note: string | null;
  requestedBy: number | null;
  requestAt: string | null;
  approvedBy: number | null;
  approvedAt: string | null;
  canceledBy: number | null;
  canceledAt: string | null;
  rejectedBy: number | null;
  rejectedAt: string | null;
  shippedBy: number | null;
  shippedAt: string | null;
  receivedBy: number | null;
  receivedAt: string | null;
  deliveryNote: string | null;
  logisticProvider: string | null;
  trackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
  requestedUser?: ITransferStockUserReference | null;
  approvedUser?: ITransferStockUserReference | null;
  shippedUser?: ITransferStockUserReference | null;
  receivedUser?: ITransferStockUserReference | null;
  canceledUser?: ITransferStockUserReference | null;
  rejectedUser?: ITransferStockUserReference | null;
}

export interface ITransferStockListPayload {
  items: ITransferStockRecord[];
  meta: IPageMeta;
}

export interface ITransferStockListResponse extends IDefaultResponseFetch {
  data?: ITransferStockListPayload;
  result?: ITransferStockListPayload;
}

export interface ITransferStockMutationResponse<T = ITransferStockRecord> extends IDefaultResponseFetch {
  data?: T;
  result?: T;
}

export interface ITransferStockListParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

export interface ITransferStockItemOption {
  id: string;
  name: string;
  sku: string;
  stockQuantity: number;
}

export interface ITransferStockItemListPayload {
  items: ITransferStockItemOption[];
  meta: IPageMeta;
}

export interface ITransferStockItemListResponse extends IDefaultResponseFetch {
  data?: ITransferStockItemListPayload;
  result?: ITransferStockItemListPayload;
}

export interface ITransferStockItemListRequest {
  storeToId: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ITransferStockCreateItemPayload {
  itemId: string;
  qty: number;
}

export interface ITransferStockCreatePayload {
  storeToId: string;
  note?: string | null;
  items: ITransferStockCreateItemPayload[];
}

export interface ITransferStockRequestPayload {
  storeToId?: string;
  note?: string | null;
  items: ITransferStockCreateItemPayload[];
}

export interface ITransferStockFormItem {
  itemId: string;
  name: string;
  sku: string;
  stockQuantity: number;
  qty: number;
}
