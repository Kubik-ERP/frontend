// Constants
import {
  LIST_COLUMNS_OF_CASH_IN_OUT,
  LIST_ITEMS_OF_SPLIT_BUTTON,
  LIST_TYPES_OF_CASH_IN_OUT,
  LIST_VALUES_OF_CASH_IN_OUT,
} from '../constants/sales-order.constant';

// Interfaces
import type { ICashInOutFormData, ICashInOutProvided } from '../interfaces/cash-in-out.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useCashInOutService = (): ICashInOutProvided => {
  /**
   * @description Reactive data binding
   */
  const cashInOut_formData = reactive<ICashInOutFormData>({
    amount: 0,
    notes: '',
    title: '',
    type: 'Cash In',
  });

  /**
   * @description Form validations
   */
  const cashInOut_formRules = computed(() => ({
    amount: { required },
    notes: { required },
    title: { required },
    type: { required },
  }));
  const cashInOut_formValidations = useVuelidate(cashInOut_formRules, cashInOut_formData);

  /**
   * @description Handle business logic for close dialog
   */
  const cashInOut_onClose = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-in-out-create-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button create cash in out
   */
  const cashInOut_onCreate = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-in-out-create-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '448px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button delete cash in out
   */
  const cashInOut_onDelete = (): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'sales-order-cash-in-out-dialog-confirmation',
      isUsingIcon: true,
      isUsingButtonActions: true,
      isOpen: true,
      title: 'Delete Cash In/Out',
      description: 'Are you sure you want to delete this cash in/out?',
      iconName: 'warning',
      type: 'error',
      textButtonPrimary: 'Delete',
      textButtonSecondary: 'Cancel',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button edit cash in out
   */
  const cashInOut_onEdit = (): void => {
    console.log('Edit cash in out');
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-in-out-create-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '448px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for managing the list of cash in out
   */
  const cashInOut_listItemsOfSplitButton = LIST_ITEMS_OF_SPLIT_BUTTON.map(item => {
    if (item.label === 'Edit') {
      item.command = cashInOut_onEdit;
    }

    if (item.label === 'Delete') {
      item.command = cashInOut_onDelete;
    }

    return item;
  });

  return {
    cashInOut_formData,
    cashInOut_formValidations,
    cashInOut_listColumns: LIST_COLUMNS_OF_CASH_IN_OUT,
    cashInOut_listItemsOfSplitButton,
    cashInOut_listTypes: LIST_TYPES_OF_CASH_IN_OUT,
    cashInOut_listValues: LIST_VALUES_OF_CASH_IN_OUT as never[],
    cashInOut_onClose,
    cashInOut_onCreate,
  };
};
