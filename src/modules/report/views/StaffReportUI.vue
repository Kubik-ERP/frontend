<script setup lang="ts">
// components
import CommissionReport from '../components/StaffReport/CommissionReport.vue';
import IndividualReport from '../components/StaffReport/IndividualReport.vue';
import CommissionByItemsReport from '../components/StaffReport/CommissionByItemsReport.vue';
import CommissionByVoucherReport from '../components/StaffReport/CommissionByVoucherReport.vue';
// types
const staffReport_activeTab = ref<string>('commission-report');
const staffReport_listTabs = ref<ITabs[]>([
  {
    component: markRaw(CommissionReport),
    label: 'Commission Report',
    value: 'commission-report',
  },
  {
    component: markRaw(IndividualReport),
    label: 'Individual Report',
    value: 'individual-report',
  },
  {
    component: markRaw(CommissionByItemsReport),
    label: 'Commission By Items',
    value: 'commission-by-items',
  },
  {
    component: markRaw(CommissionByVoucherReport),
    label: 'Commission By Voucher',
    value: 'commission-by-voucher',
  },
]);

// service
import { useReportService } from '../services/report.service';
const { report_getStaffReport } = useReportService();

watch(
  staffReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'COMMISSION-REPORT': {
        await report_getStaffReport('commission-report');
        break;
      }
      case 'INDIVIDUAL-REPORT': {
        await report_getStaffReport('individual-report');
        break;
      }
      case 'COMMISSION-BY-ITEMS': {
        await report_getStaffReport('commission-by-items');
        break;
      }
      case 'COMMISSION-BY-VOUCHER': {
        await report_getStaffReport('commission-by-voucher');
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
