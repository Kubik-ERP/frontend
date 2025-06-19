<script setup lang="ts">
// Services
import { useSalesOrderService } from '../services/sales-order.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { salesOrder_activeTab, salesOrder_listTabs } = useSalesOrderService();
</script>

<template>
  <section id="sales-order" class="flex flex-col relative inset-0 z-0">
    <AppBaseTabs v-model:value="salesOrder_activeTab" :items="salesOrder_listTabs" />
  </section>
</template>
