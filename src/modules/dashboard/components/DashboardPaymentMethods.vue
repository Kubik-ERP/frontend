<script setup lang="ts">
import type { IDashboardProvided } from '../interfaces';
// inject
const { dashboard_values } = inject<IDashboardProvided>('dashboard')!;
dashboard_values.value.paymentMethods = [
  {
    label: 'Cash',
    value: 100000,
  },
  {
    label: 'Qris',
    value: 100000,
  },
  {
    label: 'Debit Card',
    value: 100000,
  },
  {
    label: 'Credit Card',
    value: 100000,
  },
];
</script>
<template>
  <section
    id="dashboard-top-paymentMethod"
    class="flex flex-col bg-white border border-solid border-grayscale-10 p-4 gap-4 rounded-sm h-full"
  >
    <h5 class="font-semibold text-lg text-grayscale-70">
      {{ useLocalization('dashboard.paymentMethods.title') }}
    </h5>
    <section id="list-paymentMethod" class="flex flex-col w-full">
      <section
        v-for="(paymentMethod, index) in dashboard_values.paymentMethods"
        id="paymentMethod-item"
        :key="index"
        class="flex items-center border-b border-solid border-grayscale-10 py-2 w-full"
      >
        <section id="paymentMethod-name" class="flex items-center w-full gap-2">
          <span class="w-1 h-4 rounded-md bg-primary-border"> &nbsp; </span>
          <span class="font-normal text-grayscale-70 text-base"> {{ paymentMethod.label }} </span>
        </section>

        <section id="amount" class="flex items-center gap-1">
          <span class="font-semibold text-primary text-sm">{{
            useCurrencyFormat({ data: paymentMethod.value })
          }}</span>
        </section>
      </section>
    </section>
  </section>
</template>
