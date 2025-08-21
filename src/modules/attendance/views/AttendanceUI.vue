<script setup lang="ts">
// Components
import AttendanceListCreateDialog from '../components/AttendanceListCreateDialog.vue';
import AttendanceListTable from '../components/AttendanceListTable.vue';

// Services
import { useAttendanceService } from '../services/attendance.service';

const {
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
  attendance_formValidations,
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
} = useAttendanceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('attendance', {
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
  attendance_formValidations,
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
});
</script>

<template>
  <section id="attendance" class="default-wrapper">
    <AttendanceListTable />
    <AttendanceListCreateDialog />
    <AppBaseDialogConfirmation id="attendance-delete-dialog-confirmation" />
  </section>
</template>
