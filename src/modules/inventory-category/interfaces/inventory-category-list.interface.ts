import { DataTableSortEvent } from "primevue";
import { IInventoryCategory, IInventoryCategoryListResponse } from ".";

export interface IInventoryCategoryListRequestQuery {
  page: number;
  pageSize: number;
  search?: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

export interface IInventoryCategoryListProvided {
  inventoryCategoryList_columns: IColumnDataTable[];
  inventoryCategoryList_fetchData: () => Promise<void>;
  inventoryCategoryList_isLoading: globalThis.Ref<boolean>;
  inventoryCategoryList_onChangePage: (page: number) => void;
  inventoryCategoryList_handleOnSortChange: (event: DataTableSortEvent) => void
  inventoryCategoryList_handleOnSearch: (searchTerm: string) => void;
  inventoryCategoryList_queryParams: IInventoryCategoryListRequestQuery;
  inventoryCategoryList_values: globalThis.Ref<IInventoryCategoryListResponse>;
  inventoryCategoryList_onCreateCategory: () => void;
  inventoryCategoryList_onEditCategory: (categoryId: string) => void;
  inventoryCategoryList_onDeleteCategory: (categoryId: string) => void;
  inventoryCategoryFormMode: globalThis.Ref<'create' | 'edit'>;
  inventoryCategoryList_editingItem: globalThis.Ref<IInventoryCategory | null>;
}
