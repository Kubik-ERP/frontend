<script setup lang="ts">
// Components
import DashboardChartLatestSales from './DashboardChartLatestSales.vue';
import DashboardTopProducts from './DashboardTopProducts.vue';
</script>

<template>
  <section id="dashboard-sales-and-products" class="grid grid-rows-1 grid-cols-12 gap-4">
    <DashboardChartLatestSales />
    <DashboardTopProducts />
  </section>
</template>
