// Interfaces
import type { IStaffMember, IStaffMeta, IStaffMemberList } from './index';

export interface IStaffMemberListRequestQuery{
  search?: string | null;
}

export interface IStaffMemberListResponse {
  data: {
    data: IStaffMember[] | [];
    meta: IStaffMeta;
  };
}

export interface IStaffMemberListProvided {
  staffMemberList_columns: IColumnDataTable[];
  staffMemberList_dropdownItemStaff: globalThis.Ref<IDropdownItem[]>;
  staffMemberList_fetchListMembers: () => Promise<unknown>;
  staffMemberList_deleteStaffMember: (staffMemberId: string) => Promise<void>;
  staffMemberList_isLoading: globalThis.Ref<boolean>;
  staffMemberList_values: globalThis.Ref<IStaffMemberList>;
  staffMemberList_queryParams: IStaffMemberListRequestQuery;
}
