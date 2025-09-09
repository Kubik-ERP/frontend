import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { IInventoryItemsStockAdjustmentPayload } from '../interfaces';
import {
  ItemsStockAdjustmentActionProvided,
  typeOptions,
} from '../interfaces/items-stock-adjustment-action.interface';
import { useInventoryItemsStore } from '../store';
import eventBus from '@/plugins/mitt';
import { useInventoryItemPreviewService } from './items-stock-adjustment.service';

export const useItemStockAdjustmentActionService = (): ItemsStockAdjustmentActionProvided => {
  const store = useInventoryItemsStore();
  const { itemsStockAdjustmentFormMode, itemStockAdjustment_editingItem, inventoryItems_editingItem } = storeToRefs(store);
  const { inventoryItemPreview_item, stockadjustment_list } = useInventoryItemPreviewService();
  const itemStockAdjustmentAction_isLoading = ref(false);
  // const route = useRoute();

  const itemStockAdjustmentAction_formData = ref<IInventoryItemsStockAdjustmentPayload>({
    action: '',
    adjustmentQuantity: 0,
    notes: '',
  });

  watch(
    [itemsStockAdjustmentFormMode, itemStockAdjustment_editingItem],
    ([mode, item]) => {
      if (mode === 'create') {
        itemStockAdjustmentAction_formData.value = {
          action: '',
          adjustmentQuantity: 0,
          notes: '',
        };
      } else if (mode === 'edit' && item) {
        itemStockAdjustmentAction_formData.value = {
          action: item.action,
          adjustmentQuantity: item.adjustmentQuantity,
          notes: item.notes,
        };
      }
    },
    {
      immediate: true,
    },
  );

  const itemsStockAdjustmentFormValidationRules = computed(() => ({
    action: { required },
    adjustmentQuantity: { required },
    notes: {},
  }));

  const itemStockAdjustmentAction_Validation = useVuelidate(
    itemsStockAdjustmentFormValidationRules,
    itemStockAdjustmentAction_formData,
    {
      $scope: true,
      $lazy: true,
    },
  );

  const itemStockAdjustmentAction_onSubmit = async (
    payload: IInventoryItemsStockAdjustmentPayload,
    mode: 'create' | 'edit',
    id?: string,
  ) => {
    const isFormCorrect = await itemStockAdjustmentAction_Validation.value.$validate();
    if (!isFormCorrect) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Please fill all required fields',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
      return;
    }
    let result;
    if (mode === 'create') {
      result = await store.inventoryItem_StockAdjustment_PostData(
        {},
        inventoryItemPreview_item.value?.id ?? '',
        payload,
      );
    } else if (mode === 'edit' && id) {
      result = await store.inventoryItem_StockAdjustment_PutData(
        {},
        inventoryItemPreview_item.value?.id ?? '',
        id,
        payload,
      );
    } else {
      throw new Error('Edit mode requires a valid stock adjustment ID'); // ✅ lempar error
    }

    const resFetch = await store.inventoryItem_StockAdjustment({}, inventoryItemPreview_item.value?.id ?? '', {
      page: 1,
      pageSize: 10,
      action: null,
      search: null,
    });
    stockadjustment_list.value.data = resFetch.data;

    const resGetData = await store.inventoryItems_GetData({}, inventoryItemPreview_item.value?.id ?? '');
    inventoryItems_editingItem.value = resGetData.data;

    const argsEventEmitter: IPropsToast = {
      isOpen: true,
      type: EToastType.SUCCESS,
      message:
        result?.message ||
        (mode === 'create' ? 'Category created successfully!' : 'Category updated successfully!'),
      position: EToastPosition.TOP_RIGHT,
    };

    await eventBus.emit('AppBaseToast', argsEventEmitter);

    eventBus.emit('AppBaseDialog', {
      id: 'stock-adjustment-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const itemStockAdjustmentAction_onCancel = () => {
    itemStockAdjustmentAction_formData.value = {
      action: '',
      adjustmentQuantity: 0,
      notes: '',
    };
    eventBus.emit('AppBaseDialog', {
      id: 'stock-adjustment-modal',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: false,
      width: '600px',
    });
  };

  const typeOptions: typeOptions[] = [
    { label: 'Stock In', value: 'STOCK_IN' },
    { label: 'Stock Out', value: 'STOCK_OUT' },
  ];

  return {
    itemStockAdjustmentPreview_item: itemStockAdjustment_editingItem,
    itemStockAdjustmentAction_isLoading,
    itemStockAdjustmentAction_formData,
    itemStockAdjustmentAction_Validation,
    itemStockAdjustmentAction_onSubmit,
    itemStockAdjustmentAction_onCancel,
    itemStockAdjustmentAction_typeOption: typeOptions,
    itemStockAdjustmentAction_formOnMode: itemsStockAdjustmentFormMode,
  };
};
