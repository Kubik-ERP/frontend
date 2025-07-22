// Constants
import { STAFF_MEMBER_LIST_COLUMNS, STAFF_MEMBER_LIST_REQUEST } from '../constants';

// Interfaces
import type { IStaffMemberListProvided, IStaffMemberListRequestQuery } from '../interfaces';

// Store
import { useStaffMemberStore } from '../store';

import eventBus from '@/plugins/mitt';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useStaffMemberListService = (): IStaffMemberListProvided => {
  /**
   * @description Injected variables
   */
  const store = useStaffMemberStore(); // Instance of the store
  const { staffMember_isLoading, staffMember_listDropdownItemStaff, staffMember_lists } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  const staffMemberList_queryParams = reactive<IStaffMemberListRequestQuery>({
    search: null,
  });
  /**
   * @description Handle fetch api staff member. We call the fetchStaffMember_list function from the store to handle the request.
   */

  /**
   * @description Reactive data binding
   */

  const staffMemberList_fetchListMembers = async (): Promise<void> => {
    try {
      await store.staffMember_list({
        ...httpAbort_registerAbort(STAFF_MEMBER_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  const staffMemberList_deleteStaffMember = async (staffMemberId: string): Promise<void> => {
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

  return {
    staffMemberList_columns: STAFF_MEMBER_LIST_COLUMNS,
    staffMemberList_dropdownItemStaff: staffMember_listDropdownItemStaff,
    staffMemberList_fetchListMembers,
    staffMemberList_deleteStaffMember,
    staffMemberList_isLoading: staffMember_isLoading,
    staffMemberList_values: staffMember_lists, // Access the value of the Ref
    staffMemberList_queryParams, // Expose the query params for potential use in the component
  };
};
