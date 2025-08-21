// Constants
import {
  WORKING_HOURS_LIST_VIEW_TYPES,
  WORKING_HOURS_CREATE_EDIT_REPEAT_OPTIONS,
  WORKING_HOURS_CUSTOM_RECURRENCE_FREQUENCY_OPTIONS,
  WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA,
  WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT,
} from '../constants';
import { DAY_NAMES, DAY_NAMES_SHORT, MONTH_NAMES, MONTH_NAMES_SHORT } from '@/app/constants';

// Interfaces
import type {
  IWorkingHoursListProvided,
  IStaffWorkingHours,
  IWorkingHoursFormData,
  ITimeSlot,
} from '../interfaces';

// Helpers
import { WorkingHoursDataHelper } from '../helpers';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import { required, minValue } from '@vuelidate/validators';
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
  const getCurrentWeekDate = (dayOfWeek: number): Date => {
    const targetDate = new Date(workingHoursList_currentWeekStart.value);
    targetDate.setDate(workingHoursList_currentWeekStart.value.getDate() + dayOfWeek);
    return targetDate;
  };

  /**
   * @description Computed property that transforms raw data into table format
   */
  const workingHoursList_listValues = computed(() => {
    const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
    if (!year || !month) return [];

    const viewType = workingHoursList_selectedViewType.value;

    return workingHoursList_rawData.value.map(staffData => {
      const tableRow: Record<string, string | number> = {
        id: staffData.id,
        staff: staffData.staff,
      };

      if (viewType === 'Week') {
        // Week view: get working hours for each day of the week
        for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
          const currentDate = getCurrentWeekDate(dayOfWeek);
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
  const workingHoursList_currentWeekStart = ref<Date>(new Date()); // Track current week start for week view

  /**
   * @description Initialize selected month with current month and current week
   */
  const workingHoursList_initializeSelectedMonth = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.toISOString().slice(0, 7); // Format: YYYY-MM
    workingHoursList_selectedMonth.value = currentMonth;

    // Initialize current week start (find the Monday of current week)
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days to Monday
    const mondayOfCurrentWeek = new Date(today);
    mondayOfCurrentWeek.setDate(today.getDate() + mondayOffset);
    workingHoursList_currentWeekStart.value = mondayOfCurrentWeek;
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
      return workingHoursList_generateWeekColumns(columns);
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
  const workingHoursList_generateWeekColumns = (columns: IColumnDataTable[]): IColumnDataTable[] => {
    // Use the current week start date instead of month-based calculation
    const startDate = new Date(workingHoursList_currentWeekStart.value);

    // Day names
    const dayNames = DAY_NAMES;

    // Generate 7 columns for each day of the week (Monday to Sunday)
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);

      const day = currentDate.getDate();
      const monthAbbr = workingHoursList_getMonthName(currentDate.getMonth() + 1).slice(0, 3);
      const year = currentDate.getFullYear().toString().slice(2);

      columns.push({
        label: `${dayNames[i]}, ${day} ${monthAbbr} ${year}`, // Using comma separator for split in template
        sortable: false,
        value: `week_day_${i}`,
        width: '240px',
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
   * @description Computed property to set list columns based on selected month, view type, and current week
   */
  const workingHoursList_computedColumns = computed(() => {
    // This will be reactive to month, view type, and current week changes
    return workingHoursList_generateColumnsForMonth(workingHoursList_selectedMonth.value);
  });

  /**
   * @description Watch for changes in selected month, view type, and current week and update columns
   */
  watch(
    [workingHoursList_selectedMonth, workingHoursList_selectedViewType, workingHoursList_currentWeekStart],
    ([newMonth]) => {
      workingHoursList_listColumns.value = workingHoursList_generateColumnsForMonth(newMonth);
    },
    { immediate: true },
  );

  /**
   * @description Watch for view type changes to reinitialize week start when switching to week view
   */
  watch(workingHoursList_selectedViewType, newViewType => {
    if (newViewType === 'Week') {
      // Reinitialize current week when switching to week view
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday, go back 6 days to Monday
      const mondayOfCurrentWeek = new Date(today);
      mondayOfCurrentWeek.setDate(today.getDate() + mondayOffset);
      workingHoursList_currentWeekStart.value = mondayOfCurrentWeek;
    }
  });

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
    if (workingHoursList_selectedViewType.value === 'Week') {
      // Navigate to previous week
      const newWeekStart = new Date(workingHoursList_currentWeekStart.value);
      newWeekStart.setDate(newWeekStart.getDate() - 7);
      workingHoursList_currentWeekStart.value = newWeekStart;
    } else {
      // Navigate to previous month
      if (!workingHoursList_selectedMonth.value) return;

      const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
      const currentDate = new Date(year, month - 1, 1);
      currentDate.setMonth(currentDate.getMonth() - 1);

      const newYear = currentDate.getFullYear();
      const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      workingHoursList_selectedMonth.value = `${newYear}-${newMonth}`;
    }
  };

  /**
   * @description Navigate to next week/month
   */
  const workingHoursList_onNavigateNext = () => {
    if (workingHoursList_selectedViewType.value === 'Week') {
      // Navigate to next week
      const newWeekStart = new Date(workingHoursList_currentWeekStart.value);
      newWeekStart.setDate(newWeekStart.getDate() + 7);
      workingHoursList_currentWeekStart.value = newWeekStart;
    } else {
      // Navigate to next month
      if (!workingHoursList_selectedMonth.value) return;

      const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
      const currentDate = new Date(year, month - 1, 1);
      currentDate.setMonth(currentDate.getMonth() + 1);

      const newYear = currentDate.getFullYear();
      const newMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      workingHoursList_selectedMonth.value = `${newYear}-${newMonth}`;
    }
  };

  /**
   * @description Get formatted date range for week view
   */
  const workingHoursList_getWeekDateRange = computed(() => {
    if (workingHoursList_selectedViewType.value !== 'Week') {
      return '';
    }

    const startDate = new Date(workingHoursList_currentWeekStart.value);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Sunday (end of week)

    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startMonth = workingHoursList_getMonthName(startDate.getMonth() + 1);
    const endMonth = workingHoursList_getMonthName(endDate.getMonth() + 1);

    if (startDate.getMonth() === endDate.getMonth()) {
      // Same month: "19-25 Aug 2025"
      return `${startDay}-${endDay} ${startMonth} ${startDate.getFullYear()}`;
    } else {
      // Different months: "29 Jul - 4 Aug 2025"
      return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${startDate.getFullYear()}`;
    }
  });

  /**
   * @description Get formatted date string for a specific day of the current week
   */
  const workingHoursList_getCurrentWeekDateString = (dayOfWeek: number): string => {
    const targetDate = getCurrentWeekDate(dayOfWeek);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

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
  const workingHoursList_formRules = computed(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rules: Record<string, any> = {
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
    };

    // Only add customRecurrence validation when repeatType is 'custom'
    if (workingHoursList_formData.repeatType === 'custom') {
      rules.customRecurrence = {
        frequency: { required },
        interval: { required, minValue: minValue(1) },
        endType: { required },
        endDate: workingHoursList_formData.customRecurrence.endType === 'on' ? { required } : {},
        occurrences:
          workingHoursList_formData.customRecurrence.endType === 'after'
            ? { required, minValue: minValue(1) }
            : {},
      };
    }

    return rules;
  });

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

      const formData = toRaw(workingHoursList_formData);

      // Generate all dates based on repeat type
      const datesToSchedule = workingHoursList_generateScheduleDates(formData);

      // Convert time slots to proper format
      const timeSlots = formData.timeSlots.map((slot, index) => ({
        id: `ts${Date.now()}_${index}`,
        startTime: workingHoursList_formatTimeFromDate(slot.openTime!),
        endTime: workingHoursList_formatTimeFromDate(slot.closeTime!),
      }));

      // Add working hours for each date
      datesToSchedule.forEach(date => {
        workingHoursList_addTimeSlotsByDate(formData.staffId!, date, timeSlots);
      });

      console.log('Working hours saved successfully:', {
        mode: workingHoursList_createEditFormMode.value,
        staffId: formData.staffId,
        dates: datesToSchedule,
        timeSlots,
        repeatType: formData.repeatType,
      });

      // Close dialog
      workingHoursList_onCloseDialog();
    } catch (error) {
      console.error('Error saving working hours:', error);
      // Handle error (show toast, etc.)
    }
  };

  /**
   * @description Generate all dates to schedule based on repeat type
   */
  const workingHoursList_generateScheduleDates = (formData: IWorkingHoursFormData): Date[] => {
    const startDate = new Date(formData.date);
    const dates: Date[] = [new Date(startDate)]; // Always include the original date

    switch (formData.repeatType) {
      case 'none':
        return dates;

      case 'daily': {
        // Add next 30 days
        for (let i = 1; i <= 30; i += 1) {
          const nextDate = new Date(startDate);
          nextDate.setDate(startDate.getDate() + i);
          dates.push(nextDate);
        }
        break;
      }

      case 'weekly-monday': {
        // Add next 12 Mondays
        const mondayDate = new Date(startDate);
        // Find next Monday if current date is not Monday
        const currentDay = mondayDate.getDay();
        const daysUntilMonday = currentDay === 1 ? 7 : (8 - currentDay) % 7;
        if (currentDay !== 1) {
          mondayDate.setDate(mondayDate.getDate() + daysUntilMonday);
          dates.push(new Date(mondayDate));
        }
        // Add next 11 Mondays
        for (let i = 1; i < 12; i += 1) {
          const nextMonday = new Date(mondayDate);
          nextMonday.setDate(mondayDate.getDate() + i * 7);
          dates.push(nextMonday);
        }
        break;
      }

      case 'weekday': {
        // Add next 30 weekdays (Monday to Friday)
        const dateCounter = new Date(startDate);
        let weekdaysAdded = 0;
        while (weekdaysAdded < 30) {
          dateCounter.setDate(dateCounter.getDate() + 1);
          const dayOfWeek = dateCounter.getDay();
          // Monday = 1, Friday = 5
          if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            dates.push(new Date(dateCounter));
            weekdaysAdded += 1;
          }
        }
        break;
      }

      case 'custom': {
        const { frequency, interval, endType, endDate, occurrences } = formData.customRecurrence;
        const currentDate = new Date(startDate);
        let count = 0;
        const maxOccurrences = endType === 'after' ? occurrences : 100; // Limit to prevent infinite loop

        while (count < maxOccurrences) {
          // Calculate next date based on frequency
          switch (frequency) {
            case 'day':
              currentDate.setDate(currentDate.getDate() + interval);
              break;
            case 'week':
              currentDate.setDate(currentDate.getDate() + interval * 7);
              break;
            case 'month':
              currentDate.setMonth(currentDate.getMonth() + interval);
              break;
          }

          // Check end conditions
          if (endType === 'on' && endDate && currentDate.getTime() > endDate.getTime()) {
            break;
          }

          dates.push(new Date(currentDate));
          count += 1;
        }
        break;
      }
    }

    return dates;
  };

  /**
   * @description Format time from Date object to HH:mm string
   */
  const workingHoursList_formatTimeFromDate = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  /**
   * @description Add time slots for a specific date
   */
  const workingHoursList_addTimeSlotsByDate = (staffId: number, date: Date, timeSlots: ITimeSlot[]) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // JavaScript months are 0-indexed
    const day = date.getDate();

    // Find or create staff data
    let staffData = workingHoursList_rawData.value.find(s => s.id === staffId);
    if (!staffData) {
      const staffName =
        workingHoursList_createEditStaffList.value.find(s => s.value === staffId)?.label || `Staff #${staffId}`;
      staffData = {
        id: staffId,
        staff: staffName,
        monthlyData: [],
      };
      workingHoursList_rawData.value.push(staffData);
    }

    // Find or create monthly data
    let monthlyData = staffData.monthlyData.find(m => m.year === year && m.month === month);
    if (!monthlyData) {
      monthlyData = {
        year,
        month,
        workingHours: [],
      };
      staffData.monthlyData.push(monthlyData);
    }

    // Find or create day working hours
    let dayWorkingHours = monthlyData.workingHours.find(d => d.day === day);
    if (!dayWorkingHours) {
      dayWorkingHours = {
        day,
        timeSlots: [],
      };
      monthlyData.workingHours.push(dayWorkingHours);
    }

    // Add new time slots (replace existing ones for simplicity)
    dayWorkingHours.timeSlots = [...timeSlots];
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
   * @description Show custom recurrence options when "custom" is selected
   */
  const workingHoursList_showCustomRecurrence = computed(() => {
    return workingHoursList_formData.repeatType === 'custom';
  });

  /**
   * @description Computed property for custom recurrence end date
   */
  const workingHoursList_customRecurrenceEndDate = computed({
    get: () => {
      return workingHoursList_formData.customRecurrence.endDate;
    },
    set: (value: Date | null) => {
      workingHoursList_formData.customRecurrence.endDate = value;
    },
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
    workingHoursList_getCurrentWeekDateString,
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
    workingHoursList_customRecurrenceFrequencyOptions: WORKING_HOURS_CUSTOM_RECURRENCE_FREQUENCY_OPTIONS,
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
    workingHoursList_showCustomRecurrence,
    workingHoursList_customRecurrenceEndDate,
  };
};
