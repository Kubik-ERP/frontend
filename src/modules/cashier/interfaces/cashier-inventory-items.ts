import type { Ref } from 'vue';
import type { IInventoryItemsListResponse, IInventoryItemsListRequestQuery } from '@/modules/items/interfaces/items-list.interface';

export interface ICashierInventoryItemsProvided {
  inventoryItems_colums: IColumnDataTable[];
  inventoryItems_values: Ref<IInventoryItemsListResponse>;
  inventoryItems_isLoading: Ref<boolean>;
  inventoryItems_queryParams: IInventoryItemsListRequestQuery;
  inventoryItems_fetchData: () => Promise<void>;
}