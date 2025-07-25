export interface IDailySalesListRequestQuery {
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

export interface IDailySales {
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

export interface IDailySalesListResponse {
  data: {
    items: IDailySales[] | [];
    meta: IPageMeta;
  };
}

export interface IQueueStateStore {
  queue_isLoading: boolean;
  dailySales_invoiceLists : IDailySalesListResponse
}

export interface IQueueListRequestBody {
  orderStatus: string;
}

export interface IQueueListResponse {
  data:{
    success: boolean;
    message: string;
  }
}

