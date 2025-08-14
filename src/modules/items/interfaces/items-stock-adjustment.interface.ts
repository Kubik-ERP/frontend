import { DataTableSortEvent } from "primevue";
import { IInventoryItems, IInventoryItemsStockAdjustment } from ".";

export interface IInventoryItemsStcokAdjustmentListRequestQuery{
  page: number;
  pageSize: number;
  search: string | null;
  action: null | 'STOCK_IN' | 'STOCK_OUT';
}



export interface ItemsStockAdjustmentProvided{
     inventoryItemPreview_item:globalThis.Ref<IInventoryItems | null>,
    inventoryItemPreview_fetchItemById: (id: string) => void,
    inventoryItemPreview_onEditItem: (id: string) => void,
    stockadjustment_queryParams:globalThis.Ref<IInventoryItemsStcokAdjustmentListRequestQuery>,
    stockadjustment_fetchList: (id: string) => void,
    stockadjustment_listColumns: IColumnDataTable[],
    stockadjustment_isLoading: globalThis.Ref<boolean>,
    stockadjustment_list: globalThis.Ref<IInventoryItemsStcokAdjustmentListResponse>,
    stockadjustment_onChangePage: (page: number) => void,
    stockadjustment_handleOnSortChange: (event: DataTableSortEvent) => void,
    stockadjustment_handleOnSearch: (searchTerm: string) => void
    stockadjustment_handleOnFilter: (filter: null | 'STOCK_IN' | 'STOCK_OUT') => void,
    stockadjustment_onCreate: () => void
}

export interface IInventoryItemsStcokAdjustmentListResponse{
  statusCode: number;
  message: string;
  data: {
    items: IInventoryItemsStockAdjustment[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  }
}
