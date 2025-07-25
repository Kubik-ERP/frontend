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
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalCancelOrder.show"
      modal
      :style="{ width: '32rem' }"
      class="m-2"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-cancel-order-content" class="flex flex-col gap-6 p-6">
          <section id="cashier-summary-modal-cancel-order-content-body" class="flex flex-col gap-4 items-center">
            <AppBaseSvg name="exclude" class="!w-14 !h-14" />

            <div class="flex flex-col gap-3 items-center">
              <span class="font-semibold text-base lg:text-lg">{{
                useLocalization('cashier.orderSummary.cancel.title')
              }}</span>
              <span class="text-xs lg:text-sm text-text-disabled">{{
                useLocalization('cashier.cancel.description')
              }}</span>
            </div>
          </section>

          <div class="flex justify-end gap-6">
            <PrimeVueButton
              class="text-text-action-error text-xs lg:text-base w-1/2 py-2.5"
              type="button"
              :label="useLocalization('cashier.orderSummary.cancel.cancelOrder')"
              variant="text"
              severity="danger"
              text
              @click="cashierOrderSummary_handleCancelOrder()"
            ></PrimeVueButton>

            <PrimeVueButton
              class="border-primary text-xs lg:text-base text-primary w-1/2 py-2.5"
              type="button"
              :label="useLocalization('cashier.close')"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
