// Constants
import { STAFF_MEMBER_LIST_COLUMNS, STAFF_MEMBER_LIST_REQUEST, STAFF_MEMBER_LIST_VALUES } from '../constants';

// Interfaces
import type { IStaffMemberListProvided } from '../interfaces';

// Store
import { useStaffMembetStore } from '../store';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useStaffMemberListService = (): IStaffMemberListProvided => {
  /**
   * @description Injected variables
   */
  const store = useStaffMembetStore(); // Instance of the store
  const { staffMember_isLoading, staffMember_listDropdownItemStaff } = storeToRefs(store);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Handle fetch api staff member. We call the fetchStaffMember_list function from the store to handle the request.
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

  return {
    staffMemberList_columns: STAFF_MEMBER_LIST_COLUMNS,
    staffMemberList_dropdownItemStaff: staffMember_listDropdownItemStaff,
    staffMemberList_fetchListMembers,
    staffMemberList_isLoading: staffMember_isLoading,
    staffMemberList_values: STAFF_MEMBER_LIST_VALUES as never[],
  };
};
