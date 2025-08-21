// Interfaces
import type { IWorkingHoursFormDataTimeSlot, IWorkingHoursFormData } from '../interfaces';

export const WORKING_HOURS_LIST_VIEW_TYPES: IDropdownItem[] = [
  {
    label: 'Month',
    value: 'Month',
  },
  {
    label: 'Week',
    value: 'Week',
  },
];

export const WORKING_HOURS_CREATE_EDIT_REPEAT_OPTIONS: IDropdownItem[] = [
  {
    label: 'Does Not Repeat',
    value: 'none',
  },
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Weekly',
    value: 'weekly',
  },
  {
    label: 'Monthly',
    value: 'monthly',
  },
];

export const WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT: IWorkingHoursFormDataTimeSlot = {
  openTime: null,
  closeTime: null,
};

export const WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA: IWorkingHoursFormData = {
  staffId: null,
  date: '',
  timeSlots: [WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT],
  notes: '',
  repeatType: 'none',
};
