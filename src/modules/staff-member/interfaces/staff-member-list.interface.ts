// Interfaces
import type { IStaffMember } from './index';

export interface IStaffMemberListResponse {
  data: IStaffMember[] | [];
}

export interface IStaffMemberListProvided {
  staffMemberList_columns: IColumnDataTable[];
  staffMemberList_dropdownItemStaff: globalThis.Ref<IDropdownItem[]>;
  staffMemberList_fetchListMembers: () => Promise<unknown>;
  staffMemberList_isLoading: globalThis.Ref<boolean>;
  staffMemberList_values: never[];
}
