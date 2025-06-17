import { DataTableSortEvent } from 'primevue'

export interface IDailySalesProvided {
  dailySales_getClassOfOrderStatus: (orderStatus: string) => string;
  dailySales_getClassOfOrderType: (orderType: string) => string;
  dailySales_getClassOfPaymentStatus: (paymentStatus: string) => string;
  dailySales_handleOnPageChange: (page: number) => void;
  dailySales_handleOnSortChange: (event: DataTableSortEvent) => void;
  dailySales_data: Ref<IDailySalesData, IDailySalesData>;
  dailySales_listColumns: IColumnDataTable[];
  dailySales_listTypesOfOrderStatus: IDropdownItem[];
  dailySales_listTypesOfOrderType: IDropdownItem[];
  dailySales_listTypesOfPaymentStatus: IDropdownItem[];
}

export interface IDailySalesFilter {
  paymentStatus: string[] | null;
  orderType: string[] | null;
  orderStatus: string[] | null;
  createdAtFrom: Date | null;
  createdAtTo: Date | null;
  invoiceNumber: string | null;
}

export interface IDailySalesSorting {
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | undefined | null;
}

export interface IDailySalesData {
  isLoading: boolean;
  items: IDailySalesItem[];
  meta: IDailySalesMeta;
  filter: IDailySalesFilter;
  sorting: IDailySalesSorting;
}

export interface IDailySalesCustomer {
  id: string;
  name: string;
  code: string;
  number: string;
  dob: string;
  email: string;
  username: string | null;
  address: string;
  gender: 'Male' | 'Female' | string;
}

export interface IDailySalesItem {
  id: string;
  paymentMethodsId: string | null;
  customerId: string;
  discountAmount: number;
  tableCode: string;
  paymentStatus: 'paid' | 'unpaid' | 'refund' | string;
  createdAt: string;
  updateAt: string;
  deleteAt: string | null;
  subtotal: number;
  orderType: 'dine_in' | 'take_away' | string;
  paidAt: string | null;
  taxId: string | null;
  serviceChargeId: string | null;
  taxAmount: number | null;
  serviceChargeAmount: number | null;
  grandTotal: number | null;
  customer: IDailySalesCustomer;
}

export interface IDailySalesMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface IDailySalesData {
  items: IDailySalesItem[];
  meta: IDailySalesMeta;
}

export interface IDailySalesDataResponse {
  data: IDailySalesData;
  message: string;
  statusCode: number;
}
