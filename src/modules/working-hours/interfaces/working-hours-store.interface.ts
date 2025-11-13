export interface IWorkingHour {
  id:                      number;
  staff_id:                string; // UUID
  date:                    Date;
  notes:                   string;
  repeat_type:             string;
  created_at:              Date;
  updated_at:              Date;
  working_hour_time_slots: IWorkingHourTimeSlot[];
  working_hour_recurrence: IWorkingHourRecurrence;
}

export interface IWorkingHourRecurrence {
  id:              number;
  working_hour_id: number;
  frequency:       string;
  interval:        number;
  end_type:        string;
  end_date:        Date;
  occurrences:     number;
}

export interface IWorkingHourTimeSlot {
  id:              number;
  working_hour_id: number;
  open_time:       Date;
  close_time:      Date;
}

export interface IWorkingHoursListResponse extends IDefaultResponseFetch {
  data: {
    items: IWorkingHour[];
    meta: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface IWorkingHoursStateStore {
  workingHours_detail: unknown;
  workingHours_isLoading: boolean;
  workingHours_lists: IWorkingHour[] | [];
}
