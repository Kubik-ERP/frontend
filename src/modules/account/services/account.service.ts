// Constants
import {
  ACCOUNT_ATTACH_BANK_REQUEST,
  ACCOUNT_LIST_COLUMNS_STORE,
  ACCOUNT_PROFILE_REQUEST,
  ACCOUNT_USER_BANKS_REQUEST,
} from '../constants/account.constant';

// Interfaces
import type { IAccountBankAccountFormData, IAccountProvided } from '../interfaces/account.interface';

// Stores
import { useAccountStore } from '../store';
import { useOutletStore } from '@/modules/outlet/store';

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
   * @description Injected variables
   */
  const accountStore = useAccountStore();
  const outletStore = useOutletStore();
  const { outlet_isLoading, outlet_profile } = storeToRefs(outletStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const account_bankAccountFormData = reactive<IAccountBankAccountFormData>({
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  /**
   * @description Form validations
   */
  const account_bankAccountFormRules = computed(() => ({
    bankName: { required },
    accountNumber: { required },
    accountName: { required },
  }));
  const account_bankAccountFormValidations = useVuelidate(
    account_bankAccountFormRules,
    account_bankAccountFormData,
  );

  /**
   * @description Handle fetch api account. We call the fetchAccount_attachBankAccount function from the store to handle the request.
   */
  const account_fetchAttachBankAccount = async (): Promise<void> => {
    try {
      await accountStore.fetchAccount_attachBankAccount(account_bankAccountFormData, {
        ...httpAbort_registerAbort(ACCOUNT_ATTACH_BANK_REQUEST),
      });

      await account_fetchUserBanks();
      account_onCloseDialogSetUpBank();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_profile function from the store to handle the request.
   */
  const account_fetchOutletProfile = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_profile({
        ...httpAbort_registerAbort(ACCOUNT_PROFILE_REQUEST),
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
   * @description Handle fetch api account. We call the fetchAccount_userBanks function from the store to handle the request.
   */
  const account_fetchUserBanks = async (): Promise<void> => {
    try {
      await accountStore.fetchAccount_userBanks({
        ...httpAbort_registerAbort(ACCOUNT_USER_BANKS_REQUEST),
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
   * @description Handle fetch api account. We call the fetchAccount_updateAttachedBank function from the store to handle the request.
   */
  const account_fetchUpdateAttachedBank = async (id: string): Promise<void> => {
    try {
      await accountStore.fetchAccount_updateAttachedBank(id, account_bankAccountFormData, {
        ...httpAbort_registerAbort(ACCOUNT_USER_BANKS_REQUEST),
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

  /**
   * @description Handle business logic for submitting the bank account form
   */
  const account_onSubmitBankAccount = async (id?: string): Promise<void> => {
    account_bankAccountFormValidations.value.$touch();

    if (account_bankAccountFormValidations.value.$invalid) {
      return;
    }

    try {
      if (id) {
        await account_fetchUpdateAttachedBank(id);
      } else {
        await account_fetchAttachBankAccount();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    account_bankAccountFormData,
    account_bankAccountFormValidations,
    account_fetchOutletProfile,
    account_fetchUserBanks,
    account_isLoadingOfOutlet: outlet_isLoading,
    account_listColumns: ACCOUNT_LIST_COLUMNS_STORE,
    account_onCloseDialogSetUpBank,
    account_onSetUpBankAccount,
    account_onSubmitBankAccount,
    account_profile: outlet_profile,
  };
};
