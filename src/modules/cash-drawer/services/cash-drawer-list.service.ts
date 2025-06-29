// Constants
import {
  CASH_DRAWER_LIST_COLUMNS,
  CASH_DRAWER_LIST_REQUEST,
  CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
} from '../constants/cash-drawer.constant';

// Interfaces
import type {
  ICashDrawerListProvided,
  ICashDrawerListOpenRegisterFormData,
  ICashDrawerListRequestQuery,
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
  const router = useRouter();
  const store = useCashDrawerStore(); // Instance of the store
  const { cashDrawer_isLoading, cashDrawer_lists } = storeToRefs(store);
  const { outlet_currentOutlet } = storeToRefs(outletStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const cashDrawerList_formDataOfOpenRegister = reactive<ICashDrawerListOpenRegisterFormData>({
    balance: null,
    userId: null,
    notes: null,
  });
  const cashDrawerList_queryParams = reactive<ICashDrawerListRequestQuery>({
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
   * @description Handle fetch api cash drawer . We call the cashDrawer_open function from the store to handle the request.
   */
  const cashDrawerList_fetchOpenRegister = async (): Promise<unknown> => {
    try {
      await store.cashDrawer_open(outlet_currentOutlet.value!.id, cashDrawerList_formDataOfOpenRegister, {
        ...httpAbort_registerAbort(CASH_DRAWER_LIST_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Cash drawer opened successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      setTimeout(() => {
        router.push({
          name: 'cash-drawer.cash-register',
        })
      }, 1000)
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashDrawerList_formValidationsOfOpenRegister.value.$reset();
      cashDrawerList_formDataOfOpenRegister.balance = null;
      cashDrawerList_formDataOfOpenRegister.userId = null;
      cashDrawerList_formDataOfOpenRegister.notes = null;
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
   * @description Handle business logic for changing page size
   */
  const cashDrawerList_onChangePage = (page: number): void => {
    cashDrawerList_queryParams.page = page;
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

  /**
   * @description Handle business logic on submit open register form
   */
  const cashDrawerList_onSubmitOpenRegisterForm = async (): Promise<void> => {
    cashDrawerList_formValidationsOfOpenRegister.value.$touch();

    if (cashDrawerList_formValidationsOfOpenRegister.value.$invalid) {
      return;
    }

    try {
      await cashDrawerList_fetchOpenRegister();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => cashDrawerList_queryParams,
    debounce(async () => {
      await cashDrawerList_fetchListTransactions();
    }, 500),
    { deep: true },
  );

  return {
    cashDrawerList_columns: CASH_DRAWER_LIST_COLUMNS,
    cashDrawerList_fetchListTransactions,
    cashDrawerList_formDataOfOpenRegister,
    cashDrawerList_formValidationsOfOpenRegister,
    cashDrawerList_getClassOfStatus,
    cashDrawerList_isLoading: cashDrawer_isLoading,
    cashDrawerList_onChangePage,
    cashDrawerList_onCloseOpenRegisterDialog,
    cashDrawerList_onShowOpenRegisterDialog,
    cashDrawerList_onSubmitOpenRegisterForm,
    cashDrawerList_queryParams,
    cashDrawerList_suggestionRegisterBalance: CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
    cashDrawerList_values: cashDrawer_lists,
  };
};
