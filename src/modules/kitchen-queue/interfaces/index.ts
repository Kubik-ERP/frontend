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
  variant: IVariant | null;
}

export interface IItem {
  id: string;
  product: IProduct;
}

export interface IKitchenQueueData {
  invoiceId: string;
  queueReferenceId: string;
  invoiceNumber: string;
  createdAt: string;
  updatedAt: string;
  storeId: string;
  tableCode: string;
  orderType: 'dine_in' | 'take_away' | string;
  orderStatus: 'placed' | 'in_progress' | 'completed';
  customerId: string;
  customerName: string;
  isLoading: boolean;
  queues: IItem[];
}

// Return type for useKitchenQueue composable
export interface IKitchenQueueProvided {
  kitchenQueue_invoices: Ref<IKitchenQueueData[]>;
  kitchenQueue_isLoading: Ref<boolean>;
  kitchenQueue_dummyRefs: Ref<HTMLElement[]>;
  kitchenQueue_columns: Ref<IInvoiceChunk[][]>;
  kitchenQueue_durations: Ref<Record<string, string>>;
  kitchenQueue_scrollContainer: Ref<HTMLElement | null>;
  kitchenQueue_meterValue: Ref<{
    meter: {
      value: number;
      label: string;
      color: string;
    };
    max: number;
  }>;
  kitchenQueue_listTabs: Ref<'orders' | 'order-history'>;
  kitchenQueue_generateColor: (status: string) => IInvoiceColor;

  kitchenQueue_generateChipColor: (status: string) => string;
  kitchenQueue_handleScrollHorizontal: (direction: 'left' | 'right') => void;
  kitchenQueue_updateScrollPosition: () => void;
  kitchenQueue_handleDebounceUpdateStatus: (
    queueReferenceId: string,
    invoiceId: string,
    queueId: string,
    status: string,
    columnData: {
      index: number;
      itemIndex: number;
    }
  ) => void;
  kitchenQueue_handleUpdateStatus: (
    queueReferenceId: string,
    invoiceId: string,
    queueId: string,
    orderStatus: 'placed' | 'in_progress' | 'completed',
    columnData: {
      index: number;
      itemIndex: number;
    }
  ) => void;
  kitchenQueue_handleUpdateStatusBulk: (
    queueReferenceId: string,
    items: IItem[],
  ) => void;
}
