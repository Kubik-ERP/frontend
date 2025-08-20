import { DataTableSortEvent } from "primevue";
import { IVoucherListResponse } from "./index";

export type IVoucherListRequestQuery = {
  startDate: string | null;
  endDate: string | null;
  page: number;
  pageSize: number;
  orderBy: string | null;
  orderDirection: 'asc' | 'desc' | null;
};

export interface IVoucherListProvided {
   voucherList_columns: IColumnDataTable[];
   voucherList_isLoading: globalThis.Ref<boolean>;
   voucherList_onChangePage: (page: number) => void;
   voucher_handleOnSortChange: (event: DataTableSortEvent) => void;
   voucherList_queryParams: IVoucherListRequestQuery;
   voucherList_fetchListVouchers: () => Promise<unknown>;
   voucherList_deleteVoucher: (voucherId: string) => Promise<void>;
   voucherList_values: globalThis.Ref<IVoucherListResponse>;
   voucherList_handleFilter: (startDate: string, endDate: string) => void;
}

