// Constants
import {
  STAFF_MEMBER_LIST_COLUMNS,
  STAFF_MEMBER_LIST_REQUEST,
} from '../constants';

// Interfaces
import type { IStaffMemberListProvided, IStaffMemberListRequestQuery } from '../interfaces';

// Store
import { useStaffMemberStore } from '../store';

import eventBus from '@/plugins/mitt';
import { IRole } from '@/modules/role/interfaces/index.interface';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useStaffMemberListService = (): IStaffMemberListProvided => {
  /**
   * @description Injected variables
   */
  const store = useStaffMemberStore(); // Instance of the store
  const route = useRoute();
  const {
    staffMember_isLoading,
    staffMember_listDropdownItemStaff,
    staffMember_listDropdownItemStaffUsingUserId,
    staffMember_listDropdownItemTitles,
    staffMember_lists,
  } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const staffMemberList_queryParams = reactive<IStaffMemberListRequestQuery>({
    search: null,
    page: 1,
    limit: 10,
    // title: null,
    permission: [],
  });
  /**
   * @description Handle fetch api staff member. We call the fetchStaffMember_list function from the store to handle the request.
   */

  /**
   * @description Reactive data binding
   */

  const staffMemberList_fetchListMembers = async (): Promise<void> => {
    try {
      await store.staffMember_list(staffMemberList_queryParams, {
        ...httpAbort_registerAbort(STAFF_MEMBER_LIST_REQUEST),
        paramsSerializer: useParamsSerializer,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const staffMemberList_onChangePage = (page: number): void => {
    staffMemberList_queryParams.page = page;
  };

  /**
   * @description Watcher for query parameters changes
   */
  watch(
    () => staffMemberList_queryParams,
    debounce(async () => {
      await staffMemberList_fetchListMembers();
    }, 500),
    { deep: true },
  );

  /**
   * @description Handle fetch api staff member - delete
   */

  const staffMemberList_fetchdeleteStaffMember = async (staffMemberId: string): Promise<void> => {
    try {
      await store.staffMember_deleteStaffMember(staffMemberId, {
        ...httpAbort_registerAbort(STAFF_MEMBER_LIST_REQUEST),
      });
      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Staff member has been deleted successfully',
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
      // Optionally, you can refetch the list after deletion
      await staffMemberList_fetchListMembers();
    }
  };

  const staffMemberList_deleteStaffMember = async (staffMemberId: string): Promise<void> => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'staff-member-list-dialog-confirmation',
      description: 'This action cannot be undone, and the member you remove will lose access to the system',
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      onClickButtonPrimary: () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'staff-member-list-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
      },
      onClickButtonSecondary: async () => {
        const argsEventEmitter: IPropsDialogConfirmation = {
          id: 'staff-member-list-dialog-confirmation',
          isOpen: false,
        };

        eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);

        await staffMemberList_fetchdeleteStaffMember(staffMemberId);
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Staff Member',
      title: 'Are you sure want to delete this staff member?',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description for roles permissions
   */
  const staffMemberCreateEdit_permissionData = ref<IRole[]>([]);

  const staffMemberCreateEdit_getRoles = async (): Promise<void> => {
    try {
     const res = await store.staffMember_getPermissions({
        page: 1,
        pageSize: 100,
        orderBy: null,
        orderDirection: null
      }, {}, route)

      staffMemberCreateEdit_permissionData.value = res.data?.items ?? []
    } catch (error) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  }

  onMounted(() => {
    staffMemberCreateEdit_getRoles()
  })

  return {
    staffMemberList_columns: STAFF_MEMBER_LIST_COLUMNS,
    staffMemberList_dropdownItemStaff: staffMember_listDropdownItemStaff,
    staffMemberList_dropdownItemStaffUsingUserId: staffMember_listDropdownItemStaffUsingUserId,
    staffMemberList_dropdownItemTitles: staffMember_listDropdownItemTitles,
    staffMemberList_typesOfUserPermissions: staffMemberCreateEdit_permissionData,
    staffMemberList_fetchListMembers,
    staffMemberList_deleteStaffMember,

    staffMemberList_isLoading: staffMember_isLoading,
    staffMemberList_values: staffMember_lists, // Access the value of the Ref
    staffMemberList_queryParams, // Expose the query params for potential use in the component

    staffMemberList_onChangePage,
  };
};
