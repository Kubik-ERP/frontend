<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalMenuOrderItem, cashierOrderSummary_modalCancelOrder } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-more-options-mobile">
    <PrimeVueDrawer
      v-model:visible="cashierOrderSummary_modalMenuOrderItem.show"
      position="bottom"
      close-icon="h"
      class="rounded-t-4xl"
      style="height: auto"
    >
      <template #container>
        <div class="flex flex-col gap-6 p-6">
          <PrimeVueButton
            variant="text"
            class="flex justify-start text-start"
            severity="danger"
            @click="cashierOrderSummary_modalCancelOrder.show = true"
          >
            Cancel Order
          </PrimeVueButton>
        </div>
      </template>
    </PrimeVueDrawer>
  </section>
</template>
