// Base interfaces for pagination
export interface ITransferStockMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Base transfer stock item (from list API)
// export interface ITransferStockItem {
//   id: string;
//   storeFromId: string;
//   storeToId: string;
//   storeCreatedBy: string;
//   transactionCode: string;
//   status: 'drafted' | 'approved' | 'shipped' | 'received' | 'rejected' | 'canceled';
//   note?: string;
//   draftedBy: number;
//   draftedAt: string;
//   approvedBy: number | null;
//   approvedAt: string | null;
//   canceledBy: number | null;
//   canceledAt: string | null;
//   canceledNote: string | null;
//   rejectedBy: number | null;
//   rejectedAt: string | null;
//   rejectedNote: string | null;
//   shippedBy: number | null;
//   shippedAt: string | null;
//   receivedBy: number | null;
//   receivedAt: string | null;
//   deliveryNote: string | null;
//   logisticProvider: string | null;
//   trackingNumber: string | null;
//   createdAt: string;
//   updatedAt: string;
//   draftedUser: {
//     id: number;
//     fullname: string;
//     email: string;
//   };
//   approvedUser: {
//     id: number;
//     fullname: string;
//     email: string;
//   } | null;
//   shippedUser: {
//     id: number;
//     fullname: string;
//     email: string;
//   } | null;
//   receivedUser: {
//     id: number;
//     fullname: string;
//     email: string;
//   } | null;
//   canceledUser: {
//     id: number;
//     fullname: string;
//     email: string;
//   } | null;
//   rejectedUser: {
//     id: number;
//     fullname: string;
//     email: string;
//   } | null;
// }

export interface ITransferStock {
  id: string;
  storeFromId: string;
  storeToId: string;
  storeCreatedBy: string;
  transactionCode: string;
  status: string;
  note: string;
  draftedBy: number;
  draftedAt: Date;
  approvedBy: null;
  approvedAt: null;
  canceledBy: null;
  canceledAt: null;
  canceledNote: null;
  shippedBy: null;
  shippedAt: null;
  receivedBy: null;
  receivedAt: null;
  deliveryNote: null;
  logisticProvider: null;
  trackingNumber: null;
  createdAt: Date;
  updatedAt: Date;
  storeFrom: Store;
  storeTo: Store;
  draftedUser: DraftedUser;
  approvedUser: null;
  shippedUser: null;
  receivedUser: null;
  canceledUser: null;
  transferStockItems: ITransferStockItem[];
}

export interface DraftedUser {
  id: number;
  fullname: string;
  email: string;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  phoneNumber: string;
  photo: string;
  city: string;
  postalCode: string;
  building: string;
  email: string;
  businessType: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITransferStockItem {
  id: string;
  transferStockId: string;
  masterInventoryItemId: string;
  hasDestinationProduct: boolean;
  qtyReserved: number;
  qtyReceived: number;
  unitPrice: Subtotal;
  subtotal: Subtotal;
  status: string;
  note: null;
  createdAt: Date;
  updatedAt: Date;
  masterInventoryItems: IMasterInventoryItems;
}

export interface IMasterInventoryItems {
  id: string;
  name: string;
  brandId: null;
  barcode: string;
  sku: string;
  categoryId: string;
  unit: string;
  notes: string;
  stockQuantity: number;
  reorderLevel: number;
  minimumStockQuantity: number;
  expiryDate: null;
  storageLocationId: null;
  pricePerUnit: Subtotal;
  supplierId: string;
  createdAt: Date;
  updatedAt: Date;
  storeId: string;
  priceGrosir: Subtotal;
  markup: null;
  margin: Subtotal;
}

export interface Subtotal {
  s: number;
  e: number;
  d: number[];
}

// Transfer stock detail (same structure as list item)
export type ITransferStockDetail = ITransferStock;

// Response interfaces
export interface ITransferStockListResponse {
  statusCode: number;
  message: string;
  data: {
    items: ITransferStock[];
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
  logistic_provider: string;
  tracking_number: string;
  delivery_note?: string;
}

export interface ITransferStockReceivePayload {
  status: 'received' | 'received_with_issue';
  items: Array<{
    itemId: string;
    qty_shipped: number;
    qty_received: number;
    notes?: string;
  }>;
}

export interface ITransferStockRejectPayload {
  status: 'reject';
  note: string;
}

// Response for check product destination
export type ITransferStockCheckProductDestinationResponse = IDefaultResponseFetch;

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
    items: ITransferStock[];
    meta: ITransferStockMeta;
  } | null;
}
