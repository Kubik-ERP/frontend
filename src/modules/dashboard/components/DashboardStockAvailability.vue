<script setup lang="ts">
// Components
import DashboardLowStock from './DashboardLowStock.vue';
import DashboardOutOfStock from './DashboardOutOfStock.vue';

const value = ref([
  { label: 'Available', color: '#8CC8EB', value: 56 },
  { label: 'Low Stock', color: '#FFB84D', value: 32 },
  { label: 'Out of Stock', color: '#E57171', value: 12 },
]);
</script>

<template>
  <section
    id="dashboard-stock-availability"
    class="flex flex-col bg-white border border-solid border-grayscale-10 p-4 gap-4 rounded-sm"
  >
    <h5 class="font-semibold text-base lg:text-lg text-grayscale-70">Stock Availability</h5>

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
