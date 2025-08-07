// Interfaces
import type { DataTableSortEvent } from 'primevue';
import type { ISupplierListResponse } from './index';

export interface ISupplierListRequestQuery {
  page: number;
  pageSize: number;
  search?: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

export interface ISupplierListProvided {
  supplierList_columns: IColumnDataTable[];
  supplierList_fetchSuppliers: () => Promise<void>;
  supplierList_isLoading: globalThis.Ref<boolean>;
  supplierList_onChangePage: (page: number) => void;
  supplierList_handleOnSortChange: (event: DataTableSortEvent) => void;
  supplierList_queryParams: ISupplierListRequestQuery;
  supplierList_values: globalThis.Ref<ISupplierListResponse>;
  supplierList_onCreateSupplier: () => void;
  supplierList_onEditSupplier: (supplierId: string) => void;
  supplierList_onDeleteSupplier: (supplierId: string) => void;
}
