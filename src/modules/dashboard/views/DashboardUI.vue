<script setup lang="ts">
// Components
import DashboardGreetingText from '../components/DashboardGreetingText.vue';
import DashboardOverviews from '../components/DashboardOverviews.vue';
import DashboardSalesAndProducts from '../components/DashboardSalesAndProducts.vue';
import DashboardStockAvailability from '../components/DashboardStockAvailability.vue';

// types
import type { IDashboardProvided } from '../interfaces';

// services
import { useDashboardService } from '../services/useDashboard.service';

const {
  authentication_userData,
  dashboard_queryParams,
  dashboard_isLoading,
  dashboard_values,
  dashboard_getSummary,
} = useDashboardService();

provide<IDashboardProvided>('dashboard', {
  authentication_userData,
  dashboard_queryParams,
  dashboard_isLoading,
  dashboard_values,
  dashboard_getSummary,
});

onMounted(() => {
  dashboard_getSummary();
});
</script>

<template>
  <section id="dashboard" class="flex flex-col gap-4">
    <!-- <pre>
      {{ dashboard_queryParams }}
    </pre> -->
    <DashboardGreetingText />
    <DashboardOverviews />
    <DashboardSalesAndProducts />
    <DashboardStockAvailability />
  </section>
</template>
