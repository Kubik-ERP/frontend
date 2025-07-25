// Constants
import {
  SETTING_PAYMENT_METHOD_CREATE_REQUEST,
  SETTING_PAYMENT_METHOD_LIST_COLUMNS,
  SETTING_PAYMENT_METHOD_LIST_REQUEST,
} from '../constants/setting-payment-method.constant';

// Interfaces
import type {
  ISettingPaymentMethod,
  ISettingPaymentMethodFormData,
  ISettingPaymentMethodProvided,
} from '../interfaces/setting-payment-method.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Store
import { useSettingStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSettingPaymentMethodService = (): ISettingPaymentMethodProvided => {
  /**
   * @description Injected variables
   */
  const store = useSettingStore(); // Instance of the store
  const { setting_isLoading, setting_paymentMethod } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const settingPaymentMethod_formData = reactive<ISettingPaymentMethodFormData>({
    name: '',
    iconName: '',
    isAvailable: false,
    sortNo: 0,
  });
  const settingPaymentMethod_selectedId = ref<number | null>(null);

  /**
   * @description Form validations
   */
  const settingPaymentMethod_formRules = computed(() => ({
    name: { required },
  }));
  const settingPaymentMethod_formValidations = useVuelidate(
    settingPaymentMethod_formRules,
    settingPaymentMethod_formData,
  );

  /**
   * @description Handle fetch api setting. We call the fetchSetting_createPaymentMethod function from the store to handle the request.
   */
  const settingPaymentMethod_fetchCreatePaymentMethod = async (): Promise<void> => {
    try {
      await store.fetchSetting_createPaymentMethod(
        {
          ...settingPaymentMethod_formData,
          iconName: settingPaymentMethod_formData.name.toLowerCase().replace(/\s+/g, '-'), // Generate iconName from name
        },
        {
          ...httpAbort_registerAbort(SETTING_PAYMENT_METHOD_CREATE_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Payment Method has been created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      settingPaymentMethod_onClear(); // Clear form data after successful creation
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api setting. We call the fetchSetting_listPaymentMethods function from the store to handle the request.
   */
  const settingPaymentMethod_fetchListPaymentMethods = async (): Promise<void> => {
    try {
      await store.fetchSetting_listPaymentMethods({
        ...httpAbort_registerAbort(SETTING_PAYMENT_METHOD_LIST_REQUEST),
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
   * @description Handle fetch api setting. We call the fetchSetting_updatePaymentMethod function from the store to handle the request.
   */
  const settingPaymentMethod_fetchUpdatePaymentMethod = async (): Promise<void> => {
    try {
      await store.fetchSetting_updatePaymentMethod(
        settingPaymentMethod_selectedId.value!,
        settingPaymentMethod_formData,
        {
          ...httpAbort_registerAbort(SETTING_PAYMENT_METHOD_CREATE_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Payment Method has been updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
      settingPaymentMethod_onClear(); // Clear form data after successful update
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for clear form data
   */
  const settingPaymentMethod_onClear = (): void => {
    settingPaymentMethod_formData.name = '';
    settingPaymentMethod_formData.iconName = '';
    settingPaymentMethod_formData.isAvailable = false;
    settingPaymentMethod_formData.sortNo = 0;
    settingPaymentMethod_selectedId.value = null; // Reset selected ID
    settingPaymentMethod_formValidations.value.$reset(); // Reset form validations
  };

  /**
   * @description Handle business logic for close dialog
   */
  const settingPaymentMethod_onClose = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'setting-payment-method-create-edit-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button create or edit payment method
   */
  const settingPaymentMethod_onCreateOrEdit = (selectedData?: ISettingPaymentMethod): void => {
    if (selectedData) {
      settingPaymentMethod_selectedId.value = selectedData.id;
      settingPaymentMethod_formData.name = selectedData.name;
      settingPaymentMethod_formData.iconName = selectedData.iconName;
      settingPaymentMethod_formData.isAvailable = selectedData.isAvailable;
    }

    const argsEventEmitter: IPropsDialog = {
      id: 'setting-payment-method-create-edit-dialog',
      isOpen: true,
      isUsingBackdrop: true,
      isUsingClosableButton: false,
      width: '586px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for event click button edit payment method
   */
  const settingPaymentMethod_onDeactivate = (value: boolean): void => {
    if (value) {
      settingPaymentMethod_formData.isAvailable = value;
    } else {
      const argsEventEmitter: IPropsDialogConfirmation = {
        id: 'setting-payment-method-delete-confirmation-dialog',
        description: 'Once deactivated, it will no longer be available for new transactions.',
        iconName: 'delete-polygon',
        isOpen: true,
        isUsingButtonSecondary: true,
        onClickButtonPrimary: () => {
          settingPaymentMethod_formData.isAvailable = true;
          console.log(settingPaymentMethod_formData.isAvailable, 'Payment method reactivated');

          // Close the confirmation dialog without deactivating
          const argsEventEmitter: IPropsDialog = {
            id: 'setting-payment-method-delete-confirmation-dialog',
            isOpen: false,
          };

          eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
        },
        onClickButtonSecondary: () => {
          settingPaymentMethod_formData.isAvailable = false;

          // Close the confirmation dialog without deactivating
          const argsEventEmitter: IPropsDialog = {
            id: 'setting-payment-method-delete-confirmation-dialog',
            isOpen: false,
          };

          eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
        },
        textButtonPrimary: 'Cancel',
        textButtonSecondary: 'Deactivate Payment Method',
        title: 'Are you sure you want to deactivate this payment method?',
        type: 'error',
        width: 'w-fit min-w-[472px]',
      };

      eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
    }
  };

  /**
   * @description Handle action on submit form.
   */
  const settingPaymentMethod_onSubmit = async (): Promise<void> => {
    try {
      settingPaymentMethod_formValidations.value.$touch(); // Trigger validation

      if (settingPaymentMethod_formValidations.value.$invalid) {
        return; // If form is invalid, do not proceed
      }

      if (settingPaymentMethod_selectedId.value) {
        await settingPaymentMethod_fetchUpdatePaymentMethod();
      } else {
        await settingPaymentMethod_fetchCreatePaymentMethod();
      }

      await settingPaymentMethod_fetchListPaymentMethods(); // Refresh the list after create or update
      settingPaymentMethod_onClose(); // Close the dialog after successful operation
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for toggle payment method availability
   */
  const settingPaymentMethod_toggleAvailability = (value: boolean): void => {
    settingPaymentMethod_onDeactivate(value);
  };

  return {
    settingPaymentMethod_fetchListPaymentMethods,
    settingPaymentMethod_formData,
    settingPaymentMethod_formValidations,
    settingPaymentMethod_isLoading: setting_isLoading,
    settingPaymentMethod_listColumns: SETTING_PAYMENT_METHOD_LIST_COLUMNS,
    settingPaymentMethod_listValues: setting_paymentMethod,
    settingPaymentMethod_onClose,
    settingPaymentMethod_onCreateOrEdit,
    settingPaymentMethod_onDeactivate,
    settingPaymentMethod_onSubmit,
    settingPaymentMethod_toggleAvailability,
  };
};
