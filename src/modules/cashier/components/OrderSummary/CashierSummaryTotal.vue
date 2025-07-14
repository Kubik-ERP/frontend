<script setup lang="ts">
// Interfaces
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_calculateEstimation } = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <section id="cashier-summary-total" class="p-4 border-b-2 border-b-grayscale-10">
    <div class="flex flex-col gap-1 pb-2 border-b-2 border-b-grayscale-10">
      <div class="flex justify-between text-sm font-semibold">
        <span>Sub Total</span>
        <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: cashierOrderSummary_calculateEstimation?.data?.total || 0,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
      <div
        v-if="cashierOrderSummary_calculateEstimation.data.tax"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >Tax
          <span v-if="cashierOrderSummary_calculateEstimation.data.taxInclude">(included)</span>
          <span v-else>(excluded)</span></span
        >

        <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: cashierOrderSummary_calculateEstimation.data.tax,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
      <div
        v-if="cashierOrderSummary_calculateEstimation.data.serviceCharge"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >Service

          <span v-if="cashierOrderSummary_calculateEstimation.data.serviceChargeInclude">(included)</span>
          <span v-else>(excluded)</span></span
        >

        <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data: cashierOrderSummary_calculateEstimation.data.serviceCharge,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
    </div>

    <div class="flex justify-between font-semibold pt-2">
      <span>Total</span>
      <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">{{
        useCurrencyFormat({
          data: cashierOrderSummary_calculateEstimation?.data?.grandTotal || 0,
        })
      }}</span>
      <PrimeVueSkeleton v-else width="6rem" />
    </div>
  </section>
</template>
