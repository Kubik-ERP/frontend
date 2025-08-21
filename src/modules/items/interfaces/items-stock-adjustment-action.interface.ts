import { Validation } from '@vuelidate/core';
import { IInventoryItemsStockAdjustment, IInventoryItemsStockAdjustmentPayload } from '.';

export interface ItemsStockAdjustmentActionResponse {
  statusCode: number;
  message: string;
  data: IInventoryItemsStockAdjustment;
}
export interface typeOptions {
  label: string;
  value: string;
}

export interface ItemsStockAdjustmentActionProvided {
  itemStockAdjustmentPreview_item: globalThis.Ref<IInventoryItemsStockAdjustment | null>;
  itemStockAdjustmentAction_isLoading: globalThis.Ref<boolean>;
  itemStockAdjustmentAction_formData: globalThis.Ref<IInventoryItemsStockAdjustmentPayload>;
  itemStockAdjustmentAction_onSubmit: (
    payload: IInventoryItemsStockAdjustmentPayload,
    mode: 'create' | 'edit',
    id?: string,
  ) => Promise<void>;
  itemStockAdjustmentAction_onCancel: () => void;
  itemStockAdjustmentAction_Validation: globalThis.Ref<Validation>;
  itemStockAdjustmentAction_formOnMode: globalThis.Ref<'create' | 'edit'>;
  itemStockAdjustmentAction_typeOption: typeOptions[];
}
