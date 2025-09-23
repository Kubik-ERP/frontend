// Constants
import {
  attendanceList_CREATE_REQUEST,
  attendanceList_DELETE_REQUEST,
  attendanceList_DETAIL_REQUEST,
  attendanceList_LIST_REQUEST,
  attendanceList_UPDATE_REQUEST,
} from '../constants/attendance-api.constant';
import { attendanceList_LIST_COLUMNS, attendanceList_LIST_VALUES, attendanceList_STAFF_LIST } from '../constants';

// Interfaces
import type {
  IAttendanceListData,
  IAttendanceListFormData,
  IAttendanceListProvided,
  IAttendanceListRequestQuery,
} from '../interfaces';

// Vue
import { ref, reactive, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';

// Plugins
import eventBus from '@/plugins/mitt';
import { useHttpAbort } from '@/app/composables';

// Stores
import { useAttendanceStore } from '../store';

// Vuelidate
import { required } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';

// Interface for dropdown items
interface IDropdownItem {
  label: string;
  value: string;
}

// Interface for dialog props
interface IPropsDialog {
  id: string;
  isOpen: boolean;
  isUsingClosableButton?: boolean;
  isUsingBackdrop?: boolean;
  width?: string;
}

// Working Hours Interface (for shift data)
interface ISimpleShift {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
}

interface ISimpleWorkingHours {
  id: number;
  staffId: number;
  shifts: ISimpleShift[];
}

/**
 * @description Closure function that returns everything what we need into an object
 */
export const useAttendanceService = (): IAttendanceListProvided => {
  /**
   * @description Injected variables
   */
  const attendanceStore = useAttendanceStore();
  const { attendanceList_isLoading } = storeToRefs(attendanceStore);
  const { httpAbort_registerAbort } = useHttpAbort();

  /**
   * @description Reactive data binding
   */
  const attendanceList_listData = ref<IAttendanceListData>({
    items: attendanceList_LIST_VALUES,
    meta: {
      total: attendanceList_LIST_VALUES.length,
      perPage: 10,
      currentPage: 1,
      lastPage: Math.ceil(attendanceList_LIST_VALUES.length / 10),
    },
  });

  const attendanceList_columns = ref(attendanceList_LIST_COLUMNS);
  const attendanceList_createEditFormMode = ref<'create' | 'edit'>('create');
  const attendanceList_currentAttendanceId = ref<string>('');

  /**
   * @description Form data structure
   */
  const attendanceList_formData = reactive<IAttendanceListFormData>({
    id: null,
    date: '',
    staffId: null,
    shift: '',
    shiftStart: '',
    shiftEnd: '',
    clockIn: '',
    clockOut: '',
    notes: '',
  });

  /**
   * @description Available shifts for selected staff and date
   */
  const attendanceList_availableShifts = ref<IDropdownItem[]>([]);

  /**
   * @description Mock working hours data (in real app, this would come from API)
   */
  const mockWorkingHours = ref<ISimpleWorkingHours[]>([
    {
      id: 1,
      staffId: 1,
      shifts: [
        { id: 'morning', day: 'monday', start_time: '09:00', end_time: '17:00' },
        { id: 'evening', day: 'monday', start_time: '18:00', end_time: '22:00' },
        { id: 'morning', day: 'tuesday', start_time: '09:00', end_time: '17:00' },
        { id: 'morning', day: 'wednesday', start_time: '09:00', end_time: '17:00' },
        { id: 'morning', day: 'thursday', start_time: '09:00', end_time: '17:00' },
        { id: 'morning', day: 'friday', start_time: '09:00', end_time: '17:00' },
      ],
    },
    {
      id: 2,
      staffId: 2,
      shifts: [
        { id: 'morning', day: 'monday', start_time: '08:00', end_time: '16:00' },
        { id: 'morning', day: 'tuesday', start_time: '08:00', end_time: '16:00' },
        { id: 'morning', day: 'wednesday', start_time: '08:00', end_time: '16:00' },
        { id: 'morning', day: 'thursday', start_time: '08:00', end_time: '16:00' },
        { id: 'morning', day: 'friday', start_time: '08:00', end_time: '16:00' },
        { id: 'evening', day: 'saturday', start_time: '14:00', end_time: '22:00' },
      ],
    },
    {
      id: 3,
      staffId: 3,
      shifts: [
        { id: 'night', day: 'sunday', start_time: '22:00', end_time: '06:00' },
        { id: 'night', day: 'monday', start_time: '22:00', end_time: '06:00' },
        { id: 'night', day: 'tuesday', start_time: '22:00', end_time: '06:00' },
        { id: 'night', day: 'wednesday', start_time: '22:00', end_time: '06:00' },
        { id: 'night', day: 'thursday', start_time: '22:00', end_time: '06:00' },
      ],
    },
  ]);

  /**
   * @description Get available shifts for a staff member on a specific date
   */
  const attendanceList_getAvailableShifts = (staffId: number, date: string): IDropdownItem[] => {
    const staffWorkingHours = mockWorkingHours.value.find(wh => wh.staffId === staffId);
    if (!staffWorkingHours) return [];

    const dateObj = new Date(date);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const availableShifts = staffWorkingHours.shifts
      .filter(shift => shift.day === dayName)
      .map(shift => ({
        label: `${shift.start_time} - ${shift.end_time}`,
        value: `${shift.start_time}-${shift.end_time}`,
      }));

    return availableShifts;
  };

  /**
   * @description Update available shifts when staff or date changes
   */
  const attendanceList_updateAvailableShifts = (): void => {
    if (attendanceList_formData.staffId && attendanceList_formData.date) {
      attendanceList_availableShifts.value = attendanceList_getAvailableShifts(
        attendanceList_formData.staffId,
        attendanceList_formData.date,
      );

      // Clear shift selection if it's no longer available
      if (
        attendanceList_formData.shift &&
        !attendanceList_availableShifts.value.some(s => s.value === attendanceList_formData.shift)
      ) {
        attendanceList_formData.shift = '';
        attendanceList_formData.shiftStart = '';
        attendanceList_formData.shiftEnd = '';
      }
    } else {
      attendanceList_availableShifts.value = [];
    }
  };

  /**
   * @description Handle shift selection
   */
  const attendanceList_onShiftChange = (): void => {
    if (attendanceList_formData.shift) {
      const [startTime, endTime] = (attendanceList_formData.shift as string).split('-');
      attendanceList_formData.shiftStart = startTime;
      attendanceList_formData.shiftEnd = endTime;
    } else {
      attendanceList_formData.shiftStart = '';
      attendanceList_formData.shiftEnd = '';
    }
  };

  /**
   * @description Computed properties for date and time formatting
   */
  const attendanceList_minDate = computed(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today.toISOString().split('T')[0];
  });

  const attendanceList_maxDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const attendanceList_formattedStartTime = computed(() => {
    return attendanceList_formData.shiftStart ? `${attendanceList_formData.shiftStart}:00` : '';
  });

  const attendanceList_formattedEndTime = computed(() => {
    return attendanceList_formData.shiftEnd ? `${attendanceList_formData.shiftEnd}:00` : '';
  });

  /**
   * @description Validation rules
   */
  const attendanceList_validationRules = computed(() => ({
    date: { required },
    staffId: { required },
    shift: { required },
    clockIn: { required },
    clockOut: { required },
    notes: {}, // Optional field
  }));

  const attendanceList_formValidations = useVuelidate(attendanceList_validationRules, attendanceList_formData);

  /**
   * @description Handle fetch api attendance - create
   */
  const attendanceList_fetchCreate = async (): Promise<void> => {
    try {
      await attendanceStore.attendanceList_create(attendanceList_formData, {
        ...httpAbort_registerAbort(attendanceList_CREATE_REQUEST),
      });

      eventBus.emit('AppBaseToast', {
        message: 'Attendance created successfully',
        type: 'success',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error creating attendance:', error);
      } else {
        console.error('Error creating attendance:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api attendance - delete
   */
  const attendanceList_fetchDelete = async (attendanceId: string): Promise<void> => {
    try {
      await attendanceStore.attendanceList_delete(attendanceId, {
        ...httpAbort_registerAbort(attendanceList_DELETE_REQUEST),
      });

      eventBus.emit('AppBaseToast', {
        message: 'Attendance deleted successfully',
        type: 'success',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error deleting attendance:', error);
      } else {
        console.error('Error deleting attendance:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api attendance - detail
   */
  const attendanceList_fetchDetail = async (attendanceId: string): Promise<void> => {
    try {
      const response = await attendanceStore.attendanceList_detail(attendanceId, {
        ...httpAbort_registerAbort(attendanceList_DETAIL_REQUEST),
      });

      // Populate form data with fetched details
      if (response) {
        Object.assign(attendanceList_formData, response);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching attendance detail:', error);
      } else {
        console.error('Error fetching attendance detail:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api attendance - list
   */
  const attendanceList_fetchList = async (): Promise<void> => {
    try {
      await attendanceStore.attendanceList_list({
        ...httpAbort_registerAbort(attendanceList_LIST_REQUEST),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error fetching attendance list:', error);
      } else {
        console.error('Error fetching attendance list:', String(error));
      }
    }
  };

  /**
   * @description Handle fetch api attendance - update
   */
  const attendanceList_fetchUpdate = async (attendanceId: string): Promise<void> => {
    try {
      await attendanceStore.attendanceList_update(attendanceId, attendanceList_formData, {
        ...httpAbort_registerAbort(attendanceList_UPDATE_REQUEST),
      });

      eventBus.emit('AppBaseToast', {
        message: 'Attendance updated successfully',
        type: 'success',
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error updating attendance:', error);
      } else {
        console.error('Error updating attendance:', String(error));
      }
    }
  };

  /**
   * @description Popover ref for create dialog
   */
  const attendanceList_popover = ref();

  /**
   * @description Watch for staff and date changes to update available shifts
   */
  watch(
    [() => attendanceList_formData.staffId, () => attendanceList_formData.date],
    () => {
      attendanceList_updateAvailableShifts();
    },
    { immediate: true },
  );

  /**
   * @description Format time display
   */
  const attendanceList_formatTime = (time: string | null): string => {
    if (!time) return '-';
    return time;
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
   * @description Add a new shift to attendance for a specific staff and date
   */
  const attendanceList_addShift = (staffId: number, date: string): void => {
    // Find existing attendance record for this staff and date
    const existingRecord = attendanceList_listData.value.items.find(
      item => item.staffId === staffId && item.date === date,
    );

    if (existingRecord) {
      // Add a new shift to existing record
      const availableShifts = attendanceList_getAvailableShifts(staffId, date);
      if (availableShifts.length > 0) {
        const firstAvailableShift = availableShifts[0];
        const [startTime, endTime] = (firstAvailableShift.value as string).split('-');

        const newShift = {
          id: `shift_${Date.now()}`,
          shiftStart: startTime,
          shiftEnd: endTime,
          clockIn: null,
          clockOut: null,
          duration: '0h 0m',
          early: '0m',
          late: '0m',
          overtime: '0m',
          notes: '',
        };

        existingRecord.shifts.push(newShift);
      }
    } else {
      // Create new attendance record
      const staffData = attendanceList_STAFF_LIST.find(staff => staff.value === staffId);
      const availableShifts = attendanceList_getAvailableShifts(staffId, date);

      if (availableShifts.length > 0 && staffData) {
        const firstAvailableShift = availableShifts[0];
        const [startTime, endTime] = (firstAvailableShift.value as string).split('-');

        const newRecord = {
          id: Date.now(),
          date,
          staffId,
          staffName: staffData.label,
          shifts: [
            {
              id: `shift_${Date.now()}`,
              shiftStart: startTime,
              shiftEnd: endTime,
              clockIn: null,
              clockOut: null,
              duration: '0h 0m',
              early: '0m',
              late: '0m',
              overtime: '0m',
              notes: 'Manually added shift',
            },
          ],
          createdAt: new Date().toLocaleString('en-GB'),
          createdBy: 'Manual Entry',
        };

        attendanceList_listData.value.items.unshift(newRecord);
        attendanceList_listData.value.meta.total += 1;
      }
    }
  };

  /**
   * @description Handle business logic for close dialog
   */
  const attendanceList_onCloseDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'attendance-list-create-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);

    // Reset form data
    attendanceList_onReset();
  };

  /**
   * @description Handle business logic for create dialog
   */
  const attendanceList_onCreate = (): void => {
    attendanceList_createEditFormMode.value = 'create';

    // Reset form data first
    attendanceList_onReset();

    const argsEventEmitter: IPropsDialog = {
      id: 'attendance-list-create-dialog',
      isUsingClosableButton: false,
      isUsingBackdrop: true,
      isOpen: true,
      width: '600px',
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);
  };

  /**
   * @description Handle business logic for edit dialog
   */
  const attendanceList_onEdit = (id: number): void => {
    attendanceList_createEditFormMode.value = 'edit';
    attendanceList_currentAttendanceId.value = id.toString();

    // Reset form data first
    attendanceList_onReset();

    // Fetch detail and populate form
    attendanceList_fetchDetail(id.toString()).then(() => {
      const argsEventEmitter: IPropsDialog = {
        id: 'attendance-list-create-dialog',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: true,
        width: '600px',
      };

      eventBus.emit('AppBaseDialog', argsEventEmitter);
    });
  };

  /**
   * @description Handle business logic for delete
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
   * @description Handle business logic for save (create/update)
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

  /**
   * @description Reset form data to initial state
   */
  const attendanceList_onReset = (): void => {
    Object.assign(attendanceList_formData, {
      id: null,
      date: '',
      staffId: null,
      shift: '',
      shiftStart: '',
      shiftEnd: '',
      clockIn: '',
      clockOut: '',
      notes: '',
    });
    attendanceList_formValidations.value.$reset();
    attendanceList_currentAttendanceId.value = '';
  };

  /**
   * @description Handle business logic for search/filter
   */
  const attendanceList_onFilter = (query: IAttendanceListRequestQuery): void => {
    // In a real application, this would make an API call
    // For now, we'll just filter the existing data
    let filteredItems = [...attendanceList_LIST_VALUES];

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredItems = filteredItems.filter(
        item => item.staffName.toLowerCase().includes(searchTerm) || item.date.includes(searchTerm),
      );
    }

    attendanceList_listData.value = {
      items: filteredItems,
      meta: {
        total: filteredItems.length,
        perPage: query.limit || 10,
        currentPage: query.page || 1,
        lastPage: Math.ceil(filteredItems.length / (query.limit || 10)),
      },
    };
  };

  /**
   * @description Handle delete confirmation for attendance record
   */
  const attendanceList_handleDelete = (recordId: number): void => {
    const argsEventEmitter = {
      id: 'attendance-delete-dialog-confirmation',
      isOpen: true,
      title: 'Delete Attendance',
      message: 'Are you sure you want to delete this attendance record?',
      onConfirm: () => attendanceList_onDelete(recordId.toString()),
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Handle opening the attendance dialog
   */
  const attendanceList_onOpenDialog = (mode: 'create' | 'edit', attendanceId?: string) => {
    if (mode === 'create') {
      attendanceList_onCreate();
    } else if (attendanceId) {
      attendanceList_onEdit(parseInt(attendanceId));
    }
  };

  /**
   * @description Alias for form mode for backward compatibility
   */
  const attendanceList_formMode = computed(() => attendanceList_createEditFormMode.value);

  return {
    attendanceList_addShift,
    attendanceList_availableShifts,
    attendanceList_columns,
    attendanceList_createEditFormMode,
    attendanceList_currentAttendanceId,
    attendanceList_fetchList,
    attendanceList_formData,
    attendanceList_formMode,
    attendanceList_formValidations,
    attendanceList_formattedEndTime,
    attendanceList_formattedStartTime,
    attendanceList_formatTime,
    attendanceList_getStatusColor,
    attendanceList_handleDelete,
    attendanceList_isLoading: attendanceList_isLoading,
    attendanceList_listData,
    attendanceList_maxDate,
    attendanceList_minDate,
    attendanceList_onCloseDialog,
    attendanceList_onCreate,
    attendanceList_onDelete,
    attendanceList_onEdit,
    attendanceList_onFilter,
    attendanceList_onOpenDialog,
    attendanceList_onReset,
    attendanceList_onSave,
    attendanceList_onShiftChange,
    attendanceList_popover,
    attendanceList_updateAvailableShifts,
    attendanceList_v$: attendanceList_formValidations,
  };
};
