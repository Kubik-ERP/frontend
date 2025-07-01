export interface IQueue {
  cashierId: number;
  createdAt: string;
  customer: ICustomer;
  customerId: string;
  deleteAt: string | null;
  discountAmount: number;
  grandTotal: number;
  id: string;
  invoiceNumber: string;
  orderType: string;
  paidAt: string | null;
  paymentMethodsId: string | null;
  paymentStatus: string;
  serviceChargeAmount: number;
  serviceChargeId: string | null;
  subtotal: number;
  tableCode: string;
  taxAmount: number | null;
  taxId: string | null;
  updatedAt: string;
}

export interface IQueueListResponse {
  data: {
    items: IQueue[] | [];
    meta: IPageMeta;
  };
}

export interface IQueueStateStore {
  queue_isLoading: boolean;
  queue_invoiceLists: IQueueListResponse;
}

export interface IQueueListRequestQuery {
  createdAtFrom: Date | null;
  createdAtTo: Date | null;
  invoiceNumber: string | null;
  orderStatus: string | null;
  orderType: string | null;
  page: number;
  pageSize: number;
  paymentStatus: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

