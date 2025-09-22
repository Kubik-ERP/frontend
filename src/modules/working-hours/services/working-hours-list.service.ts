// Constants
import {
  WORKING_HOURS_LIST_VIEW_TYPES,
  WORKING_HOURS_CREATE_EDIT_REPEAT_OPTIONS,
  WORKING_HOURS_CUSTOM_RECURRENCE_FREQUENCY_OPTIONS,
  WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA,
  WORKING_HOURS_CREATE_EDIT_INITIAL_TIME_SLOT,
  WORKING_HOURS_LIST_REQUEST,
  WORKING_HOURS_CREATE_REQUEST,
  WORKING_HOURS_UPDATE_REQUEST,
  WORKING_HOURS_DELETE_REQUEST,
  WORKING_HOURS_DETAIL_REQUEST,
} from '../constants';
import { DAY_NAMES_SHORT } from '@/app/constants';

// Interfaces
import type { IWorkingHoursListProvided, IStaffWorkingHours, IWorkingHoursFormData } from '../interfaces';

// Helpers
import { WorkingHoursDataHelper } from '../helpers';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useWorkingHoursStore } from '../store';

// Vuelidate
import { required, minValue, requiredIf } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useWorkingHoursListService = (): IWorkingHoursListProvided => {
  /**
   * @description Injected variables
   */
  const workingHoursStore = useWorkingHoursStore();
  const { workingHours_isLoading } = storeToRefs(workingHoursStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const workingHoursList_formData = reactive<IWorkingHoursFormData>({
    ...WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA,
  });

  const workingHoursList_createEditFormMode = ref<'create' | 'edit'>('create');
  const workingHoursList_createEditMinDate = ref<string>('');
  const workingHoursList_createEditMaxDate = ref<string>('');
  const workingHoursList_selectedMonth = ref<string>('');
  const workingHoursList_selectedViewType = ref<string>('Month');
  const workingHoursList_currentWeekStart = ref<Date>(new Date());
  const workingHoursList_currentWorkingHoursId = ref<string>('');

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
   * @description Sample working hours data using the new structure
   */
  const workingHoursList_rawData = ref<IStaffWorkingHours[]>([
    {
      id: 1,
      staff: 'Bessie Cooper #001',
      monthlyData: [
        {
          year: 2025,
          month: 8,
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
          month: 8,
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
   * @description Form validations
   */
  const workingHoursList_formRules = computed(() => ({
    staffId: { required },
    date: { required },
    timeSlots: {
      required,
      minValue: minValue(1),
      $each: {
        openTime: { required },
        closeTime: { required },
      },
    },
    repeatType: { required },
    notes: {},
    customRecurrence: {
      frequency: {
        required: requiredIf(() => workingHoursList_formData.repeatType === 'custom'),
      },
      interval: {
        required: requiredIf(() => workingHoursList_formData.repeatType === 'custom'),
        minValue: minValue(1),
      },
      endType: {
        required: requiredIf(() => workingHoursList_formData.repeatType === 'custom'),
      },
      endDate: {
        required: requiredIf(
          () =>
            workingHoursList_formData.repeatType === 'custom' &&
            workingHoursList_formData.customRecurrence.endType === 'on',
        ),
      },
      occurrences: {
        required: requiredIf(
          () =>
            workingHoursList_formData.repeatType === 'custom' &&
            workingHoursList_formData.customRecurrence.endType === 'after',
        ),
        minValue: minValue(1),
      },
    },
  }));

  const workingHoursList_formValidations = useVuelidate(workingHoursList_formRules, workingHoursList_formData, {
    $autoDirty: true,
  });

  /**
   * @description Handle fetch api working hours - create
   */
  const workingHoursList_fetchCreate = async (): Promise<void> => {
    try {
      await workingHoursStore.workingHours_create(workingHoursList_formData, {
        ...httpAbort_registerAbort(WORKING_HOURS_CREATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Working hours created successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api working hours - delete
   */
  const workingHoursList_fetchDelete = async (workingHoursId: string): Promise<void> => {
    try {
      await workingHoursStore.workingHours_delete(workingHoursId, {
        ...httpAbort_registerAbort(WORKING_HOURS_DELETE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Working hours deleted successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api working hours - detail
   */
  const workingHoursList_fetchDetail = async (workingHoursId: string): Promise<void> => {
    try {
      const response = await workingHoursStore.workingHours_detail(workingHoursId, {
        ...httpAbort_registerAbort(WORKING_HOURS_DETAIL_REQUEST),
      });

      // Populate form data with the fetched details for edit mode
      if (response && workingHoursList_createEditFormMode.value === 'edit') {
        // This would be where you map the response to form data
        // For now, this is a placeholder
        console.log('Fetched working hours detail:', response);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api working hours - list
   */
  const workingHoursList_fetchList = async (): Promise<void> => {
    try {
      await workingHoursStore.workingHours_list({
        ...httpAbort_registerAbort(WORKING_HOURS_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Handle fetch api working hours - update
   */
  const workingHoursList_fetchUpdate = async (workingHoursId: string): Promise<void> => {
    try {
      await workingHoursStore.workingHours_update(workingHoursId, workingHoursList_formData, {
        ...httpAbort_registerAbort(WORKING_HOURS_UPDATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        type: EToastType.SUCCESS,
        message: 'Working hours updated successfully',
        position: EToastPosition.TOP_RIGHT,
      };

      eventBus.emit('AppBaseToast', argsEventEmitter);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return Promise.reject(error);
      } else {
        return Promise.reject(new Error(String(error)));
      }
    }
  };

  /**
   * @description Helper function to get the date for a specific day of the week in the current week
   */
  const getCurrentWeekDate = (dayOfWeek: number): Date => {
    const startOfWeek = new Date(workingHoursList_currentWeekStart.value);
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + dayOfWeek - 1); // dayOfWeek: 1=Monday, 7=Sunday
    return date;
  };

  /**
   * @description Computed property that transforms raw data into table format
   */
  const workingHoursList_listValues = computed(() => {
    return workingHoursList_rawData.value.map(staffMember => {
      const tableRow: Record<string, string | number> = {
        id: staffMember.id,
        staff: staffMember.staff,
      };

      if (workingHoursList_selectedMonth.value) {
        const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);

        if (workingHoursList_selectedViewType.value === 'Week') {
          // Week view: show time slots for each day of the current week
          for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
            const currentDate = getCurrentWeekDate(dayOfWeek);
            const currentDay = currentDate.getDate();
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            const monthData = staffMember.monthlyData.find(
              m => m.year === currentYear && m.month === currentMonth,
            );
            const dayData = monthData?.workingHours.find(wh => wh.day === currentDay);

            if (dayData && dayData.timeSlots.length > 0) {
              const timeSlots = dayData.timeSlots.map(slot => `${slot.startTime}-${slot.endTime}`).join('\n');
              tableRow[`week_day_${dayOfWeek}`] = timeSlots;
            } else {
              tableRow[`week_day_${dayOfWeek}`] = '';
            }
          }
        } else {
          // Month view: show Present/Absent for each day
          const daysInMonth = new Date(year, month, 0).getDate();
          const monthData = staffMember.monthlyData.find(m => m.year === year && m.month === month);

          for (let day = 1; day <= daysInMonth; day++) {
            const dayData = monthData?.workingHours.find(wh => wh.day === day);
            tableRow[`day_${day}`] = dayData && dayData.timeSlots.length > 0 ? 'Present' : 'Absent';
          }
        }
      }

      return tableRow;
    });
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
    if (staffData) {
      WorkingHoursDataHelper.addTimeSlot(staffData, year, month, day, {
        id: `ts_${Date.now()}`,
        startTime,
        endTime,
      });
    }
  };

  /**
   * @description Get formatted date string for a specific day of the current week
   */
  const workingHoursList_getCurrentWeekDateString = (dayOfWeek: number): string => {
    const date = getCurrentWeekDate(dayOfWeek);
    return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  };

  /**
   * @description Get raw working hours data for a specific staff member
   */
  const workingHoursList_getStaffData = (staffId: number): IStaffWorkingHours | undefined => {
    return workingHoursList_rawData.value.find(staff => staff.id === staffId);
  };

  /**
   * @description Get formatted date range for week view
   */
  const workingHoursList_getWeekDateRange = computed(() => {
    const startDate = new Date(workingHoursList_currentWeekStart.value);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);

    const startDateStr = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const endDateStr = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${startDateStr} - ${endDateStr}`;
  });

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
    if (staffData) {
      WorkingHoursDataHelper.removeTimeSlot(staffData, year, month, day, timeSlotId);
    }
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
   * @description Method to update selected month
   */
  const workingHoursList_onChangeSelectedMonth = (month: string) => {
    workingHoursList_selectedMonth.value = month;
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
  };

  /**
   * @description Navigate to next week/month
   */
  const workingHoursList_onNavigateNext = () => {
    if (workingHoursList_selectedViewType.value === 'Week') {
      // Move to next week
      const nextWeek = new Date(workingHoursList_currentWeekStart.value);
      nextWeek.setDate(nextWeek.getDate() + 7);
      workingHoursList_currentWeekStart.value = nextWeek;
    } else if (workingHoursList_selectedMonth.value) {
      // Move to next month
      const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
      const nextMonth = month === 12 ? 1 : month + 1;
      const nextYear = month === 12 ? year + 1 : year;
      workingHoursList_selectedMonth.value = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    }
  };

  /**
   * @description Navigate to previous week/month
   */
  const workingHoursList_onNavigatePrevious = () => {
    if (workingHoursList_selectedViewType.value === 'Week') {
      // Move to previous week
      const prevWeek = new Date(workingHoursList_currentWeekStart.value);
      prevWeek.setDate(prevWeek.getDate() - 7);
      workingHoursList_currentWeekStart.value = prevWeek;
    } else if (workingHoursList_selectedMonth.value) {
      // Move to previous month
      const [year, month] = workingHoursList_selectedMonth.value.split('-').map(Number);
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      workingHoursList_selectedMonth.value = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
    }
  };

  /**
   * @description Open the dialog for create or edit mode using eventBus
   */
  const workingHoursList_onOpenDialog = async (
    mode: 'create' | 'edit',
    staffId?: number,
    date?: string,
    workingHoursId?: string,
  ) => {
    workingHoursList_createEditFormMode.value = mode;

    // Reset form data to initial state
    Object.assign(workingHoursList_formData, WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA);

    // Store the workingHoursId for edit mode
    workingHoursList_currentWorkingHoursId.value = workingHoursId || '';

    // Pre-fill form data if provided
    if (staffId) {
      workingHoursList_formData.staffId = staffId;
    }

    if (date) {
      workingHoursList_formData.date = date;
    }

    // If edit mode and workingHoursId is provided, fetch the details
    if (mode === 'edit' && workingHoursId) {
      try {
        await workingHoursList_fetchDetail(workingHoursId);
      } catch (error) {
        console.error('Error fetching working hours detail:', error);
      }
    }

    // Open dialog
    const argsEventEmitter: IPropsDialog = {
      id: 'working-hours-create-edit-dialog',
      isOpen: true,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
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
   * @description Reset form data to initial state
   */
  const workingHoursList_onReset = () => {
    Object.assign(workingHoursList_formData, WORKING_HOURS_CREATE_EDIT_INITIAL_FORM_DATA);
    workingHoursList_formValidations.value.$reset();
    workingHoursList_currentWorkingHoursId.value = '';
  };

  /**
   * @description Delete working hours data
   */
  const workingHoursList_onDelete = async (workingHoursId: string): Promise<void> => {
    try {
      await workingHoursList_fetchDelete(workingHoursId);

      // Refresh the list after successful deletion
      await workingHoursList_fetchList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting working hours:', error);
      } else {
        console.error('Error deleting working hours:', String(error));
      }
    }
  };

  /**
   * @description Save the working hours data
   */
  const workingHoursList_onSave = async (): Promise<void> => {
    workingHoursList_formValidations.value.$touch();

    if (workingHoursList_formValidations.value.$invalid) {
      return;
    }

    try {
      if (workingHoursList_createEditFormMode.value === 'create') {
        await workingHoursList_fetchCreate();
      } else {
        // For update, use the stored workingHoursId
        await workingHoursList_fetchUpdate(workingHoursList_currentWorkingHoursId.value);
      }

      // Refresh the list
      await workingHoursList_fetchList();

      // Close the dialog
      workingHoursList_onCloseDialog();

      // Reset form
      workingHoursList_onReset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error saving working hours:', error);
      } else {
        console.error('Error saving working hours:', String(error));
      }
    }
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
   * @description Generate columns for month view
   */
  const workingHoursList_generateMonthColumns = (
    monthString: string,
    columns: IColumnDataTable[],
  ): IColumnDataTable[] => {
    const [year, month] = monthString.split('-').map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayName = DAY_NAMES_SHORT[date.getDay()];
      const dayWithSuffix = workingHoursList_getDayWithOrdinalSuffix(day);

      columns.push({
        label: `${dayName} (${dayWithSuffix})`,
        sortable: false,
        value: `day_${day}`,
        width: '120px',
      });
    }

    return columns;
  };

  /**
   * @description Generate columns for week view
   */
  const workingHoursList_generateWeekColumns = (columns: IColumnDataTable[]): IColumnDataTable[] => {
    const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let dayOfWeek = 1; dayOfWeek <= 7; dayOfWeek++) {
      const date = getCurrentWeekDate(dayOfWeek);
      const dayName = dayNames[dayOfWeek - 1];
      const dayDate = date.getDate();

      columns.push({
        label: `${dayName}|${dayDate}`, // Use | as separator for parsing in template
        sortable: false,
        value: `week_day_${dayOfWeek}`,
        width: '150px',
      });
    }

    return columns;
  };

  /**
   * @description Helper function to get day with ordinal suffix
   */
  const workingHoursList_getDayWithOrdinalSuffix = (day: number): string => {
    const j = day % 10;
    const k = day % 100;
    if (j === 1 && k !== 11) {
      return day + 'st';
    }
    if (j === 2 && k !== 12) {
      return day + 'nd';
    }
    if (j === 3 && k !== 13) {
      return day + 'rd';
    }
    return day + 'th';
  };

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
   * @description Initialize date range (1 year back and 1 year forward)
   */
  const workingHoursList_initializeDateRange = () => {
    const currentDate = new Date();
    const minDate = new Date(currentDate);
    minDate.setFullYear(currentDate.getFullYear() - 1);
    const maxDate = new Date(currentDate);
    maxDate.setFullYear(currentDate.getFullYear() + 1);

    workingHoursList_createEditMinDate.value = minDate.toISOString().split('T')[0];
    workingHoursList_createEditMaxDate.value = maxDate.toISOString().split('T')[0];
  };

  /**
   * @description Computed property to set list columns based on selected month, view type, and current week
   */
  const workingHoursList_columns = computed(() => {
    return workingHoursList_generateColumnsForMonth(workingHoursList_selectedMonth.value);
  });

  /**
   * @description Watch for changes in selected month, view type, and current week and update columns
   */
  watch(
    [workingHoursList_selectedMonth, workingHoursList_selectedViewType, workingHoursList_currentWeekStart],
    () => {
      // Columns are automatically updated via computed property
    },
    { immediate: true },
  );

  /**
   * @description Watch for view type changes to reinitialize week start when switching to week view
   */
  watch(workingHoursList_selectedViewType, newViewType => {
    if (newViewType === 'Week') {
      // Re-initialize the current week start when switching to week view
      const today = new Date();
      const dayOfWeek = today.getDay();
      const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const mondayOfCurrentWeek = new Date(today);
      mondayOfCurrentWeek.setDate(today.getDate() + mondayOffset);
      workingHoursList_currentWeekStart.value = mondayOfCurrentWeek;
    }
  });

  // ===== COMPUTED PROPERTIES =====

  /**
   * @description Convert date string to Date object for PrimeVue Calendar
   */
  const workingHoursList_calendarDate = computed({
    get: () => {
      return workingHoursList_formData.date ? new Date(workingHoursList_formData.date) : null;
    },
    set: (value: Date | null) => {
      if (value) {
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        workingHoursList_formData.date = `${year}-${month}-${day}`;
      }
    },
  });

  /**
   * @description Get formatted date for the header
   */
  const workingHoursList_formattedDate = computed(() => {
    if (!workingHoursList_formData.date) return '';

    const date = new Date(workingHoursList_formData.date);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
    return !!(workingHoursList_formData.staffId && workingHoursList_formData.date);
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
    workingHoursList_addTimeSlot,
    workingHoursList_calendarDate,
    workingHoursList_columns,
    workingHoursList_createEditFormMode,
    workingHoursList_createEditMaxDate,
    workingHoursList_createEditMinDate,
    workingHoursList_createEditRepeatOptions: WORKING_HOURS_CREATE_EDIT_REPEAT_OPTIONS,
    workingHoursList_createEditStaffList,
    workingHoursList_customRecurrenceEndDate,
    workingHoursList_customRecurrenceFrequencyOptions: WORKING_HOURS_CUSTOM_RECURRENCE_FREQUENCY_OPTIONS,
    workingHoursList_fetchList,
    workingHoursList_formData,
    workingHoursList_formValidations,
    workingHoursList_formattedDate,
    workingHoursList_getCurrentWeekDateString,
    workingHoursList_getStaffData,
    workingHoursList_getWeekDateRange,
    workingHoursList_hasValidHeaderData,
    workingHoursList_isLoading: workingHours_isLoading,
    workingHoursList_listValues,
    workingHoursList_listViewTypes: WORKING_HOURS_LIST_VIEW_TYPES,
    workingHoursList_onAddTimeSlot,
    workingHoursList_onChangeSelectedMonth,
    workingHoursList_onCloseDialog,
    workingHoursList_onDelete,
    workingHoursList_onNavigateNext,
    workingHoursList_onNavigatePrevious,
    workingHoursList_onOpenDialog,
    workingHoursList_onRemoveTimeSlot,
    workingHoursList_onReset,
    workingHoursList_onSave,
    workingHoursList_removeTimeSlot,
    workingHoursList_selectedMonth,
    workingHoursList_selectedStaffName,
    workingHoursList_selectedViewType,
    workingHoursList_showCustomRecurrence,
  } as IWorkingHoursListProvided;
};
