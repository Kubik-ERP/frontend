<script setup lang="ts">
// Components
import DashboardChartLatestSales from './DashboardChartLatestSales.vue';
import DashboardTopProducts from './DashboardTopProducts.vue';
import DashboardPaymentMethods from './DashboardPaymentMethods.vue';
</script>

<template>
  <section id="dashboard-sales-and-products" class="grid grid-rows-1 grid-cols-12 gap-4">
    <DashboardChartLatestSales />
    <section class="flex flex-col gap-4 w-full col-span-full lg:col-span-4 justify-between">
      <DashboardTopProducts />
      <DashboardPaymentMethods />
    </section>
  </section>
</template>
