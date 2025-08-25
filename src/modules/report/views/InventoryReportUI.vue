<script setup lang="ts">
// components
import StockReport from '../components/InventoryReport/StockReport.vue';
import StockMovementReport from '../components/InventoryReport/StockMovementReport.vue';

// types

const inventoryReport_activeTab = ref<string>('stock-report');
const inventoryReport_listTabs = ref<ITabs[]>([
  {
    component: StockReport,
    label: 'Stock Report',
    value: 'stock-report',
  },
  {
    component: StockMovementReport,
    label: 'Stock Movement Report',
    value: 'stock-movement-report',
  },
]);
</script>
<template>
  <section id="point-configuration" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="inventoryReport_activeTab" :items="inventoryReport_listTabs" />
  </section>
</template>
