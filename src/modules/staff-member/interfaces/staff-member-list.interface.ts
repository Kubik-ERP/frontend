// Interfaces
import type { IStaffMember, IStaffMeta, IStaffMemberList, IStafPermission } from './index';

export interface IStaffMemberListRequestQuery{
  search?: string | null;
  page?: number;
  limit?: number;
  // title?: string | null;
  permission?: string[] | [];
}

export interface IStaffMemberListResponse {
  data: {
    employees: IStaffMember[] | [];
    meta: IStaffMeta;
  };
}

export interface IStaffMemberGetWithOwnerResponse{
  statusCode: number;
  message: string;
  data: {
    id: string;
    fullname: string;
  }[];
}
export interface IStaffMemberListProvided {
  staffMemberList_columns: IColumnDataTable[];
  staffMemberList_dropdownItemStaff: globalThis.Ref<IDropdownItem[]>;
  staffMemberList_dropdownItemTitles: globalThis.Ref<IDropdownItem[]>;
  staffMemberList_typesOfUserPermissions: globalThis.Ref<IStafPermission[]>;
  staffMemberList_fetchListMembers: () => Promise<unknown>;
  staffMemberList_deleteStaffMember: (staffMemberId: string) => Promise<void>;
  staffMemberList_isLoading: globalThis.Ref<boolean>;
  staffMemberList_values: globalThis.Ref<IStaffMemberList>;
  staffMemberList_queryParams: IStaffMemberListRequestQuery;
  staffMemberList_onChangePage: (page: number) => void;
}
