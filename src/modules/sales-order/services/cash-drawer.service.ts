// Constants
import { LIST_COLUMNS_OF_CASH_DRAWER, LIST_VALUES_OF_CASH_DRAWER } from "../constants/sales-order.constant";

// Interfaces
import type { ICashDrawerFormData, ICashDrawerProvided } from "../interfaces/cash-drawer.interface";

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashDrawerService = (): ICashDrawerProvided => {
  const cashDrawer_formData = reactive<ICashDrawerFormData>({
    balances: [],
    notes: '',
    openBalance: null,
    staffName: 'Samantha',
  })

  /**
   * @description Form validations
   */
  const cashDrawer_formRules = computed(() => ({
    openBalance: { required },
    staffName: { required },
    notes: { required },
  }));
  const cashDrawer_formValidations = useVuelidate(cashDrawer_formRules, cashDrawer_formData);

  /**
   * @description Handle business logic to render dynamic class of status
   */
  const cashDrawer_getClassOfStatus = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-background-success text-success';
      case 'CLOSE':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  }

  /**
   * @description Handle business logic for close dialog open register
   */
  const cashDrawer_onCloseRegister = (): void => {
    const argsEventEmitter = {
      id: 'cash-drawer-setup-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button open register
   */
  const cashDrawer_onOpenRegister = (): void => {
    const argsEventEmitter = {
      id: 'cash-drawer-setup-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '534px'
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    cashDrawer_formData,
    cashDrawer_formValidations,
    cashDrawer_getClassOfStatus,
    cashDrawer_listColumns: LIST_COLUMNS_OF_CASH_DRAWER,
    cashDrawer_listValues: LIST_VALUES_OF_CASH_DRAWER as never[],
    cashDrawer_onCloseRegister,
    cashDrawer_onOpenRegister,
  }
}