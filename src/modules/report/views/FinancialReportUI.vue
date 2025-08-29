<script setup lang="ts">
// components
import ProfitandLostReport from '../components/FinancialReport/ProfitandLostReport.vue';
import CashInOutReport from '../components/FinancialReport/CashInOutReport.vue';
import PaymentMethodReport from '../components/FinancialReport/PaymentMethodReport.vue';
import TaxandServiceChargeReport from '../components/FinancialReport/TaxandServiceChargeReport.vue';

// types

const financialReport_activeTab = ref<string>('profit-and-lost-report');
const financialReport_listTabs = ref<ITabs[]>([
  {
    component: ProfitandLostReport,
    label: 'Profit & Loss Report',
    value: 'profit-and-lost-report',
  },
  {
    component: CashInOutReport,
    label: 'Cash In/Out Report',
    value: 'cash-in-out-report',
  },
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
</script>
<template>
  <section id="point-configuration" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="financialReport_activeTab" :items="financialReport_listTabs" />
  </section>
</template>
