export interface IAttendance {
  id:                number;
  date:              Date;
  staff_name:        string;
  created_at:        Date;
  created_by:        string;
  staff_id:          string; // UUID
  attendance_shifts: IAttendanceShift[];
}

export interface IAttendanceShift {
  id:            number;
  attendance_id: number;
  shift_start:   Date;
  shift_end:     Date;
  clock_in:      string;
  clock_out:     string;
  duration:      string;
  early:         string;
  late:          string;
  overtime:      string;
  notes:         string;
}

export interface IAttendanceListResponse extends IDefaultResponseFetch {
  data: {
    items: IAttendance[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IAttendanceStateStore {
  attendance_detail: unknown;
  attendance_isLoading: boolean;
  attendance_lists: IAttendance[];
}
