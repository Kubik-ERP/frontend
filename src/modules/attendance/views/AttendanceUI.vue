<script setup lang="ts">
// Components
import AttendanceListCreateDialog from '../components/AttendanceListCreateDialog.vue';
import AttendanceTable from '../components/AttendanceTable.vue';

// Services
import { useAttendanceService } from '../services/attendance.service';

const {
  attendanceList_availableShifts,
  attendanceList_columns,
  attendanceList_formData,
  attendanceList_formMode,
  attendanceList_formattedEndTime,
  attendanceList_formattedStartTime,
  attendanceList_listData,
  attendanceList_maxDate,
  attendanceList_minDate,
  attendanceList_popover,
  attendanceList_updateAvailableShifts,
  attendanceList_v$,
  attendanceList_formValidations,
  attendanceList_addShift,
  attendanceList_formatTime,
  attendanceList_getStatusColor,
  attendanceList_handleDelete,
  attendanceList_onCloseDialog,
  attendanceList_onCreate,
  attendanceList_onDelete,
  attendanceList_onEdit,
  attendanceList_onFilter,
  attendanceList_onSave,
  attendanceList_onShiftChange,
} = useAttendanceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('attendance', {
  attendanceList_availableShifts,
  attendanceList_columns,
  attendanceList_formData,
  attendanceList_formMode,
  attendanceList_formattedEndTime,
  attendanceList_formattedStartTime,
  attendanceList_listData,
  attendanceList_maxDate,
  attendanceList_minDate,
  attendanceList_popover,
  attendanceList_updateAvailableShifts,
  attendanceList_v$,
  attendanceList_formValidations,
  attendanceList_addShift,
  attendanceList_formatTime,
  attendanceList_getStatusColor,
  attendanceList_handleDelete,
  attendanceList_onCloseDialog,
  attendanceList_onCreate,
  attendanceList_onDelete,
  attendanceList_onEdit,
  attendanceList_onFilter,
  attendanceList_onSave,
  attendanceList_onShiftChange,
});
</script>

<template>
  <section id="attendance" class="default-wrapper">
    <AttendanceTable />
    <AttendanceListCreateDialog />
    <AppBaseDialogConfirmation id="attendance-delete-dialog-confirmation" />
  </section>
</template>
