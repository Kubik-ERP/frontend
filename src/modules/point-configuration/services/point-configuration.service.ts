// store
import { usePointConfigurationStore } from '../store';

// Constant
import {
  LIST_TABS_POINT_CONFIGURATION,
  LOYALTY_POINT_SETTINGS_PRODUCT_LIST_COLUMNS,
  LOYALTY_POINT_SETTINGS_SELECT_PRODUCT_LIST_COLUMNS,
} from '../constants/point-configuration.constant';

// Type
import {
  ILoyaltyPointSettingsProvided,
  IQueryParams,
  ILoyaltyPointSettingsFormData,
  ILoyaltyPointSettingsAllProductListQueryParams,
  ISelectedProducts,
  // IProductWithSelection,
  IProduct,
} from '../interfaces/point-configuration.interface';
// Service

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const usePointConfigurationService = (): ILoyaltyPointSettingsProvided => {
  const router = useRouter();

  const pointConfiguration_activeTab = ref<string>('loyalty-point-benefit');

  const loyaltyPointSettings_formData = reactive<ILoyaltyPointSettingsFormData>({
    spendBased: false,
    spendBasedMinTransaction: 0,
    spendBasedPointEarned: 0,
    spendBasedExpiration: 0,
    spendBasedApplyMultiple: false,
    spendBasedEarnWhenRedeem: false,
    productBased: false,
    productBasedItems: [],
    productBasedExpiration: 0,
    productBasedApplyMultiple: false,
    productBasedEarnWhenRedeem: false,
  });

  const loyaltyPointSettings_formRules = computed(() => ({
    spendBasedMinTransaction: {
      required,
    },
    spendBasedPointEarned: {
      required,
    },
    spendBasedExpiration: {
      required,
    },
    productBasedExpiration: {
      required,
    },
  }));

  const loyaltyPointSettings_formValidations = useVuelidate(
    loyaltyPointSettings_formRules,
    loyaltyPointSettings_formData,
    {
      $autoDirty: true,
    },
  );

  const loyaltyPointSettings_formDataReset = (): void => {
    Object.assign(loyaltyPointSettings_formData, {
      spendBased: false,
      spendBasedMinTransaction: 0,
      spendBasedPointEarned: 0,
      spendBasedExpiration: 0,
      spendBasedApplyMultiple: false,
      spendBasedEarnWhenRedeem: false,
      productBased: false,
      productBasedItems: [],
      productBasedExpiration: 0,
      productBasedApplyMultiple: false,
      productBasedEarnWhenRedeem: false,
    });

    loyaltyPointSettings_formValidations.value.$reset();
  };

  const loyaltyPointSettings_onSubmit = async (): Promise<void> => {
    try {
      await store.loyaltySettings_update(loyaltyPointSettings_formData, {
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_UPDATE_REQUEST'),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Loyalty Settings has been updated successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      router.push({ name: 'point-configuration.index' });
      loyaltyPointSettings_formDataReset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  watch(
    pointConfiguration_activeTab,
    async newTab => {
      switch (newTab.toUpperCase()) {
        case 'LOYALTY-POINT-BENEFIT': {
          // Handle logic for loyalty point benefit tab
          break;
        }
        case 'LOYALTY-POINT-SETTING': {
          // Handle logic for loyalty point setting tab
          break;
        }
      }
    },
    { immediate: true },
  );

  const store = usePointConfigurationStore();
  const {
    loyaltyPointSettingsProduct_isLoading,
    loyaltyPointSettingsProduct_value,
    loyaltyPointSettings_isLoading,
    loyaltyPointSettings_value,
    loyaltyPointSettings_allProductList,
    allProductList_isLoading,
  } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const loyaltyPointSettingsDetail_loadData = (): void => {
    loyaltyPointSettings_formData.spendBased = loyaltyPointSettings_value.value?.spendBased ?? false;
    loyaltyPointSettings_formData.spendBasedMinTransaction =
      loyaltyPointSettings_value.value?.minimumTransaction ?? 0;
    loyaltyPointSettings_formData.spendBasedPointEarned =
      loyaltyPointSettings_value.value?.pointsPerTransaction ?? 0;
    loyaltyPointSettings_formData.spendBasedExpiration =
      loyaltyPointSettings_value.value?.spendBasedPointsExpiryDays ?? 0;
    loyaltyPointSettings_formData.spendBasedApplyMultiple =
      loyaltyPointSettings_value.value?.spendBasedPointsApplyMultiple ?? false;
    loyaltyPointSettings_formData.spendBasedEarnWhenRedeem =
      loyaltyPointSettings_value.value?.spendBasedGetPointsOnRedemption ?? false;
    loyaltyPointSettings_formData.productBased = loyaltyPointSettings_value.value?.productBased ?? false;
    loyaltyPointSettings_formData.productBasedExpiration =
      loyaltyPointSettings_value.value?.productBasedPointsExpiryDays ?? 0;
    loyaltyPointSettings_formData.productBasedApplyMultiple =
      loyaltyPointSettings_value.value?.productBasedPointsApplyMultiple ?? false;
    loyaltyPointSettings_formData.productBasedEarnWhenRedeem =
      loyaltyPointSettings_value.value?.productBasedGetPointsOnRedemption ?? false;
  };

  const loyaltyPointSettingsDetail = async (): Promise<void> => {
    try {
      await store.loyaltySettings_fetchDetails({
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_LIST_REQUEST'),
      });

      loyaltyPointSettingsDetail_loadData();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const loyaltyPointSettingsProduct = async (): Promise<void> => {
    try {
      await store.loyaltySettings_fetchProductList(loyaltyPointSettingsProduct_queryParams, {
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_PRODUCT_LIST_REQUEST'),
      });
      loyaltyPointSettings_formData.productBasedItems = loyaltyPointSettingsProduct_value.value.data.map(
        ({ productId, points, minimumTransaction, products }) => ({
          productId: productId,
          name: products.name,
          price: products.price,
          pointsEarned: points,
          minimumPurchase: minimumTransaction,
        }),
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const loyaltyPointSettingsProduct_queryParams = reactive<IQueryParams>({
    page: 1,
    pageSize: 5,
  });

  const loyaltyPointSettingsProduct_onChangePage = (page: number): void => {
    loyaltyPointSettingsProduct_queryParams.page = page;
  };

  watch(
    () => loyaltyPointSettingsProduct_queryParams,
    debounce(async () => {
      await loyaltyPointSettingsProduct();
    }, 500),
    { deep: true },
  );

  const loyaltyPointSettings_populateDialog = (): void => {
    selectedProducts.value = loyaltyPointSettings_formData.productBasedItems.map(
      ({ productId, name, price, pointsEarned, minimumPurchase }) => ({
        productId: productId,
        pointsEarned: pointsEarned,
        minimumPurchase: minimumPurchase,
        name,
        price,
      }),
    );
  };

  // const loyaltyPointSettings_onShowDialogEditProduct = (productName: string): void => {
  //   loyaltyPointSettingAllProductQueryParams.search = productName;
  //   loyaltyPointSettings_onShowDialog();
  // };
  const loyaltyPointSettings_EditProduct = ref<IProduct[] | null>(null);

  const loyaltyPointSettings_onShowDialogEditProduct = (product: IProduct): void => {
    loyaltyPointSettings_EditProduct.value = [{ ...product }];
    console.log(loyaltyPointSettings_EditProduct.value);
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-settings-dialog-edit-product',
      isOpen: true,
      isUsingClosableButton: false,
      // width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointSettings_onCloseDialogEditProduct = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-settings-dialog-edit-product',
      isOpen: false,
      isUsingClosableButton: false,
      // width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointSettings_onSubmitDialogEditProduct = (): void => {
    const productIndex = loyaltyPointSettings_formData.productBasedItems.findIndex(
      product => product.productId === loyaltyPointSettings_EditProduct.value?.[0].productId,
    );
    if (productIndex !== -1) {
      loyaltyPointSettings_formData.productBasedItems[productIndex] = {
        ...loyaltyPointSettings_EditProduct.value?.[0],
      };
    }
    loyaltyPointSettings_onCloseDialogEditProduct();
  };

  const loyaltyPointSettings_onShowDialog = async (): Promise<void> => {
    await loyaltyPointSettings_fetchAllProduct();
    loyaltyPointSettings_populateDialog();
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-settings-dialog-select-product',
      isOpen: true,
      isUsingClosableButton: false,
      // width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointSettings_onCloseDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-settings-dialog-select-product',
      isOpen: false,
      isUsingClosableButton: false,
      // width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointSettingAllProductQueryParams = reactive<ILoyaltyPointSettingsAllProductListQueryParams>({
    page: 1,
    limit: 5,
    search: null,
  });

  const loyaltyPointSettings_fetchAllProduct = async (): Promise<void> => {
    try {
      await store.loyaltySettings_fetchAllProductList(loyaltyPointSettingAllProductQueryParams, {
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_PRODUCT_LIST_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const loyaltyPointSettingsAllProduct_onChangePage = (page: number): void => {
    loyaltyPointSettingAllProductQueryParams.page = page;
  };

  watch(
    () => loyaltyPointSettingAllProductQueryParams,
    debounce(async () => {
      await loyaltyPointSettings_fetchAllProduct();
    }, 500),
    { deep: true },
  );

  // This remains the single source of truth for what is selected.
  const selectedProducts = ref<ISelectedProducts[]>([]);

  // ✅ HELPER 1: A simple function to check if a product is in our selection pool.
  const isProductSelected = (product: IProduct): boolean => {
    return selectedProducts.value.some(p => p.productId === product.id);
  };

  // ✅ HELPER 2: A function to get the full data object from the selection pool.
  // This is needed for v-model on the number inputs.
  const getSelectedProductData = (product: IProduct): ISelectedProducts | undefined => {
    return selectedProducts.value.find(p => p.productId === product.id);
  };

  // ✅ HELPER 3: This function now handles the checkbox click directly.
  const loyaltyPointSettings_toggleSelection = (product: IProduct): void => {
    if (isProductSelected(product)) {
      // If it's already selected, remove it
      selectedProducts.value = selectedProducts.value.filter(p => p.productId !== product.id);
    } else {
      // If it's not selected, add it with default values
      selectedProducts.value.push({
        productId: product.id,
        pointsEarned: 0,
        minimumPurchase: 0,
        name: product.name,
        price: product.price,
      });
    }
  };

  // ✅ HELPER 4: A NEW function to handle InputNumber changes
  const loyaltyPointSettings_updateProductValue = (
    product: IProduct,
    field: 'pointsEarned' | 'minimumPurchase',
    newValue: number,
  ): void => {
    const productToUpdate = selectedProducts.value.find(p => p.productId === product.id);
    if (productToUpdate) {
      productToUpdate[field] = newValue;
    }
  };

  // const selectedProducts = ref<ISelectedProducts[]>([]);

  // watch(
  //   [() => loyaltyPointSettings_allProductList.value.products, selectedProducts],
  //   ([productList, selectionList]) => {
  //     if (!productList) return;

  //     const selectedMap = new Map(selectionList.map(p => [p.productId, p]));

  //     // 2. Loop through the products currently displayed in the table
  //     (productList as IProductWithSelection[]).forEach(productInTable => {
  //       const selectionData = selectedMap.get(productInTable.id);

  //       if (selectionData) {
  //         productInTable.isSelected = true;
  //         productInTable.points_earned = selectionData.pointsEarned;
  //         productInTable.minimum_purchase = selectionData.minimumPurchase;
  //       } else {
  //         productInTable.isSelected = false;
  //         productInTable.points_earned = 0;
  //         productInTable.minimum_purchase = 0;
  //       }
  //     });
  //   },
  //   { deep: true },
  // );

  // // This watcher handles when the user physically clicks a checkbox
  // watch(
  //   () => loyaltyPointSettings_allProductList.value.products,
  //   newProductList => {
  //     if (!newProductList || !Array.isArray(newProductList)) return;
  //     const currentlySelected = (newProductList as IProductWithSelection[]).filter(p => p.isSelected);

  //     selectedProducts.value = currentlySelected.map(p => ({
  //       productId: p.id,
  //       pointsEarned: p.points_earned,
  //       minimumPurchase: p.minimum_purchase,
  //       name: p.name,
  //       price: p.price,
  //     }));
  //   },
  //   { deep: true },
  // );

  const loyaltyPointSettings_onSubmitDialog = (): void => {
    const currentItems = new Map(
      loyaltyPointSettings_formData.productBasedItems.map(item => [item.productId, item]),
    );

    (
      selectedProducts.value as {
        productId: string;
        name: string;
        price: number;
        pointsEarned: number;
        minimumPurchase: number;
      }[]
    ).forEach(product => {
      currentItems.set(product.productId, product);
    });

    loyaltyPointSettings_formData.productBasedItems = Array.from(currentItems.values());
    selectedProducts.value = [];
    loyaltyPointSettings_onCloseDialog();
  };

  const loyaltyPointSettings_fetchDeleteProduct = async (productId: string): Promise<void> => {
    try {
      loyaltyPointSettings_formData.productBasedItems = loyaltyPointSettings_formData.productBasedItems.filter(
        item => item.productId !== productId,
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Product has been Removed successfully.',
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
      await loyaltyPointSettings_fetchAllProduct();
    }
  };

  const loyaltyPointSettings_onDeleteProduct = (productId: string): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'loyalty-point-setting-delete-dialog-confirmation',
      description: 'This action cannot be undone, and the Product you remove will be deleted from the system',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'loyalty-point-setting-delete-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'loyalty-point-setting-delete-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        await loyaltyPointSettings_fetchDeleteProduct(productId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Product Benefit',
      title: 'Are you sure want to delete this Product Benefit?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  return {
    pointConfiguration_activeTab,
    pointConfiguration_listTabs: LIST_TABS_POINT_CONFIGURATION,

    loyaltyPointSettings_isLoading,
    loyaltyPointSettings_value,
    loyaltyPointSettingsDetail,

    // table
    loyaltyPointSettingsProduct_columns: LOYALTY_POINT_SETTINGS_PRODUCT_LIST_COLUMNS,
    loyaltyPointSettingsProduct,
    loyaltyPointSettingsProduct_isLoading,
    loyaltyPointSettingsProduct_value,
    loyaltyPointSettingsProduct_onChangePage,

    // form
    loyaltyPointSettings_formData,
    loyaltyPointSettings_formValidations,
    loyaltyPointSettings_onSubmit,

    // dialog
    loyaltyPointSettings_onShowDialog,
    loyaltyPointSettings_onCloseDialog,
    loyaltyPointSettings_columns: LOYALTY_POINT_SETTINGS_SELECT_PRODUCT_LIST_COLUMNS,
    loyaltyPointSettings_fetchAllProduct,
    loyaltyPointSettings_allProductList,
    allProductList_isLoading,
    loyaltyPointSettingAllProductQueryParams,
    loyaltyPointSettingsAllProduct_onChangePage,
    selectedProducts,
    loyaltyPointSettings_onSubmitDialog,
    loyaltyPointSettings_onShowDialogEditProduct,
    loyaltyPointSettings_onCloseDialogEditProduct,
    loyaltyPointSettings_onDeleteProduct,

    isProductSelected,
    getSelectedProductData,
    loyaltyPointSettings_toggleSelection,
    loyaltyPointSettings_updateProductValue,
    loyaltyPointSettings_EditProduct,
    loyaltyPointSettings_onSubmitDialogEditProduct,
  };
};
