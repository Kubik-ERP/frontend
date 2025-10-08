// Constants
import {
  ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_COLUMNS,
  ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS,
  ACCOUNT_STORE_DETAIL_FACILITY_VALUES,
  ACCOUNT_STORE_DETAIL_LIST_TABS,
  ACCOUNT_STORE_DETAIL_OPERATIONAL_HOUR_COLUMNS,
  ACCOUNT_STORE_DETAIL_OPERATIONAL_HOURS_VALUES,
  ACCOUNT_STORE_LIST_OPERATIONAL_HOURS_REQUEST,
  ACCOUNT_STORE_TABLE_LIST_REQUEST,
  ACCOUNT_STORE_TABLE_CHANGE_STATUS_REQUEST,
} from '../constants';

// Interfaces
import type {
  IAccountStoreDetailProvided,
  IAccountStoreTable,
  IStoreFacilityFormData,
  IStoreFacility_queryParams,
  IStoreFacility,
  IStoreAssignedStaff,
  IAcountStaffMemberListRequestQuery,
  IStoreAssignedStaffFormData,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

// Stores
import { useOutletStore } from '@/modules/outlet/store';
import { useAccountStore } from '../store';

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
  const store = useAccountStore();
  const { account_storeFacilities, account_storeFacilities_isLoading, account_storeStaffAssigned } =
    storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();
  const route = useRoute();

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
   * @description Handle API request to change a table's status (available / occupied)
   */
  const accountStoreDetail_fetchChangeTableStatus = async (
    tableId: string,
    newStatus: 'available' | 'occupied',
  ): Promise<void> => {
    try {
      await store.fetchAccount_changeTableStatus(
        { table_id: tableId, new_status: newStatus },
        {
          ...httpAbort_registerAbort(ACCOUNT_STORE_TABLE_CHANGE_STATUS_REQUEST),
        },
      );

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: `Table status changed to "${newStatus}" successfully.`,
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error) {
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Failed to change table status. Please try again.',
        position: EToastPosition.TOP_RIGHT,
      };
      eventBus.emit('AppBaseToast', argsEventEmitter);

      if (error instanceof Error) return Promise.reject(error);
      else return Promise.reject(new Error(String(error)));
    }
  };

  /**
   * @description Handle business logic for downloading table QR code as image
   */
  const accountStoreDetail_onDownloadTableQRCode = (): void => {
    try {
      if (!accountStoreDetail_selectedTable.value || !outlet_selectedOutletOnAccountPage.value) {
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.DANGER,
          message: 'Table information is not available for download.',
          position: EToastPosition.TOP_RIGHT,
        };

        eventBus.emit('AppBaseToast', argsEventEmitter);
        return;
      }

      // Find the existing QR code canvas element in the dialog
      const qrCodeElement = document.querySelector('canvas#account-store-table-qr-code');

      if (qrCodeElement instanceof HTMLCanvasElement) {
        // Use the existing QR code canvas to create image
        qrCodeElement.toBlob(blob => {
          if (!blob) {
            const argsEventEmitter: IPropsToast = {
              isOpen: true,
              type: EToastType.DANGER,
              message: 'Failed to generate QR code image.',
              position: EToastPosition.TOP_RIGHT,
            };

            eventBus.emit('AppBaseToast', argsEventEmitter);
            return;
          }

          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `table-qr-${accountStoreDetail_selectedTable.value?.floorName}-${accountStoreDetail_selectedTable.value?.name}.png`;

          // Trigger download
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Clean up
          URL.revokeObjectURL(url);

          // Show success message
          const argsEventEmitter: IPropsToast = {
            isOpen: true,
            type: EToastType.SUCCESS,
            message: 'QR code downloaded successfully.',
            position: EToastPosition.TOP_RIGHT,
          };

          eventBus.emit('AppBaseToast', argsEventEmitter);
        }, 'image/png');
      } else {
        // If canvas not found, show error message
        const argsEventEmitter: IPropsToast = {
          isOpen: true,
          type: EToastType.DANGER,
          message: 'QR code not found. Please make sure the dialog is open.',
          position: EToastPosition.TOP_RIGHT,
        };

        eventBus.emit('AppBaseToast', argsEventEmitter);
      }
    } catch (error: unknown) {
      console.error('Download QR code error:', error);
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.DANGER,
        message: 'Failed to download QR code.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
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
    outlet_tables.value?.find(floor => floor.id === accountStoreDetail_selectedFloor.value),
  );

  /**
   * @description Filter tabs based on business type
   */
  const filteredTabs = computed(() => {
    if (outlet_selectedOutletOnAccountPage.value?.businessType === 'Retail') {
      // Hide 'Table Configuration' tab for Retail
      return ACCOUNT_STORE_DETAIL_LIST_TABS.filter(tab => tab.value !== 'table-configuration');
    }
    return ACCOUNT_STORE_DETAIL_LIST_TABS;
  });

  /**
   * @description Handle business logic for fetching API account store facilities
   */

  const accountStoreDetail_formData = reactive<IStoreFacilityFormData>({
    id: null,
    facility: '',
    description: '',
  });

  const accountStoreDetail_formRules = computed(() => ({
    facility: { required },
  }));

  const accountStoreDetail_formValidations = useVuelidate(
    accountStoreDetail_formRules,
    accountStoreDetail_formData,
    {
      $autoDirty: true,
    },
  );

  const accountStoreDetail_formReset = (): void => {
    accountStoreDetail_formData.id = null;
    accountStoreDetail_formData.facility = '';
    accountStoreDetail_formData.description = '';

    accountStoreDetail_formValidations.value.$reset();
  };

  const accountStoreDetail_queryParams = reactive<IStoreFacility_queryParams>({
    page: 1,
    limit: 10,
  });

  const accountStoreDetail_onChangePage = (page: number): void => {
    accountStoreDetail_queryParams.page = page;
  };

  watch(
    () => accountStoreDetail_queryParams,
    debounce(async () => {
      await accountStoreDetail_fetchAccountStoreFacilities();
    }, 500),
    { deep: true },
  );

  const accountStoreDetail_fetchAccountStoreFacilities = async (): Promise<void> => {
    try {
      await store.fetchAccount_storeFacilities(accountStoreDetail_queryParams, {
        ...httpAbort_registerAbort('ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const accountStoreDetail_createAccountStoreFacilities = async (): Promise<void> => {
    try {
      await store.fetchAccount_createStoreFacilities(accountStoreDetail_formData, {
        ...httpAbort_registerAbort('ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Facility has been created successfully.',
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

  const accountStoreDetail_updateAccountStoreFacilities = async (id: string): Promise<void> => {
    try {
      await store.fetchAccount_updateStoreFacilities(id, accountStoreDetail_formData, {
        ...httpAbort_registerAbort('ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Facility has been updated successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      await accountStoreDetail_fetchAccountStoreFacilities();
    }
  };

  const accountStoreDetail_deleteAccountStoreFacilities = async (id: string): Promise<void> => {
    try {
      await store.fetchAccount_deleteStoreFacilities(id, {
        ...httpAbort_registerAbort('ACCOUNT_STORE_DETAIL_FACILITY_ENDPOINT'),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Facility has been deleted successfully.',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      await accountStoreDetail_fetchAccountStoreFacilities();
    }
  };

  const accountStoreDetail_onShowDialogCreateEdit = (facility: IStoreFacility | null): void => {
    if (facility) {
      accountStoreDetail_formData.id = facility.id;
      accountStoreDetail_formData.facility = facility.facility;
      accountStoreDetail_formData.description = facility.description;
    }
    eventBus.emit('AppBaseDialog', {
      id: 'account-store-facility-create-edit-dialog',
      isOpen: true,
    });
  };

  const accountStoreDetail_onCloseDialogCreateEdit = (): void => {
    eventBus.emit('AppBaseDialog', {
      id: 'account-store-facility-create-edit-dialog',
      isOpen: false,
    });
    accountStoreDetail_formReset();
  };

  const accoutnStoreDetail_onSubmitDialogCreateEdit = async (): Promise<void> => {
    try {
      if (accountStoreDetail_formData.id === null) {
        await accountStoreDetail_createAccountStoreFacilities();
      } else {
        await accountStoreDetail_updateAccountStoreFacilities(accountStoreDetail_formData.id as string);
      }
      accountStoreDetail_onCloseDialogCreateEdit();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    } finally {
      accountStoreDetail_fetchAccountStoreFacilities();
    }
  };

  const accountStoreDetail_onDeleteDialogConfirmation = (id: string) => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'account-store-facility-delete-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            This action will stop the current recording and discard any unsaved or draft data.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'account-store-facility-delete-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the table goes here
        accountStoreDetail_deleteAccountStoreFacilities(id);
        eventBus.emit('AppBaseDialog', { id: 'account-store-facility-delete-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Store Facility',
      title: 'Are you sure want to delete this store facility?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle business logic for showing dialog staff store
   */
  const accountDetail_AssignedStaff_isLoading = ref<boolean>(false);
  const accountDetail_formData = ref<IStoreAssignedStaffFormData>({
    employeeId: '',
    type: 'ASSIGN',
  });

  const accountDetail_formRules = computed(() => ({
    employeeId: { required: true },
    type: { required: true },
  }));

  const accountDetail_AssignedStaff_formValidations = useVuelidate(
    accountDetail_formRules,
    accountDetail_formData.value,
  );

  const accountDetail_listAssignedStaff = ref<IStoreAssignedStaff[]>([]);
  const accountDetail_modalMode = ref<boolean>(false);

  const idStore = route.params.id as string;
  const accountDetail_listAssignedQueryParams = reactive<IAcountStaffMemberListRequestQuery>({
    search: '',
    page: 1,
    limit: 10,
    'X-STORE-ID': accountDetail_modalMode.value ? idStore : '',
  });

  const accountDetail_fetchAssignedStaff = async (): Promise<void> => {
    try {
      const res = await store.fetchAccount_assignedStaff(accountDetail_listAssignedQueryParams, {
        ...httpAbort_registerAbort('ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_ENDPOINT'),
      });
      accountDetail_listAssignedStaff.value = res.data.employees as IStoreAssignedStaff[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  watch(
    accountDetail_listAssignedQueryParams,
    () => {
      accountDetail_fetchAssignedStaff();
    },
    {
      deep: true,
      immediate: true,
    },
  );

  const router = useRouter();
  const accountStoreDetail_onAddStaff = (): void => {
    router.push({ name: 'staff-member.create' });
  };

  const accountStoreDetail_onCloseAddStaff = (): void => {
    console.log('accountStoreDetail_onCloseAddStaff');
  };

  const accountDetail_AssignedStaff_onSubmit = async (): Promise<void> => {
    try {
      await store.createAccount_assignedStaff(accountDetail_formData.value, {
        ...httpAbort_registerAbort('ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_ENDPOINT'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  return {
    accountStoreDetail_activeTab,
    accountStoreDetail_fetchOutletListOperationalHours,
    accountStoreDetail_fetchOutletStoreTable,
    accountStoreDetail_isLoadingOfOutlet: outlet_isLoading,
    accountStoreDetail_listAvailableFloor: outlet_listAvailableFloor,
    accountStoreDetail_listTabs: filteredTabs.value,
    accountStoreDetail_listColumnsOfAssignedStaff: ACCOUNT_STORE_DETAIL_ASSIGNED_STAFF_COLUMNS,
    accountStoreDetail_listColumnsOfOperationalHours: ACCOUNT_STORE_DETAIL_OPERATIONAL_HOUR_COLUMNS,
    accountStoreDetail_listColumnsOfStoreFacilities: ACCOUNT_STORE_DETAIL_FACILITY_COLUMNS,
    accountStoreDetail_listValuesOfAssignedStaff: account_storeStaffAssigned,
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

    // facility
    account_storeFacilities,
    accountStoreDetail_formData,
    accountStoreDetail_formValidations,
    accountStoreDetail_onChangePage,
    account_storeFacilities_isLoading,

    accountStoreDetail_fetchAccountStoreFacilities,
    accountStoreDetail_createAccountStoreFacilities,
    accountStoreDetail_updateAccountStoreFacilities,
    accountStoreDetail_deleteAccountStoreFacilities,

    accountStoreDetail_onShowDialogCreateEdit,
    accountStoreDetail_onCloseDialogCreateEdit,
    accoutnStoreDetail_onSubmitDialogCreateEdit,
    accountStoreDetail_onDeleteDialogConfirmation,
    accountStoreDetail_onDownloadTableQRCode,

    accountStoreDetail_onAddStaff,
    accountStoreDetail_onCloseAddStaff,
    accountDetail_fetchAssignedStaff,
    accountDetail_listAssignedQueryParams,
    accountDetail_listAssignedStaff,
    accountDetail_AssignedStaff_formData: accountDetail_formData,
    accountDetail_AssignedStaff_isLoading,
    accountDetail_AssignedStaff_formValidations,
    accountDetail_AssignedStaff_onSubmit,
    accountStoreDetail_fetchChangeTableStatus,
  };
};
