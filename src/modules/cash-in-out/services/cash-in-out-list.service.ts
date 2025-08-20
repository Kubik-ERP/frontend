// Constants
import {
  CASH_IN_OUT_LIST_COLUMNS,
  CASH_IN_OUT_LIST_REQUEST,
  CASH_IN_OUT_LIST_TYPES_OF_CASH_IN_OUT,
} from '../constants';

// Interfaces
import type { ICashInOutListFormData, ICashInOutListProvided, ICashInOutListRequestQuery } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useCashInOutStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashInOutListService = (): ICashInOutListProvided => {
  /**
   * @description Injected variables
   */
  const store = useCashInOutStore(); // Instance of the store
  const { cashInOut_isLoading, cashInOut_list } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const cashInOutList_formData = reactive<ICashInOutListFormData>({
    amount: 0,
    notes: '',
    title: '',
    type: 'Cash In',
  });
  const cashInOutList_queryParams = reactive<ICashInOutListRequestQuery>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toLocaleDateString('sv-SE', {
      timeZone: 'Asia/Jakarta',
    }), // Two weeks ago in Jakarta timezone
    endDate: new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' }), // Today in Jakarta timezone
  });

  /**
   * @description Form validations
   */
  const cashInOutList_formRules = computed(() => ({
    amount: { required },
    notes: { required },
    title: { required },
    type: { required },
  }));
  const cashInOutList_formValidations = useVuelidate(cashInOutList_formRules, cashInOutList_formData);

  /**
   * @description Handle fetch api cash in out . We call the cashInOut_list function from the store to handle the request.
   */
  const cashInOutList_fetchListTransactions = async (): Promise<unknown> => {
    try {
      await store.fetchCashInOut_list(cashInOutList_queryParams, {
        ...httpAbort_registerAbort(CASH_IN_OUT_LIST_REQUEST),
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
   * @description Handle business logic for close dialog
   */
  const cashInOutList_onClose = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-in-out-list-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button create cash in out
   */
  const cashInOutList_onCreate = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-in-out-list-create-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '448px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    cashInOutList_fetchListTransactions,
    cashInOutList_formData,
    cashInOutList_formValidations,
    cashInOutList_isLoading: cashInOut_isLoading,
    cashInOutList_listColumns: CASH_IN_OUT_LIST_COLUMNS,
    cashInOutList_listTypes: CASH_IN_OUT_LIST_TYPES_OF_CASH_IN_OUT,
    cashInOutList_listValues: cashInOut_list,
    cashInOutList_onClose,
    cashInOutList_onCreate,
    cashInOutList_queryParams,
  };
};
