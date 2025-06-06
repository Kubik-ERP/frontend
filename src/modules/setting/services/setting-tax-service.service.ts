// Constants
import { SETTING_LIST_CHARGES_REQUEST, SETTING_UPDATE_CHARGES_REQUEST } from '../constants/setting.constant';

// Interfaces
import type { ISettingTaxAndServiceFormData, ISettingTaxAndServiceProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useSettingStore } from '../store';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { EToastPosition, EToastType } from '@/app/constants/toast.constant';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useSettingTaxAndServiceService = (): ISettingTaxAndServiceProvided => {
  /**
   * @description Injected variables
   */
  const store = useSettingStore();
  const { httpAbort_registerAbort } = useHttpAbort();
  const { setting_isLoading, setting_service, setting_tax } = storeToRefs(store);

  /**
   * @description Reactive data binding
   */
  const storeId = ref<string>('8681d73d-8d50-4b50-b4fd-63357660e60d');
  const settingTaxService_formDataOfService = reactive<ISettingTaxAndServiceFormData>({
    appliedToTakeaway: false,
    chargeType: 'service',
    isEnabled: false,
    isInclude: false,
    name: 'Service Charge',
    percentage: 0,
  });
  const settingTaxService_formDataOfTax = reactive<ISettingTaxAndServiceFormData>({
    appliedToTakeaway: false,
    chargeType: 'tax',
    isEnabled: false,
    isInclude: false,
    name: '',
    percentage: 0,
  });

  /**
   * @description Form validations
   */
  const settingTaxService_formRulesOfService = computed(() => ({
    appliedToTakeaway: { required },
    chargeType: { required },
    isEnabled: { required },
    isInclude: { required },
    name: { required },
    percentage: { required },
  }));
  const settingTaxService_formRulesOfTax = computed(() => ({
    appliedToTakeaway: { required },
    chargeType: { required },
    isEnabled: { required },
    isInclude: { required },
    name: { required },
    percentage: { required },
  }));
  const settingTaxService_formValidationsOfService = useVuelidate(
    settingTaxService_formRulesOfService,
    settingTaxService_formDataOfService,
  );
  const settingTaxService_formValidationsOfTax = useVuelidate(
    settingTaxService_formRulesOfTax,
    settingTaxService_formDataOfTax,
  );

  /**
   * @description Handle fetch api pos setting. We call the fetchSetting_listCharges function from the store to handle the request.
   */
  const settingTaxService_fetchListCharges = async () => {
    try {
      await store.fetchSetting_listCharges(storeId.value, {
        ...httpAbort_registerAbort(SETTING_LIST_CHARGES_REQUEST),
      });

      if (setting_service.value) {
        settingTaxService_mappingServiceCharge();
      }

      if (setting_tax.value) {
        settingTaxService_mappingTax();
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
   * @description Handle fetch api pos setting. We call the fetchSetting_updateCharges function from the store to handle the request.
   */
  const settingTaxService_fetchUpdateCharges = async (payload: ISettingTaxAndServiceFormData) => {
    try {
      await store.fetchSetting_updateCharges(
        {
          ...payload,
          percentage: payload.percentage / 100,
        },
        {
          ...httpAbort_registerAbort(SETTING_UPDATE_CHARGES_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: `Charges of ${payload.chargeType} updated successfully`,
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle business logic for mapping service charge
   */
  const settingTaxService_mappingServiceCharge = () => {
    for (const key in settingTaxService_formDataOfService) {
      if (Object.hasOwn(setting_service.value!, key)) {
        const value = setting_service.value![key as keyof typeof setting_service.value];

        if (value !== null && value !== undefined) {
          if (key === 'percentage' && typeof value === 'number') {
            // Convert percentage to a number if it's a string
            (settingTaxService_formDataOfService as Record<string, unknown>)[key] = value * 100;

            return;
          }

          settingTaxService_formDataOfService[key as keyof typeof settingTaxService_formDataOfService] = value;
        }
      }
    }
  };

  /**
   * @description Handle business logic for mapping tax
   */
  const settingTaxService_mappingTax = () => {
    for (const key in settingTaxService_formDataOfTax) {
      if (Object.hasOwn(setting_tax.value!, key)) {
        const value = setting_tax.value![key as keyof typeof setting_service.value];

        if (value !== null && value !== undefined) {
          if (key === 'percentage' && typeof value === 'number') {
            // Convert percentage to a number if it's a string
            (settingTaxService_formDataOfTax as Record<string, unknown>)[key] = value * 100;

            return;
          }

          settingTaxService_formDataOfTax[key as keyof typeof settingTaxService_formDataOfTax] = value;
        }
      }
    }
  };

  /**
   * @description Handle action on submit form.
   */
  const settingTaxService_onSubmit = async (type: 'service' | 'tax'): Promise<void> => {
    try {
      if (type === 'service') {
        await settingTaxService_formValidationsOfService.value.$touch();

        if (settingTaxService_formValidationsOfService.value.$invalid) {
          return;
        }

        await settingTaxService_fetchUpdateCharges(settingTaxService_formDataOfService);
      } else if (type === 'tax') {
        await settingTaxService_formValidationsOfTax.value.$touch();

        if (settingTaxService_formValidationsOfTax.value.$invalid) {
          return;
        }

        await settingTaxService_fetchUpdateCharges(settingTaxService_formDataOfTax);
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
    settingTaxService_fetchListCharges,
    settingTaxService_formDataOfService,
    settingTaxService_formDataOfTax,
    settingTaxService_formValidationsOfService,
    settingTaxService_formValidationsOfTax,
    settingTaxService_isLoading: setting_isLoading,
    settingTaxService_onSubmit,
  };
};
