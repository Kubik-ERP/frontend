<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_handleCancelOrder, cashierOrderSummary_modalCancelOrder } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-cancel-order">
    <PrimeVueDialog v-model:visible="cashierOrderSummary_modalCancelOrder.show" modal :style="{ width: '32rem' }">
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-cancel-order-content" class="flex flex-col gap-6 p-6">
          <section id="cashier-summary-modal-cancel-order-content-body" class="flex flex-col gap-4 items-center">
            <AppBaseSvg name="exclude" class="!w-14 !h-14" />

            <div class="flex flex-col gap-3 items-center">
              <span class="font-semibold text-lg">Are you sure want to cancel this order?</span>
              <span class="text-sm text-text-disabled">All selected items will be removed</span>
            </div>
          </section>

          <div class="flex justify-end gap-6">
            <PrimeVueButton
              class="text-text-action-error w-1/2 py-2.5 px-14"
              type="button"
              label="Cancel Order"
              text
              @click="cashierOrderSummary_handleCancelOrder()"
            ></PrimeVueButton>

            <PrimeVueButton
              class="border-primary text-primary w-1/2 py-2.5 px-14"
              type="button"
              label="Close"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
