// Constants
import {
  ATTENDANCE_CREATE_REQUEST,
  ATTENDANCE_DELETE_REQUEST,
  ATTENDANCE_DETAIL_REQUEST,
  ATTENDANCE_LIST_COLUMNS,
  ATTENDANCE_LIST_INITIAL_FORM_DATA,
  ATTENDANCE_LIST_INITIAL_SHIFT,
  ATTENDANCE_LIST_REQUEST,
  ATTENDANCE_UPDATE_REQUEST,
} from '../constants';

// Interfaces
import type { IAttendanceCreatePayload, IAttendanceListFormData, IAttendanceListProvided } from '../interfaces';
import type { IAttendanceData } from '../interfaces/attendance-data.interface';
import type { IWorkingHour, IWorkingHourTimeSlot } from '@/modules/working-hours/interfaces/working-hours-store.interface';

// Plugins
import eventBus from '@/plugins/mitt';

// Stores
import { useAttendanceStore } from '../store';
import { useStaffMemberStore } from '@/modules/staff-member/store';
import { useWorkingHoursStore } from '@/modules/working-hours/store';

// Vuelidate
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAttendanceListService = (): IAttendanceListProvided => {
  /**
   * @description Injected variables
   */
  const attendanceStore = useAttendanceStore();
  const { attendance_isLoading, attendance_lists, attendance_meta } = storeToRefs(attendanceStore);
  const staffMemberStore = useStaffMemberStore();
  const { staffMember_lists } = storeToRefs(staffMemberStore);
  const workingHoursStore = useWorkingHoursStore();
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const attendanceList_columns = ref(ATTENDANCE_LIST_COLUMNS);
  const attendanceList_createEditFormMode = ref<'create' | 'edit'>('create');
  const attendanceList_createEditMaxDate = ref<string>('');
  const attendanceList_createEditMinDate = ref<string>('');
  const attendanceList_currentAttendanceId = ref<string>('');
  const attendanceList_formData = reactive<IAttendanceListFormData>({
    ...ATTENDANCE_LIST_INITIAL_FORM_DATA,
  });
  const attendanceList_queryParams: IAttendanceListRequestQuery = reactive({
    page: 1,
    limit: 10,
    sortBy: 'date',
    sortOrder: 'desc',
    startDate: null,
    endDate: null,
    staffId: null,
  });
  const attendanceList_selectedStaffWorkingHours = ref<IWorkingHour[]>([]);
  const attendanceList_isLoadingShifts = ref<boolean>(false);

  /**
   * @description Form validations
   */
  const attendanceList_formRules = computed(() => ({
    date: { required },
    shifts: {
      $each: {
        clockIn: { required },
        clockOut: { required },
        shiftEnd: { required },
        shiftStart: { required },
      },
    },
    staffId: { required },
  }));

  const attendanceList_formValidations = useVuelidate(attendanceList_formRules, attendanceList_formData, {
    $autoDirty: true,
  });

  /**
   * @description Handle fetch api attendance - create
   */
  const attendanceList_fetchCreate = async (): Promise<void> => {
    try {
      // Filter out shifts with null values and format for API
      const validShifts = attendanceList_formData.shifts
        .filter(shift => shift.shiftStart && shift.shiftEnd && shift.clockIn && shift.clockOut)
        .map(shift => {
          // Format times to HH:mm string format
          const formatTimeToString = (date: Date): string => {
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes}`;
          };

          // Calculate duration
          const durationMs = new Date(shift.clockOut!).getTime() - new Date(shift.clockIn!).getTime();
          const hours = Math.floor(durationMs / (1000 * 60 * 60));
          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
          const duration = `${hours}h ${minutes}m`;

          // Calculate late (clockIn > shiftStart)
          const lateMs = new Date(shift.clockIn!).getTime() - new Date(shift.shiftStart!).getTime();
          const lateMinutes = Math.max(0, Math.floor(lateMs / (1000 * 60)));
          const late = `${lateMinutes}m`;

          // Calculate early (clockIn < shiftStart)
          const earlyMinutes = Math.max(0, Math.floor(-lateMs / (1000 * 60)));
          const early = `${earlyMinutes}m`;

          // Calculate overtime (clockOut > shiftEnd)
          const overtimeMs = new Date(shift.clockOut!).getTime() - new Date(shift.shiftEnd!).getTime();
          const overtimeMinutes = Math.max(0, Math.floor(overtimeMs / (1000 * 60)));
          const overtime = `${overtimeMinutes}m`;

          return {
            shiftStart: formatTimeToString(shift.shiftStart!),
            shiftEnd: formatTimeToString(shift.shiftEnd!),
            clockIn: formatTimeToString(shift.clockIn!),
            clockOut: formatTimeToString(shift.clockOut!),
            duration,
            early,
            late,
            overtime,
            notes: shift.notes || '',
          };
        });

      // Get staff name
      const staffData = attendanceList_getStaffData(attendanceList_formData.staffId!);
      const staffName = staffData ? staffData.name : '';

      const payload: IAttendanceCreatePayload = {
        staffId: attendanceList_formData.staffId,
        date: attendanceList_formData.date,
        staffName,
        createdBy: 'System',
        shifts: validShifts,
      };

      await attendanceStore.attendance_create(payload, {
        ...httpAbort_registerAbort(ATTENDANCE_CREATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        message: 'Attendance created successfully',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
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
   * @description Handle fetch api attendance - delete
   */
  const attendanceList_fetchDelete = async (attendanceId: string): Promise<void> => {
    try {
      await attendanceStore.attendance_delete(attendanceId, {
        ...httpAbort_registerAbort(ATTENDANCE_DELETE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        message: 'Attendance deleted successfully',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
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
   * @description Handle fetch api attendance - detail
   */
  const attendanceList_fetchDetail = async (attendanceId: string): Promise<void> => {
    try {
      const response = await attendanceStore.attendance_detail(attendanceId, {
        ...httpAbort_registerAbort(ATTENDANCE_DETAIL_REQUEST),
      });

      // Populate form data with the fetched details for edit mode
      if (response && attendanceList_createEditFormMode.value === 'edit') {
        const attendanceDetail = response as IAttendance;

        attendanceList_formData.staffId = attendanceDetail.staff_id;
        attendanceList_formData.date = new Date(attendanceDetail.date).toISOString().split('T')[0];

        attendanceList_formData.shifts = attendanceDetail.attendance_shifts.map(shift => {
          const shiftStart = new Date(shift.shift_start);
          const shiftEnd = new Date(shift.shift_end);

          // The time values from API are strings in "HH:mm" format.
          // We need to create full Date objects for the form.
          const [clockInHours, clockInMinutes] = shift.clock_in.split(':').map(Number);
          const clockInDate = new Date(attendanceDetail.date);
          clockInDate.setHours(clockInHours, clockInMinutes);

          const [clockOutHours, clockOutMinutes] = shift.clock_out.split(':').map(Number);
          const clockOutDate = new Date(attendanceDetail.date);
          clockOutDate.setHours(clockOutHours, clockOutMinutes);

          return {
            shiftStart: shiftStart,
            shiftEnd: shiftEnd,
            clockIn: clockInDate,
            clockOut: clockOutDate,
            notes: shift.notes,
          };
        });

        // After populating data, fetch available shifts for the selected staff
        await attendanceList_updateAvailableShifts();
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
   * @description Handle fetch api attendance - list
   */
  const attendanceList_fetchList = async (): Promise<void> => {
    try {
      await attendanceStore.attendance_list({
        params: attendanceList_queryParams,
        ...httpAbort_registerAbort(ATTENDANCE_LIST_REQUEST),
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
   * @description Handle fetch api attendance - update
   */
  const attendanceList_fetchUpdate = async (attendanceId: string): Promise<void> => {
    try {
      await attendanceStore.attendance_update(attendanceId, attendanceList_formData, {
        ...httpAbort_registerAbort(ATTENDANCE_UPDATE_REQUEST),
      });

      const argsEventEmitter: IPropsToast = {
        isOpen: true,
        message: 'Attendance updated successfully',
        position: EToastPosition.TOP_RIGHT,
        type: EToastType.SUCCESS,
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
   * @description Format duration from clock in and clock out
   */
  const attendanceList_formatDuration = (clockIn: Date | null, clockOut: Date | null): string => {
    if (!clockIn || !clockOut) return '0h 0m';

    const diff = new Date(clockOut).getTime() - new Date(clockIn).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  /**
   * @description Format time display
   */
  const attendanceList_formatTime = (time: Date | string | null): string => {
    if (!time) return '-';

    const date = typeof time === 'string' ? new Date(time) : new Date(time);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
  };

  /**
   * @description Get status color for late/early/overtime
   */
  const attendanceList_getStatusColor = (value: string, type: 'early' | 'late' | 'overtime'): string => {
    if (value === '0m') return 'text-gray-500';

    switch (type) {
      case 'early':
        return 'text-green-600';
      case 'late':
        return 'text-red-600';
      case 'overtime':
        return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };

  /**
   * @description Get staff member data from staff member store
   */
  const attendanceList_getStaffData = (staffId: string) => {
    return staffMember_lists.value.employees.find(staff => staff.id === staffId);
  };

  /**
   * @description Add a new shift to dialog form
   */
  const attendanceList_addShift = () => {
    attendanceList_formData.shifts.push({
      ...ATTENDANCE_LIST_INITIAL_SHIFT,
    });
  };

  /**
   * @description Handle delete confirmation for attendance record
   */
  const attendanceList_handleDelete = (recordId: number): void => {
    const argsEventEmitter = {
      id: 'attendance-delete-dialog-confirmation',
      isOpen: true,
      message: 'Are you sure you want to delete this attendance record?',
      onConfirm: () => attendanceList_onDelete(recordId.toString()),
      title: 'Delete Attendance',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Initialize date range (1 month back to today)
   */
  const attendanceList_initializeDateRange = () => {
    const currentDate = new Date();
    const minDate = new Date(currentDate);
    minDate.setMonth(currentDate.getMonth() - 1);

    attendanceList_createEditMinDate.value = minDate.toISOString().split('T')[0];
    attendanceList_createEditMaxDate.value = currentDate.toISOString().split('T')[0];
  };

  /**
   * @description Handle page change from data table
   */
  const attendanceList_onChangePage = (page: number): void => {
    attendanceList_queryParams.page = page;
    attendanceList_fetchList();
  };

  /**
   * @description Handle sort from data table
   */
  const attendanceList_onSort = (event: { sortField: string; sortOrder: 'asc' | 'desc' }): void => {
    attendanceList_queryParams.sortBy = event.sortField;
    attendanceList_queryParams.sortOrder = event.sortOrder;
    attendanceList_fetchList();
  };

  /**
   * @description Fetch working hours detail by staff ID
   */
  const attendanceList_fetchWorkingHoursByStaffId = async (staffId: string): Promise<void> => {
    if (!staffId) {
      attendanceList_selectedStaffWorkingHours.value = [];
      return;
    }

    attendanceList_isLoadingShifts.value = true;

    try {
      const response = await workingHoursStore.workingHours_detailByStaffId(staffId, {
        ...httpAbort_registerAbort('WORKING_HOURS_DETAIL_BY_STAFF_REQUEST'),
      });

      if (response?.data && Array.isArray(response.data)) {
        attendanceList_selectedStaffWorkingHours.value = response.data;
      }
    } catch (error: unknown) {
      console.error('Error fetching working hours by staff ID:', error);
      attendanceList_selectedStaffWorkingHours.value = [];
    } finally {
      attendanceList_isLoadingShifts.value = false;
    }
  };

  /**
   * @description Handle shift change and populate shift data
   */
  const attendanceList_onShiftChange = (selectedValue: string): void => {
    if (!selectedValue || !attendanceList_selectedStaffWorkingHours.value.length) return;

    // Find the selected time slot
    let selectedSlot: IWorkingHourTimeSlot | null = null;

    for (const workingHour of attendanceList_selectedStaffWorkingHours.value) {
      const slot = workingHour.working_hour_time_slots.find(
        s => s.id.toString() === selectedValue
      );
      if (slot) {
        selectedSlot = slot;
        break;
      }
    }

    if (!selectedSlot || !attendanceList_currentShift.value) return;

    // Parse UTC time and create Date objects with correct local time
    const openTime = new Date(selectedSlot.open_time);
    const closeTime = new Date(selectedSlot.close_time);

    // Extract UTC hours and minutes
    const openHours = openTime.getUTCHours();
    const openMinutes = openTime.getUTCMinutes();
    const closeHours = closeTime.getUTCHours();
    const closeMinutes = closeTime.getUTCMinutes();

    // Create new Date objects with today's date and the extracted time (in local timezone)
    const today = new Date();
    const shiftStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), openHours, openMinutes, 0);
    const shiftEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), closeHours, closeMinutes, 0);

    // Set shift start and end times
    attendanceList_currentShift.value.shiftStart = shiftStart;
    attendanceList_currentShift.value.shiftEnd = shiftEnd;

    // Initialize clock in/out with shift times (can be modified by user)
    if (!attendanceList_currentShift.value.clockIn) {
      attendanceList_currentShift.value.clockIn = new Date(shiftStart);
    }
    if (!attendanceList_currentShift.value.clockOut) {
      attendanceList_currentShift.value.clockOut = new Date(shiftEnd);
    }
  };

  /**
   * @description Update available shifts when staff changes
   */
  const attendanceList_updateAvailableShifts = async (): Promise<void> => {
    if (attendanceList_formData.staffId) {
      await attendanceList_fetchWorkingHoursByStaffId(attendanceList_formData.staffId);
    } else {
      attendanceList_selectedStaffWorkingHours.value = [];
    }
  };

  /**
   * @description Close the dialog using eventBus
   */
  const attendanceList_onCloseDialog = () => {
    const argsEventEmitter: IPropsDialog = {
      id: 'attendance-list-create-edit-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Open dialog for create mode
   */
  const attendanceList_onCreate = (): void => {
    attendanceList_onOpenDialog('create');
  };

  /**
   * @description Delete attendance data
   */
  const attendanceList_onDelete = async (attendanceId: string): Promise<void> => {
    try {
      await attendanceList_fetchDelete(attendanceId);

      // Refresh the list after successful deletion
      await attendanceList_fetchList();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting attendance:', error);
      } else {
        console.error('Error deleting attendance:', String(error));
      }
    }
  };

  /**
   * @description Open dialog for edit mode
   */
  const attendanceList_onEdit = (id: number): void => {
    attendanceList_onOpenDialog('edit', id.toString());
  };

  /**
   * @description Open the dialog for create or edit mode using eventBus
   */
  const attendanceList_onOpenDialog = async (mode: 'create' | 'edit', attendanceId?: string) => {
    attendanceList_createEditFormMode.value = mode;

    // Reset form data to initial state
    Object.assign(attendanceList_formData, ATTENDANCE_LIST_INITIAL_FORM_DATA);

    // Store the attendanceId for edit mode
    attendanceList_currentAttendanceId.value = attendanceId || '';

    // If edit mode and attendanceId is provided, fetch the details
    if (mode === 'edit' && attendanceId) {
      try {
        await attendanceList_fetchDetail(attendanceId);
      } catch (error) {
        console.error('Error fetching attendance detail:', error);
      }
    }

    // Open dialog
    const argsEventEmitter: IPropsDialog = {
      id: 'attendance-list-create-edit-dialog',
      isOpen: true,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Remove a shift by index from dialog form
   */
  const attendanceList_onRemoveShift = (index: number) => {
    if (attendanceList_formData.shifts.length > 1) {
      attendanceList_formData.shifts.splice(index, 1);
    }
  };

  /**
   * @description Reset form data to initial state
   */
  const attendanceList_onReset = () => {
    Object.assign(attendanceList_formData, ATTENDANCE_LIST_INITIAL_FORM_DATA);
    attendanceList_formValidations.value.$reset();
    attendanceList_currentAttendanceId.value = '';
  };

  /**
   * @description Save the attendance data
   */
  const attendanceList_onSave = async (): Promise<void> => {
    attendanceList_formValidations.value.$touch();

    if (attendanceList_formValidations.value.$invalid) {
      return;
    }

    try {
      if (attendanceList_createEditFormMode.value === 'create') {
        await attendanceList_fetchCreate();
      } else {
        // For update, use the stored attendanceId
        await attendanceList_fetchUpdate(attendanceList_currentAttendanceId.value);
      }

      // Refresh the list
      await attendanceList_fetchList();

      // Close the dialog
      attendanceList_onCloseDialog();

      // Reset form
      attendanceList_onReset();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error saving attendance:', error);
      } else {
        console.error('Error saving attendance:', String(error));
      }
    }
  };

  // ===== COMPUTED PROPERTIES =====

  /**
   * @description Alias for form mode
   */
  const attendanceList_formMode = computed(() => attendanceList_createEditFormMode.value);

  /**
   * @description Staff list for dropdown will be provided from staffMember store
   */
  const attendanceList_staffList = computed(() => {
    return staffMember_lists.value.employees.map(staff => ({
      label: staff.name,
      value: staff.id, // Use UUID id
    }));
  });

  /**
   * @description Get available shifts for selected staff from API
   */
  const attendanceList_getAvailableShifts = computed(() => {
    if (!attendanceList_formData.staffId || attendanceList_selectedStaffWorkingHours.value.length === 0) {
      return [];
    }

    // If no date selected, return empty array
    if (!attendanceList_formData.date) {
      return [];
    }

    const workingHours = attendanceList_selectedStaffWorkingHours.value;
    const selectedDate = new Date(attendanceList_formData.date);

    // Map working hours time slots to dropdown items
    const shifts: Array<{ label: string; value: string | number }> = [];

    // Iterate through all working hours and collect time slots for matching dates
    workingHours.forEach(workingHour => {
      const workingHourDate = new Date(workingHour.date);

      // Check if working hour matches selected date or has repeat_type
      const isSameDate = workingHourDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
      const isRecurring = workingHour.repeat_type !== 'not_repeat';

      // For now, show shifts if:
      // 1. It's the exact same date
      // 2. OR it has repeat_type (weekday, daily, etc.) and date is after or equal to working_hour date
      const shouldShowShift = isSameDate || (isRecurring && selectedDate >= workingHourDate);

      if (shouldShowShift && workingHour.working_hour_time_slots && workingHour.working_hour_time_slots.length > 0) {
        workingHour.working_hour_time_slots.forEach(slot => {
          const openTime = new Date(slot.open_time);
          const closeTime = new Date(slot.close_time);

          // Use UTC methods to avoid timezone conversion issues
          const openHour = String(openTime.getUTCHours()).padStart(2, '0');
          const openMinute = String(openTime.getUTCMinutes()).padStart(2, '0');
          const closeHour = String(closeTime.getUTCHours()).padStart(2, '0');
          const closeMinute = String(closeTime.getUTCMinutes()).padStart(2, '0');

          shifts.push({
            label: `${openHour}:${openMinute} - ${closeHour}:${closeMinute}`,
            value: slot.id.toString(),
          });
        });
      }
    });

    return shifts;
  });

  /**
   * @description Alias for availableShifts
   */
  const attendanceList_availableShifts = attendanceList_getAvailableShifts;

  /**
   * @description Check if form has valid data for header display
   */
  const attendanceList_hasValidHeaderData = computed(() => {
    return !!(attendanceList_formData.staffId && attendanceList_formData.date);
  });

  /**
   * @description Computed property that transforms raw data into table format
   */
  const attendanceList_listValues = computed(() => {
    return attendance_lists.value.map(attendance => {
      // Get staff name
      const staffData = attendanceList_getStaffData(attendance.staff_id);
      const staffName = staffData ? staffData.name : attendance.staff_name;

      // Format date
      const date = new Date(attendance.date);
      const formattedDate = date.toLocaleDateString('en-GB');

      return {
        clockIn: attendance.attendance_shifts.map(shift => attendanceList_formatTime(shift.clock_in)).join('\n'),
        clockOut: attendance.attendance_shifts.map(shift => attendanceList_formatTime(shift.clock_out)).join('\n'),
        createdAt: new Date(attendance.created_at).toLocaleString('en-GB'),
        createdBy: attendance.created_by,
        date: formattedDate,
        duration: attendance.attendance_shifts.map(shift => shift.duration).join('\n'),
        early: attendance.attendance_shifts.map(shift => shift.early).join('\n'),
        id: attendance.id,
        late: attendance.attendance_shifts.map(shift => shift.late).join('\n'),
        overtime: attendance.attendance_shifts.map(shift => shift.overtime).join('\n'),
        shift: attendance.attendance_shifts
          .map(shift => `${attendanceList_formatTime(shift.shift_start)} - ${attendanceList_formatTime(shift.shift_end)}`)
          .join('\n'),
        staffId: attendance.staff_id,
        staffName,
      };
    });
  });

  /**
   * @description Computed property that transforms raw data into table format for list data
   */
  const attendanceList_listData = computed(() => {
    const items: IAttendanceData[] = attendance_lists.value.map(attendance => {
      const staffData = attendanceList_getStaffData(attendance.staff_id);
      const staffName = staffData ? staffData.name : attendance.staff_name;

      return {
        id: attendance.id,
        date: new Date(attendance.date).toLocaleDateString('en-GB'),
        staffId: attendance.staff_id,
        staffName,
        shifts: attendance.attendance_shifts.map(shift => ({
          id: shift.id.toString(),
          shiftStart: attendanceList_formatTime(shift.shift_start),
          shiftEnd: attendanceList_formatTime(shift.shift_end),
          clockIn: shift.clock_in,
          clockOut: shift.clock_out,
          duration: shift.duration,
          early: shift.early,
          late: shift.late,
          overtime: shift.overtime,
          notes: shift.notes,
        })),
        createdAt: new Date(attendance.created_at).toLocaleString('en-GB'),
        createdBy: attendance.created_by,
      };
    });

    return {
      items,
      meta: {
        currentPage: attendance_meta.value?.currentPage || 1,
        lastPage: attendance_meta.value?.lastPage || 1,
        perPage: attendance_meta.value?.perPage || 10,
        total: attendance_meta.value?.total || 0,
      },
    };
  });

  /**
   * @description Computed properties for min and max date
   */
  const attendanceList_maxDate = computed(() => attendanceList_createEditMaxDate.value);
  const attendanceList_minDate = computed(() => attendanceList_createEditMinDate.value);

  /**
   * @description Get selected staff name
   */
  const attendanceList_selectedStaffName = computed(() => {
    if (!attendanceList_formData.staffId) return '';

    const staff = attendanceList_staffList.value.find(s => s.value === attendanceList_formData.staffId);
    return staff ? staff.label : '';
  });

  /**
   * @description Convert date string to Date object for PrimeVue Calendar
   */
  const attendanceList_calendarDate = computed({
    get: () => {
      if (!attendanceList_formData.date) return null;
      return new Date(attendanceList_formData.date);
    },
    set: (value: Date | null) => {
      if (value) {
        // Convert Date to string format (YYYY-MM-DD)
        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, '0');
        const day = String(value.getDate()).padStart(2, '0');
        attendanceList_formData.date = `${year}-${month}-${day}`;
      } else {
        attendanceList_formData.date = '';
      }
    },
  });

  /**
   * @description Get first shift for single shift mode
   */
  const attendanceList_currentShift = computed(() => {
    if (attendanceList_formData.shifts.length === 0) {
      return null;
    }
    return attendanceList_formData.shifts[0];
  });

  /**
   * @description Computed property for shift selection (maps to shift times)
   */
  const attendanceList_selectedShiftValue = computed({
    get: () => {
      if (!attendanceList_currentShift.value?.shiftStart || !attendanceList_currentShift.value?.shiftEnd) {
        return null;
      }
      // Format times for display
      const shiftStart = attendanceList_formatTime(attendanceList_currentShift.value.shiftStart);
      const shiftEnd = attendanceList_formatTime(attendanceList_currentShift.value.shiftEnd);
      return `${shiftStart}-${shiftEnd}`;
    },
    set: () => {
      // This will be handled by attendanceList_onShiftChange
    },
  });

  /**
   * @description Convert clock in time to Date object for PrimeVue DatePicker
   */
  const attendanceList_clockInTime = computed({
    get: () => attendanceList_currentShift.value?.clockIn || null,
    set: (value: Date | null) => {
      if (attendanceList_currentShift.value) {
        attendanceList_currentShift.value.clockIn = value;
      }
    },
  });

  /**
   * @description Convert clock out time to Date object for PrimeVue DatePicker
   */
  const attendanceList_clockOutTime = computed({
    get: () => attendanceList_currentShift.value?.clockOut || null,
    set: (value: Date | null) => {
      if (attendanceList_currentShift.value) {
        attendanceList_currentShift.value.clockOut = value;
      }
    },
  });

  /**
   * @description Format shift start time for display
   */
  const attendanceList_formattedShiftStart = computed(() => {
    if (!attendanceList_currentShift.value?.shiftStart) return '';
    return attendanceList_formatTime(attendanceList_currentShift.value.shiftStart);
  });

  /**
   * @description Format shift end time for display
   */
  const attendanceList_formattedShiftEnd = computed(() => {
    if (!attendanceList_currentShift.value?.shiftEnd) return '';
    return attendanceList_formatTime(attendanceList_currentShift.value.shiftEnd);
  });

  /**
   * @description Initialize on service creation
   */
  onMounted(() => {
    attendanceList_initializeDateRange();
  });

  /**
   * @description Return all necessary data and methods
   */
  return {
    attendanceList_addShift,
    attendanceList_availableShifts,
    attendanceList_calendarDate,
    attendanceList_clockInTime,
    attendanceList_clockOutTime,
    attendanceList_columns,
    attendanceList_createEditFormMode,
    attendanceList_createEditMaxDate,
    attendanceList_createEditMinDate,
    attendanceList_currentAttendanceId,
    attendanceList_currentShift,
    attendanceList_fetchList,
    attendanceList_formData,
    attendanceList_formMode,
    attendanceList_formValidations,
    attendanceList_formattedShiftEnd,
    attendanceList_formattedShiftStart,
    attendanceList_formatDuration,
    attendanceList_formatTime,
    attendanceList_getAvailableShifts,
    attendanceList_getStatusColor,
    attendanceList_handleDelete,
    attendanceList_hasValidHeaderData,
    attendanceList_isLoading: attendance_isLoading,
    attendanceList_isLoadingShifts,
    attendanceList_listData,
    attendanceList_listValues,
    attendanceList_maxDate,
    attendanceList_minDate,
    attendanceList_onChangePage,
    attendanceList_onCloseDialog,
    attendanceList_onCreate,
    attendanceList_onDelete,
    attendanceList_onEdit,
    attendanceList_onOpenDialog,
    attendanceList_onRemoveShift,
    attendanceList_onReset,
    attendanceList_onSave,
    attendanceList_onShiftChange,
    attendanceList_onSort,
    attendanceList_queryParams,
    attendanceList_selectedShiftValue,
    attendanceList_selectedStaffName,
    attendanceList_staffList,
    attendanceList_updateAvailableShifts,
  };
};
