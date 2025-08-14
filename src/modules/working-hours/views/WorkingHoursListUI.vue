<script setup lang="ts">
// Components
import WorkingHoursListTable from '../components/WorkingHoursListTable.vue';

// Services
import { useWorkingHoursListService } from '../services/working-hours-list.service';

const {
  workingHoursList_addTimeSlot,
  workingHoursList_computedColumns,
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
} = useWorkingHoursListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('workingHoursList', {
  workingHoursList_addTimeSlot,
  workingHoursList_computedColumns,
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
});
</script>

<template>
  <section id="working-hours-list" class="default-wrapper" style="max-width: calc(100dvw - 25%)">
    <WorkingHoursListTable />
  </section>
</template>
