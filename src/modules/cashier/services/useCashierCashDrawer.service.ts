// Constants
import {
  CASH_DRAWER_LIST_REQUEST,
  CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
} from '@/modules/cash-drawer/constants/cash-drawer.constant';

// Interfaces
import type {
  ICashDrawerListOpenRegisterFormData,
} from '@/modules/cash-drawer/interfaces/cash-drawer-list.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Services
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';

// Stores
import { useCashDrawerStore } from '@/modules/cash-drawer/store';
import { useOutletStore } from '@/modules/outlet/store';
import { useAuthenticationStore } from '@/modules/authentication/store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Cashier specific cash drawer service that doesn't redirect after opening register
 */
export const useCashierCashDrawerService = () => {
  /**
   * @description Injected variables
   */
  const authenticationStore = useAuthenticationStore();
  const outletStore = useOutletStore();
  const store = useCashDrawerStore();
  const { cashDrawer_isLoading, cashDrawer_todayStatus } = storeToRefs(store);
  const { outlet_currentOutlet } = storeToRefs(outletStore);
  const { authentication_isStaff, authentication_userData } = storeToRefs(authenticationStore);
  const { httpAbort_registerAbort } = useHttpAbort();
  const { staffMemberList_fetchListMembers } = useStaffMemberListService();

  /**
   * @description Reactive data binding
   */
  const cashierCashDrawer_formDataOfOpenRegister = reactive<ICashDrawerListOpenRegisterFormData>({
    balance: null,
    userId: null,
    notes: null,
  });

  /**
   * @description Form validations - userId is only required if user is not staff
   */
  const cashierCashDrawer_formRulesOfOpenRegister = computed(() => ({
    balance: { required },
    userId: authentication_isStaff.value ? {} : { required },
  }));
  const cashierCashDrawer_formValidationsOfOpenRegister = useVuelidate(
    cashierCashDrawer_formRulesOfOpenRegister,
    cashierCashDrawer_formDataOfOpenRegister,
  );

  /**
   * @description Auto-fill userId when user is staff
   */
  watch(
    () => authentication_isStaff.value,
    isStaff => {
      if (isStaff && authentication_userData.value?.staffId) {
        cashierCashDrawer_formDataOfOpenRegister.userId = authentication_userData.value.staffId;
      }
    },
    { immediate: true },
  );

  /**
   * @description Handle fetch api cash drawer status
   */
  const cashierCashDrawer_fetchTodayStatus = async (): Promise<unknown> => {
    try {
      const result = await store.cashDrawer_status(outlet_currentOutlet.value!.id, {
        ...httpAbort_registerAbort('CASH_DRAWER_STATUS_REQUEST'),
      });

      return Promise.resolve(result);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api open cash drawer - cashier version (no redirect)
   */
  const cashierCashDrawer_fetchOpenRegister = async (): Promise<unknown> => {
    try {
      const result = await store.cashDrawer_open(
        outlet_currentOutlet.value!.id,
        cashierCashDrawer_formDataOfOpenRegister,
        {
          ...httpAbort_registerAbort(CASH_DRAWER_LIST_REQUEST),
        },
      );

      cashierCashDrawer_onCloseOpenRegisterDialog();

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Cash drawer opened successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);

      // Refresh the cash drawer status after opening
      await cashierCashDrawer_fetchTodayStatus();

      return Promise.resolve(result);
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      cashierCashDrawer_formValidationsOfOpenRegister.value.$reset();
      cashierCashDrawer_formDataOfOpenRegister.balance = null;
      cashierCashDrawer_formDataOfOpenRegister.userId = null;
      cashierCashDrawer_formDataOfOpenRegister.notes = null;
    }
  };

  /**
   * @description Handle business logic for close dialog open register
   */
  const cashierCashDrawer_onCloseOpenRegisterDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'cash-drawer-list-open-register-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for show dialog open register
   */
  const cashierCashDrawer_onShowOpenRegisterDialog = (): void => {
    if (!authentication_isStaff.value) {
      staffMemberList_fetchListMembers();
    }

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
  const cashierCashDrawer_onSubmitOpenRegisterForm = async (): Promise<void> => {
    cashierCashDrawer_formValidationsOfOpenRegister.value.$touch();

    if (cashierCashDrawer_formValidationsOfOpenRegister.value.$invalid) {
      return;
    }

    try {
      await cashierCashDrawer_fetchOpenRegister();
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    cashierCashDrawer_fetchTodayStatus,
    cashierCashDrawer_formDataOfOpenRegister,
    cashierCashDrawer_formValidationsOfOpenRegister,
    cashierCashDrawer_isLoading: cashDrawer_isLoading,
    cashierCashDrawer_onCloseOpenRegisterDialog,
    cashierCashDrawer_onShowOpenRegisterDialog,
    cashierCashDrawer_onSubmitOpenRegisterForm,
    cashierCashDrawer_suggestionRegisterBalance: CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE,
    cashierCashDrawer_todayStatus: cashDrawer_todayStatus,
  };
};