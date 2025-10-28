import type { Validation } from '@vuelidate/core';
import type { IStaffMember } from '@/modules/staff-member/interfaces';

// ===== DATA INTERFACES =====
export interface ITimeSlot {
  id: string;
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface IDayWorkingHours {
  day: number; // 1-31
  timeSlots: ITimeSlot[];
}

export interface IMonthWorkingHours {
  year: number;
  month: number; // 1-12
  workingHours: IDayWorkingHours[];
}

export interface IStaffWorkingHours {
  id: number;
  staff: string;
  monthlyData: IMonthWorkingHours[];
}

export interface IWorkingHoursData {
  staffMembers: IStaffWorkingHours[];
}

// ===== FORM INTERFACES =====
export interface IWorkingHoursFormDataTimeSlot {
  openTime: Date | null;
  closeTime: Date | null;
}

export interface ICustomRecurrence {
  frequency: string; // "day", "week", "month"
  interval: number; // Every X days/weeks/months
  endType: string; // "never", "on", "after"
  endDate: Date | null; // End date (when endType is "on")
  occurrences: number; // Number of occurrences (when endType is "after")
}

export interface IWorkingHoursFormData {
  staffId: number | null;
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: IWorkingHoursFormDataTimeSlot[];
  notes: string;
  repeatType: string; // "none", "daily", "weekly-monday", "weekday", "custom"
  customRecurrence: ICustomRecurrence;
}

// ===== SERVICE INTERFACE =====
export interface IWorkingHoursListProvided {
  workingHoursList_addTimeSlot: (
    staffId: number,
    year: number,
    month: number,
    day: number,
    startTime: string,
    endTime: string,
  ) => void;
  workingHoursList_calendarDate: globalThis.ComputedRef<Date | null>;
  workingHoursList_columns: globalThis.ComputedRef<IColumnDataTable[]>;
  workingHoursList_createEditFormMode: globalThis.Ref<'create' | 'edit'>;
  workingHoursList_createEditMaxDate: globalThis.Ref<string>;
  workingHoursList_createEditMinDate: globalThis.Ref<string>;
  workingHoursList_createEditRepeatOptions: IDropdownItem[];
  workingHoursList_createEditStaffList: globalThis.ComputedRef<IDropdownItem[]>;
  workingHoursList_customRecurrenceEndDate: globalThis.ComputedRef<Date | null>;
  workingHoursList_customRecurrenceFrequencyOptions: IDropdownItem[];
  workingHoursList_fetchList: () => Promise<void>;
  workingHoursList_formData: IWorkingHoursFormData;
  workingHoursList_formValidations: globalThis.Ref<Validation>;
  workingHoursList_formattedDate: globalThis.ComputedRef<string>;
  workingHoursList_getCurrentWeekDateString: (dayOfWeek: number) => string;
  workingHoursList_getStaffData: (staffId: number) => IStaffMember | undefined;
  workingHoursList_getWeekDateRange: globalThis.ComputedRef<string>;
  workingHoursList_hasValidHeaderData: globalThis.ComputedRef<boolean>;
  workingHoursList_isLoading: globalThis.Ref<boolean>;
  workingHoursList_listValues: globalThis.ComputedRef<Record<string, string | number>[]>;
  workingHoursList_listViewTypes: IDropdownItem[];
  workingHoursList_onAddTimeSlot: () => void;
  workingHoursList_onChangeSelectedMonth: (month: string) => void;
  workingHoursList_onCloseDialog: () => void;
  workingHoursList_onDelete: (workingHoursId: string) => Promise<void>;
  workingHoursList_onNavigateNext: () => void;
  workingHoursList_onNavigatePrevious: () => void;
  workingHoursList_onOpenDialog: (
    mode: 'create' | 'edit',
    staffId?: number,
    date?: string,
    workingHoursId?: string,
  ) => void;
  workingHoursList_onRemoveTimeSlot: (index: number) => void;
  workingHoursList_onReset: () => void;
  workingHoursList_onSave: () => Promise<void>;
  workingHoursList_removeTimeSlot: (
    staffId: number,
    year: number,
    month: number,
    day: number,
    timeSlotId: string,
  ) => void;
  workingHoursList_selectedMonth: globalThis.Ref<string>;
  workingHoursList_selectedStaffName: globalThis.ComputedRef<string>;
  workingHoursList_selectedViewType: globalThis.Ref<string>;
  workingHoursList_showCustomRecurrence: globalThis.ComputedRef<boolean>;
}
