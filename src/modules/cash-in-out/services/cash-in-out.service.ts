// Constants
import {
  CASH_IN_OUT_LIST_COLUMNS,
  CASH_IN_OUT_LIST_TYPES_OF_CASH_IN_OUT,
  CASH_IN_OUT_LIST_VALUES,
} from '../constants';

// Interfaces
import type { ICashInOutListFormData, ICashInOutListProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashInOutListService = (): ICashInOutListProvided => {
  /**
   * @description Reactive data binding
   */
  const cashInOutList_formData = reactive<ICashInOutListFormData>({
    amount: 0,
    notes: '',
    title: '',
    type: 'Cash In',
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
    cashInOutList_formData,
    cashInOutList_formValidations,
    cashInOutList_listColumns: CASH_IN_OUT_LIST_COLUMNS,
    cashInOutList_listTypes: CASH_IN_OUT_LIST_TYPES_OF_CASH_IN_OUT,
    cashInOutList_listValues: CASH_IN_OUT_LIST_VALUES as never[],
    cashInOutList_onClose,
    cashInOutList_onCreate,
  };
};
