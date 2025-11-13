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
  batchCookingRecipe?: IWasteLogBatchRecipe;
  wasteLogItems: IWasteLogItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWasteLogBatchRecipe {
  id: string;
  recipeId: string;
  date: Date;
  batchTargetYield: number;
  batchWaste: number;
  notes: string;
  createdAt: Date;
  createdBy: number;
  updatedAt: Date;
  updatedBy: number;
  status: number;
  costBatch: null;
  costPortion: null;
  marginSellingPrice: null;
  cookingAt: Date;
  storeId: string;
}

export interface IWasteLogItem {
  wasteLogItemId: string;
  inventoryItemId: string;
  inventoryItemName: string;
  category: string;
  quantity: number;
  uom: string;
  notes: string;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWasteLogListResponse extends IDefaultResponseFetch {
  data: {
    items: IWasteLog[];
    meta: IPageMeta;
  };
}

export interface IWasteLogStateStore {
  wasteLog_selectedData: IWasteLog | null;
  wasteLog_isLoading: boolean;
  wasteLog_lists: {
    meta: IPageMeta;
    items: IWasteLog[] | [];
  };
}
