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
  voucherAmount: number | null;
}

export interface IDailySalesListResponse {
  data: {
    items: IDailySales[] | [];
    meta: IPageMeta;
  };
}

export interface IDailySalesStateStore {
  dailySales_isLoading: boolean;
  dailySales_invoiceLists: IDailySalesListResponse;
}
