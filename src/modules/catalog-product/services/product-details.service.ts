// constants
import { PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS, PRODUCT_DETAILS_PORTION_STOCK_COLUMNS } from '../constants';
// type
import { IProductDetailsProvided, IPortionStock_formData } from '../interfaces';
// store
import { useProductDetailsStore } from '../store/productDetails.store';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
export const useProductDetailsService = (): IProductDetailsProvided => {
  const store = useProductDetailsStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  const { productDetails, productDetails_isLoading } = storeToRefs(store);

  const portionStock_formData = reactive<IPortionStock_formData>({
    type: 'increase',
    quantity: 0,
    notes: '',
  });

  // form rules
  const portionStock_formRules = computed(() => ({
    type: { required },
    quantity: { required },
  }));

  const portionStock_formValidations = useVuelidate(portionStock_formRules, portionStock_formData, {
    $autoDirty: true,
  });
  function resetPortionStockFormData() {
    portionStock_formData.type = 'increase';
    portionStock_formData.quantity = 0;
    portionStock_formData.notes = '';
  }

  const portionStock_onShowAdjustment = (): void => {
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
  };

  const portionStock_onSubmitAdjustment = async (): Promise<void> => {
    portionStock_formValidations.value.$touch();
    if (portionStock_formValidations.value.$invalid) {
      return;
    }

    try {
      console.log(JSON.stringify(portionStock_formData, null, 2));

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Portion Stock Adjustment has been added successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      portionStock_onCloseAdjustment();
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

  return {
    // columns
    productDetails_productVariants_columns: PRODUCT_DETAILS_PRODUCT_VARIANTS_COLUMNS,
    productDetails_portionStock_columns: PRODUCT_DETAILS_PORTION_STOCK_COLUMNS,
    // data
    productDetails,
    productDetails_isLoading,
    // method
    productDetails_fetchProductDetails,
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
