// Interfaces
import type { Validation } from '@vuelidate/core';
import type { IAttendanceListData } from './attendance-data.interface';

// Base interfaces
interface IDropdownItem {
  label: string;
  value: string | number;
}

interface IColumnDataTable {
  label: string;
  value: string;
  isHideable?: boolean;
  isSortable?: boolean;
}

// ===== REQUEST INTERFACES =====
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

// ===== FORM INTERFACES =====
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

// ===== SERVICE INTERFACE =====
export interface IAttendanceListProvided {
  attendanceList_addShift: (staffId: number, date: string) => void;
  attendanceList_availableShifts: globalThis.Ref<IDropdownItem[]>;
  attendanceList_columns: globalThis.Ref<IColumnDataTable[]>;
  attendanceList_createEditFormMode: globalThis.Ref<'create' | 'edit'>;
  attendanceList_currentAttendanceId: globalThis.Ref<string>;
  attendanceList_fetchList: () => Promise<void>;
  attendanceList_formData: IAttendanceListFormData;
  attendanceList_formMode: globalThis.Ref<'create' | 'edit'>;
  attendanceList_formValidations: globalThis.Ref<Validation>;
  attendanceList_formattedEndTime: globalThis.ComputedRef<string>;
  attendanceList_formattedStartTime: globalThis.ComputedRef<string>;
  attendanceList_formatTime: (time: string | null) => string;
  attendanceList_getStatusColor: (value: string, type: 'early' | 'late' | 'overtime') => string;
  attendanceList_handleDelete: (recordId: number) => void;
  attendanceList_isLoading: globalThis.Ref<boolean>;
  attendanceList_listData: globalThis.Ref<IAttendanceListData>;
  attendanceList_maxDate: globalThis.ComputedRef<string>;
  attendanceList_minDate: globalThis.ComputedRef<string>;
  attendanceList_onCloseDialog: () => void;
  attendanceList_onCreate: () => void;
  attendanceList_onDelete: (attendanceId: string) => Promise<void>;
  attendanceList_onEdit: (id: number) => void;
  attendanceList_onFilter: (query: IAttendanceListRequestQuery) => void;
  attendanceList_onOpenDialog: (mode: 'create' | 'edit', attendanceId?: string) => void;
  attendanceList_onReset: () => void;
  attendanceList_onSave: () => Promise<void>;
  attendanceList_onShiftChange: () => void;
  attendanceList_popover: globalThis.Ref<unknown>;
  attendanceList_updateAvailableShifts: () => void;
  attendanceList_v$: globalThis.Ref<Validation>;
}
