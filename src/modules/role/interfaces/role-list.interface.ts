import { DataTableSortEvent } from 'primevue';
import { IRole } from './index.interface';

export interface IRoleListResponse {
  statusCode: number;
  message: string;
  data: {
    items: IRole[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IRoleActionResponse{
  statusCode: number;
  message: string;
  data: IRole
}

export interface IRoleListQueryParams{
  page: number | null;
  pageSize: number | null;
  // search: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null
}

export interface IRoleListProvided {
  roleList_columns: IColumnDataTable[];
  roleList_fetchData: () => Promise<void>;
  roleList_isLoading: globalThis.Ref<boolean>;
  roleList_onChangePage: (page: number) => void;
  roleList_handleOnSortChange: (event: DataTableSortEvent) => void;
  roleList_queryParams: globalThis.Ref<IRoleListQueryParams>;
  roleList_values: globalThis.Ref<IRole[] | []>;
  roleList_onCreate: () => void;
  roleList_onEdit: (roleListId: string) => void;
  roleList_onDelete: (roleListId: string) => void;
  roleList_response: globalThis.Ref<IRoleListResponse>;
}
