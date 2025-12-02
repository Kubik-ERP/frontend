// Interfaces
import type { DataTableSortEvent } from 'primevue';
import type { Validation } from '@vuelidate/core';
import type { IInventoryItems } from '@/modules/items/interfaces';
import type { IWasteLog, IWasteLogCreateEditFormPayload, IWasteLogItem as IWasteLogItemStore } from './waste-log-store.interface';

export interface IBatchMenuRecipes {
  recipe_id: string;
  recipe_name: string;
  target_yield: number;
  output_unit: string;
}

export interface IBatch {
  id: string;
  date: Date;
  status: string;
  batch_target_yield: number;
  menu_recipes?: IBatchMenuRecipes;
  batchName?: string;
  cost_batch?: number | null;
  cost_portion?: number | null;
  batch_waste?: number;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface IWasteLogListQueryParams {
  page: number;
  pageSize: number;
  search: string;
  orderBy: string;
  orderDirection: 'asc' | 'desc';
}

export interface IWasteLogFormData {
  batchId: IBatch | string | null;
  wasteLogs: IWasteLogItem[];
}

export interface IWasteLogItem {
  category: string | null;
  itemId: string | null;
  notes: string | null;
  photo: File | null;
  photoPreview: string | null;
  quantity: number;
  uom: string | null;
}

export interface IWasteLogFlattenedItem extends IWasteLogItemStore {
  wasteLogId: string;
  batchId: string;
  storeName: string;
  wasteLogCreatedAt: Date;
}

export interface IWasteLogListProvided {
  wasteLogList_batchOptions: globalThis.Ref<IBatch[]>;
  wasteLogList_categoryOptions: IDropdownItem[];
  wasteLogList_columns: IColumnDataTable[];
  wasteLogList_fetchBatchList: () => Promise<void>;
  wasteLogList_fetchDetail: (id: string) => Promise<IWasteLog | null>;
  wasteLogList_fetchInventoryItems: () => Promise<void>;
  wasteLogList_fetchList: () => Promise<unknown>;
  wasteLogList_flattenedItems: globalThis.ComputedRef<IWasteLogFlattenedItem[]>;
  wasteLogList_formData: globalThis.Ref<IWasteLogFormData>;
  wasteLogList_formValidations: Validation;
  wasteLogList_handleOnSortChange: (event: DataTableSortEvent) => void;
  wasteLogList_inventoryItems: globalThis.Ref<IInventoryItems[]>;
  wasteLogList_isLoading: globalThis.Ref<boolean>;
  wasteLogList_isLoadingBatchOptions: globalThis.Ref<boolean>;
  wasteLogList_isLoadingInventoryItems: globalThis.Ref<boolean>;
  wasteLogList_mapApiResponseToFormData: (apiData: IWasteLog) => void;
  wasteLogList_mapFormDataToApiPayload: () => IWasteLogCreateEditFormPayload;
  wasteLogList_onAddWasteLogItem: () => void;
  wasteLogList_onChangePage: (page: number) => void;
  wasteLogList_onDeleteWasteLogItem: (index: number) => void;
  wasteLogList_onInitializeForm: () => void;
  wasteLogList_onRemovePhoto: (index: number) => void;
  wasteLogList_onSaveWasteLog: () => Promise<void>;
  wasteLogList_onSelectPhoto: (index: number, event: Event) => void;
  wasteLogList_onShowDialogAddOrEditWasteLog: (id?: string) => Promise<void>;
  wasteLogList_onShowDialogCancelAddOrEditWasteLog: () => void;
  wasteLogList_onShowDialogDelete: (id: string) => void;
  wasteLogList_queryParams: IWasteLogListQueryParams;
  wasteLogList_setScrollCallback: (callback: (index: number) => void) => void;
  wasteLogList_uomOptions: IDropdownItem[];
  wasteLogList_updateWasteLog: (id: string) => Promise<void>;
  wasteLogList_values: globalThis.Ref<{
    items: IWasteLog[];
    meta: IPageMeta;
  }>;
}
