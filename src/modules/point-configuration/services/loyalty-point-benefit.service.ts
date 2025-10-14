// Constant
import {
  LOYALTY_POINT_BENEFIT_LIST_REQUEST,
  LOYALTY_POINT_BENEFIT_LIST_COLUMNS,
} from '../constants/loyalty-point-benefit.constant';

// Type
import type {
  ILoyaltyPointBenefitProvided,
  IDiscountFormData,
  IFreeItemFormData,
  IPointConfigurationListRequestQuery,
  ILoyaltyPointBenefit,
  IProductListRequestQuery,
} from '../interfaces/loyalty-point-benefit.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required, helpers, minValue } from '@vuelidate/validators';

// store
import { usePointConfigurationStore } from '../store';

export const useLoyaltyPointBenefitService = (): ILoyaltyPointBenefitProvided => {
  const router = useRouter();
  const store = usePointConfigurationStore();
  const {
    loyaltyPointBenefit_isLoading,
    loyaltyPointBenefit_list,
    productList_isLoading,
    loyaltyPointBenefit_productList,
  } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const isEdit = ref(false);

  /**
   * @description Handle business logic for dialog discount
   */

  const discountBenefit_formData = reactive<IDiscountFormData>({
    id: null,
    name: '',
    pointNeeds: 0,
    discountPrice: {
      value: 0,
      unit: '%',
      isPercent: true,
    },
  });

  const dicountBenefit_formRules = computed(() => ({
    name: {
      required,
    },
    pointNeeds: {
      required,
    },
    discountPrice: {
      value: {
        required,
      },
    },
  }));

  const discountBenefit_formValidations = useVuelidate(dicountBenefit_formRules, discountBenefit_formData, {
    $autoDirty: true,
  });

  const discountBenefit_formDataReset = (): void => {
    isEdit.value = false;
    discountBenefit_formData.name = '';
    discountBenefit_formData.pointNeeds = 0;
    discountBenefit_formData.discountPrice.value = 0;
    discountBenefit_formData.discountPrice.unit = '%';
    discountBenefit_formData.discountPrice.isPercent = true;
    discountBenefit_formValidations.value.$reset();
  };

  const loyaltyPointBenefit_onSubmitDialogDiscount = async (): Promise<void> => {
    try {
      const payload = {
        benefitType: 'discount',
        benefitName: discountBenefit_formData.name,
        pointNeeds: discountBenefit_formData.pointNeeds,
        value: discountBenefit_formData.discountPrice.value,
        isPercent: discountBenefit_formData.discountPrice.unit === '%' ? true : false,
      };

      // await store.loyaltyPointBenefit_addBenefit(payload, {
      //   ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_CREATE_DISCOUNT_REQUEST'),
      // });

      await store.loyaltyPointBenefit_addBenefit(payload, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_CREATE_DISCOUNT_REQUEST'),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Discount Benefit has been added successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return Promise.resolve();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      loyaltyPointBenefit_onCloseDialogDiscount();
      loyaltyPointBenefit_fetchList();
    }
  };
  const loyaltyPointBenefit_onSubmitEditDialogDiscount = async (): Promise<void> => {
    try {
      const payload = {
        id: discountBenefit_formData.id,
        benefitType: 'discount',
        benefitName: discountBenefit_formData.name,
        pointNeeds: discountBenefit_formData.pointNeeds,
        value: discountBenefit_formData.discountPrice.value,
        isPercent: discountBenefit_formData.discountPrice.unit === '%' ? true : false,
      };

      await store.loyaltyPointBenefit_editBenefit(payload, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_CREATE_DISCOUNT_REQUEST'),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Discount Benefit has been Edited successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      return Promise.resolve();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      loyaltyPointBenefit_onCloseDialogDiscount();
      loyaltyPointBenefit_fetchList();
    }
  };

  const loyaltyPointBenefit_onShowDialogDiscount = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-discount',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointBenefit_onShowEditDialogDiscount = (data: ILoyaltyPointBenefit): void => {
    isEdit.value = true;
    discountBenefit_formData.id = data.id;
    discountBenefit_formData.name = data.benefitName;
    discountBenefit_formData.pointNeeds = data.pointNeeds;

    if ('value' in data.discountFreeItems) {
      discountBenefit_formData.discountPrice.value = data.discountFreeItems.value;
      if (data.discountFreeItems.isPercent) {
        discountBenefit_formData.discountPrice.unit = '%';
        discountBenefit_formData.discountPrice.isPercent = true;
      } else {
        discountBenefit_formData.discountPrice.unit = 'Rp';
        discountBenefit_formData.discountPrice.isPercent = false;
      }
    } else {
      // Handle the case where data.discountFreeItems is an array of IFreeItems
    }

    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-discount',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointBenefit_onCloseDialogDiscount = (): void => {
    discountBenefit_formDataReset();
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-discount',
      isOpen: false,
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for dialog free items
   */

  const freeItemsBenefit_formData = reactive<IFreeItemFormData>({
    id: null,
    name: '',
    pointNeeds: 0,
    freeItems: [],
  });

  const freeItemsBenefit_formRules = computed(() => ({
    name: {
      required,
    },
    pointNeeds: {
      required,
    },
    freeItems: {
      required: helpers.withMessage('At least one free item is required', required),
      $each: helpers.forEach({
        quantity: {
          required: helpers.withMessage('Quantity is required', required),
          minValue: helpers.withMessage('Quantity must be at least 1', minValue(1)),
        },
      }),
    },
  }));

  const freeItemsBenefit_formValidations = useVuelidate(freeItemsBenefit_formRules, freeItemsBenefit_formData, {
    $autoDirty: true,
  });

  const loyaltyPointBenefit_onSubmitDialogFreeItems = async (): Promise<void> => {
    try {
      const payload = {
        benefitType: 'free_items',
        benefitName: freeItemsBenefit_formData.name,
        pointNeeds: freeItemsBenefit_formData.pointNeeds,
        items: freeItemsBenefit_formData.freeItems.map(item => ({
          productId: item.id ?? '',
          quantity: item.quantity,
        })),
      };

      await store.loyaltyBenefit_addFreeItems(payload, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_CREATE_FREE_ITEMS_REQUEST'),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Free Items Benefit has been added successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      return Promise.resolve();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      loyaltyPointBenefit_onCloseDialogFreeItems();
      loyaltyPointBenefit_fetchList();
    }
  };

  const loyaltyPointBenefit_onSubmitEditDialogFreeItems = async (): Promise<void> => {
    try {
      const payload = {
        id: freeItemsBenefit_formData.id!,
        benefitType: 'free_items',
        benefitName: freeItemsBenefit_formData.name,
        pointNeeds: freeItemsBenefit_formData.pointNeeds,
        items: freeItemsBenefit_formData.freeItems.map(item => ({
          productId: item.id ?? '',
          quantity: item.quantity,
        })),
      };

      await store.loyaltyBenefit_updateFreeItems(payload, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_UPDATE_FREE_ITEMS_REQUEST'),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Free Items Benefit has been updated successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      return Promise.resolve();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      loyaltyPointBenefit_onCloseDialogFreeItems();
      loyaltyPointBenefit_fetchList();
    }
  };

  const loyaltyPointBenefit_onShowDialogFreeItems = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-free-items',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };
  const loyaltyPointBenefit_onShowEditDialogFreeItems = (data: ILoyaltyPointBenefit): void => {
    isEdit.value = true;
    freeItemsBenefit_formData.id = data.id;
    freeItemsBenefit_formData.name = data.benefitName;
    freeItemsBenefit_formData.pointNeeds = data.pointNeeds;
    freeItemsBenefit_formData.freeItems = Array.isArray(data.discountFreeItems)
      ? data.discountFreeItems.map(item => ({ ...item }))
      : [];
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-free-items',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const freeItemsBenefit_formDataReset = (): void => {
    isEdit.value = false;
    freeItemsBenefit_formData.name = '';
    freeItemsBenefit_formData.pointNeeds = 0;
    freeItemsBenefit_formData.freeItems = [];
    freeItemsBenefit_formValidations.value.$reset();
  };

  const loyaltyPointBenefit_onCloseDialogFreeItems = (): void => {
    freeItemsBenefit_formDataReset();
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-free-items',
      isOpen: false,
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointBenefit_queryParams = reactive<IPointConfigurationListRequestQuery>({
    page: 1,
    limit: 10,
  });

  const loyaltyPointBenefit_fetchDeleteBenefit = async (id: string): Promise<void> => {
    try {
      await store.loyaltyPointBenefit_deleteBenefit(id, {
        ...httpAbort_registerAbort('LOYALTY_POINT_BENEFIT_DELETE_BENEFIT_REQUEST'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Benefit has been deleted successfully.',
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

  const loyaltyPointBenefit_onDelete = async (id: string): Promise<void> => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'loyalty-point-benefit-delete-dialog-confirmation',
      description: 'This action cannot be undone, and the Benefit you remove will be deleted from the system',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'loyalty-point-benefit-delete-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'loyalty-point-benefit-delete-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        await loyaltyPointBenefit_fetchDeleteBenefit(id);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Loyalty Benefit',
      title: 'Are you sure want to delete this Loyalty Benefit?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  const loyaltyPointBenefit_fetchList = async (): Promise<void> => {
    try {
      await store.loyaltyPointBenefit_fetchlist(loyaltyPointBenefit_queryParams, {
        ...httpAbort_registerAbort(LOYALTY_POINT_BENEFIT_LIST_REQUEST),
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

  const product_queryParams = reactive<IProductListRequestQuery>({
    page: 1,
    limit: 100,
    search: '',
  });
  const loyaltyPointBenefit_fetchProductList = async (): Promise<void> => {
    try {
      await store.loyaltyPointBenefit_fetchProductList(product_queryParams, {
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

  const dailySalesList_onChangePage = (page: number): void => {
    loyaltyPointBenefit_queryParams.page = page;
  };
  watch(
    () => loyaltyPointBenefit_queryParams,
    debounce(async () => {
      await loyaltyPointBenefit_fetchList();
    }, 500),
    { deep: true },
  );
  const loyaltyPointSettings_initiate = async (): Promise<void> => {
    try {
      await store.loyaltySettings_initiate({
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_INITIATE_REQUEST'),
      });
      // toast
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Loyalty Point Settings has been initiated successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      router.push({ name: 'loyalty-point-setting.edit' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      await loyaltyPointBenefit_fetchList();
    }
  };
  return {
    loyaltyPointBenefit_columns: LOYALTY_POINT_BENEFIT_LIST_COLUMNS,
    dailySalesList_onChangePage,

    //     loyalty point benefit
    loyaltyPointBenefit_isLoading,
    isEdit,

    loyaltyPointBenefit_fetchProductList,

    discountBenefit_formData,
    discountBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogDiscount,
    loyaltyPointBenefit_onShowDialogDiscount,
    loyaltyPointBenefit_onShowEditDialogDiscount,
    loyaltyPointBenefit_onSubmitEditDialogDiscount,
    loyaltyPointBenefit_onCloseDialogDiscount,
    loyaltyPointBenefit_fetchList,
    loyaltyPointBenefit_onDelete,

    loyaltyPointBenefit_queryParams,
    loyaltyPointBenefit_list,

    freeItemsBenefit_formData,
    freeItemsBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogFreeItems,
    loyaltyPointBenefit_onSubmitEditDialogFreeItems,
    loyaltyPointBenefit_onShowEditDialogFreeItems,
    loyaltyPointBenefit_onShowDialogFreeItems,
    loyaltyPointBenefit_onCloseDialogFreeItems,

    productList_isLoading,
    loyaltyPointBenefit_productList,
    loyaltyPointSettings_initiate,
  };
};
