// CONSTANT
import { PRICE_TYPE_OPTION, PRODUCT_BUNDLING_COLUMNS } from '../constants';

// interface
import {
  IProductBundlingProvided,
  IProductBundlingCreateEditFormData,
  IProductListRequestQuery,
  IProductBundlingListRequestQuery,
  IProductBundlingDetailsResponse,
} from '../interfaces';

// Vuelidate
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { useProductBundlingStore } from '../store';

import eventBus from '@/plugins/mitt';

export const useProductBundlingService = (): IProductBundlingProvided => {
  const router = useRouter();
  const store = useProductBundlingStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  const { productList_isLoading, productBundling_productList, productBundling_list, productBundling_isLoading } =
    storeToRefs(store);

  const productBundling_grandTotal = ref<number>(0);

  const productBundling_formData = reactive<IProductBundlingCreateEditFormData>({
    id: null,
    name: '',
    description: '',
    products: [],
    type: '',
    price: 0,
  });

  const productBundling_formRules = computed(() => ({
    name: { required },
    price: { required },
    type: { required },
  }));

  const productBundling_formValidations = useVuelidate(productBundling_formRules, productBundling_formData, {
    $autoDirty: true,
  });

  const calculateTotalPrice = () => {
    if (productBundling_formData.type === 'TOTAL_ITEMS') {
      productBundling_formData.price = productBundling_formData.products.reduce(
        (total, item) => total + item.discountPrice * item.quantity,
        0,
      );
      productBundling_grandTotal.value = productBundling_formData.price;
    } else if (productBundling_formData.type === 'DISCOUNT') {
      productBundling_grandTotal.value = productBundling_formData.products.reduce(
        (total, item) =>
          total +
          item.discountPrice * item.quantity -
          (item.discountPrice * item.quantity * productBundling_formData.price) / 100,
        0,
      );
    } else if (productBundling_formData.type === 'CUSTOM') {
      productBundling_grandTotal.value = productBundling_formData.price;
    }
  };

  const setPricingType = () => {
    if (productBundling_formData.type === 'TOTAL_ITEMS') {
      calculateTotalPrice();
    } else if (productBundling_formData.type === 'DISCOUNT') {
      productBundling_formData.price = 0;
    } else if (productBundling_formData.type === 'CUSTOM') {
      productBundling_formData.price = productBundling_formData.products.reduce(
        (total, item) => total + item.discountPrice * item.quantity,
        0,
      );
    }
  };

  const resetFormData = () => {
    productBundling_formData.id = null;
    productBundling_formData.name = '';
    productBundling_formData.description = '';
    productBundling_formData.products = [];
    productBundling_formData.type = 'TOTAL_ITEMS';
    productBundling_formData.price = 0;
    productBundling_grandTotal.value = 0;
    productBundling_formValidations.value.$reset();
  };

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

  const productBundling_queryParams = reactive<IProductBundlingListRequestQuery>({
    page: 1,
    limit: 10,
  });

  const productBundling_onChangePage = (page: number): void => {
    productBundling_queryParams.page = page;
  };

  const productBundling_fetchProductBundlingList = async (): Promise<void> => {
    try {
      await store.productBundling_fetchProductBundlingList(productBundling_queryParams, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_PRODUCT_LIST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };
  watch(
    productBundling_queryParams,
    () => {
      productBundling_fetchProductBundlingList();
    },
    { deep: true },
  );

  // convert form data to payload
  const convertFormDataToPayload = () => {
    let payload;
    if (productBundling_formData.type === 'TOTAL_ITEMS') {
      payload = {
        id: productBundling_formData.id || null,
        name: productBundling_formData.name,
        description: productBundling_formData.description,
        products: productBundling_formData.products.map(p => ({ productId: p.id, quantity: p.quantity })),
        type: productBundling_formData.type,
        price: null,
        discount: null,
      };
    } else if (productBundling_formData.type === 'DISCOUNT') {
      payload = {
        id: productBundling_formData.id || null,
        name: productBundling_formData.name,
        description: productBundling_formData.description,
        products: productBundling_formData.products.map(p => ({ productId: p.id, quantity: p.quantity })),
        type: productBundling_formData.type,
        price: null,
        discount: productBundling_formData.price,
      };
    } else if (productBundling_formData.type === 'CUSTOM') {
      payload = {
        id: productBundling_formData.id || null,
        name: productBundling_formData.name,
        description: productBundling_formData.description,
        products: productBundling_formData.products.map(p => ({ productId: p.id, quantity: p.quantity })),
        type: productBundling_formData.type,
        price: productBundling_formData.price,
        discount: null,
      };
    } else {
      payload = {
        id: null,
        name: '',
        description: '',
        products: [],
        type: '',
        price: null,
        discount: null,
      };
    }
    return payload;
  };

  const productBundling_fetchCreateProductBundlingList = async (): Promise<void> => {
    try {
      convertFormDataToPayload();
      const payload = convertFormDataToPayload();
      console.log(
        '🚀 ~ constproductBundling_fetchCreateProductBundlingList= ~ payload:',
        JSON.stringify(payload, null, 2),
      );

      await store.productBundling_fetchCreateProductBundlingList(payload, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_PRODUCT_LIST'),
        paramsSerializer: useParamsSerializer,
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product Bundling created successfully!',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      router.push({ name: 'product-bundling.index' });
      resetFormData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const productBundling_onShowDialogDelete = (id: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'product-bundling-delete-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will stop the current recording and discard any unsaved or draft data.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      width: '600px',
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'product-bundling-delete-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        productBundling_fetchDeleteProductBundlingList(id);
        eventBus.emit('AppBaseDialog', { id: 'product-bundling-delete-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Product Bundling',
      title: 'Are you sure want to cancel this stock opname record process?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const productBundling_fetchDeleteProductBundlingList = async (id: string): Promise<void> => {
    try {
      await store.productBundling_fetchDeleteProductBundlingList(id, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_PRODUCT_LIST'),
        paramsSerializer: useParamsSerializer,
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product Bundling deleted successfully!',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    } finally {
      productBundling_fetchProductBundlingList();
    }
  };

  const productBundling_fetchProductBundlingDetails = async (id: string): Promise<void> => {
    try {
      const data = (await store.productBundling_fetchProductBundlingDetails(id, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_PRODUCT_LIST'),
        paramsSerializer: useParamsSerializer,
      })) as IProductBundlingDetailsResponse;
      productBundling_formData.id = data.id;
      productBundling_formData.name = data.name;
      productBundling_formData.description = data.description;
      productBundling_formData.type = data.type;
      if (data.type === 'DISCOUNT') {
        productBundling_formData.price = (data?.discount || 0);
      } else {
        productBundling_formData.price = data.price;
      }
      productBundling_formData.products =
        data?.products?.map(p => ({
          id: p.product_id,
          name: p.product_name,
          quantity: p.quantity,
          categories: '',
          price: p.product_price,
          discountPrice: p.product_discount_price,
        })) || [];

      calculateTotalPrice();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  const productBundling_fetchUpdateProductBundlingList = async (): Promise<void> => {
    try {
      convertFormDataToPayload();
      const payload = convertFormDataToPayload();
      await store.productBundling_fetchUpdateProductBundlingList(payload, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_PRODUCT_LIST'),
        paramsSerializer: useParamsSerializer,
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product Bundling updated successfully!',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      router.push({ name: 'product-bundling.index' });
      resetFormData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    } finally {
      productBundling_fetchProductBundlingList();
    }
  };

  return {
    // constant
    productBinding_columns: PRODUCT_BUNDLING_COLUMNS,
    productBundling_list,
    productBundling_onChangePage,
    productBundling_isLoading,

    price_type_option: PRICE_TYPE_OPTION,

    productBundling_grandTotal,
    productBundling_formData,
    productBundling_formValidations,

    productBundling_onShowDialogDelete,

    // API
    productBundling_fetchProductList,
    productBundling_fetchProductBundlingList,
    productBundling_fetchCreateProductBundlingList,
    productBundling_fetchProductBundlingDetails,
    productBundling_fetchUpdateProductBundlingList,

    productBundling_productList,
    productList_isLoading,

    // function
    setPricingType,
    calculateTotalPrice,
  };
};
