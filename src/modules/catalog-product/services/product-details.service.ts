// constants
import { PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS, PRODUCT_DETAILS_PORTION_STOCK_COLUMNS } from '../constants';
// type
import { IProductDetailsProvided, IPortionStock_formData, IProductPortionStock } from '../interfaces';
// store
import { useProductDetailsStore } from '../store/productDetails.store';
import { useOutletStore } from '@/modules/outlet/store';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { reactive, computed } from 'vue'; // Ensure these are imported from vue
import { storeToRefs } from 'pinia'; // Ensure this is imported

const portionStock_formData = reactive<IPortionStock_formData>({
  product_id: null,
  store_id: null,
  adjustment_id: null,
  action: 'INCREASE',
  adjustmentQuantity: 0,
  notes: '',
});

const portionStock_formRules = computed(() => ({
  action: { required },
  adjustmentQuantity: { required },
}));

const portionStock_formValidations = useVuelidate(portionStock_formRules, portionStock_formData, {
  $autoDirty: true,
});

export const useProductDetailsService = (): IProductDetailsProvided => {
  const store = useProductDetailsStore();
  const outletStore = useOutletStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  const { productDetails, productDetails_isLoading } = storeToRefs(store);

  function resetPortionStockFormData() {
    portionStock_formData.updatedAt = null;
    portionStock_formData.product_id = null;
    portionStock_formData.store_id = null;
    portionStock_formData.adjustment_id = null;
    portionStock_formData.action = 'INCREASE';
    portionStock_formData.adjustmentQuantity = 0;
    portionStock_formData.notes = '';

    portionStock_formValidations.value.$reset();
  }

  const portionStock_onShowAdjustment = (data?: IProductPortionStock | null): void => {
    if (data) {
      portionStock_formData.updatedAt = data.updatedAt;
      portionStock_formData.product_id = data.productId;
      portionStock_formData.adjustment_id = data.id;
      portionStock_formData.action = data.action;
      portionStock_formData.adjustmentQuantity = data.adjustmentQuantity;
      portionStock_formData.notes = data.notes;
    } else {
      resetPortionStockFormData();
    }

    const argsEventEmitter: IPropsDialog = {
      id: 'product-portion-stock-dialog',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const portionStock_onCloseAdjustment = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'product-portion-stock-dialog',
      isOpen: false,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);

    resetPortionStockFormData();
  };

  const portionStock_onSubmitAdjustment = async (): Promise<void> => {
    portionStock_formValidations.value.$touch();
    if (portionStock_formValidations.value.$invalid) {
      return;
    }

    try {
      if (portionStock_formData.adjustment_id) {
        await portionStock_update(productDetails.value.id, portionStock_formData.adjustment_id);
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.SUCCESS,
          message: 'Portion Stock Adjustment has been updated successfully.',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      } else {
        await portionStock_create(productDetails.value.id);
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.SUCCESS,
          message: 'Portion Stock Adjustment has been created successfully.',
          position: EToastPosition.TOP_RIGHT,
        };
        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      portionStock_onCloseAdjustment();
      await productDetails_fetchProductDetails(productDetails.value.id);
    }
  };

  const productDetails_fetchProductDetails = async (id: string) => {
    try {
      await store.fetchProductDetails(id, {
        ...httpAbort_registerAbort('PRODUCT_DETAILS_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const portionStock_create = async (id: string) => {
    try {
      const payload = { ...portionStock_formData };
      payload.product_id = id;
      payload.store_id = outletStore.outlet_currentOutlet?.id;

      await store.postProductStockAdjustment(id, payload, {
        ...httpAbort_registerAbort('PORTION_STOCK_ADJUSTMENT_CREATE_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const portionStock_update = async (id: string, adjustmentId: string) => {
    try {
      const payload = { ...portionStock_formData };
      payload.product_id = id;
      payload.store_id = outletStore.outlet_currentOutlet?.id;
      
      await store.patchProductStockAdjustment(id, adjustmentId, payload, {
        ...httpAbort_registerAbort('PORTION_STOCK_ADJUSTMENT_UPDATE_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    // columns
    productDetails_productVariants_columns: PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS,
    productDetails_portionStock_columns: PRODUCT_DETAILS_PORTION_STOCK_COLUMNS,
    // data
    productDetails,
    productDetails_isLoading,
    // method
    productDetails_fetchProductDetails,
    portionStock_create,
    portionStock_update,
    // formdata
    portionStock_formData,
    portionStock_formValidations,
    resetPortionStockFormData,
    // dialog
    portionStock_onShowAdjustment,
    portionStock_onCloseAdjustment,
    portionStock_onSubmitAdjustment,
  };
};
