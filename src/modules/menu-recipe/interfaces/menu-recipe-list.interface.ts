export interface IMenuRecipeListQueryParams {
  page: number;
  perPage: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export interface IMenuRecipeListProvided {
  menuRecipeList_columns: IColumnDataTable[];
  menuRecipeList_onShowDialogDelete: (id: string) => void;
  menuRecipeList_queryParams: IMenuRecipeListQueryParams;
  menuRecipeList_values: unknown[];
}