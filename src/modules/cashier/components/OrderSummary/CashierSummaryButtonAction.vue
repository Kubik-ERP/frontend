<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalPlaceOrderConfirmation } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-button-action" class="flex gap-4 px-4 pt-2">
    <PrimeVueButton v-slot="slotProps" as-child outlined>
      <RouterLink :to="{ name: 'invoice' }" v-bind="slotProps" class="p-3 w-1/2 border border-primary">
        <section class="flex gap-2 justify-center w-full items-center">
          <AppBaseSvg name="order-primary" class="!h-5 !w-5" />
          <span class="font-semibold text-primary">Save Unpaid Order</span>
        </section>
      </RouterLink>
    </PrimeVueButton>

    <PrimeVueButton
      label="Place Order"
      class="p-3 w-1/2 bg-primary border-primary"
      @click="cashierOrderSummary_modalPlaceOrderConfirmation.show = true"
    >
      <template #default>
        <section class="flex gap-2 justify-center w-full items-center">
          <span class="font-semibold text-xl text-white">Place Order</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
