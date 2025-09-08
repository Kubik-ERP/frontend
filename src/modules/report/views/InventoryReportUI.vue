<script setup lang="ts">
// components
import StockReport from '../components/InventoryReport/StockReport.vue';
// import StockMovementReport from '../components/InventoryReport/StockMovementReport.vue';

// types
const inventoryReport_activeTab = ref<string>('stock-report');
// const inventoryReport_listTabs = ref<ITabs[]>([
//   {
//     component: StockReport,
//     label: 'Stock Report',
//     value: 'stock-report',
//   },
//   {
//     component: StockMovementReport,
//     label: 'Stock Movement Report',
//     value: 'stock-movement-report',
//   },
// ]);
// service
import { useReportService } from '../services/report.service';
const { report_getInventoryReport } = useReportService();

watch(
  inventoryReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'STOCK-REPORT': {
        await report_getInventoryReport('stock');
        break;
      }
      case 'STOCK-MOVEMENT-REPORT': {
        await report_getInventoryReport('movement');
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
    <!-- <AppBaseTabs v-model:value="inventoryReport_activeTab" :items="inventoryReport_listTabs"  /> -->
    <StockReport />
  </section>
</template>
