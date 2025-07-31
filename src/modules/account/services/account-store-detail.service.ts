// Constants
import {
  ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_COLUMNS,
  ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_VALUES,
  ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS,
  ACCOUNT_STORE_DETAIL_FACILITY_VALUES,
  ACCOUNT_STORE_DETAIL_LIST_TABS,
  ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_COLUMNS,
  ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_VALUES,
  ACCOUNT_STORE_LIST_OPERATIONAL_HOURS_REQUEST,
  ACCOUNT_STORE_TABLE_LIST_REQUEST,
} from '../constants';

// Interfaces
import type { IAccountStoreDetailProvided } from '../interfaces';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAccountStoreDetailsService = (): IAccountStoreDetailProvided => {
  /**
   * @description Injected variables
   */
  const outletStore = useOutletStore();
  const route = useRoute();
  const { outlet_isLoading, outlet_listAvailableFloor, outlet_operationalHours, outlet_tables } =
    storeToRefs(outletStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const accountStoreDetail_activeTab = ref<string>('store-facilities');
  const accountStoreDetail_selectedFloor = ref<string>('');

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_listOperationalHours function from the store to handle the request.
   */
  const accountStoreDetail_fetchOutletListOperationalHours = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_listOperationalHours(route.params.id as string, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_LIST_OPERATIONAL_HOURS_REQUEST),
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
   * @description Handle fetch api outlet. We call the fetchOutlet_storeTable function from the store to handle the request.
   */
  const accountStoreTableConfiguration_fetchOutletStoreTable = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_storeTable(route.params.id as string, {
        ...httpAbort_registerAbort(ACCOUNT_STORE_TABLE_LIST_REQUEST),
      });

      if (outlet_listAvailableFloor.value.length > 0) {
        accountStoreDetail_selectedFloor.value = String(outlet_listAvailableFloor.value[0].value);
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
   * @description Watch active tab changes
   */
  watch(accountStoreDetail_activeTab, newTab => {
    switch (newTab.toUpperCase()) {
      case 'STORE-FACILITIES': {
        // Handle logic for store facilities tab
        break;
      }
      case 'TABLE-CONFIGURATION': {
        accountStoreTableConfiguration_fetchOutletStoreTable();
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
    accountStoreTableConfiguration_fetchOutletStoreTable,
    accountStoreDetail_fetchOutletListOperationalHours,
    accountStoreDetail_isLoadingOfOutlet: outlet_isLoading,
    accountStoreDetail_listAvailableFloor: outlet_listAvailableFloor,
    accountStoreDetail_listTabs: ACCOUNT_STORE_DETAIL_LIST_TABS,
    accountStoreDetail_listColumnsOfAssignedStaff: ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_COLUMNS,
    accountStoreDetail_listColumnsOfOperationalHours: ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_COLUMNS,
    accountStoreDetail_listColumnsOfStoreFacilities: ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS,
    accountStoreDetail_listValuesOfAssignedStaff: ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_VALUES as never[],
    accountStoreDetail_listValuesOfOperationalHours: ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_VALUES as never[],
    accountStoreDetail_listValuesOfStoreFacilities: ACCOUNT_STORE_DETAIL_FACILITY_VALUES as never[],
    accountStoreDetail_operationalHours: outlet_operationalHours,
    accountStoreDetail_selectedFloor,
    accountStoreDetail_storeTables: outlet_tables,
  };
};
