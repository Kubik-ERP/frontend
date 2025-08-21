<script setup lang="ts">
// Components
import WorkingHoursListTable from '../components/WorkingHoursListTable.vue';
import WorkingHoursCreateEditDialog from '../components/WorkingHoursCreateEditDialog.vue';

// Services
import { useWorkingHoursListService } from '../services/working-hours-list.service';

const {
  workingHoursList_addTimeSlot,
  workingHoursList_computedColumns,
  workingHoursList_getCurrentWeekDateString,
  workingHoursList_getStaffData,
  workingHoursList_getWeekDateRange,
  workingHoursList_initializeSelectedMonth,
  workingHoursList_listColumns,
  workingHoursList_listValues,
  workingHoursList_listViewTypes,
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
  workingHoursList_createEditRepeatOptions,
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
} = useWorkingHoursListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('workingHoursList', {
  workingHoursList_addTimeSlot,
  workingHoursList_computedColumns,
  workingHoursList_getCurrentWeekDateString,
  workingHoursList_getStaffData,
  workingHoursList_getWeekDateRange,
  workingHoursList_initializeSelectedMonth,
  workingHoursList_listColumns,
  workingHoursList_listValues,
  workingHoursList_listViewTypes,
  workingHoursList_onChangeSelectedMonth,
  workingHoursList_onNavigateNext,
  workingHoursList_onNavigatePrevious,
  workingHoursList_removeTimeSlot,
  workingHoursList_selectedMonth,
  workingHoursList_selectedViewType,
  workingHoursList_onOpenDialog,
  workingHoursList_formData,
  workingHoursList_formValidations,
  workingHoursList_createEditFormMode,
  workingHoursList_createEditMinDate,
  workingHoursList_createEditMaxDate,
  workingHoursList_createEditStaffList,
  workingHoursList_createEditRepeatOptions,
  workingHoursList_onAddTimeSlot,
  workingHoursList_onRemoveTimeSlot,
  workingHoursList_onCloseDialog,
  workingHoursList_onSave,
  workingHoursList_onReset,
  workingHoursList_calendarDate,
  workingHoursList_formattedDate,
  workingHoursList_selectedStaffName,
  workingHoursList_hasValidHeaderData,
});
</script>

<template>
  <section id="working-hours-list" class="default-wrapper" style="max-width: calc(100dvw - 25%)">
    <WorkingHoursListTable />
    <WorkingHoursCreateEditDialog />
  </section>
</template>
