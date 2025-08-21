// Constants
import {
  WORKING_HOURS_LIST_VIEW_TYPES,
  WORKING_HOURS_CREATE_EDIT_REPEAT_OPTIONS,
  WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA,
  WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT,
} from '../constants';
import { DAY_NAMES, DAY_NAMES_SHORT, MONTH_NAMES, MONTH_NAMES_SHORT } from '@/app/constants';

// Interfaces
import type { IWorkingHoursListProvided, IStaffWorkingHours, IWorkingHoursFormData } from '../interfaces';

// Helpers
import { WorkingHoursDataHelper } from '../helpers';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useWorkingHoursListService = (): IWorkingHoursListProvided => {
  /**
   * @description Reactive variables
   */
  const workingHoursList_listColumns = ref<IColumnDataTable[]>([]);
  /**
   * @description Sample working hours data using the new structure
   */
  const workingHoursList_rawData = ref<IStaffWorkingHours[]>([
    {
      id: 1,
      staff: 'Bessie Cooper #001',
      monthlyData: [
        {
          year: 2025,
          month: 8, // August
          workingHours: [
            {
              day: 1,
              timeSlots: [
                { id: 'ts1', startTime: '07:00', endTime: '12:00' },
                { id: 'ts2', startTime: '18:00', endTime: '23:00' },
              ],
            },
            {
              day: 3,
              timeSlots: [
                { id: 'ts3', startTime: '07:00', endTime: '12:00' },
                { id: 'ts4', startTime: '18:00', endTime: '23:00' },
              ],
            },
            {
              day: 4,
              timeSlots: [
                { id: 'ts5', startTime: '07:00', endTime: '12:00' },
                { id: 'ts6', startTime: '18:00', endTime: '23:00' },
              ],
            },
            {
              day: 6,
              timeSlots: [
                { id: 'ts7', startTime: '07:00', endTime: '12:00' },
                { id: 'ts8', startTime: '18:00', endTime: '23:00' },
              ],
            },
            {
              day: 7,
              timeSlots: [
                { id: 'ts9', startTime: '07:00', endTime: '12:00' },
                { id: 'ts10', startTime: '18:00', endTime: '23:00' },
              ],
            },
            // Add more days with working hours...
            {
              day: 8,
              timeSlots: [
                { id: 'ts11', startTime: '07:00', endTime: '12:00' },
                { id: 'ts12', startTime: '18:00', endTime: '23:00' },
              ],
            },
            {
              day: 10,
              timeSlots: [
                { id: 'ts13', startTime: '07:00', endTime: '12:00' },
                { id: 'ts14', startTime: '18:00', endTime: '23:00' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      staff: 'Esther Howard #002',
      monthlyData: [
        {
          year: 2025,
          month: 8, // August
          workingHours: [
            {
              day: 1,
              timeSlots: [
                { id: 'ts21', startTime: '08:00', endTime: '13:00' },
                { id: 'ts22', startTime: '19:00', endTime: '24:00' },
              ],
            },
            {
              day: 2,
              timeSlots: [
                { id: 'ts23', startTime: '08:00', endTime: '13:00' },
                { id: 'ts24', startTime: '19:00', endTime: '24:00' },
              ],
            },
            {
              day: 4,
              timeSlots: [
                { id: 'ts25', startTime: '08:00', endTime: '13:00' },
                { id: 'ts26', startTime: '19:00', endTime: '24:00' },
              ],
            },
            {
              day: 5,
              timeSlots: [
                { id: 'ts27', startTime: '08:00', endTime: '13:00' },
                { id: 'ts28', startTime: '19:00', endTime: '24:00' },
              ],
            },
          ],
        },
      ],
    },
  ]);

  /**
   * @description Helper function to get the date for a specific day of the week in the current week
   */
  const getCurrentWeekDate = (year: number, month: number, dayOfWeek: number): Date => {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday

    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + dayOfWeek);
    return targetDate;
  };

  /**
   * @description Computed property that transforms raw data into table format
   */
  const workingHoursList_listValues = computed(() => {
    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    if (!year || !month) return [];

    return workingHoursList_rawData.value.map(staffData => {
      const tableRow: Record<string, string | number> = {
        id: staffData.id,
        staff: staffData.staff,
      };

      if (workingHoursList_selectedViewType.value === 'Week') {
        // Week view: get working hours for each day of the week
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          const currentDate = getCurrentWeekDate(year, month, dayOfWeek);
          const dayOfMonth = currentDate.getDate();
          const monthOfDate = currentDate.getMonth() + 1;
          const yearOfDate = currentDate.getFullYear();

          tableRow[`week_day_${dayOfWeek}`] = WorkingHoursDataHelper.getFormattedTimeSlots(
            staffData,
            yearOfDate,
            monthOfDate,
            dayOfMonth,
          );
        }
      } else {
        // Month view: get working hours for each day of the month
        const lastDay = new Date(year, month, 0).getDate();
        for (let day = 1; day <= lastDay; day++) {
          const hasHours = WorkingHoursDataHelper.hasWorkingHours(staffData, year, month, day);
          tableRow[`day_${day}`] = hasHours ? 'Present' : 'Absent';
        }
      }

      return tableRow;
    });
  });
  const workingHoursList_selectedMonth = ref<string>('');
  const workingHoursList_selectedViewType = ref<string>('Month'); // Default view type

  /**
   * @description Initialize selected month with current month
   */
  const workingHoursList_initializeSelectedMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM
    workingHoursList_selectedMonth.value = currentMonth;
  };

  /**
   * @description Generate columns based on selected month and view type
   */
  const workingHoursList_generateColumnsForMonth = (monthString: string): IColumnDataTable[] => {
    if (!monthString) return [];

    const columns: IColumnDataTable[] = [];

    // Add Staff column first
    columns.push({
      label: 'Staff',
      sortable: false,
      value: 'staff',
      width: '300px',
    });

    // Check view type to determine column generation
    if (workingHoursList_selectedViewType.value === 'Week') {
      return workingHoursList_generateWeekColumns(monthString, columns);
    } else {
      return workingHoursList_generateMonthColumns(monthString, columns);
    }
  };

  /**
   * @description Generate columns for month view (current implementation)
   */
  const workingHoursList_generateMonthColumns = (
    monthString: string,
    columns: IColumnDataTable[],
  ): IColumnDataTable[] => {
    // Parse the month string (YYYY-MM format)
    const [year, month] = monthString.split('-').map(Number);

    // Get the last day of the month to determine total days
    const lastDay = new Date(year, month, 0);
    const totalDays = lastDay.getDate();

    // Generate columns for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayName = workingHoursList_getDayName(currentDate);

      // Create ordinal suffix for the day
      const getOrdinalSuffix = (n: number): string => {
        const s = ['th', 'st', 'nd', 'rd'];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      columns.push({
        label: `${dayName} (${getOrdinalSuffix(day)})`,
        sortable: false,
        value: `day_${day}`,
        width: '80px',
      });
    }

    return columns;
  };

  /**
   * @description Generate columns for week view
   */
  const workingHoursList_generateWeekColumns = (
    monthString: string,
    columns: IColumnDataTable[],
  ): IColumnDataTable[] => {
    // Parse the month string (YYYY-MM format)
    const [year, month] = monthString.split('-').map(Number);

    // Get first day of the month
    const firstDayOfMonth = new Date(year, month - 1, 1);

    // Find the first Sunday of the month or the Sunday before if month doesn't start on Sunday
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay()); // Go back to Sunday

    // Day names
    const dayNames = DAY_NAMES;

    // Generate 7 columns for each day of the week
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const day = currentDate.getDate();
      const monthAbbr = workingHoursList_getMonthName(currentDate.getMonth() + 1).slice(0, 3);
      const year = currentDate.getFullYear().toString().slice(2);

      columns.push({
        label: `${dayNames[i]}, ${day} ${monthAbbr} ${year}`,
        sortable: false,
        value: `week_day_${i}`,
        width: '200px',
      });
    }

    return columns;
  };

  /**
   * @description Helper function to get month name
   */
  const workingHoursList_getMonthName = (monthNum: number): string => {
    return MONTH_NAMES_SHORT[monthNum - 1];
  };

  /**
   * @description Helper function to get day name from date
   */
  const workingHoursList_getDayName = (date: Date): string => {
    return DAY_NAMES_SHORT[date.getDay()];
  };

  /**
   * @description Computed property to set list columns based on selected month and view type
   */
  const workingHoursList_computedColumns = computed(() => {
    return workingHoursList_generateColumnsForMonth(workingHoursList_selectedMonth.value);
  });

  /**
   * @description Watch for changes in selected month and view type and update columns
   */
  watch(
    [workingHoursList_selectedMonth, workingHoursList_selectedViewType],
    ([newMonth]) => {
      workingHoursList_listColumns.value = workingHoursList_generateColumnsForMonth(newMonth);
    },
    { immediate: true },
  );

  /**
   * @description Initialize on service creation
   */
  onMounted(() => {
    workingHoursList_initializeSelectedMonth();
  });

  /**
   * @description Method to update selected month
   */
  const workingHoursList_onChangeSelectedMonth = (month: string) => {
    workingHoursList_selectedMonth.value = month;
  };

  /**
   * @description Navigate to previous week/month
   */
  const workingHoursList_onNavigatePrevious = () => {
    if (!workingHoursList_selectedMonth.value) return;

    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    const currentDate = new Date(year, month - 1, 1);

    if (workingHoursList_selectedViewType.value === 'Week') {
      // Navigate to previous week
      currentDate.setDate(currentDate.getDate() - 7);
    } else {
      // Navigate to previous month
      currentDate.setMonth(currentDate.getMonth() - 1);
    }

    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    workingHoursList_selectedMonth.value = `${newYear}-${newMonth}`;
  };

  /**
   * @description Navigate to next week/month
   */
  const workingHoursList_onNavigateNext = () => {
    if (!workingHoursList_selectedMonth.value) return;

    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    const currentDate = new Date(year, month - 1, 1);

    if (workingHoursList_selectedViewType.value === 'Week') {
      // Navigate to next week
      currentDate.setDate(currentDate.getDate() + 7);
    } else {
      // Navigate to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    const newYear = currentDate.getFullYear();
    const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    workingHoursList_selectedMonth.value = `${newYear}-${newMonth}`;
  };

  /**
   * @description Get formatted date range for week view
   */
  const workingHoursList_getWeekDateRange = computed(() => {
    if (!workingHoursList_selectedMonth.value || workingHoursList_selectedViewType.value !== 'Week') {
      return '';
    }

    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    const firstDayOfMonth = new Date(year, month - 1, 1);

    // Find the first Sunday of the month or the Sunday before
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = workingHoursList_getMonthName(startDate.getMonth() + 1);
    const endMonth = workingHoursList_getMonthName(endDate.getMonth() + 1);

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startDay}-${endDay} ${startMonth} ${startDate.getFullYear()}`;
    } else {
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startDate.getFullYear()}`;
    }
  });

  /**
   * @description Add a new time slot to a staff member's working hours
   */
  const workingHoursList_addTimeSlot = (
    staffId: number,
    year: number,
    month: number,
    day: number,
    startTime: string,
    endTime: string,
  ) => {
    const staffData = workingHoursList_rawData.value.find(staff => staff.id === staffId);
    if (!staffData) return;

    const timeSlot = {
      id: WorkingHoursDataHelper.generateTimeSlotId(),
      startTime,
      endTime,
    };

    WorkingHoursDataHelper.addTimeSlot(staffData, year, month, day, timeSlot);
  };

  /**
   * @description Remove a time slot from a staff member's working hours
   */
  const workingHoursList_removeTimeSlot = (
    staffId: number,
    year: number,
    month: number,
    day: number,
    timeSlotId: string,
  ) => {
    const staffData = workingHoursList_rawData.value.find(staff => staff.id === staffId);
    if (!staffData) return;

    WorkingHoursDataHelper.removeTimeSlot(staffData, year, month, day, timeSlotId);
  };

  /**
   * @description Get raw working hours data for a specific staff member
   */
  const workingHoursList_getStaffData = (staffId: number): IStaffWorkingHours | undefined => {
    return workingHoursList_rawData.value.find(staff => staff.id === staffId);
  };

  // ===== DIALOG FUNCTIONALITY =====

  /**
   * @description Dialog reactive data binding
   */
  const workingHoursList_formData = reactive<IWorkingHoursFormData>({
    ...WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA,
  });

  const workingHoursList_createEditFormMode = ref<'create' | 'edit'>('create');
  const workingHoursList_createEditMinDate = ref<string>('');
  const workingHoursList_createEditMaxDate = ref<string>('');

  /**
   * @description Staff list for dropdown
   */
  const workingHoursList_createEditStaffList = ref<IDropdownItem[]>([
    { label: 'Bessie Cooper #001', value: 1 },
    { label: 'Esther Howard #002', value: 2 },
    { label: 'John Doe #003', value: 3 },
    { label: 'Jane Smith #004', value: 4 },
    { label: 'Mike Johnson #005', value: 5 },
  ]);

  /**
   * @description Dialog form validations
   */
  const workingHoursList_formRules = computed(() => ({
    staffId: { required },
    date: { required },
    timeSlots: {
      required,
      $each: {
        openTime: { required },
        closeTime: { required },
      },
    },
    notes: {},
    repeatType: { required },
  }));

  const workingHoursList_formValidations = useVuelidate(workingHoursList_formRules, workingHoursList_formData, {
    $autoDirty: true,
  });

  /**
   * @description Initialize date range (1 year back and 1 year forward)
   */
  const workingHoursList_initializeDateRange = () => {
    const today = new Date();
    const lastYear = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    workingHoursList_createEditMinDate.value = lastYear.toISOString().split('T')[0];
    workingHoursList_createEditMaxDate.value = nextYear.toISOString().split('T')[0];
  };

  /**
   * @description Add a new time slot to dialog form
   */
  const workingHoursList_onAddTimeSlot = () => {
    workingHoursList_formData.timeSlots.push({
      ...WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT,
    });
  };

  /**
   * @description Remove a time slot by index from dialog form
   */
  const workingHoursList_onRemoveTimeSlot = (index: number) => {
    if (workingHoursList_formData.timeSlots.length > 1) {
      workingHoursList_formData.timeSlots.splice(index, 1);
    }
  };

  /**
   * @description Open the dialog for create or edit mode using eventBus
   */
  const workingHoursList_onOpenDialog = (mode: 'create' | 'edit', staffId?: number, date?: string) => {
    workingHoursList_createEditFormMode.value = mode;

    // Reset form data
    workingHoursList_onReset();

    // Pre-fill data if provided
    if (staffId) {
      workingHoursList_formData.staffId = staffId;
    }

    if (date) {
      workingHoursList_formData.date = date;
    }

    // Emit eventBus to open dialog
    const argsEventEmitter: IPropsDialog = {
      id: 'working-hours-create-edit-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Close the dialog using eventBus
   */
  const workingHoursList_onCloseDialog = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'working-hours-create-edit-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);

    workingHoursList_onReset();
  };

  /**
   * @description Reset form data to initial state
   */
  const workingHoursList_onReset = () => {
    Object.assign(workingHoursList_formData, {
      ...WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA,
      timeSlots: [{ ...WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT }],
    });
    workingHoursList_formValidations.value.$reset();
  };

  /**
   * @description Save the working hours data
   */
  const workingHoursList_onSave = async (): Promise<void> => {
    try {
      // Validate form
      const isValid = await workingHoursList_formValidations.value.$validate();

      if (!isValid) {
        return;
      }

      // Here you would typically make an API call to save the data
      console.log('Saving working hours data:', {
        mode: workingHoursList_createEditFormMode.value,
        data: toRaw(workingHoursList_formData),
      });

      // For demo purposes, we'll just show a success message
      // You can integrate with your notification system here

      // Close dialog
      workingHoursList_onCloseDialog();
    } catch (error) {
      console.error('Error saving working hours:', error);
      // Handle error (show toast, etc.)
    }
  };

  // ===== DIALOG COMPUTED PROPERTIES =====

  /**
   * @description Convert date string to Date object for PrimeVue Calendar
   */
  const workingHoursList_calendarDate = computed({
    get: () => {
      if (!workingHoursList_formData.date) return null;
      return new Date(workingHoursList_formData.date);
    },
    set: (value: Date | null) => {
      if (value) {
        // Convert Date to string format (YYYY-MM-DD)
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        workingHoursList_formData.date = `${year}-${month}-${day}`;
      } else {
        workingHoursList_formData.date = '';
      }
    },
  });

  /**
   * @description Get formatted date for the header
   */
  const workingHoursList_formattedDate = computed(() => {
    if (!workingHoursList_formData.date) return '';

    const date = new Date(workingHoursList_formData.date);
    const dayName = DAY_NAMES[date.getDay()];
    const day = date.getDate();
    const monthName = MONTH_NAMES[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName}, ${day} ${monthName} ${year}`;
  });

  /**
   * @description Get selected staff name
   */
  const workingHoursList_selectedStaffName = computed(() => {
    if (!workingHoursList_formData.staffId) return '';

    const staff = workingHoursList_createEditStaffList.value.find(
      s => s.value === workingHoursList_formData.staffId,
    );

    return staff ? staff.label : '';
  });

  /**
   * @description Check if form has valid data for header display
   */
  const workingHoursList_hasValidHeaderData = computed(() => {
    return Boolean(workingHoursList_formData.staffId && workingHoursList_formData.date);
  });

  /**
   * @description Initialize on service creation
   */
  onMounted(() => {
    workingHoursList_initializeSelectedMonth();
    workingHoursList_initializeDateRange();
  });

  /**
   * @description Return all necessary data and methods
   */
  return {
    // List functionality
    workingHoursList_addTimeSlot,
    workingHoursList_computedColumns,
    workingHoursList_getStaffData,
    workingHoursList_getWeekDateRange,
    workingHoursList_initializeSelectedMonth,
    workingHoursList_listColumns,
    workingHoursList_listViewTypes: WORKING_HOURS_LIST_VIEW_TYPES,
    workingHoursList_listValues,
    workingHoursList_onChangeSelectedMonth,
    workingHoursList_onNavigateNext,
    workingHoursList_onNavigatePrevious,
    workingHoursList_removeTimeSlot,
    workingHoursList_selectedMonth,
    workingHoursList_selectedViewType,

    // Dialog functionality
    workingHoursList_formData,
    workingHoursList_formValidations,
    workingHoursList_createEditFormMode,
    workingHoursList_createEditMinDate,
    workingHoursList_createEditMaxDate,
    workingHoursList_createEditStaffList,
    workingHoursList_createEditRepeatOptions: WORKING_HOURS_CREATE_EDIT_REPEAT_OPTIONS,
    workingHoursList_onAddTimeSlot,
    workingHoursList_onRemoveTimeSlot,
    workingHoursList_onOpenDialog,
    workingHoursList_onCloseDialog,
    workingHoursList_onSave,
    workingHoursList_onReset,

    // Dialog computed properties
    workingHoursList_calendarDate,
    workingHoursList_formattedDate,
    workingHoursList_selectedStaffName,
    workingHoursList_hasValidHeaderData,
  };
};
