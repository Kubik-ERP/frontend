// export interface IStaff
export interface IStaff {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  title: string;
  userPermission: string;
}

export interface IStaffStateStore {
  employees: IStaff[];
  currentPage: number; // Added currentPage property
  itemsPerPage: number;
  sortField: string;
  sortOrder: string;
}
