// Interfaces
interface IColumnDataTable {
  label: string;
  value: string;
  sortable?: boolean;
  width?: string;
}

interface IDropdownItem {
  label: string;
  value: string | number;
}

/**
 * @description Attendance list columns for datatable
 */
export const attendanceList_LIST_COLUMNS: IColumnDataTable[] = [
  {
    label: 'Date',
    value: 'date',
    sortable: true,
    width: '120px',
  },
  {
    label: 'Staff Name',
    value: 'staffName',
    sortable: true,
    width: '150px',
  },
  {
    label: 'Shift',
    value: 'shift',
    sortable: false,
    width: '120px',
  },
  {
    label: 'Clock In',
    value: 'clockIn',
    sortable: false,
    width: '100px',
  },
  {
    label: 'Clock Out',
    value: 'clockOut',
    sortable: false,
    width: '100px',
  },
  {
    label: 'Duration',
    value: 'duration',
    sortable: false,
    width: '100px',
  },
  {
    label: 'Early',
    value: 'early',
    sortable: false,
    width: '80px',
  },
  {
    label: 'Late',
    value: 'late',
    sortable: false,
    width: '80px',
  },
  {
    label: 'Overtime',
    value: 'overtime',
    sortable: false,
    width: '100px',
  },
  {
    label: 'Action',
    value: 'action',
    sortable: false,
    width: '100px',
  },
];

export const attendanceList_LIST_VALUES = [
  {
    id: 1,
    date: '20/08/2025',
    staffId: 1,
    staffName: 'Bessie Cooper #001',
    shifts: [
      {
        id: 'shift1',
        shiftStart: '07:00',
        shiftEnd: '12:00',
        clockIn: '07:05',
        clockOut: '12:10',
        duration: '5h 5m',
        early: '0m',
        late: '5m',
        overtime: '10m',
        notes: 'Regular morning shift',
      },
      {
        id: 'shift2',
        shiftStart: '18:00',
        shiftEnd: '23:00',
        clockIn: '17:55',
        clockOut: '23:00',
        duration: '5h 5m',
        early: '5m',
        late: '0m',
        overtime: '0m',
        notes: 'Evening shift',
      },
    ],
    createdAt: '20/08/2025 23:00',
    createdBy: 'System',
  },
  {
    id: 2,
    date: '19/08/2025',
    staffId: 2,
    staffName: 'Esther Howard #002',
    shifts: [
      {
        id: 'shift3',
        shiftStart: '08:00',
        shiftEnd: '13:00',
        clockIn: '08:15',
        clockOut: '13:30',
        duration: '5h 15m',
        early: '0m',
        late: '15m',
        overtime: '30m',
        notes: 'Late arrival due to traffic',
      },
      {
        id: 'shift4',
        shiftStart: '19:00',
        shiftEnd: '24:00',
        clockIn: '19:00',
        clockOut: '23:45',
        duration: '4h 45m',
        early: '0m',
        late: '0m',
        overtime: '0m',
        notes: 'Left early with permission',
      },
    ],
    createdAt: '19/08/2025 23:45',
    createdBy: 'Manager',
  },
  {
    id: 3,
    date: '18/08/2025',
    staffId: 3,
    staffName: 'Devon Lane #003',
    shifts: [
      {
        id: 'shift5',
        shiftStart: '09:00',
        shiftEnd: '17:00',
        clockIn: '09:00',
        clockOut: '17:00',
        duration: '8h 0m',
        early: '0m',
        late: '0m',
        overtime: '0m',
        notes: 'Perfect timing',
      },
    ],
    createdAt: '18/08/2025 17:00',
    createdBy: 'System',
  },
];

export const attendanceList_STAFF_LIST: IDropdownItem[] = [
  {
    label: 'Bessie Cooper #001',
    value: 1,
  },
  {
    label: 'Esther Howard #002',
    value: 2,
  },
  {
    label: 'Devon Lane #003',
    value: 3,
  },
  {
    label: 'Marvin McKinney #004',
    value: 4,
  },
];
