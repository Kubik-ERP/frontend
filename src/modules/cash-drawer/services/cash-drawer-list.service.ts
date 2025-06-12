// Constants
import {
  CASH_DRAWER_LIST_COLUMNS,
  CASH_DRAWER_LIST_REQUEST,
  // CASH_DRAWER_OPEN_REQUEST,
} from '../constants/cash-drawer.constant';

// Interfaces
import type { ICashDrawerOpenFormData, ICashDrawerRequestQuery } from '../interfaces/cash-drawer-list.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useCashDrawerStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashDrawerListService = () => {
  /**
   * @description Injected variables
   */
  const store = useCashDrawerStore(); // Instance of the store
  const { cashDrawer_isLoading, cashDrawer_transactionLists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const cashDrawerList_formDataOfOpenRegister = reactive<ICashDrawerOpenFormData>({
    balance: null,
    userId: null,
    notes: null,
  });
  const cashDrawerList_queryParams = reactive<ICashDrawerRequestQuery>({
    endDate: null,
    limit: 10,
    page: 1,
    startDate: null,
    type: null,
  });

  /**
   * @description Handle fetch api cash drawer . We call the cashDrawer_list function from the store to handle the request.
   */
  const cashDrawerList_fetchListTransactions = async (): Promise<unknown> => {
    try {
      await store.cashDrawer_list('0', cashDrawerList_queryParams, {
        ...httpAbort_registerAbort(CASH_DRAWER_LIST_REQUEST),
      });
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic to render dynamic class of status
   */
  const cashDrawerList_getClassOfStatus = (status: string): string => {
    switch (status.toUpperCase()) {
      case 'OPEN':
        return 'bg-background-success text-success';
      case 'CLOSE':
        return 'bg-error-background text-error-main';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic for event click button open register
   */
  const cashDrawerList_onOpenDialogOpenRegister = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-dialog-open-register',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '534px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    cashDrawerList_columns: CASH_DRAWER_LIST_COLUMNS,
    cashDrawerList_fetchListTransactions,
    cashDrawerList_formDataOfOpenRegister,
    cashDrawerList_getClassOfStatus,
    cashDrawerList_isLoading: cashDrawer_isLoading,
    cashDrawerList_onOpenDialogOpenRegister,
    cashDrawerList_queryParams,
    cashDrawerList_values: cashDrawer_transactionLists,
  };
};
