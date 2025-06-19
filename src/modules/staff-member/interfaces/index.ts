export * from './staff-member-list.interface';

export interface IStaffMember {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profileUrl: string;
  startDate: Date;
  endDate: Date;
  gender: string;
}

export interface IStaffMemberStore {
  staffMember_isLoading: boolean;
  staffMember_lists: IStaffMember[] | [];
}
