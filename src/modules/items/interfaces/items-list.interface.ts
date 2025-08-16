import { DataTableSortEvent } from "primevue";
import { IInventoryItems } from ".";

export interface IInventoryItemsListRequestQuery {
  page: number;
  pageSize: number;
  search?: string | null;
  orderBy: string | null;
  orderDirection: 0 | 1 | -1 | string | undefined | null;
}

export interface IInventoryItemsListResponse{
  statusCode: number;
  message: string;
  data: {
    items: IInventoryItems[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }
}

export interface IInventoryItemsListProvided{
  inventoryItems_colums: IColumnDataTable[];
  inventoryItems_fetchData: () => Promise<void>;
  inventoryItems_isLoading: globalThis.Ref<boolean>;
  inventoryItems_list: IInventoryItems[];
  inventoryItems_onChangePage: (page: number) => void;
  inventoryItems_handleOnSortChange: (event: DataTableSortEvent) => void;
  inventoryItems_handleOnSearch: (searchTerm: string) => void;
  inventoryItems_queryParams: IInventoryItemsListRequestQuery;
  inventoryItems_values: globalThis.Ref<IInventoryItemsListResponse>;
  inventoryItems_onCreate: () => void;
  inventoryItems_onEdit: (inventoryItemsId: string) => void;
  inventoryItems_onDelete: (inventoryItemsId: string) => void;
  inventoryItemsFormMode: globalThis.Ref<'create' | 'edit'>;
  inventoryItems_editingItem: globalThis.Ref<IInventoryItems | null>;
  inventoryItem_onAdjustment: (inventoryItemsId: string) => void;
}
