<script setup lang="ts">
// components
import SalesByItem from '../components/SalesReport/SalesByItem.vue';
import SalesByOrderType from '../components/SalesReport/SalesByOrderType.vue';

// types

const salesReport_activeTab = ref<string>('sales-by-item');
const salesReport_listTabs = ref<ITabs[]>([
  {
    component: SalesByItem,
    label: 'Sales by Item',
    value: 'sales-by-item',
  },
  {
    component: SalesByOrderType,
    label: 'Sales by Order Type',
    value: 'sales-by-order-type',
  },
]);

// service
import { useReportService } from '../services/report.service';
const { report_getSalesReport } = useReportService();

watch(
  salesReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'SALES-BY-ITEM': {
        await report_getSalesReport('item');
        break;
      }
      case 'SALES-BY-ORDER-TYPE': {
        await report_getSalesReport('order');
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
    <AppBaseTabs v-model:value="salesReport_activeTab" :items="salesReport_listTabs" />
  </section>
</template>
