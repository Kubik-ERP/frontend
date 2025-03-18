<script setup lang="ts">
// Components
import DashboardGreetingText from '../components/DashboardGreetingText.vue';
import DashboardOverviews from '../components/DashboardOverviews.vue';
import DashboardSalesAndProducts from '../components/DashboardSalesAndProducts.vue';
import DashboardStockAvailability from '../components/DashboardStockAvailability.vue';
</script>

<template>
  <section id="dashboard" class="flex flex-col gap-4">
    <DashboardGreetingText />
    <DashboardOverviews />
    <DashboardSalesAndProducts />
    <DashboardStockAvailability />
  </section>
</template>
