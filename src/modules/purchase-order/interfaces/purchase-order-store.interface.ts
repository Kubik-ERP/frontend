// Base interfaces for pagination
export interface IPurchaseOrderMeta {
  currentPage: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Base purchase order item
export interface IPurchaseOrderItem {
  id: string;
  supplierName: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Purchase order detail
export interface IPurchaseOrderDetail {
  id: string;
  createdAt: string;
  updatedAt: string;
  orderNumber: string;
  totalPrice: number;
  masterSupplierId: string;
  cancelReason?: string;
  cancelledAt?: string;
  orderDate: string;
  orderStatus: string;
  storeId: string;
  supplierInfo: {
    address: string;
    phoneNumber: string;
    supplierName: string;
    contactPerson: string;
  };
  deliveryDate?: string;
  deliveryNumber?: string;
  shippedAt?: string;
  receivedAt?: string;
  paidAt?: string;
  purchaseOrderItems: Array<{
    id: string;
    createdAt: string;
    updatedAt?: string;
    purchaseOrderId: string;
    masterInventoryItemId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    actualQuantity?: number;
    itemInfo: {
      sku: string;
      name: string;
      unit: string;
      brandName: string;
      barcode?: string;
    };
  }>;
  receiver: {
    id: string;
    fullname: string;
  }
}

// Response interfaces
export interface IPurchaseOrderResponse {
  status: boolean;
  message: string;
  data: {
    items: IPurchaseOrderItem[];
    meta: IPurchaseOrderMeta;
  };
}

export interface IPurchaseOrderDetailResponse {
  status: boolean;
  message: string;
  data: IPurchaseOrderDetail;
}

export interface IPurchaseOrderActionResponse {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
}

// Request query params
export interface IPurchaseOrderListRequestQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

// Form data interfaces
export interface IPurchaseOrderProductItem {
  id: string;
  masterItemId: string;
  quantity: number;
}

export interface IPurchaseOrderCreateFormData {
  supplierId: string;
  orderDate: string;
  productItems: IPurchaseOrderProductItem[];
}

export interface IPurchaseOrderUpdateFormData {
  supplierId: string;
  orderDate: string;
  productItems: IPurchaseOrderProductItem[];
}

// Action-specific payload interfaces
export interface IPurchaseOrderCancelPayload {
  reason: string;
}

export interface IPurchaseOrderConfirmPayload {
  delivery_date: Date | Date[] | (Date | null)[] | null | undefined;
}

// Store state interface
export interface IPurchaseOrderStateStore {
  purchaseOrder_detail: IPurchaseOrderDetail | null;
  purchaseOrder_isLoading: boolean;
  purchaseOrder_lists: {
    items: IPurchaseOrderItem[];
    meta: IPurchaseOrderMeta;
  } | null;
}
