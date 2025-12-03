<script setup lang="ts">
import { ref, computed, watch, markRaw, onMounted } from 'vue';

// components
import benefitUtilization from '../components/LoyaltyPointReport/benefitUtilization.vue';
import expiryWarning from '../components/LoyaltyPointReport/expiryWarning.vue';
import productBased from '../components/LoyaltyPointReport/productBased.vue';
import spendBased from '../components/LoyaltyPointReport/spendBased.vue';
import typeAccumulation from '../components/LoyaltyPointReport/typeAccumulation.vue';

// service
import { useReportService } from '../services/report.service';
const { report_getLoyaltyPointReport } = useReportService();

const loyaltyPointReport_activeTab = ref<string>('spend-based-report');

// 1. Changed to 'computed' for instant translation updates
const loyaltyPointReport_listTabs = computed<ITabs[]>(() => [
  {
    component: markRaw(spendBased),
    label: useLocalization('reports.loyalty_point.tabs.spend_based'),
    value: 'spend-based-report',
  },
  {
    component: markRaw(productBased),
    label: useLocalization('reports.loyalty_point.tabs.product_based'),
    value: 'product-based-report',
  },
  {
    component: markRaw(benefitUtilization),
    label: useLocalization('reports.loyalty_point.tabs.benefit_utilization'),
    value: 'benefit-utilization-report',
  },
  {
    component: markRaw(expiryWarning),
    label: useLocalization('reports.loyalty_point.tabs.expiry_warning'),
    value: 'expiry-warning-report',
  },
  {
    component: markRaw(typeAccumulation),
    label: useLocalization('reports.loyalty_point.tabs.type_accumulation'),
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