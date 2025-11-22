<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <section id="invoice-customer-details" class="py-4 px-5 bg-white">
    <PrimeVueButton v-slot="slotProps" as-child class="w-full">
      <RouterLink
        :to="{
          name: 'self-order',
          query: {
            ...route.query,
          },
        }"
        v-bind="slotProps"
        class="p-3 w-full border bg-primary border-primary"
      >
        Create New Order
      </RouterLink>
    </PrimeVueButton>
  </section>
</template>
