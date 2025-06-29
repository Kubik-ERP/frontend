// Constants
import {
  CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER,
  CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER,
  CASH_DRAWER_LIST_VALUES_OF_CASH_REGISTER,
  CASH_DRAWER_TRANSACTION_REQUEST,
} from '../constants';

// Interfaces
import type { ICashDrawerCashRegisterProvide } from '../interfaces/cash-drawer-cash-register.interface';

// Stores
import { useCashDrawerStore } from '../store';

export const useCashDrawerCashRegisterService = (): ICashDrawerCashRegisterProvide => {
  /**
   * @description Injected variables
   */
  const store = useCashDrawerStore(); // Instance of the store
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Handle fetch api cash drawer . We call the cashDrawer_list function from the store to handle the request.
   */
  const cashDrawerCashRegister_fetchTrasanctions = async (id: string): Promise<unknown> => {
    try {
      await store.cashDrawer_transactions(id, {
        ...httpAbort_registerAbort(CASH_DRAWER_TRANSACTION_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

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
    cashDrawerCashRegister_fetchTrasanctions,
    cashDrawerCashRegister_getIconOfTypeCashRegister,
    cashDrawerCashRegister_listColumns: CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER,
    cashDrawerCashRegister_listTypesOfCashRegister: CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER,
    cashDrawerCashRegister_listValuesOfCashRegister: CASH_DRAWER_LIST_VALUES_OF_CASH_REGISTER as never[],
  };
};
