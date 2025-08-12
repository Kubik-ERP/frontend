// Constant
import {
  LOYALTY_POINT_BENEFIT_LIST_COLUMNS,
  LOYALTY_POINT_BENEFIT_LIST_DATA,
} from '../constants/loyalty-point-benefit.constant';

// Type
import type {
  ILoyaltyPointBenefitProvided,
  IDiscountFormData,
  IFreeItemFormData,
} from '../interfaces/loyalty-point-benefit.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
export const useLoyaltyPointBenefitService = (): ILoyaltyPointBenefitProvided => {
  const dailySalesList_onChangePage = () => {
    console.log('onChangePage');
  };

  /**
   * @description Handle business logic for dialog discount
   */

  const discountBenefit_formData = reactive<IDiscountFormData>({
    name: 'Discount 50%',
    pointNeeds: 50,
    discountPrice: {
      value: 50,
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

  const loyaltyPointBenefit_onSubmitDialogDiscount = (): Promise<void> => {
    try {
      console.log(`discountBenefit_formData`, discountBenefit_formData);

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

  const loyaltyPointBenefit_onCloseDialogDiscount = (): void => {
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

  const loyaltyPointBenefit_onCloseDialogFreeItems = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'loyalty-point-benefit-dialog-free-items',
      isOpen: false,
    };
    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    loyaltyPointBenefit_values: LOYALTY_POINT_BENEFIT_LIST_DATA,
    loyaltyPointBenefit_columns: LOYALTY_POINT_BENEFIT_LIST_COLUMNS,
    dailySalesList_onChangePage,

    discountBenefit_formData,
    discountBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogDiscount,
    loyaltyPointBenefit_onShowDialogDiscount,
    loyaltyPointBenefit_onCloseDialogDiscount,

    freeItemsBenefit_formData,
    freeItemsBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogFreeItems,
    loyaltyPointBenefit_onShowDialogFreeItems,
    loyaltyPointBenefit_onCloseDialogFreeItems,
  };
};
