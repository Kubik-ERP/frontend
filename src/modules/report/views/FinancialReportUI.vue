<script setup lang="ts">
// components
// import ProfitandLostReport from '../components/FinancialReport/ProfitandLostReport.vue';
// import CashInOutReport from '../components/FinancialReport/CashInOutReport.vue';
import PaymentMethodReport from '../components/FinancialReport/PaymentMethodReport.vue';
import TaxandServiceChargeReport from '../components/FinancialReport/TaxandServiceChargeReport.vue';

// types
const financialReport_activeTab = ref<string>('payment-method-report');
const financialReport_listTabs = ref<ITabs[]>([
  // {
  //   component: ProfitandLostReport,
  //   label: 'Profit & Loss Report',
  //   value: 'profit-and-lost-report',
  // },
  // {
  //   component: CashInOutReport,
  //   label: 'Cash In/Out Report',
  //   value: 'cash-in-out-report',
  // },
  {
    component: PaymentMethodReport,
    label: 'Payment Method Report',
    value: 'payment-method-report',
  },
  {
    component: TaxandServiceChargeReport,
    label: 'Tax & Service Charge Report',
    value: 'tax-and-service-charge-report',
  },
]);

// service
import { useReportService } from '../services/report.service';
const { report_getFinancialReport } = useReportService();

watch(
  financialReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'PROFIT-AND-LOST-REPORT': {
        await report_getFinancialReport('profit-loss');
        break;
      }
      case 'CASH-IN-OUT-REPORT': {
        await report_getFinancialReport('cashin-out');
        break;
      }
      case 'PAYMENT-METHOD-REPORT': {
        await report_getFinancialReport('payment-summary');
        break;
      }
      case 'TAX-AND-SERVICE-CHARGE-REPORT': {
        await report_getFinancialReport('tax-and-service-summary');
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
  <section id="point-configuration" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="financialReport_activeTab" :items="financialReport_listTabs" />
  </section>
</template>
