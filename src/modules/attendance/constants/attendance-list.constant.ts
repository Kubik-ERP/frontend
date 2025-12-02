// Interfaces
import type { IAttendanceListFormData, IAttendanceListShiftFormData } from '../interfaces';

export const ATTENDANCE_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    sortable: true,
    value: 'date',
    width: '120px',
  },
  {
    label: 'Staff Name',
    sortable: true,
    value: 'staffName',
    width: '150px',
  },
  {
    label: 'Shift',
    sortable: false,
    value: 'shift',
    width: '120px',
  },
  {
    label: 'Clock In',
    sortable: false,
    value: 'clockIn',
    width: '100px',
  },
  {
    label: 'Clock Out',
    sortable: false,
    value: 'clockOut',
    width: '100px',
  },
  {
    label: 'Duration',
    sortable: false,
    value: 'duration',
    width: '100px',
  },
  {
    label: 'Early',
    sortable: false,
    value: 'early',
    width: '80px',
  },
  {
    label: 'Late',
    sortable: false,
    value: 'late',
    width: '80px',
  },
  {
    label: 'Overtime',
    sortable: false,
    value: 'overtime',
    width: '100px',
  },
  {
    label: 'Action',
    sortable: false,
    value: 'action',
    width: '100px',
  },
];

export const ATTENDANCE_LIST_INITIAL_SHIFT: IAttendanceListShiftFormData = {
  clockIn: null,
  clockOut: null,
  notes: '',
  shiftEnd: null,
  shiftStart: null,
};

export const ATTENDANCE_LIST_INITIAL_FORM_DATA: IAttendanceListFormData = {
  date: '',
  shifts: [ATTENDANCE_LIST_INITIAL_SHIFT],
  staffId: null,
};
