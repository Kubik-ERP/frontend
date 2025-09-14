// Constants
import {
  CASH_DRAWER_DETAILS_REQUEST,
  CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER,
  CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER,
  CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
  CASH_DRAWER_TRANSACTION_REQUEST,
} from '../constants';

// Plugins
import eventBus from '@/plugins/mitt';

// Interfaces
import {
  ICashDrawerCashRegisterFormDataOfCloseTransaction,
  ICashDrawerCashRegisterQueryParamsOfTransaction,
  type ICashDrawerCashRegisterFormDataOfTransaction,
  type ICashDrawerCashRegisterProvide,
} from '../interfaces/cash-drawer-cash-register.interface';

// Html2Pdf
import html2pdf from 'html2pdf.js';

// Stores
import { useCashDrawerStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const useCashDrawerCashRegisterService = (): ICashDrawerCashRegisterProvide => {
  /**
   * @description Injected variables
   */
  const route = useRoute(); // Current route
  const store = useCashDrawerStore(); // Instance of the store
  const { cashDrawer_detail, cashDrawer_isLoading, cashDrawer_transactionOfOpenRegister } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const cashDrawerCashRegister_differenceBalance = ref<number>(0);
  const cashDrawerCashRegister_formDataOfTransaction = reactive<ICashDrawerCashRegisterFormDataOfTransaction>({
    amount: null,
    notes: null,
  });
  const cashDrawerCashRegister_formDataOfCloseTransaction =
    reactive<ICashDrawerCashRegisterFormDataOfCloseTransaction>({
      balance: null,
      notes: null,
    });
  const cashDrawerCashRegister_isOpenCashRegisterSummary = ref<boolean>(false);
  const cashDrawerCashRegister_queryParamsOfTransaction =
    reactive<ICashDrawerCashRegisterQueryParamsOfTransaction>({
      page: 1,
      limit: 10,
      type: null,
      startDate: null,
      endDate: null,
    });
  const cashDrawerCashRegister_routeParamsId = route.params?.id ? String(route.params.id) : '';
  const cashDrawerCashRegister_selectedCashDrawerId = ref<string | null>(null);
  const cashDrawerCashRegister_typeOfTransaction = ref<'in' | 'out'>('in');

  /**
   * @description Form validations
   */
  const cashDrawerCashRegister_formRulesOfCloseTransaction = computed(() => ({
    balance: { required },
  }));
  const cashDrawerCashRegister_formValidationsOfCloseTransaction = useVuelidate(
    cashDrawerCashRegister_formRulesOfCloseTransaction,
    cashDrawerCashRegister_formDataOfCloseTransaction,
  );
  const cashDrawerCashRegister_formRulesOfTransaction = computed(() => ({
    amount: { required },
  }));
  const cashDrawerCashRegister_formValidationsOfTransaction = useVuelidate(
    cashDrawerCashRegister_formRulesOfTransaction,
    cashDrawerCashRegister_formDataOfTransaction,
  );

  /**
   * @description Computed property to check if the cash drawer transaction form is invalid
   * This isolates the validation check to only the cash drawer fields, avoiding pollution from other forms
   */
  const cashDrawerCashRegister_isFormInvalid = computed(() => {
    const validation = cashDrawerCashRegister_formValidationsOfTransaction.value;
    // Check specifically for the amount field validation
    return !validation.amount || validation.amount.$invalid;
  });

  /**
   * @description Handle fetch api cash drawer. We call the cashDrawer_addTransaction function from the store to handle the request.
   */
  const cashDrawerCashRegister_fetchAddTransaction = async (): Promise<unknown> => {
    try {
      await store.cashDrawer_addTransaction(
        cashDrawer_detail.value?.id ?? cashDrawerCashRegister_routeParamsId,
        cashDrawerCashRegister_typeOfTransaction.value,
        cashDrawerCashRegister_formDataOfTransaction,
        {
          ...httpAbort_registerAbort(CASH_DRAWER_TRANSACTION_REQUEST),
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api cash drawer. We call the cashDrawer_close function from the store to handle the request.
   */
  const cashDrawerCashRegister_fetchCloseTransaction = async (): Promise<unknown> => {
    try {
      await store.cashDrawer_close(
        cashDrawerCashRegister_routeParamsId,
        cashDrawerCashRegister_formDataOfCloseTransaction,
        {
          ...httpAbort_registerAbort(CASH_DRAWER_TRANSACTION_REQUEST),
        },
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api cash drawer. We call the cashDrawer_list function from the store to handle the request.
   */
  const cashDrawerCashRegister_fetchCashDrawerDetails = async (id?: string): Promise<unknown> => {
    if (id) {
      if (cashDrawerCashRegister_selectedCashDrawerId.value === id) return;

      cashDrawerCashRegister_selectedCashDrawerId.value = id;
    }

    try {
      await store.cashDrawer_details(
        cashDrawerCashRegister_selectedCashDrawerId.value ?? cashDrawerCashRegister_routeParamsId,
        {
          ...httpAbort_registerAbort(CASH_DRAWER_DETAILS_REQUEST),
        },
      );

      if (cashDrawer_detail.value?.actualBalance) {
        cashDrawerCashRegister_differenceBalance.value =
          cashDrawer_detail.value.actualBalance - (cashDrawer_detail.value.expectedBalance ?? 0);
        cashDrawerCashRegister_formDataOfCloseTransaction.balance = cashDrawer_detail.value.actualBalance;
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api cash drawer. We call the cashDrawer_list function from the store to handle the request.
   */
  const cashDrawerCashRegister_fetchTrasanctions = async (id?: string): Promise<unknown> => {
    try {
      await store.cashDrawer_transactions(
        id ?? cashDrawer_detail.value?.id ?? cashDrawerCashRegister_routeParamsId,
        cashDrawerCashRegister_queryParamsOfTransaction,
        {
          ...httpAbort_registerAbort(CASH_DRAWER_TRANSACTION_REQUEST),
        },
      );
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
  const cashDrawerCashRegister_getIconOfTypeCashRegister = (type: number): string => {
    switch (type) {
      case 0:
        return 'cashier-circle';
      case 1:
        return 'arrow-right-circle-success';
      case 2:
        return 'receipt-circle';
      case 3:
        return 'arrow-left-circle-danger';
      case 5:
        return 'flip-backward-circle';
      default:
        return '';
    }
  };

  /**
   * @description Handle business logic to return dynamic value of type cash register
   */
  const cashDrawerCashRegister_getValueOfTypeCashRegister = (type: number): string => {
    switch (type) {
      case 0:
        return 'Opening Balance';
      case 1:
        return 'Cash In';
      case 2:
        return 'Sale';
      case 3:
        return 'Cash Out';
      case 5:
        return 'Cash Refund';
      default:
        return 'Closing';
    }
  };

  /**
   * @description Handle business logic for closing dialog add transaction
   */
  const cashDrawerCashRegister_onCloseDialogAddTransaction = (): void => {
    // Reset form data and validation state when closing dialog
    cashDrawerCashRegister_formDataOfTransaction.amount = null;
    cashDrawerCashRegister_formDataOfTransaction.notes = null;
    cashDrawerCashRegister_formValidationsOfTransaction.value.$reset();

    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-add-transaction-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for closing dialog close transaction
   */
  const cashDrawerCashRegister_onCloseDialogCloseTransaction = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-close-transaction-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for exporting register summary to PDF
   */
  const cashDrawerCashRegister_onExportToPdf = (element: HTMLElement): void => {
    // Opsi untuk html2pdf
    const options = {
      margin: 0,
      filename: `[Backoffice] Cash Drawer Summary.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      enableLinks: true,
    };

    console.log('Exporting to PDF...');

    // Panggil html2pdf untuk membuat dan mengunduh PDF
    html2pdf()
      .from(element)
      .set(options)
      .save()
      .then(() => {
        console.log('PDF exported successfully.');
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .catch((error: any) => {
        console.error('Error exporting PDF:', error);
      });
  };

  /**
   * @description Handle business logic for showing dialog add transaction
   */
  const cashDrawerCashRegister_onOpenDialogAddTransaction = (type: 'in' | 'out'): void => {
    cashDrawerCashRegister_typeOfTransaction.value = type;

    // Reset form data and validation state when opening dialog
    cashDrawerCashRegister_formDataOfTransaction.amount = null;
    cashDrawerCashRegister_formDataOfTransaction.notes = null;
    cashDrawerCashRegister_formValidationsOfTransaction.value.$reset();

    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-add-transaction-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '414px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog add transaction
   */
  const cashDrawerCashRegister_onOpenDialogCloseTransaction = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-close-transaction-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: 'w-fit',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for submitting add transaction form
   */
  const cashDrawerCashRegister_onSubmitAddTransaction = async (): Promise<void> => {
    cashDrawerCashRegister_formValidationsOfTransaction.value.$touch();

    // Use the specific form validation check instead of the general $invalid
    if (cashDrawerCashRegister_isFormInvalid.value) {
      return;
    }

    try {
      await cashDrawerCashRegister_fetchAddTransaction();
      await cashDrawerCashRegister_fetchCashDrawerDetails(
        cashDrawer_detail.value?.id ?? cashDrawerCashRegister_routeParamsId,
      );
      await cashDrawerCashRegister_fetchTrasanctions(
        cashDrawer_detail.value?.id ?? cashDrawerCashRegister_routeParamsId,
      );
      cashDrawerCashRegister_onCloseDialogAddTransaction();

      // Reset the form and validation
      cashDrawerCashRegister_formDataOfTransaction.amount = null;
      cashDrawerCashRegister_formDataOfTransaction.notes = null;
      cashDrawerCashRegister_formValidationsOfTransaction.value.$reset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for submitting close transaction form
   */
  const cashDrawerCashRegister_onSubmitCloseTransaction = async (): Promise<void> => {
    cashDrawerCashRegister_formValidationsOfCloseTransaction.value.$touch();

    if (cashDrawerCashRegister_formValidationsOfCloseTransaction.value.$invalid) {
      return;
    }

    try {
      await cashDrawerCashRegister_fetchCloseTransaction();
      await cashDrawerCashRegister_fetchCashDrawerDetails();
      await cashDrawerCashRegister_fetchTrasanctions();
      cashDrawerCashRegister_onCloseDialogCloseTransaction();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for toggle summary of cash register
   */
  const cashDrawerCashRegister_toggleCashRegisterSummary = (): void => {
    cashDrawerCashRegister_isOpenCashRegisterSummary.value =
      !cashDrawerCashRegister_isOpenCashRegisterSummary.value;
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => cashDrawerCashRegister_queryParamsOfTransaction,
    debounce(async () => {
      await cashDrawerCashRegister_fetchTrasanctions();
    }, 500),
    { deep: true },
  );

  return {
    cashDrawerCashRegister_detail: cashDrawer_detail,
    cashDrawerCashRegister_fetchCashDrawerDetails,
    cashDrawerCashRegister_fetchTrasanctions,
    cashDrawerCashRegister_formDataOfCloseTransaction,
    cashDrawerCashRegister_formDataOfTransaction,
    cashDrawerCashRegister_formValidationsOfCloseTransaction,
    cashDrawerCashRegister_formValidationsOfTransaction,
    cashDrawerCashRegister_getIconOfTypeCashRegister,
    cashDrawerCashRegister_getValueOfTypeCashRegister,
    cashDrawerCashRegister_isFormInvalid,
    cashDrawerCashRegister_isLoading: cashDrawer_isLoading,
    cashDrawerCashRegister_isOpenCashRegisterSummary,
    cashDrawerCashRegister_listColumns: CASH_DRAWER_LIST_COLUMNS_OF_CASH_REGISTER,
    cashDrawerCashRegister_listTypesOfCashRegister: CASH_DRAWER_LIST_TYPES_OF_CASH_REGISTER,
    cashDrawerCashRegister_listValuesOfCashRegister: cashDrawer_transactionOfOpenRegister,
    cashDrawerCashRegister_onCloseDialogAddTransaction,
    cashDrawerCashRegister_onCloseDialogCloseTransaction,
    cashDrawerCashRegister_onExportToPdf,
    cashDrawerCashRegister_onOpenDialogAddTransaction,
    cashDrawerCashRegister_onOpenDialogCloseTransaction,
    cashDrawerCashRegister_onSubmitAddTransaction,
    cashDrawerCashRegister_onSubmitCloseTransaction,
    cashDrawerCashRegister_queryParamsOfTransaction,
    cashDrawerCashRegister_suggestionRegisterBalance: CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
    cashDrawerCashRegister_toggleCashRegisterSummary,
    cashDrawerCashRegister_typeOfTransaction,
  };
};
