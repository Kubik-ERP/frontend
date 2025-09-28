<script setup lang="ts">
// components
import SalesByItem from '../components/SalesReport/SalesByItem.vue';
// import SalesByOrderType from '../components/SalesReport/SalesByOrderType.vue';

// types

const salesReport_activeTab = ref<string>('sales-by-item');
const salesReport_listTabs = ref<ITabs[]>([
  {
    component: SalesByItem,
    label: 'Sales by Item',
    value: 'sales-by-item',
  },
  {
    component: SalesByItem,
    label: 'Sales by Category',
    value: 'sales-by-category',
  },
  {
    component: SalesByItem,
    label: 'Sales by Customer',
    value: 'sales-by-customer',
  },
  {
    component: SalesByItem,
    label: 'Sales by Staff',
    value: 'sales-by-staff',
  },
  {
    component: SalesByItem,
    label: 'Sales by Day',
    value: 'sales-by-day',
  },
  {
    component: SalesByItem,
    label: 'Sales by Month',
    value: 'sales-by-month',
  },
  {
    component: SalesByItem,
    label: 'Sales by Quarter',
    value: 'sales-by-quarter',
  },
  {
    component: SalesByItem,
    label: 'Sales by Year',
    value: 'sales-by-year',
  },
  // {
  //   component: SalesByOrderType,
  //   label: 'Sales by Order Type',
  //   value: 'sales-by-order-type',
  // },
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
