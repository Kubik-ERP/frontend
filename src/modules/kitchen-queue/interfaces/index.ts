// Invoice item interface (individual menu item)
export interface IInvoiceItem {
  name: string;
  status: 'placed' | 'in_progress' | 'completed';
  variant?: string;
  qty: number;
  notes?: string;
}

// Base invoice structure
export interface IInvoice {
  id: string;
  customer: string;
  status: 'placed' | 'in_progress' | 'completed';
  eta: number;
  startTime: Date;
  tableNumber: string;
  orderType: 'dine_in' | 'take_away' | 'self_order';
  items: IInvoiceItem[];
}

// Additional info for chunked invoices
export interface IInvoiceChunk extends IKitchenQueueData {
  items: IItem[];
  height: number;
  invoiceId: string;
  indexCounter: number;
  globalIndex: number;
  totalPage: number;
  isFirst: boolean;
}

// Tailwind color set for UI
export interface IInvoiceColor {
  background: string;
  header: string;
  border: string;
  text: string;
}

export interface IKitchenQueueStateStore {
  kitchenQueue_isLoading: boolean;
  kitchenQueue_invoices: IKitchenQueueData[];
}

export interface IKitchenQueueListResponse {
  statusCode: number;
  message: string;
  data: IKitchenQueueData[];
}

export interface IVariant {
  id: string;
  name: string;
}

export interface IProduct {
  orderStatus: 'placed' | 'in_progress' | 'completed';
  notes: string;
  id: string;
  name: string;
  variant: IVariant;
}

export interface IItem {
  products: IProduct;
}

export interface IKitchenQueueData {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  tableCode: string;
  orderType: 'dine_in' | 'take_away' | string;
  customerId: string;
  customerName: string;
  items: IItem[];
}

// Return type for useKitchenQueue composable
export interface IKitchenQueueProvided {
  kitchenQueue_invoices: Ref<IKitchenQueueData[]>;
  kitchenQueue_isLoading: Ref<boolean>;
  kitchenQueue_dummyRefs: Ref<HTMLElement[]>;
  kitchenQueue_columns: Ref<IInvoiceChunk[][]>;
  kitchenQueue_durations: Ref<Record<string, string>>;
  kitchenQueue_generateColor: (status: string) => IInvoiceColor;
  kitchenQueue_handleChangeStatus: (
    invoice_id: string,
    index: number,
    status: 'placed' | 'in_progress' | 'completed',
  ) => void;
  kitchenQueue_generateChipColor: (status: string) => string;
}
