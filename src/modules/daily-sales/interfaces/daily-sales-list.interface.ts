// Interfaces
import { DataTableSortEvent } from 'primevue';
import type { IDailySalesListResponse } from './index';

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

export interface IDailySalesListProvided {
  dailySalesList_columns: IColumnDataTable[];
  dailySalesList_fetchListInvoices: () => Promise<unknown>;
  dailySalesList_getClassOfOrderStatus: (orderStatus: string) => string;
  dailySalesList_getClassOfOrderType: (orderType: string) => string;
  dailySalesList_getClassOfPaymentStatus: (paymentStatus: string) => string;
  dailySalesList_isLoading: globalThis.Ref<boolean>;
  dailySalesList_onChangePage: (page: number) => void;
  dailySales_handleOnSortChange: (event: DataTableSortEvent) => void;
  dailySalesList_queryParams: IDailySalesListRequestQuery;
  dailySalesList_typesOfOrderType: IDropdownItem[];
  dailySalesList_typesOfPaymentStatus: IDropdownItem[];
  dailySalesList_typesOfOrderStatus: IDropdownItem[];
  dailySalesList_values: IDailySalesListResponse;
}
