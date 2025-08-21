// Constants
import { ATTENDANCE_LIST_COLUMNS, ATTENDANCE_LIST_VALUES, ATTENDANCE_STAFF_LIST } from '../constants';

// Interfaces
import type {
  IAttendanceListData,
  IAttendanceListFormData,
  IAttendanceListProvided,
  IAttendanceListRequestQuery,
} from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

// Vuelidate
import useVuelidate from '@vuelidate/core';
import { required } from '@vuelidate/validators';

// Interface for dropdown items
interface IDropdownItem {
  label: string;
  value: string;
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
   * @description Reactive data binding
   */
  const attendance_listData = ref<IAttendanceListData>({
    items: ATTENDANCE_LIST_VALUES,
    meta: {
      total: ATTENDANCE_LIST_VALUES.length,
      perPage: 10,
      currentPage: 1,
      lastPage: Math.ceil(ATTENDANCE_LIST_VALUES.length / 10),
    },
  });

  const attendance_columns = ref(ATTENDANCE_LIST_COLUMNS);
  const attendance_formMode = ref<'create' | 'edit'>('create');

  /**
   * @description Form data structure
   */
  const attendance_formData = reactive<IAttendanceListFormData>({
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
  const attendance_availableShifts = ref<IDropdownItem[]>([]);

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
  const attendance_getAvailableShifts = (staffId: number, date: string): IDropdownItem[] => {
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
  const attendance_updateAvailableShifts = (): void => {
    if (attendance_formData.staffId && attendance_formData.date) {
      attendance_availableShifts.value = attendance_getAvailableShifts(
        attendance_formData.staffId,
        attendance_formData.date,
      );

      // Clear shift selection if it's no longer available
      if (
        attendance_formData.shift &&
        !attendance_availableShifts.value.some(s => s.value === attendance_formData.shift)
      ) {
        attendance_formData.shift = '';
        attendance_formData.shiftStart = '';
        attendance_formData.shiftEnd = '';
      }
    } else {
      attendance_availableShifts.value = [];
    }
  };

  /**
   * @description Handle shift selection
   */
  const attendance_onShiftChange = (): void => {
    if (attendance_formData.shift) {
      const [startTime, endTime] = (attendance_formData.shift as string).split('-');
      attendance_formData.shiftStart = startTime;
      attendance_formData.shiftEnd = endTime;
    } else {
      attendance_formData.shiftStart = '';
      attendance_formData.shiftEnd = '';
    }
  };

  /**
   * @description Computed properties for date and time formatting
   */
  const attendance_minDate = computed(() => {
    const today = new Date();
    today.setMonth(today.getMonth() - 1);
    return today.toISOString().split('T')[0];
  });

  const attendance_maxDate = computed(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const attendance_formattedStartTime = computed(() => {
    return attendance_formData.shiftStart ? `${attendance_formData.shiftStart}:00` : '';
  });

  const attendance_formattedEndTime = computed(() => {
    return attendance_formData.shiftEnd ? `${attendance_formData.shiftEnd}:00` : '';
  });

  /**
   * @description Validation rules
   */
  const attendance_validationRules = computed(() => ({
    date: { required },
    staffId: { required },
    shift: { required },
    clockIn: { required },
    clockOut: { required },
    notes: {}, // Optional field
  }));

  const attendance_v$ = useVuelidate(attendance_validationRules, attendance_formData);

  /**
   * @description Popover ref for create dialog
   */
  const attendance_popover = ref();

  /**
   * @description Watch for staff and date changes to update available shifts
   */
  watch(
    [() => attendance_formData.staffId, () => attendance_formData.date],
    () => {
      attendance_updateAvailableShifts();
    },
    { immediate: true },
  );

  /**
   * @description Format time display
   */
  const attendance_formatTime = (time: string | null): string => {
    if (!time) return '-';
    return time;
  };

  /**
   * @description Get status color for late/early/overtime
   */
  const attendance_getStatusColor = (value: string, type: 'early' | 'late' | 'overtime'): string => {
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
   * @description Handle delete confirmation
   */
  const attendance_handleDelete = (id: number): void => {
    const argsEventEmitter: IPropsDialogConfirmation = {
      id: 'attendance-delete-dialog-confirmation',
      description: `
        <div class="flex items-center justify-center">
          <p class="font-normal text-black-secondary text-sm text-center">
            Are you sure you want to delete this attendance record? This action cannot be undone.
          </p>
        </div>`,
      iconName: 'delete-polygon',
      isOpen: true,
      isUsingButtonSecondary: true,
      isUsingHtmlTagOnDescription: true,
      onClickButtonPrimary: () => {
        eventBus.emit('AppBaseDialog', { id: 'attendance-delete-dialog-confirmation', isOpen: false });
      },
      onClickButtonSecondary: () => {
        // Logic to delete the attendance record goes here
        attendance_onDelete(id);
        eventBus.emit('AppBaseDialog', { id: 'attendance-delete-dialog-confirmation', isOpen: false });
      },
      textButtonPrimary: 'Cancel',
      textButtonSecondary: 'Delete Attendance',
      title: 'Delete Attendance Record',
      type: 'error',
    };

    eventBus.emit('AppBaseDialogConfirmation', argsEventEmitter);
  };

  /**
   * @description Add a new shift to attendance for a specific staff and date
   */
  const attendance_addShift = (staffId: number, date: string): void => {
    // Find existing attendance record for this staff and date
    const existingRecord = attendance_listData.value.items.find(
      item => item.staffId === staffId && item.date === date,
    );

    if (existingRecord) {
      // Add a new shift to existing record
      const availableShifts = attendance_getAvailableShifts(staffId, date);
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
      const staffData = ATTENDANCE_STAFF_LIST.find(staff => staff.value === staffId);
      const availableShifts = attendance_getAvailableShifts(staffId, date);

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

        attendance_listData.value.items.unshift(newRecord);
        attendance_listData.value.meta.total += 1;
      }
    }
  };

  /**
   * @description Handle business logic for close dialog
   */
  const attendance_onCloseDialog = (): void => {
    const argsEventEmitter: IPropsDialog = {
      id: 'attendance-list-create-dialog',
      isOpen: false,
    };

    eventBus.emit('AppBaseDialog', argsEventEmitter);

    // Reset form data
    Object.assign(attendance_formData, {
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

    attendance_v$.value.$reset();
  };

  /**
   * @description Handle business logic for create dialog
   */
  const attendance_onCreate = (): void => {
    attendance_formMode.value = 'create';

    // Reset form data first
    Object.assign(attendance_formData, {
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
    attendance_v$.value.$reset();

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
  const attendance_onEdit = (id: number, shiftId?: string): void => {
    const attendanceRecord = attendance_listData.value.items.find(item => item.id === id);
    if (attendanceRecord) {
      attendance_formMode.value = 'edit';
      attendance_formData.id = id;

      // Populate form with existing data
      attendance_formData.date = attendanceRecord.date.split('/').reverse().join('-'); // Convert DD/MM/YYYY to YYYY-MM-DD
      attendance_formData.staffId = attendanceRecord.staffId;

      // Handle multiple shifts structure
      if (attendanceRecord.shifts && attendanceRecord.shifts.length > 0) {
        const targetShift = shiftId
          ? attendanceRecord.shifts.find(shift => shift.id === shiftId) || attendanceRecord.shifts[0]
          : attendanceRecord.shifts[0];

        attendance_formData.shift = `${targetShift.shiftStart}-${targetShift.shiftEnd}`;
        attendance_formData.shiftStart = targetShift.shiftStart;
        attendance_formData.shiftEnd = targetShift.shiftEnd;
        attendance_formData.clockIn = targetShift.clockIn || '';
        attendance_formData.clockOut = targetShift.clockOut || '';
        attendance_formData.notes = targetShift.notes;
      }

      const argsEventEmitter: IPropsDialog = {
        id: 'attendance-list-create-dialog',
        isUsingClosableButton: false,
        isUsingBackdrop: true,
        isOpen: true,
        width: '600px',
      };

      eventBus.emit('AppBaseDialog', argsEventEmitter);
    }
  };

  /**
   * @description Handle business logic for delete
   */
  const attendance_onDelete = (id: number): void => {
    const index = attendance_listData.value.items.findIndex(item => item.id === id);
    if (index !== -1) {
      attendance_listData.value.items.splice(index, 1);
      attendance_listData.value.meta.total -= 1;
      attendance_listData.value.meta.lastPage = Math.ceil(
        attendance_listData.value.meta.total / attendance_listData.value.meta.perPage,
      );
    }
  };

  /**
   * @description Handle business logic for save (create/update)
   */
  const attendance_onSave = async (): Promise<void> => {
    const isValid = await attendance_v$.value.$validate();
    if (!isValid) return;

    const formattedDate = attendance_formData.date.split('-').reverse().join('/'); // Convert YYYY-MM-DD to DD/MM/YYYY

    if (attendance_formMode.value === 'create') {
      // Create new record with shifts structure
      const newRecord = {
        id: Date.now(),
        date: formattedDate,
        staffId: attendance_formData.staffId!,
        staffName: ATTENDANCE_STAFF_LIST.find(staff => staff.value === attendance_formData.staffId)?.label || '',
        shifts: [
          {
            id: `shift_${Date.now()}`,
            shiftStart: attendance_formData.shiftStart,
            shiftEnd: attendance_formData.shiftEnd,
            clockIn: attendance_formData.clockIn,
            clockOut: attendance_formData.clockOut,
            duration: '8h 0m', // Calculate based on clock in/out
            early: '0m',
            late: '0m',
            overtime: '0m',
            notes: attendance_formData.notes,
          },
        ],
        createdAt: new Date().toLocaleString('en-GB'),
        createdBy: 'System',
      };

      attendance_listData.value.items.unshift(newRecord);
      attendance_listData.value.meta.total += 1;
    } else {
      // Update existing record
      const existingRecord = attendance_listData.value.items.find(item => item.id === attendance_formData.id);
      if (existingRecord && existingRecord.shifts.length > 0) {
        // Update first shift (for now - in future could update specific shift)
        const shift = existingRecord.shifts[0];
        shift.shiftStart = attendance_formData.shiftStart;
        shift.shiftEnd = attendance_formData.shiftEnd;
        shift.clockIn = attendance_formData.clockIn;
        shift.clockOut = attendance_formData.clockOut;
        shift.notes = attendance_formData.notes;

        existingRecord.date = formattedDate;
        existingRecord.staffId = attendance_formData.staffId!;
        existingRecord.staffName =
          ATTENDANCE_STAFF_LIST.find(staff => staff.value === attendance_formData.staffId)?.label || '';
      }
    }

    attendance_listData.value.meta.lastPage = Math.ceil(
      attendance_listData.value.meta.total / attendance_listData.value.meta.perPage,
    );
    attendance_onCloseDialog();
  };

  /**
   * @description Handle business logic for search/filter
   */
  const attendance_onFilter = (query: IAttendanceListRequestQuery): void => {
    // In a real application, this would make an API call
    // For now, we'll just filter the existing data
    let filteredItems = [...ATTENDANCE_LIST_VALUES];

    if (query.search) {
      const searchTerm = query.search.toLowerCase();
      filteredItems = filteredItems.filter(
        item => item.staffName.toLowerCase().includes(searchTerm) || item.date.includes(searchTerm),
      );
    }

    attendance_listData.value = {
      items: filteredItems,
      meta: {
        total: filteredItems.length,
        perPage: query.limit || 10,
        currentPage: query.page || 1,
        lastPage: Math.ceil(filteredItems.length / (query.limit || 10)),
      },
    };
  };

  return {
    attendance_availableShifts,
    attendance_columns,
    attendance_formData,
    attendance_formMode,
    attendance_formattedEndTime,
    attendance_formattedStartTime,
    attendance_listData,
    attendance_maxDate,
    attendance_minDate,
    attendance_popover,
    attendance_updateAvailableShifts,
    attendance_v$,
    attendance_formValidations: attendance_v$,
    attendance_addShift,
    attendance_formatTime,
    attendance_getStatusColor,
    attendance_handleDelete,
    attendance_onCloseDialog,
    attendance_onCreate,
    attendance_onDelete,
    attendance_onEdit,
    attendance_onFilter,
    attendance_onSave,
    attendance_onShiftChange,
  };
};
