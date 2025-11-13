import { IStafPermission } from './staff-member-create-edit.interface';

export * from './staff-member-create-edit.interface';
export * from './staff-member-list.interface';

export interface IStaffMeta {
  pageSize?: number;
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

export interface IStaffMemberEmployeesShift {
  id: string;
  days: string | null;
  startTime: string | null;
  endTime: string | null;
}

export interface IStaffMemberSocialMedia {
  mediaName: string | null;
  accountName: string | null;
}

export interface IStaffMember {
  id: string;
  name: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  profileUrl?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  gender?: string | null;
  title?: string | null;
  userId: number;
  employeesShift: IStaffMemberEmployeesShift[] | [];
  employeesHasSocialMedia: IStaffMemberSocialMedia[] | [];
  productCommissions: productCommissions[];
  voucherCommissions: voucherCommissions[];
  invoices?: {
    data: unknown[];
    meta: {
      pageSize: number;
      totalData: number;
      page: number;
      totalPages: number;
    };
  };
  paid?: number;
  unpaid?: number;
}

export interface IStaffCommission {
  invoiceNumber: string;
  paidAt: string;
  name: string;
  sourceType: 'product' | 'voucher';
  commissionAmount: number;
}

export interface IStaffCommissionsResponse {
  message: string;
  statusCode: number;
  data: {
    items: IStaffCommission[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface productCommissions {
  id: string;
  productsId: string;
  employeesId: string;
  isPercent: boolean;
  amount: number;
  invoiceId: string;
  createdAt: string;
}

export interface voucherCommissions {
  id: string;
  voucherId: string;
  employeesId: string;
  isPercent: boolean;
  amount: number;
  invoiceId: string;
  createdAt: string;
}

export interface IStaffMemberList {
  employees: IStaffMember[] | [];
  meta: IStaffMeta;
}

export interface IStaffMemberPermissionResponse {
  statusCode: number;
  message: string;
  data: IStafPermission[];
}

export interface IStaffMemberStore {
  staffMember_isLoading: boolean;
  staffMember_lists: IStaffMemberList;
  staffMember_details: IStaffMember;
  staffMember_commissions: IStaffCommissionsResponse;
}
