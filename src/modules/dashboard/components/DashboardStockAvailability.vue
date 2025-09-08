<script setup lang="ts">
import { computed } from 'vue';
// Components
import DashboardLowStock from './DashboardLowStock.vue';
import DashboardOutOfStock from './DashboardOutOfStock.vue';

import type { IDashboardProvided } from '../interfaces';
// inject
const { dashboard_values } = inject<IDashboardProvided>('dashboard')!;

const countPercentage = (value: number) => {
  const totalStock =
    dashboard_values.value.stockStatus.stockStatus.available +
    dashboard_values.value.stockStatus.stockStatus.lowStock +
    dashboard_values.value.stockStatus.stockStatus.outOfStock;

  if (totalStock === 0) return 0;

  return parseFloat(((value / totalStock) * 100).toFixed(2));
};

// Use a computed property to make the labels reactive to language changes
const value = computed(() => [
  {
    label: useLocalization('dashboard.stockAvailability.available'),
    color: '#8CC8EB',
    value: countPercentage(dashboard_values.value.stockStatus.stockStatus.available),
  },
  {
    label: useLocalization('dashboard.stockAvailability.lowStock'),
    color: '#FFB84D',
    value: countPercentage(dashboard_values.value.stockStatus.stockStatus.lowStock),
  },
  {
    label: useLocalization('dashboard.stockAvailability.outOfStock'),
    color: '#E57171',
    value: countPercentage(dashboard_values.value.stockStatus.stockStatus.outOfStock),
  },
]);
</script>

<template>
  <section
    id="dashboard-stock-availability"
    class="flex flex-col bg-white border border-solid border-grayscale-10 p-4 gap-4 rounded-sm"
  >
    <h5 class="font-semibold text-base lg:text-lg text-grayscale-70">
      {{ useLocalization('dashboard.stockAvailability.title') }}
    </h5>

    <PrimeVueMeterGroup
      :value="value"
      :pt="{
        meters: 'gap-1',
        meter: 'h-6 rounded-lg',
        labelList: 'mt-4',
        labelText: 'font-normal text-text-disabled text-xs',
      }"
    />

    <section id="detail-availability" class="grid grid-rows-1 grid-cols-12">
      <DashboardLowStock />
      <DashboardOutOfStock />
    </section>
  </section>
</template>
