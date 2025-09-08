// Interfaces
import type { Validation } from '@vuelidate/core';
import type { IAttendanceListData } from './attendance-data.interface';

export interface IAttendanceListRequestQuery {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  startDate: string | null;
  endDate: string | null;
  staffId: number | null;
  search?: string;
}

export interface IAttendanceListFormData {
  id: number | null;
  date: string;
  staffId: number | null;
  shift: string;
  shiftStart: string;
  shiftEnd: string;
  clockIn: string;
  clockOut: string;
  notes: string;
}

export interface IAttendanceListProvided {
  attendance_availableShifts: globalThis.Ref<IDropdownItem[]>;
  attendance_columns: globalThis.Ref<IColumnDataTable[]>;
  attendance_formData: IAttendanceListFormData;
  attendance_formMode: globalThis.Ref<'create' | 'edit'>;
  attendance_formattedEndTime: globalThis.ComputedRef<string>;
  attendance_formattedStartTime: globalThis.ComputedRef<string>;
  attendance_listData: globalThis.Ref<IAttendanceListData>;
  attendance_maxDate: globalThis.ComputedRef<string>;
  attendance_minDate: globalThis.ComputedRef<string>;
  attendance_popover: globalThis.Ref<unknown>;
  attendance_updateAvailableShifts: () => void;
  attendance_v$: globalThis.Ref<Validation>;
  attendance_formValidations: globalThis.Ref<Validation>;
  attendance_addShift: (staffId: number, date: string) => void;
  attendance_formatTime: (time: string | null) => string;
  attendance_getStatusColor: (value: string, type: 'early' | 'late' | 'overtime') => string;
  attendance_handleDelete: (id: number) => void;
  attendance_onCloseDialog: () => void;
  attendance_onCreate: () => void;
  attendance_onDelete: (id: number) => void;
  attendance_onEdit: (id: number, shiftId?: string) => void;
  attendance_onFilter: (query: IAttendanceListRequestQuery) => void;
  attendance_onSave: () => Promise<void>;
  attendance_onShiftChange: () => void;
}
