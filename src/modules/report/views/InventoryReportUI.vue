<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';

// components
import MovementLedgerReport from '../components/InventoryReport/MovementLedgerReport.vue';
import CurrentStockOverviewReport from '../components/InventoryReport/CurrentStockOverviewReport.vue';
import PoReceivingVarianceReport from '../components/InventoryReport/PoReceivingVarianceReport.vue';
import SlowDeadStockReport from '../components/InventoryReport/SlowDeadStockReport.vue';
import ItemPerformanceReport from '../components/InventoryReport/ItemPerformanceReport.vue';
import ItemPerformanceByCategoryReport from '../components/InventoryReport/ItemPerformanceByCategoryReport.vue';
import ItemPerformanceByBrandReport from '../components/InventoryReport/ItemPerformanceByBrandReport.vue';

// service
import { useReportService } from '../services/report.service';
const { report_getInventoryReport } = useReportService();

// types
const inventoryReport_activeTab = ref<string>('movement-ledger');

// 1. Changed to 'computed' for instant translation updates
const inventoryReport_listTabs = computed<ITabs[]>(() => [
  {
    component: markRaw(MovementLedgerReport),
    label: useLocalization('reports.inventory.tabs.movement_ledger'),
    value: 'movement-ledger',
  },
  {
    component: markRaw(CurrentStockOverviewReport),
    label: useLocalization('reports.inventory.tabs.current_stock'),
    value: 'current-stock-overview',
  },
  {
    component: markRaw(PoReceivingVarianceReport),
    label: useLocalization('reports.inventory.tabs.po_variance'),
    value: 'po-receiving-variance',
  },
  {
    component: markRaw(SlowDeadStockReport),
    label: useLocalization('reports.inventory.tabs.slow_dead_stock'),
    value: 'slow-dead-stock',
  },
  {
    component: markRaw(ItemPerformanceReport),
    label: useLocalization('reports.inventory.tabs.item_performance'),
    value: 'item-performance',
  },
  {
    component: markRaw(ItemPerformanceByCategoryReport),
    label: useLocalization('reports.inventory.tabs.item_performance_category'),
    value: 'item-performance-by-category',
  },
  {
    component: markRaw(ItemPerformanceByBrandReport),
    label: useLocalization('reports.inventory.tabs.item_performance_brand'),
    value: 'item-performance-by-brand',
  },
]);

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
  <section id="point-configuration" class="flex flex-col relative inset-0 z-0 gap-4">
    <AppBaseTabs v-model:value="inventoryReport_activeTab" :items="inventoryReport_listTabs" />
    </section>
</template>