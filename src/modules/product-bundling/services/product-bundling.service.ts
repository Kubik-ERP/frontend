// CONSTANT
import { PRICE_TYPE_OPTION, PRODUCT_BUNDLING_COLUMNS, PRODUCT_BUNDLING_LIST } from '../constants';

// interface
import {
  IProductBundlingProvided,
  IProductBundlingCreateEditFormData,
  IProductListRequestQuery,
} from '../interfaces';

// Vuelidate
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { useProductBundlingStore } from '../store';
export const useProductBundlingService = (): IProductBundlingProvided => {
  const store = useProductBundlingStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  const { productList_isLoading, productBundling_productList } = storeToRefs(store);

  const productBundling_grandTotal = ref<number>(0);

  const productBundling_formData = reactive<IProductBundlingCreateEditFormData>({
    name: '',
    description: '',
    products: [],
    type: 'total items',
    price: 0,
  });

  const productBundling_formRules = computed(() => ({
    name: { required },
    price: { required },
  }));

  const productBundling_formValidations = useVuelidate(productBundling_formRules, productBundling_formData, {
    $autoDirty: true,
  });

  const calculateTotalPrice = () => {
    if (productBundling_formData.type === 'total items') {
      productBundling_formData.price = productBundling_formData.products.reduce(
        (total, item) => total + item.discountPrice * item.quantity,
        0,
      );
      productBundling_grandTotal.value = productBundling_formData.price;
    } else if (productBundling_formData.type === 'discount') {
      productBundling_grandTotal.value = productBundling_formData.products.reduce(
        (total, item) => total + item.discountPrice * item.quantity - productBundling_formData.price,
        0,
      );
    } else if (productBundling_formData.type === 'custom') {
      productBundling_grandTotal.value = productBundling_formData.price;
    }
  };

  const setPricingType = () => {
    if (productBundling_formData.type === 'total items') {
      calculateTotalPrice();
    } else if (productBundling_formData.type === 'discount') {
      productBundling_formData.price = 0;
    } else if (productBundling_formData.type === 'custom') {
      productBundling_formData.price = 0;
    }
  };

  watch(
    () => productBundling_formData.type,
    () => {
      setPricingType();
    },
    { deep: true, immediate: true },
  );
  watch(
    [() => productBundling_formData.products, () => productBundling_formData.price],
    () => {
      calculateTotalPrice();
    },
    { deep: true, immediate: true },
  );

  // const resetFormData = () => {
  //   productBundling_formData.name = '';
  //   productBundling_formData.description = '';
  //   productBundling_formData.productId = [];
  //   productBundling_formData.type = 'total items';
  //   productBundling_formData.price = 0;
  // };

  const product_queryParams = reactive<IProductListRequestQuery>({
    page: 1,
    limit: 100,
    search: '',
  });

  const productBundling_fetchProductList = async (): Promise<void> => {
    try {
      await store.productBundling_fetchProductList(product_queryParams, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_PRODUCT_LIST'),
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  return {
    // constant
    productBinding_columns: PRODUCT_BUNDLING_COLUMNS,
    productBundling_list: PRODUCT_BUNDLING_LIST,

    price_type_option: PRICE_TYPE_OPTION,

    productBundling_grandTotal,
    productBundling_formData,
    productBundling_formValidations,

    // API
    productBundling_fetchProductList,

    productBundling_productList,
    productList_isLoading,
  };
};
