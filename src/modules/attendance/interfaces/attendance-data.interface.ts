export interface IAttendanceDataShift {
  id: string;
  shiftStart: string;
  shiftEnd: string;
  clockIn: string | null;
  clockOut: string | null;
  duration: string;
  early: string;
  late: string;
  overtime: string;
  notes: string;
}

export interface IAttendanceData {
  id: number;
  date: string;
  staffId: number;
  staffName: string;
  shifts: IAttendanceDataShift[];
  createdAt: string;
  createdBy: string;
}

export interface IAttendanceListData {
  items: IAttendanceData[];
  meta: {
    total: number;
    perPage: number;
    currentPage: number;
    lastPage: number;
  };
}
