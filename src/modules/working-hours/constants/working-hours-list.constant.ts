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
    value: 'not_repeat',
  },
  {
    label: 'Daily',
    value: 'daily',
  },
  {
    label: 'Weekly on Monday',
    value: 'weekly_on_monday',
  },
  {
    label: 'Every Weekday',
    value: 'weekday',
  },
  {
    label: 'Custom',
    value: 'custom',
  },
];

export const WORKING_HOURS_CUSTOM_RECURRENCE_FREQUENCY_OPTIONS: IDropdownItem[] = [
  {
    label: 'Day',
    value: 'day',
  },
  {
    label: 'Week',
    value: 'week',
  },
  {
    label: 'Month',
    value: 'month',
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
  repeatType: 'not_repeat',
  customRecurrence: {
    frequency: 'day',
    interval: 1,
    endType: 'never',
    endDate: null,
    occurrences: 1,
  },
};
