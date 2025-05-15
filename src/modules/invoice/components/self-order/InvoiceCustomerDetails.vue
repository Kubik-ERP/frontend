<template>
  <section id="invoice-customer-details" class="py-4 px-5 bg-white">
    <PrimeVueButton v-slot="slotProps" as-child class="w-full">
      <RouterLink :to="{ name: 'self-order' }" v-bind="slotProps" class="p-3 w-full border border-primary">
        Create New Order
      </RouterLink>
    </PrimeVueButton>
  </section>
</template>

<script setup lang="ts"></script>
