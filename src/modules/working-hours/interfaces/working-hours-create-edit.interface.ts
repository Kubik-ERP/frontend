import type { Validation } from '@vuelidate/core';

export interface IWorkingHoursCreateEditTimeSlot {
  openTime: Date | null;
  closeTime: Date | null;
}

export interface IWorkingHoursCreateEditFormData {
  staffId: number | null;
  date: string; // Format: "YYYY-MM-DD"
  timeSlots: IWorkingHoursCreateEditTimeSlot[];
  notes: string;
  repeatType: string; // "none", "daily", "weekly", "monthly"
}

export interface IWorkingHoursCreateEditProvided {
  workingHoursList_formData: IWorkingHoursCreateEditFormData;
  workingHoursList_formValidations: globalThis.Ref<Validation>;
  workingHoursList_createEditFormMode: globalThis.Ref<'create' | 'edit'>;
  workingHoursList_createEditIsDialogVisible: globalThis.Ref<boolean>;
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
}
