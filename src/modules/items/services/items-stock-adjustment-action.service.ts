import useVuelidate from '@vuelidate/core';
import { required, helpers } from '@vuelidate/validators';
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

  // Create a type for form data with required expiredAt for validation
  type FormDataForValidation = {
    action: string;
    adjustmentQuantity: number;
    notes: string;
    expiredAt: Date | string;
  };

  const itemStockAdjustmentAction_formData = ref<IInventoryItemsStockAdjustmentPayload>({
    action: '',
    adjustmentQuantity: 0,
    notes: '',
    expiredAt: '',
  });

  watch(
    [itemsStockAdjustmentFormMode, itemStockAdjustment_editingItem],
    ([mode, item]) => {
      if (mode === 'create') {
        itemStockAdjustmentAction_formData.value = {
          action: '',
          adjustmentQuantity: 0,
          notes: '',
          expiredAt: '',
        };
      } else if (mode === 'edit' && item) {
        itemStockAdjustmentAction_formData.value = {
          action: item.action,
          adjustmentQuantity: item.adjustmentQuantity,
          notes: item.notes,
          expiredAt: item.expiryDate ? new Date(item.expiryDate) : '',
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
    expiredAt: {
      required: helpers.withMessage('Expired date is required', (value: Date | string | undefined) => {
        if (itemStockAdjustmentAction_formData.value.action === 'STOCK_IN') {
          return !!value;
        }
        return true;
      }),
    },
  }));

  const itemStockAdjustmentAction_Validation = useVuelidate(
    itemsStockAdjustmentFormValidationRules,
    itemStockAdjustmentAction_formData as Ref<FormDataForValidation>,
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

    const formattedPayload = { ...payload };
    if (formattedPayload.expiredAt instanceof Date) {
      const date = formattedPayload.expiredAt;
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      formattedPayload.expiredAt = `${year}-${month}-${day}`;
    } else if (formattedPayload.expiredAt === null || formattedPayload.expiredAt === undefined) {
      delete (formattedPayload as Partial<IInventoryItemsStockAdjustmentPayload>).expiredAt;
    }

    let result;
    if (mode === 'create') {
      result = await store.inventoryItem_StockAdjustment_PostData(
        {},
        inventoryItemPreview_item.value?.id ?? '',
        formattedPayload,
      );
    } else if (mode === 'edit' && id) {
      result = await store.inventoryItem_StockAdjustment_PutData(
        {},
        inventoryItemPreview_item.value?.id ?? '',
        id,
        formattedPayload,
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
      expiredAt: '',
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
