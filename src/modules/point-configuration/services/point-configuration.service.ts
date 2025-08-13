// store
import { usePointConfigurationStore } from '../store';

// Constant
import {
  LIST_TABS_POINT_CONFIGURATION,
  LOYALTY_POINT_SETTINGS_PRODUCT_LIST_COLUMNS,
} from '../constants/point-configuration.constant';

// Type
import { ILoyaltyPointSettingsProvided, IQueryParams } from '../interfaces/point-configuration.interface';
// Service

export const usePointConfigurationService = (): ILoyaltyPointSettingsProvided => {
  const pointConfiguration_activeTab = ref<string>('loyalty-point-setting');

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
      await store.loyaltySettings_fetchProductList(loyaltyPointSettingsProduct_queryParams,{
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
    limit: 5,
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
  };
};
