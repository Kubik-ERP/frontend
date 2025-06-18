// Constants
import {
  CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER,
  CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER,
  CASH_DRAWER_LIST_VALUES_OF_CASH_REGISTER,
} from '../constants';

// Interfaces
import type { ICashDrawerCashRegisterProvide } from '../interfaces/cash-drawer-cash-register.interface';

export const useCashDrawerCashRegisterService = (): ICashDrawerCashRegisterProvide => {
  /**
   * @description Handle business logic to return dynamic icon name of type cash register
   */
  const cashDrawerCashRegister_getIconOfTypeCashRegister = (type: string): string => {
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
  };

  return {
    cashDrawerCashRegister_getIconOfTypeCashRegister,
    cashDrawerCashRegister_listColumns: CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER,
    cashDrawerCashRegister_listTypesOfCashRegister: CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER,
    cashDrawerCashRegister_listValuesOfCashRegister: CASH_DRAWER_LIST_VALUES_OF_CASH_REGISTER as never[],
  };
};
