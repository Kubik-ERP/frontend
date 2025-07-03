// Constants
import {
  ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS,
  ACCOUNT_STORE_DETAIL_FACILITY_VALUES,
  ACCOUNT_STORE_DETAIL_LIST_TABS,
  ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_COLUMNS,
  ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_VALUES,
} from '../constants';

// Interfaces
import type { IAccountStoreDetailProvided } from '../interfaces';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountStoreDetailsService = (): IAccountStoreDetailProvided => {
  /**
   * @description Reactive data binding
   */
  const accountStoreDetail_activeTab = ref<string>('store-facilities');

  /**
   * @description Watch active tab changes
   */
  watch(accountStoreDetail_activeTab, newTab => {
    switch (newTab.toUpperCase()) {
      case 'STORE-FACILITIES': {
        // Handle logic for store facilities tab
        break;
      }
      case 'TABLE-CONFIGURATION': {
        // Handle logic for table configuration tab
        break;
      }
      case 'ASSIGNED-STAFFS': {
        // Handle logic for assigned staffs tab
        break;
      }
      default: {
        console.warn(`Unknown tab: ${newTab}`);
      }
    }
  });

  return {
    accountStoreDetail_activeTab,
    accountStoreDetail_listTabs: ACCOUNT_STORE_DETAIL_LIST_TABS,
    accountStoreDetail_listColumnsOfOperationalHours: ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_COLUMNS,
    accountStoreDetail_listColumnsOfStoreFacilities: ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS,
    accountStoreDetail_listValuesOfOperationalHours: ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_VALUES as never[],
    accountStoreDetail_listValuesOfStoreFacilities: ACCOUNT_STORE_DETAIL_FACILITY_VALUES as never[],
  };
};
