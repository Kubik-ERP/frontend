<script setup lang="ts">
import { ref, computed, watch, markRaw } from 'vue';

// components
import SalesByItem from '../components/SalesReport/SalesByItem.vue';
import SalesByCategory from '../components/SalesReport/SalesByCategory.vue';
import SalesByCustomer from '../components/SalesReport/SalesByCustomer.vue';
import SalesByStaff from '../components/SalesReport/SalesByStaff.vue';
import SalesByDay from '../components/SalesReport/SalesByDay.vue';
import SalesByMonth from '../components/SalesReport/SalesByMonth.vue';
import SalesByQuarter from '../components/SalesReport/SalesByQuarter.vue';
import SalesByYear from '../components/SalesReport/SalesByYear.vue';

// service
import { useReportService } from '../services/report.service';
const { report_getSalesReport, hasManageStaffMemberPermission } = useReportService();

const salesReport_activeTab = ref<string>('item');

const salesReport_listTabs = computed(() => {
  const allTabs = [
    {
      component: markRaw(SalesByItem),
      label: useLocalization('reports.sales.tabs.item'), // "Item" / "Barang"
      value: 'item',
    },
    {
      component: markRaw(SalesByCategory),
      label: useLocalization('reports.sales.tabs.category'), // "Category" / "Kategori"
      value: 'category',
    },
    {
      component: markRaw(SalesByCustomer),
      label: useLocalization('reports.sales.tabs.customer'), // "Customer" / "Pelanggan"
      value: 'customer',
    },
    {
      component: markRaw(SalesByStaff),
      label: useLocalization('reports.sales.tabs.staff'), // "Staff" / "Staf"
      value: 'staff',
    },
    {
      component: markRaw(SalesByDay),
      label: useLocalization('reports.sales.tabs.day'), // "Day" / "Hari"
      value: 'day',
    },
    {
      component: markRaw(SalesByMonth),
      label: useLocalization('reports.sales.tabs.month'), // "Month" / "Bulan"
      value: 'month',
    },
    {
      component: markRaw(SalesByQuarter),
      label: useLocalization('reports.sales.tabs.quarter'), // "Quarter" / "Kuartal"
      value: 'quarter',
    },
    {
      component: markRaw(SalesByYear),
      label: useLocalization('reports.sales.tabs.year'), // "Year" / "Tahun"
      value: 'year',
    },
  ];

  // Filter based on permission
  return allTabs.filter(tab => {
    if (tab.value === 'staff') {
      return hasManageStaffMemberPermission;
    }
    return true;
  });
});

watch(
  salesReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'ITEM': {
        await report_getSalesReport('item');
        break;
      }
      case 'CATEGORY': {
        await report_getSalesReport('category');
        break;
      }
      case 'CUSTOMER': {
        await report_getSalesReport('customer');
        break;
      }
      case 'STAFF': {
        await report_getSalesReport('staff');
        break;
      }
      case 'DAY': {
        await report_getSalesReport('day');
        break;
      }
      case 'MONTH': {
        await report_getSalesReport('month');
        break;
      }
      case 'QUARTER': {
        await report_getSalesReport('quarter');
        break;
      }
      case 'YEAR': {
        await report_getSalesReport('year');
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
  <section id="sales-report" class="flex flex-col relative inset-0 z-0 gap-4">
    <AppBaseTabs v-model:value="salesReport_activeTab" :items="salesReport_listTabs" />
  </section>
</template>