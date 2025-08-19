import { IStafPermission } from './staff-member-create-edit.interface';

export * from './staff-member-create-edit.interface';
export * from './staff-member-list.interface';

export interface IStaffMeta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface IStaffMemberEmployeesShift{
  id: string;
  days: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface IStaffMemberSocialMedia{
  mediaName: string | null;
  accountName: string | null;
}

export interface IStaffMember {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  gender?: string | null;
  title?: string | null;
  employeesShift: IStaffMemberEmployeesShift[] | [];
  employeesHasSocialMedia: IStaffMemberSocialMedia[] | [];
}

export interface IStaffMemberList{
  employees: IStaffMember[] | [];
  meta: IStaffMeta;
}

export interface IStaffMemberPermissionResponse{
  statusCode: number;
  message: string;
  data: IStafPermission[]
}

export interface IStaffMemberStore {
  staffMember_isLoading: boolean;
  staffMember_lists: IStaffMemberList;
}
