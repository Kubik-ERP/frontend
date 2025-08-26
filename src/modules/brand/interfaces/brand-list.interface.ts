import { DataTableSortEvent } from 'primevue';
import { IBrand, IBrandListResponse } from '.';

export interface IBrandListRequestQuery {
  page: number;
  pageSize: number;
  search?: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

export interface IBrandListProvided {
  brand_columns: IColumnDataTable[];
  brand_fetchData: () => Promise<void>;
  brand_isLoading: globalThis.Ref<boolean>;
  brand_onChangePage: (page: number) => void;
  brand_handleOnSortChange: (event: DataTableSortEvent) => void;
  brand_handleOnSearch: (searchTerm: string) => void;
  brand_queryParams: IBrandListRequestQuery;
  brand_values: globalThis.Ref<IBrandListResponse>;
  brand_onCreate: () => void;
  brand_onEdit: (brandId: string) => void;
  brand_onDelete: (brandId: string) => void;
  brandFormMode: globalThis.Ref<'create' | 'edit'>;
  brand_editingItem: globalThis.Ref<IBrand | null>;
  brand_onImport: () => void;
}
