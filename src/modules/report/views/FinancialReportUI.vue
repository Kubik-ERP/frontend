<script setup lang="ts">
// components
import FinancialSummary from '../components/FinancialReport/FinancialSummary.vue';
import DiscountReport from '../components/FinancialReport/Discount.vue';
import PaymentMethodReport from '../components/FinancialReport/PaymentMethodReport.vue';
import TaxandServiceChargeReport from '../components/FinancialReport/TaxandServiceChargeReport.vue';

// types
const financialReport_activeTab = ref<string>('financial-summary-report');
const financialReport_listTabs = ref<ITabs[]>([
  {
    component: markRaw(FinancialSummary),
    label: 'Financial Summary',
    value: 'financial-summary-report',
  },
  {
    component: markRaw(DiscountReport),
    label: 'Discount Report',
    value: 'DISCOUNT-REPORT',
  },
  {
    component: markRaw(PaymentMethodReport),
    label: 'Payment Method Report',
    value: 'payment-method-report',
  },
  {
    component: markRaw(TaxandServiceChargeReport),
    label: 'Tax & Service Charge Report',
    value: 'tax-and-service-charge-report',
  },
]);

// service
import { useReportService } from '../services/report.service';
const { report_getFinancialReport, fetchOutlet_lists } = useReportService();

watch(
  financialReport_activeTab,
  async newTab => {
    await fetchOutlet_lists();
    switch (newTab.toUpperCase()) {
      case 'FINANCIAL-SUMMARY-REPORT': {
        await report_getFinancialReport('financial-summary');
        break;
      }
      case 'DISCOUNT-REPORT': {
        await report_getFinancialReport('discount-summary');
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
