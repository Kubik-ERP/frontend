// Constants
import {
  CASH_DRAWER_LIST_COLUMNS,
  CASH_DRAWER_LIST_REQUEST,
  CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
} from '../constants/cash-drawer.constant';

// Interfaces
import type {
  ICashDrawerListProvided,
  ICashDrawerOpenFormData,
  ICashDrawerRequestQuery,
} from '../interfaces/cash-drawer-list.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useCashDrawerStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashDrawerListService = (): ICashDrawerListProvided => {
  /**
   * @description Injected variables
   */
  const outletStore = useOutletStore(); // Instance of the outlet store
  const store = useCashDrawerStore(); // Instance of the store
  const { cashDrawer_isLoading, cashDrawer_transactionLists } = storeToRefs(store);
  const { outlet_currentOutlet } = storeToRefs(outletStore);
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
   * @description Form validations
   */
  const cashDrawerList_formRulesOfOpenRegister = computed(() => ({
    balance: { required },
    userId: { required },
  }));
  const cashDrawerList_formValidationsOfOpenRegister = useVuelidate(
    cashDrawerList_formRulesOfOpenRegister,
    cashDrawerList_formDataOfOpenRegister,
  );

  /**
   * @description Handle fetch api cash drawer . We call the cashDrawer_list function from the store to handle the request.
   */
  const cashDrawerList_fetchListTransactions = async (): Promise<unknown> => {
    try {
      await store.cashDrawer_list(outlet_currentOutlet.value!.id, cashDrawerList_queryParams, {
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
   * @description Handle business logic for close dialog open register
   */
  const cashDrawerList_onCloseOpenRegisterDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-list-open-register-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button open register
   */
  const cashDrawerList_onShowOpenRegisterDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-list-open-register-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    cashDrawerList_columns: CASH_DRAWER_LIST_COLUMNS,
    cashDrawerList_fetchListTransactions,
    cashDrawerList_formDataOfOpenRegister,
    cashDrawerList_formValidationsOfOpenRegister,
    cashDrawerList_getClassOfStatus,
    cashDrawerList_isLoading: cashDrawer_isLoading,
    cashDrawerList_onCloseOpenRegisterDialog,
    cashDrawerList_onShowOpenRegisterDialog,
    cashDrawerList_queryParams,
    cashDrawerList_suggestionRegisterBalance: CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
    cashDrawerList_values: cashDrawer_transactionLists as unknown as never[],
  };
};
