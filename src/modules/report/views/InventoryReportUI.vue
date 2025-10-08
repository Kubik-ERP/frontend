<script setup lang="ts">
// components
import MovementLedgerReport from '../components/InventoryReport/MovementLedgerReport.vue';
import CurrentStockOverviewReport from '../components/InventoryReport/CurrentStockOverviewReport.vue';

// types
const inventoryReport_activeTab = ref<string>('movement-ledger');
const inventoryReport_listTabs = ref<ITabs[]>([
  {
    component: markRaw(MovementLedgerReport),
    label: 'Movement Ledger',
    value: 'movement-ledger',
  },
  {
    component: markRaw(CurrentStockOverviewReport),
    label: 'Current Stock Overview',
    value: 'current-stock-overview',
  },
  // {
  //   component: StockReport,
  //   label: 'PO Receiving Variance',
  //   value: 'po-receiving-variance',
  // },
  // {
  //   component: StockReport,
  //   label: 'Slow Dead Stock',
  //   value: 'slow-dead-stock',
  // },
  // {
  //   component: StockReport,
  //   label: 'Item Performance',
  //   value: 'item-performance',
  // },
  // {
  //   component: StockReport,
  //   label: 'Item Performance By Category',
  //   value: 'item-performance-by-category',
  // },
]);
// service
import { useReportService } from '../services/report.service';
const { report_getInventoryReport } = useReportService();

watch(
  inventoryReport_activeTab,
  async newTab => {
    switch (newTab) {
      case 'movement-ledger': {
        await report_getInventoryReport('movement-ledger');
        break;
      }
      case 'current-stock-overview': {
        await report_getInventoryReport('current-stock-overview');
        break;
      }
      case 'po-receiving-variance': {
        await report_getInventoryReport('po-receiving-variance');
        break;
      }
      case 'slow-dead-stock': {
        await report_getInventoryReport('slow-dead-stock');
        break;
      }
      case 'item-performance': {
        await report_getInventoryReport('item-performance');
        break;
      }
      case 'item-performance-by-category': {
        await report_getInventoryReport('item-performance-by-category');
        break;
      }
      case 'item-performance-by-brand': {
        await report_getInventoryReport('item-performance-by-brand');
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
    <AppBaseTabs v-model:value="inventoryReport_activeTab" :items="inventoryReport_listTabs" />
    <!-- <StockReport /> -->
  </section>
</template>
