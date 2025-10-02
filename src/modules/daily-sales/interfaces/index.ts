// export interface IDailySales {
//   cashierId: number;
//   createdAt: string;
//   customer: ICustomer;
//   customerId: string;
//   deleteAt: string | null;
//   discountAmount: number;
//   grandTotal: number;
//   id: string;
//   invoiceNumber: string;
//   orderType: string;
//   paidAt: string | null;
//   paymentMethodsId: string | null;
//   paymentStatus: string;
//   serviceChargeAmount: number;
//   serviceChargeId: string | null;
//   subtotal: number;
//   tableCode: string;
//   taxAmount: number | null;
//   taxId: string | null;
//   updatedAt: string;
//   voucherAmount: number | null;
// }

export interface IDailySalesItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  discountAmount: number;
  subtotal: number;
}

export interface IDailySales {
  id: string;
  paymentMethodsId: null;
  customerId: string;
  discountAmount: number;
  tableCode: string;
  paymentStatus: string;
  createdAt: Date;
  updateAt: Date;
  deleteAt: null;
  subtotal: number;
  orderType: string;
  paidAt: null;
  taxId: null;
  serviceChargeId: null;
  taxAmount: number;
  serviceChargeAmount: number;
  grandTotal: number;
  cashierId: number;
  invoiceNumber: string;
  storeId: string;
  completeOrderAt: null;
  orderStatus: string;
  paymentAmount: number;
  changeAmount: number;
  voucherAmount: number;
  voucherId: null;
  totalProductDiscount: null;
  roundingSettingId: null;
  roundingAmount: null;
  customer: ICustomer;
  queue: number;
  items?: IDailySalesItem[];
}

export interface ICustomer {
  id: string;
  name: string;
  code: string;
  number: string;
  dob: null;
  email: string;
  username: null;
  address: string;
  gender: string;
  tag: null;
  point: null;
  storesId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
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
