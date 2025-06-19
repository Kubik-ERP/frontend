<script setup lang="ts">
// Services
import { useCashDrawerListService } from '@/modules/cash-drawer/services/cash-drawer-list.service';
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useSalesOrderService } from '../services/sales-order.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { cashDrawerList_fetchListTransactions } = useCashDrawerListService();
const { dailySalesList_fetchListInvoices } = useDailySalesListService();
const { salesOrder_activeTab, salesOrder_listTabs } = useSalesOrderService();

/**
 * @description Watch active tab changes
 */
watch(
  salesOrder_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'DAILY-SALES': {
        await dailySalesList_fetchListInvoices();
        break;
      }
      case 'SALES-ORDER': {
        // Handle logic for sales order tab
        break;
      }
      case 'CASH-DRAWER': {
        // Handle logic for cash drawer tab
        await cashDrawerList_fetchListTransactions();
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
  <section id="sales-order" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="salesOrder_activeTab" :items="salesOrder_listTabs" />
  </section>
</template>
