<script setup lang="ts">
// Components
import WorkingHoursListTable from '../components/WorkingHoursListTable.vue';
import WorkingHoursCreateEditDialog from '../components/WorkingHoursCreateEditDialog.vue';

// Services
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';
import { useWorkingHoursListService } from '../services/working-hours-list.service';

const { staffMemberList_fetchListMembers } = useStaffMemberListService();
const {
  workingHoursList_addTimeSlot,
  workingHoursList_calendarDate,
  workingHoursList_columns,
  workingHoursList_createEditFormMode,
  workingHoursList_createEditMaxDate,
  workingHoursList_createEditMinDate,
  workingHoursList_createEditRepeatOptions,
  workingHoursList_createEditStaffList,
  workingHoursList_customRecurrenceEndDate,
  workingHoursList_customRecurrenceFrequencyOptions,
  workingHoursList_fetchList,
  workingHoursList_formData,
  workingHoursList_formValidations,
  workingHoursList_formattedDate,
  workingHoursList_getCurrentWeekDateString,
  workingHoursList_getStaffData,
  workingHoursList_getWeekDateRange,
  workingHoursList_hasValidHeaderData,
  workingHoursList_isLoading,
  workingHoursList_listValues,
  workingHoursList_listViewTypes,
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
} = useWorkingHoursListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('workingHoursList', {
  workingHoursList_addTimeSlot,
  workingHoursList_calendarDate,
  workingHoursList_columns,
  workingHoursList_createEditFormMode,
  workingHoursList_createEditMaxDate,
  workingHoursList_createEditMinDate,
  workingHoursList_createEditRepeatOptions,
  workingHoursList_createEditStaffList,
  workingHoursList_customRecurrenceEndDate,
  workingHoursList_customRecurrenceFrequencyOptions,
  workingHoursList_fetchList,
  workingHoursList_formData,
  workingHoursList_formValidations,
  workingHoursList_formattedDate,
  workingHoursList_getCurrentWeekDateString,
  workingHoursList_getStaffData,
  workingHoursList_getWeekDateRange,
  workingHoursList_hasValidHeaderData,
  workingHoursList_isLoading,
  workingHoursList_listValues,
  workingHoursList_listViewTypes,
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
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  try {
    await Promise.all([
      staffMemberList_fetchListMembers(),
      workingHoursList_fetchList()
    ])
  } catch (error) {
    console.error('Error loading working hours list:', error);
  }
});
</script>

<template>
  <section id="working-hours-list" class="default-wrapper" style="max-width: calc(100dvw - 25%)">
    <WorkingHoursListTable />
    <WorkingHoursCreateEditDialog />
  </section>
</template>
