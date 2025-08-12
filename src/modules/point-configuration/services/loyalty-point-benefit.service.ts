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
} from '../interfaces/loyalty-point-benefit.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

// store
import { usePointConfigurationStore } from '../store';

export const useLoyaltyPointBenefitService = (): ILoyaltyPointBenefitProvided => {
  const store = usePointConfigurationStore();
  const { loyaltyPointBenefit_isLoading, loyaltyPointBenefit_list } = storeToRefs(store);
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

    console.log(discountBenefit_formData);

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
    name: 'Free Item',
    pointNeeds: 50,
    freeItems: [
      {
        name: 'Free Item 1',
        quantity: 1,
      },
      {
        name: 'Free Item 2',
        quantity: 1,
      },
    ],
  });

  const freeItemsBenefit_formRules = computed(() => ({
    name: {
      required,
    },
    pointNeeds: {
      required,
    },
  }));

  const freeItemsBenefit_formValidations = useVuelidate(freeItemsBenefit_formRules, freeItemsBenefit_formData, {
    $autoDirty: true,
  });

  const loyaltyPointBenefit_onSubmitDialogFreeItems = (): Promise<void> => {
    try {
      console.log(`freeItemsBenefit_formData`, freeItemsBenefit_formData);

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
  const loyaltyPointBenefit_onShowEditDialogFreeItems = (data: IFreeItemFormData): void => {
    console.log(data);
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-free-items',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  const loyaltyPointBenefit_onCloseDialogFreeItems = (): void => {
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

  return {
    loyaltyPointBenefit_columns: LOYALTY_POINT_BENEFIT_LIST_COLUMNS,
    dailySalesList_onChangePage,

    //     loyalty point benefit
    loyaltyPointBenefit_isLoading,
    isEdit,

    discountBenefit_formData,
    discountBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogDiscount,
    loyaltyPointBenefit_onShowDialogDiscount,
    loyaltyPointBenefit_onShowEditDialogDiscount,
    loyaltyPointBenefit_onSubmitEditDialogDiscount,
    loyaltyPointBenefit_onCloseDialogDiscount,
    loyaltyPointBenefit_fetchList,

    loyaltyPointBenefit_queryParams,
    loyaltyPointBenefit_list,

    freeItemsBenefit_formData,
    freeItemsBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogFreeItems,
    loyaltyPointBenefit_onShowEditDialogFreeItems,
    loyaltyPointBenefit_onShowDialogFreeItems,
    loyaltyPointBenefit_onCloseDialogFreeItems,
  };
};
