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
export interface IInvoiceChunk extends IInvoice {
  items: IInvoiceItem[];
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

// Return type for useKitchenQueue composable
export interface IKitchenQueueProvided {
  kitchenQueue_invoices: IInvoice[];
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
