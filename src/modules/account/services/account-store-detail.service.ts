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
import type { IAccountStoreDetailProvided, IAccountStoreTable } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

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
  const {
    outlet_isLoading,
    outlet_listAvailableFloor,
    outlet_operationalHours,
    outlet_selectedOutletOnAccountPage,
    outlet_tables,
  } = storeToRefs(outletStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const accountStoreDetail_activeTab = ref<string>('store-facilities');
  const accountStoreDetail_selectedFloor = ref<string>('');
  const accountStoreDetail_selectedTable = ref<IAccountStoreTable | null>(null);

  /**
   * @description Handle fetch api outlet. We call the fetchOutlet_listOperationalHours function from the store to handle the request.
   */
  const accountStoreDetail_fetchOutletListOperationalHours = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_listOperationalHours({
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
  const accountStoreDetail_fetchOutletStoreTable = async (): Promise<void> => {
    try {
      await outletStore.fetchOutlet_storeTable({
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
   * @description Handle business logic for close dialog detail table
   */
  const accountStoreDetail_onCloseDialogDetailTable = (): void => {
    eventBus.emit('AppBaseDialog', {
      id: 'account-store-table-configuration-detail-dialog',
      isOpen: false,
    });
    accountStoreDetail_selectedTable.value = null;
  };

  /**
   * @description Handle business logic for show dialog detail table
   */
  const accountStoreDetail_onShowDialogDetailTable = (table: IAccountStoreTable): void => {
    accountStoreDetail_selectedTable.value = table;

    const argsEventEmitter: IPropsDialog = {
      id: 'account-store-table-configuration-detail-dialog',
      isOpen: true,
      isUsingClosableButton: false,
      width: '577px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
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
        accountStoreDetail_fetchOutletStoreTable();
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

  /**
   * @description Handle business logic for returning selected table layout
   */
  const accountStoreDetail_selectedTableLayout = computed(() =>
    outlet_tables.value.find(floor => floor.floorName === accountStoreDetail_selectedFloor.value),
  );

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
    accountStoreDetail_onCloseDialogDetailTable,
    accountStoreDetail_onShowDialogDetailTable,
    accountStoreDetail_operationalHours: outlet_operationalHours,
    accountStoreDetail_selectedFloor,
    accountStoreDetail_selectedOutlet: outlet_selectedOutletOnAccountPage,
    accountStoreDetail_selectedTable,
    accountStoreDetail_selectedTableLayout,
    accountStoreDetail_storeTables: outlet_tables,
  };
};
