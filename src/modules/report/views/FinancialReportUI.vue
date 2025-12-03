<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';

// components
import FinancialSummary from '../components/FinancialReport/FinancialSummary.vue';
import DiscountReport from '../components/FinancialReport/Discount.vue';
import PaymentMethodReport from '../components/FinancialReport/PaymentMethodReport.vue';
import TaxandServiceChargeReport from '../components/FinancialReport/TaxandServiceChargeReport.vue';

// service
import { useReportService } from '../services/report.service';
const { report_getFinancialReport } = useReportService();

// types
const financialReport_activeTab = ref<string>('financial-summary-report');

// 1. Changed to 'computed' so labels update instantly when language changes
const financialReport_listTabs = computed<ITabs[]>(() => [
  {
    component: markRaw(FinancialSummary),
    label: useLocalization('reports.financial.tabs.summary'), // "Financial Summary" / "Ringkasan Keuangan"
    value: 'financial-summary-report',
  },
  {
    component: markRaw(DiscountReport),
    label: useLocalization('reports.financial.tabs.discount'), // "Discount Report" / "Laporan Diskon"
    value: 'DISCOUNT-REPORT',
  },
  {
    component: markRaw(PaymentMethodReport),
    label: useLocalization('reports.financial.tabs.payment_method'), // "Payment Method Report" / "Laporan Metode Pembayaran"
    value: 'payment-method-report',
  },
  {
    component: markRaw(TaxandServiceChargeReport),
    label: useLocalization('reports.financial.tabs.tax_service'), // "Tax & Service Charge Report" / "Laporan Pajak & Layanan"
    value: 'tax-and-service-charge-report',
  },
]);

watch(
  financialReport_activeTab,
  async newTab => {
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