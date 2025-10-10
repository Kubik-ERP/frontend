<script setup lang="ts">
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
      label: 'Item',
      value: 'item',
    },
    {
      component: markRaw(SalesByCategory),
      label: 'Category',
      value: 'category',
    },
    {
      component: markRaw(SalesByCustomer),
      label: 'Customer',
      value: 'customer',
    },
    {
      component: markRaw(SalesByStaff),
      label: 'Staff',
      value: 'staff',
    },
    {
      component: markRaw(SalesByDay),
      label: 'Day',
      value: 'day',
    },
    {
      component: markRaw(SalesByMonth),
      label: 'Month',
      value: 'month',
    },
    {
      component: markRaw(SalesByQuarter),
      label: 'Quarter',
      value: 'quarter',
    },
    {
      component: markRaw(SalesByYear),
      label: 'Year',
      value: 'year',
    },
  ];

  // 4. Filter array berdasarkan izin
  return allTabs.filter(tab => {
    // Jika tab adalah 'staff', hanya sertakan jika pengguna memiliki izin.
    if (tab.value === 'staff') {
      return hasManageStaffMemberPermission;
    }
    // Untuk semua tab lainnya, selalu sertakan.
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
  <section id="point-configuration" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="salesReport_activeTab" :items="salesReport_listTabs" />
  </section>
</template>
