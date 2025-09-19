// constant
import { PRODUCT_LIST_COLUMNS } from '../constants';
// store
import { useDiscountStore } from '../store';
// Plugins
import eventBus from '@/plugins/mitt';
// interface
import type {
  IItemDiscountProvided,
  IProductListQueryParams,
  ISelectedProduct,
  IItemDiscountFormData,
} from '../interfaces';

// Vuelidate
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const useDiscountService = (): IItemDiscountProvided => {
  const store = useDiscountStore();
  const { productDiscount_isLoading, productList_isLoading, productList_values } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const fetchProductList = async () => {
    await store.fetchProductList(productList_queryParams, { ...httpAbort_registerAbort('PRODUCT_LIST_REQUEST') });
  };

  const productList_queryParams = reactive<IProductListQueryParams>({
    page: 1,
    limit: 10,
    search: '',
  });

  const selectedProducts = ref<string[]>([]);
  const isProductSelected = (product: ISelectedProduct): boolean => {
    return selectedProducts.value.includes(product.id);
  };
  const toggleSelection = (product: ISelectedProduct): void => {
    const index = selectedProducts.value.indexOf(product.id);

    if (index > -1) {
      selectedProducts.value.splice(index, 1);
    } else {
      selectedProducts.value.push(product.id);
    }
  };

  const clearSelectedProducts = () => {
    selectedProducts.value = [];
  };

  const productList_onChangePage = (page: number): void => {
    productList_queryParams.page = page;
  };

  watch(
    () => productList_queryParams,
    debounce(async () => {
      await fetchProductList();
    }, 500),
    { deep: true },
  );

  const itemDiscount_formData = reactive<IItemDiscountFormData>({
    discountValue: 1,
    isPercent: false,
  });

  const itemDiscount_formRules = computed(() => ({
    discountValue: { required },
  }));

  const itemDiscount_formValidations = useVuelidate(itemDiscount_formRules, itemDiscount_formData, {
    $autoDirty: true,
  });

  const itemDiscount_clearFormData = () => {
    itemDiscount_formData.discountValue = 0;
    itemDiscount_formData.isPercent = false;
  };

  const itemDiscount_onShowDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'item-discount-dialog',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const itemDiscount_onCloseDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'item-discount-dialog',
      isOpen: false,
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
    itemDiscount_clearFormData();
  };

  const itemDiscount_onSubmitDialog = async (): Promise<void> => {
    if (selectedProducts.value.length === 0) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Please select at least one product.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      itemDiscount_onCloseDialog();
      return;
    }
    try {
      await store.patchDiscountPrice(selectedProducts.value, itemDiscount_formData, {
        ...httpAbort_registerAbort('PATCH_DISCOUNT_PRICE'),
      });
      itemDiscount_onCloseDialog();
      itemDiscount_clearFormData();
      clearSelectedProducts();
      fetchProductList();
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Item Discount has been applied successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  return {
    productList_columns: PRODUCT_LIST_COLUMNS,

    productList_isLoading,
    productList_values,

    productList_queryParams,
    productList_onChangePage,

    selectedProducts,
    isProductSelected,
    toggleSelection,

    itemDiscount_onShowDialog,
    itemDiscount_onCloseDialog,
    itemDiscount_onSubmitDialog,
    itemDiscount_formData,
    itemDiscount_formValidations,

    productDiscount_isLoading,

    fetchProductList,
  };
};
