<script setup lang="ts">
// Components
import AttendanceListCreateDialog from '../components/AttendanceListCreateDialog.vue';
import AttendanceTable from '../components/AttendanceTable.vue';

// Services
import { useAttendanceListService } from '../services/attendance-list.service';

// Stores
import { useStaffMemberStore } from '@/modules/staff-member/store';

const staffMemberStore = useStaffMemberStore();

const {
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
  attendanceList_isLoading,
  attendanceList_isLoadingShifts,
  attendanceList_listData,
  attendanceList_listValues,
  attendanceList_maxDate,
  attendanceList_minDate,
  attendanceList_onCloseDialog,
  attendanceList_onCreate,
  attendanceList_onDelete,
  attendanceList_onEdit,
  attendanceList_onOpenDialog,
  attendanceList_onRemoveShift,
  attendanceList_onReset,
  attendanceList_onSave,
  attendanceList_onShiftChange,
  attendanceList_selectedShiftValue,
  attendanceList_selectedStaffName,
  attendanceList_staffList,
  attendanceList_updateAvailableShifts,
} = useAttendanceListService();

/**
 * @description Fetch initial data
 */
onMounted(async () => {
  try {
    // Fetch staff members first
    await staffMemberStore.staffMember_list({}, {});

    // Then fetch attendance list
    await attendanceList_fetchList();
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
});

/**
 * @description Provide all the data and methods what we need
 */
provide('attendance', {
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
  attendanceList_isLoading,
  attendanceList_isLoadingShifts,
  attendanceList_listData,
  attendanceList_listValues,
  attendanceList_maxDate,
  attendanceList_minDate,
  attendanceList_onCloseDialog,
  attendanceList_onCreate,
  attendanceList_onDelete,
  attendanceList_onEdit,
  attendanceList_onOpenDialog,
  attendanceList_onRemoveShift,
  attendanceList_onReset,
  attendanceList_onSave,
  attendanceList_onShiftChange,
  attendanceList_selectedShiftValue,
  attendanceList_selectedStaffName,
  attendanceList_staffList,
  attendanceList_updateAvailableShifts,
});
</script>

<template>
  <section id="attendance" class="default-wrapper">
    <AttendanceTable />
    <AttendanceListCreateDialog />
    <AppBaseDialogConfirmation id="attendance-delete-dialog-confirmation" />
  </section>
</template>
