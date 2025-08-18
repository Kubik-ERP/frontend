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
        <span>{{ useLocalization('cashier.orderSummary.subTotal') }}</span>
        <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: cashierOrderSummary_calculateEstimation?.data?.subTotal || 0,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

            <div
        v-if="cashierOrderSummary_calculateEstimation.data.voucherAmount"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >Voucher


          <span >({{ useLocalization('cashier.orderSummary.included') }})</span></span
        >

        <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">
          - {{
            useCurrencyFormat({
              data: cashierOrderSummary_calculateEstimation.data.voucherAmount,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="cashierOrderSummary_calculateEstimation.data.tax"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >{{ useLocalization('cashier.orderSummary.tax') }}
          <span v-if="cashierOrderSummary_calculateEstimation.data.taxInclude"
            >({{ useLocalization('cashier.orderSummary.included') }})</span
          >
          <span v-else>({{ useLocalization('cashier.orderSummary.excluded') }})</span></span
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
          >{{ useLocalization('cashier.orderSummary.service') }}

          <span v-if="cashierOrderSummary_calculateEstimation.data.serviceChargeInclude"
            >({{ useLocalization('cashier.orderSummary.included') }})</span
          >
          <span v-else>({{ useLocalization('cashier.orderSummary.excluded') }})</span></span
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
      <span>{{ useLocalization('cashier.orderSummary.total') }}</span>
      <span v-if="!cashierOrderSummary_calculateEstimation.isLoading">{{
        useCurrencyFormat({
          data: cashierOrderSummary_calculateEstimation?.data?.grandTotal || 0,
        })
      }}</span>
      <PrimeVueSkeleton v-else width="6rem" />
    </div>
  </section>
</template>
