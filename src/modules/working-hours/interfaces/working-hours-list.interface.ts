import type { Validation } from '@vuelidate/core';

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

export interface IWorkingHoursFormData {
  staffId: number | null;
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: IWorkingHoursFormDataTimeSlot[];
  notes: string;
  repeatType: string; // "none", "daily", "weekly", "monthly"
}

// ===== SERVICE INTERFACE =====
export interface IWorkingHoursListProvided {
  // Existing list functionality
  workingHoursList_addTimeSlot: (
    staffId: number,
    year: number,
    month: number,
    day: number,
    startTime: string,
    endTime: string,
  ) => void;
  workingHoursList_computedColumns: globalThis.ComputedRef<IColumnDataTable[]>;
  workingHoursList_getStaffData: (staffId: number) => IStaffWorkingHours | undefined;
  workingHoursList_getWeekDateRange: globalThis.ComputedRef<string>;
  workingHoursList_initializeSelectedMonth: () => void;
  workingHoursList_listColumns: globalThis.Readonly<Ref<IColumnDataTable[]>>;
  workingHoursList_listValues: globalThis.ComputedRef<Record<string, string | number>[]>;
  workingHoursList_listViewTypes: IDropdownItem[];
  workingHoursList_onChangeSelectedMonth: (month: string) => void;
  workingHoursList_onNavigateNext: () => void;
  workingHoursList_onNavigatePrevious: () => void;
  workingHoursList_removeTimeSlot: (
    staffId: number,
    year: number,
    month: number,
    day: number,
    timeSlotId: string,
  ) => void;
  workingHoursList_selectedMonth: globalThis.Ref<string>;
  workingHoursList_selectedViewType: globalThis.Ref<string>;

  // Dialog functionality
  workingHoursList_formData: IWorkingHoursFormData;
  workingHoursList_formValidations: globalThis.Ref<Validation>;
  workingHoursList_createEditFormMode: globalThis.Ref<'create' | 'edit'>;
  workingHoursList_createEditMinDate: globalThis.Ref<string>;
  workingHoursList_createEditMaxDate: globalThis.Ref<string>;
  workingHoursList_createEditStaffList: globalThis.Ref<IDropdownItem[]>;
  workingHoursList_createEditRepeatOptions: IDropdownItem[];
  workingHoursList_onAddTimeSlot: () => void;
  workingHoursList_onRemoveTimeSlot: (index: number) => void;
  workingHoursList_onOpenDialog: (mode: 'create' | 'edit', staffId?: number, date?: string) => void;
  workingHoursList_onCloseDialog: () => void;
  workingHoursList_onSave: () => Promise<void>;
  workingHoursList_onReset: () => void;

  // Dialog computed properties
  workingHoursList_calendarDate: globalThis.ComputedRef<Date | null>;
  workingHoursList_formattedDate: globalThis.ComputedRef<string>;
  workingHoursList_selectedStaffName: globalThis.ComputedRef<string>;
  workingHoursList_hasValidHeaderData: globalThis.ComputedRef<boolean>;
}
