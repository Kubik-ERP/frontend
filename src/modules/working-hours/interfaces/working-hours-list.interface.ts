import type { IStaffWorkingHours } from './working-hours-data.interface';

export interface IWorkingHoursListProvided {
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
}
