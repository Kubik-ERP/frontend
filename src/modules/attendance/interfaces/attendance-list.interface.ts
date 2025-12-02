// Interfaces
import type { Validation } from '@vuelidate/core';
import type { IAttendanceData } from './attendance-data.interface';

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
  staffId: string | null; // UUID
  search?: string;
}


// ===== FORM INTERFACES =====
export interface IAttendanceListFormData {
  staffId: string | null; // UUID
  date: string; // Format: "YYYY-MM-DD"
  staffName?: string;
  createdBy?: string;
  shifts: IAttendanceListShiftFormData[];
}

export interface IAttendanceListShiftFormData {
  shiftStart: Date | null;
  shiftEnd:   Date | null;
  clockIn:    Date | null;
  clockOut:   Date | null;
  notes:      string;
}

// ===== API PAYLOAD INTERFACES =====
export interface IAttendanceCreatePayload {
  staffId: string | null;
  date: string;
  staffName: string;
  createdBy: string;
  shifts: IAttendanceShiftPayload[];
}

export interface IAttendanceShiftPayload {
  shiftStart: string; // Format: "HH:mm"
  shiftEnd: string;   // Format: "HH:mm"
  clockIn: string;    // Format: "HH:mm"
  clockOut: string;   // Format: "HH:mm"
  duration: string;   // Format: "Xh Ym"
  early: string;      // Format: "Xm"
  late: string;       // Format: "Xm"
  overtime: string;   // Format: "Xm"
  notes: string;
}


// ===== SERVICE INTERFACE =======
export interface IAttendanceListProvided {
  attendanceList_addShift: () => void;
  attendanceList_availableShifts: globalThis.ComputedRef<IDropdownItem[]>;
  attendanceList_calendarDate: globalThis.WritableComputedRef<Date | null>;
  attendanceList_clockInTime: globalThis.WritableComputedRef<Date | null>;
  attendanceList_clockOutTime: globalThis.WritableComputedRef<Date | null>;
  attendanceList_columns: globalThis.Ref<IColumnDataTable[]>;
  attendanceList_createEditFormMode: globalThis.Ref<'create' | 'edit'>;
  attendanceList_createEditMaxDate: globalThis.Ref<string>;
  attendanceList_createEditMinDate: globalThis.Ref<string>;
  attendanceList_currentAttendanceId: globalThis.Ref<string>;
  attendanceList_currentShift: globalThis.ComputedRef<IAttendanceListShiftFormData | null>;
  attendanceList_fetchList: () => Promise<void>;
  attendanceList_formData: IAttendanceListFormData;
  attendanceList_formMode: globalThis.ComputedRef<'create' | 'edit'>;
  attendanceList_formValidations: globalThis.Ref<Validation>;
  attendanceList_formattedShiftEnd: globalThis.ComputedRef<string>;
  attendanceList_formattedShiftStart: globalThis.ComputedRef<string>;
  attendanceList_formatDuration: (clockIn: Date | null, clockOut: Date | null) => string;
  attendanceList_formatTime: (time: Date | string | null) => string;
  attendanceList_getAvailableShifts: globalThis.ComputedRef<IDropdownItem[]>;
  attendanceList_getStatusColor: (value: string, type: 'early' | 'late' | 'overtime') => string;
  attendanceList_handleDelete: (recordId: number) => void;
  attendanceList_hasValidHeaderData: globalThis.ComputedRef<boolean>;
  attendanceList_isLoading: globalThis.Ref<boolean>;
  attendanceList_isLoadingShifts: globalThis.Ref<boolean>;
  attendanceList_listData: globalThis.ComputedRef<{ items: IAttendanceData[]; meta: { total: number; perPage: number; currentPage: number; lastPage: number } }>;
  attendanceList_listValues: globalThis.ComputedRef<Record<string, string | number>[]>;
  attendanceList_maxDate: globalThis.ComputedRef<string>;
  attendanceList_minDate: globalThis.ComputedRef<string>;
  attendanceList_onCloseDialog: () => void;
  attendanceList_onCreate: () => void;
  attendanceList_onDelete: (attendanceId: string) => Promise<void>;
  attendanceList_onEdit: (id: number) => void;
  attendanceList_onOpenDialog: (mode: 'create' | 'edit', attendanceId?: string) => void;
  attendanceList_onRemoveShift: (index: number) => void;
  attendanceList_onReset: () => void;
  attendanceList_onSave: () => Promise<void>;
  attendanceList_onShiftChange: (selectedValue: string) => void;
  attendanceList_selectedShiftValue: globalThis.WritableComputedRef<string | null>;
  attendanceList_selectedStaffName: globalThis.ComputedRef<string>;
  attendanceList_staffList: globalThis.ComputedRef<IDropdownItem[]>;
  attendanceList_updateAvailableShifts: () => Promise<void>;
}
