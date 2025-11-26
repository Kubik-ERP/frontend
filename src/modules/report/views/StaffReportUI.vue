<script setup lang="ts">
// components

// types
const staffReport_activeTab = ref<string>('financial-summary-report');
const staffReport_listTabs = ref<ITabs[]>([
  // {
  //   component: markRaw(FinancialSummary),
  //   label: 'Financial Summary',
  //   value: 'financial-summary-report',
  // },
]);

// service
import { useReportService } from '../services/report.service';
const { report_getStaffReport } = useReportService();

watch(
  staffReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'FINANCIAL-SUMMARY-REPORT': {
        await report_getStaffReport('financial-summary');
        break;
      }
      default: {
        console.warn(`Unknown tab: ${newTab}`);
      }
    }
  },
  {
    immediate: true,
  },
);
</script>
<template>
  <section id="staff-report" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="staffReport_activeTab" :items="staffReport_listTabs" />
  </section>
</template>
