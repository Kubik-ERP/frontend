// store
import { usePointConfigurationStore } from '../store';

// Constant
import {
  LIST_TABS_POINT_CONFIGURATION,
  LOYALTY_POINT_SETTINGS_PRODUCT_LIST_COLUMNS,
} from '../constants/point-configuration.constant';

// Type
import {
  ILoyaltyPointSettingsProvided,
  IQueryParams,
  ILoyaltyPointSettingsFormData,
} from '../interfaces/point-configuration.interface';
// Service

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export const usePointConfigurationService = (): ILoyaltyPointSettingsProvided => {
  const pointConfiguration_activeTab = ref<string>('loyalty-point-setting');

  const loyaltyPointSettings_formData = reactive<ILoyaltyPointSettingsFormData>({
    spendBased: false,
    spendBasedMinTransaction: 0,
    spendBasedPointEarned: 0,
    spendBasedExpiration: 0,
    spendBasedApplyMultiple: false,
    spendBasedEarnWhenRedeem: false,
    productBased: false,
    productBasedItems: [],
    productBasedExpiration: 0,
    productBasedApplyMultiple: false,
    productBasedEarnWhenRedeem: false,
  });

  const loyaltyPointSettings_formRules = computed(() => ({
    spendBasedMinTransaction: {
      required,
    },
    spendBasedPointEarned: {
      required,
    },
    spendBasedExpiration: {
      required,
    },
    productBasedExpiration: {
      required,
    },
  }));

  const loyaltyPointSettings_formValidations = useVuelidate(
    loyaltyPointSettings_formRules,
    loyaltyPointSettings_formData,
    {
      $autoDirty: true,
    },
  );

  const loyaltyPointSettings_onSubmit = async (): Promise<void> => {
    try {
      await store.loyaltySettings_update(loyaltyPointSettings_formData, {
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_UPDATE_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  watch(
    pointConfiguration_activeTab,
    async newTab => {
      switch (newTab.toUpperCase()) {
        case 'LOYALTY-POINT-BENEFIT': {
          // Handle logic for loyalty point benefit tab
          break;
        }
        case 'LOYALTY-POINT-SETTING': {
          // Handle logic for loyalty point setting tab
          break;
        }
      }
    },
    { immediate: true },
  );

  const store = usePointConfigurationStore();
  const {
    loyaltyPointSettingsProduct_isLoading,
    loyaltyPointSettingsProduct_value,
    loyaltyPointSettings_isLoading,
    loyaltyPointSettings_value,
  } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const loyaltyPointSettingsDetail = async (): Promise<void> => {
    try {
      await store.loyaltySettings_fetchDetails({
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_LIST_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const loyaltyPointSettingsProduct = async (): Promise<void> => {
    try {
      await store.loyaltySettings_fetchProductList(loyaltyPointSettingsProduct_queryParams, {
        ...httpAbort_registerAbort('LOYALTY_POINT_SETTINGS_PRODUCT_LIST_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const loyaltyPointSettingsProduct_queryParams = reactive<IQueryParams>({
    page: 1,
    pageSize: 5,
  });

  const loyaltyPointSettingsProduct_onChangePage = (page: number): void => {
    loyaltyPointSettingsProduct_queryParams.page = page;
  };

  watch(
    () => loyaltyPointSettingsProduct_queryParams,
    debounce(async () => {
      await loyaltyPointSettingsProduct();
    }, 500),
    { deep: true },
  );

  return {
    pointConfiguration_activeTab,
    pointConfiguration_listTabs: LIST_TABS_POINT_CONFIGURATION,

    loyaltyPointSettings_isLoading,
    loyaltyPointSettings_value,
    loyaltyPointSettingsDetail,

    // table
    loyaltyPointSettingsProduct_columns: LOYALTY_POINT_SETTINGS_PRODUCT_LIST_COLUMNS,
    loyaltyPointSettingsProduct,
    loyaltyPointSettingsProduct_isLoading,
    loyaltyPointSettingsProduct_value,
    loyaltyPointSettingsProduct_onChangePage,

    // form
    loyaltyPointSettings_formData,
    loyaltyPointSettings_formValidations,
    loyaltyPointSettings_onSubmit,
  };
};
