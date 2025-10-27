// Form payload interface for API calls
export interface IWasteLogCreateEditFormPayload {
  batchId: string;
  payload: IWasteLogItemPayload[];
}

export interface IWasteLogItemPayload {
  inventory_item_id: string;
  category: string;
  quantity: number;
  uom: string;
  notes: string | null;
  image?: File | null;
}

export interface IWasteLog {
  wasteLogId: string;
  batchId: string;
  storeId: string;
  storeName: string;
  wasteLogItems: WasteLogItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WasteLogItem {
  wasteLogItemId: string;
  inventoryItemId: string;
  inventoryItemName: string;
  category: string;
  quantity: number;
  uom: string;
  notes: string;
  photoUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWasteLogStateStore {
  wasteLog_selectedData: IWasteLog | null;
  wasteLog_isLoading: boolean;
  wasteLog_lists: {
    meta: IPageMeta;
    items: IWasteLog[] | [];
  };
}
