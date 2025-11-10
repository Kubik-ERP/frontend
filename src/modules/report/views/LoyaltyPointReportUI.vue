<script setup lang="ts">
// components
import benefitUtilization from '../components/LoyaltyPointReport/benefitUtilization.vue';
import expiryWarning from '../components/LoyaltyPointReport/expiryWarning.vue';
import productBased from '../components/LoyaltyPointReport/productBased.vue';
import spendBased from '../components/LoyaltyPointReport/spendBased.vue';
import typeAccumulation from '../components/LoyaltyPointReport/typeAccumulation.vue';

// service
import { useReportService } from '../services/report.service';
const { report_getLoyaltyPointReport } = useReportService();

const loyaltyPointReport_activeTab = ref<string>('benefit-utilization-report');
const loyaltyPointReport_listTabs = ref<ITabs[]>([
  {
    component: markRaw(spendBased),
    label: 'Spend Based',
    value: 'spend-based-report',
  },
  // product-based
  {
    component: markRaw(productBased),
    label: 'Product Based',
    value: 'product-based-report',
  },
  // benefit-utilization
  {
    component: markRaw(benefitUtilization),
    label: 'Benefit Utilization',
    value: 'benefit-utilization-report',
  },
  // expiry-warning
  {
    component: markRaw(expiryWarning),
    label: 'Expiry Warning',
    value: 'expiry-warning-report',
  },
  // type-accumulation
  {
    component: markRaw(typeAccumulation),
    label: 'Type Accumulation',
    value: 'type-accumulation-report',
  },
]);

watch(
  loyaltyPointReport_activeTab,
  debounce(async newTab => {
    switch (newTab.toUpperCase()) {
      case 'SPEND-BASED-REPORT': {
        await report_getLoyaltyPointReport('spend-based');
        break;
      }
      case 'PRODUCT-BASED-REPORT': {
        await report_getLoyaltyPointReport('product-based');
        break;
      }
      case 'BENEFIT-UTILIZATION-REPORT': {
        await report_getLoyaltyPointReport('benefit-utilization');
        break;
      }
      case 'EXPIRY-WARNING-REPORT': {
        await report_getLoyaltyPointReport('expiry-warning');
        break;
      }
      case 'TYPE-ACCUMULATION-REPORT': {
        await report_getLoyaltyPointReport('type-accumulation');
        break;
      }
      default: {
        console.warn(`Unknown tab: ${newTab}`);
      }
    }
  }, 500),
);

onMounted(async () => {
  await report_getLoyaltyPointReport('spend-based');
});
</script>
<template>
  <section id="loyalty-point-report" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="loyaltyPointReport_activeTab" :items="loyaltyPointReport_listTabs" />
  </section>
</template>
