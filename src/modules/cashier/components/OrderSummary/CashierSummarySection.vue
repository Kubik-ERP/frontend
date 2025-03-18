<script setup lang="ts">
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_data } = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <section id="cashier-summary-section" class="flex flex-col gap-2 p-4">
    <div class="flex justify-between items-center">
      <span class="font-semibold text-lg">Order Summary</span>

      <PrimeVueButton text>
        <i class="pi pi-ellipsis-h text-primary"></i>

        <span class="text-text-disabled text-xs">More</span>
      </PrimeVueButton>
    </div>

    <div class="flex flex-col gap-2 w-full">
      <span class="text-text-disabled text-xs"
        >Order ID <span class="text-black">#{{ cashierOrderSummary_data.orderId }}</span></span
      >
      <label for="username" class="text-sm">Username</label>

      <PrimeVueIconField class="flex w-full">
        <PrimeVueInputIcon class="pi pi-user" />
        <PrimeVueInputText
          class="w-full"
          id="customer-name"
          v-model="cashierOrderSummary_data.customerName"
          placeholder="Please input Customer Name"
        />
      </PrimeVueIconField>
    </div>
  </section>

  <div class="border-t-2 border-t-grayscale-10">
    <div class="flex justify-between items-center p-4 gap-2">
      <PrimeVueButton outlined class="w-1/2 border border-grayscale-30">Order Type</PrimeVueButton>
      <PrimeVueButton outlined class="w-1/2 border border-grayscale-30">Table No</PrimeVueButton>
    </div>
  </div>
</template>
