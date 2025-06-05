// Constants
import { LIST_COLUMNS_OF_CASH_DRAWER, LIST_VALUES_OF_CASH_DRAWER } from "../constants/sales-order.constant";
import { LIST_COLUMNS_OF_CASH_REGISTER, LIST_TYPES_OF_CASH_REGISTER, LIST_VALUES_OF_CASH_REGISTER } from "../constants/cash-drawer.constant";

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
  /**
   * @description Reactive data binding
   */
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
   * @description Handle business logic to return dynamic icon name of type cash register
   */
  const cashDrawer_getIconOfTypeCashRegister = (type: string): string => {
    switch (type.toUpperCase()) {
      case 'CASH IN':
        return 'arrow-right-circle-success';
      case 'CASH OUT':
        return 'arrow-left-circle-danger';
      case 'CASH REFUND':
        return 'flip-backward-circle';
      case 'OPENING BALANCE':
        return 'cashier-circle';
      case 'SALE':
        return 'receipt-circle';
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
    cashDrawer_getIconOfTypeCashRegister,
    cashDrawer_listColumns: LIST_COLUMNS_OF_CASH_DRAWER,
    cashDrawer_listColumnsOfCashRegister: LIST_COLUMNS_OF_CASH_REGISTER,
    cashDrawer_listTypesOfCashRegister: LIST_TYPES_OF_CASH_REGISTER,
    cashDrawer_listValues: LIST_VALUES_OF_CASH_DRAWER as never[],
    cashDrawer_listValuesOfCashRegister: LIST_VALUES_OF_CASH_REGISTER as never[],
    cashDrawer_onCloseRegister,
    cashDrawer_onOpenRegister,
  }
}