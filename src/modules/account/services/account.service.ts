// Constants
import { ACCOUNT_LIST_COLUMNS_STORE } from '../constants/account.constant';

// Interfaces
import type { IAccountBankAccountFormData, IAccountProvided } from '../interfaces/account.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountService = (): IAccountProvided => {
  /**
   * @description Reactive data binding
   */
  const account_bankAccountFormData = reactive<IAccountBankAccountFormData>({
    bankName: '',
    accountNumber: null,
    accountHolderName: '',
  });

  /**
   * @description Form validations
   */
  const account_bankAccountFormRules = computed(() => ({
    bankName: { required },
    accountNumber: { required },
    accountHolderName: { required },
  }));
  const account_bankAccountFormValidations = useVuelidate(
    account_bankAccountFormRules,
    account_bankAccountFormData,
  );

  /**
   * @description handle business logic for close dialog set up bank account
   */
  const account_onCloseDialogSetUpBank = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'account-setup-bank-dialog-information',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog set up bank account
   */
  const account_onSetUpBankAccount = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'account-setup-bank-dialog-information',
      isOpen: true,
      isUsingClosableButton: false,
      width: '534px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  return {
    account_bankAccountFormData,
    account_bankAccountFormValidations,
    account_listColumns: ACCOUNT_LIST_COLUMNS_STORE,
    account_onCloseDialogSetUpBank,
    account_onSetUpBankAccount,
  };
};
