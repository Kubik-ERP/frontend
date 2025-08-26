import { DataTableSortEvent } from "primevue";
import { IStorageLocation, IStorageLocationListResponse } from ".";

export interface IStorageLocationListRequestQuery {
  page: number;
  pageSize: number;
  search?: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

export interface IStorageLocationListProvided {
  storageLocation_columns: IColumnDataTable[];
  storageLocation_fetchData: () => Promise<void>;
  storageLocation_isLoading: globalThis.Ref<boolean>;
  storageLocation_onChangePage: (page: number) => void;
  storageLocation_handleOnSortChange: (event: DataTableSortEvent) => void;
  storageLocation_handleOnSearch: (searchTerm: string) => void;
  storageLocation_queryParams: IStorageLocationListRequestQuery;
  storageLocation_values: globalThis.Ref<IStorageLocationListResponse>;
  storageLocation_onCreate: () => void;
  storageLocation_onEdit: (storageLocationId: string) => void;
  storageLocation_onDelete: (storageLocationId: string) => void;
  storageLocationFormMode: globalThis.Ref<'create' | 'edit'>;
  storageLocation_editingItem: globalThis.Ref<IStorageLocation | null>;
  storageLocation_onImport: () => void;
}
