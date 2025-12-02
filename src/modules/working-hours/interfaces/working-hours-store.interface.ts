export interface IWorkingHour {
  id:                      number;
  staff_id:                string; // UUID
  date:                    Date;
  employees?:              IWorkingHourEmployee;
  notes:                   string;
  repeat_type:             string;
  created_at:              Date;
  updated_at:              Date;
  working_hour_time_slots: IWorkingHourTimeSlot[];
  working_hour_recurrence: IWorkingHourRecurrence;
}

export interface IWorkingHourEmployee {
  id:                              string;
  name:                            string;
  email:                           string;
  phone_number:                    string;
  profile_url:                     null;
  start_date:                      Date;
  end_date:                        null;
  gender:                          string;
  title:                           string;
  phone_code:                      string;
  permission:                      string;
  default_commission_product_type: null;
  default_commission_voucher_type: null;
  default_commission_voucher:      null;
  default_commission_product:      null;
  user_id:                         number;
  stores_id:                       string;
  created_at:                      Date;
  updated_at:                      Date;
  deleted_at:                      null;
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

export interface IWorkingHoursDetailResponse extends IDefaultResponseFetch {
  data: IWorkingHour;
}

export interface IWorkingHoursDetailByStaffResponse extends IDefaultResponseFetch {
  data: IWorkingHour[];
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
