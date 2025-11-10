// Interfaces
import type { DataTableSortEvent } from 'primevue';
import type { IMenuRecipeList } from './menu-recipe-store.interface';

export interface IMenuRecipeListQueryParams {
  page: number;
  pageSize: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export interface IMenuRecipeListProvided {
  menuRecipeList_columns: IColumnDataTable[];
  menuRecipeList_fetchList: () => Promise<unknown>;
  menuRecipeList_handleOnSortChange: (event: DataTableSortEvent) => void;
  menuRecipeList_isLoading: globalThis.Ref<boolean>;
  menuRecipeList_onChangePage: (page: number) => void;
  menuRecipeList_onShowDialogCancel: (id: string) => void;
  menuRecipeList_queryParams: IMenuRecipeListQueryParams;
  menuRecipeList_values: globalThis.Ref<{
    items: IMenuRecipeList[];
    meta: IPageMeta;
  }>;
}
