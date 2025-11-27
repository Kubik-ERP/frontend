<script setup lang="ts">
// Vue
import { computed, inject } from 'vue';

// Interfaces
import { ICashierOrderProvided } from '../../interfaces/cashier-order.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrder_calculateEstimation, cashierOrder_selectedLoyaltyBenefit } =
  inject<ICashierOrderProvided>('cashierOrder')!;

const loyaltyRedeemAmount = computed(() => cashierOrder_calculateEstimation.value?.data?.totalRedeemDiscount ?? 0);

const loyaltyPointUsage = computed(() => cashierOrder_selectedLoyaltyBenefit.value?.pointNeeds ?? 0);
</script>

<template>
  <section id="cashier-summary-total" class="p-4 border-b-2 border-b-grayscale-10">
    <div class="flex flex-col gap-1 pb-2 border-b-2 border-b-grayscale-10">
      <div class="flex justify-between text-sm font-semibold">
        <span>{{ useLocalization('cashier.orderSummary.subTotal') }}</span>
        <span v-if="!cashierOrder_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: cashierOrder_calculateEstimation?.data?.subTotal || 0,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="cashierOrder_calculateEstimation?.data?.discountTotal > 0"
        class="flex justify-between text-sm font-semibold"
      >
        <span>Discount Product</span>
        <span v-if="!cashierOrder_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data:
                cashierOrder_calculateEstimation?.data?.discountTotal > 0
                  ? -cashierOrder_calculateEstimation?.data?.discountTotal
                  : cashierOrder_calculateEstimation?.data?.discountTotal || 0,
            })
          }}
        </span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="cashierOrder_calculateEstimation.data.voucherAmount"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >Voucher

          <span>({{ useLocalization('cashier.orderSummary.included') }})</span></span
        >

        <span v-if="!cashierOrder_calculateEstimation.isLoading">
          -
          {{
            useCurrencyFormat({
              data: cashierOrder_calculateEstimation.data.voucherAmount,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="cashierOrder_calculateEstimation.data.tax"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >{{ useLocalization('cashier.orderSummary.tax') }}
          <span v-if="cashierOrder_calculateEstimation.data.taxInclude"
            >({{ useLocalization('cashier.orderSummary.included') }})</span
          >
          <span v-else>({{ useLocalization('cashier.orderSummary.excluded') }})</span></span
        >

        <span v-if="!cashierOrder_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: cashierOrder_calculateEstimation.data.tax,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
      <div
        v-if="cashierOrder_calculateEstimation.data.serviceCharge"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >{{ useLocalization('cashier.orderSummary.service') }}

          <span v-if="cashierOrder_calculateEstimation.data.serviceChargeInclude"
            >({{ useLocalization('cashier.orderSummary.included') }})</span
          >
          <span v-else>({{ useLocalization('cashier.orderSummary.excluded') }})</span></span
        >

        <span v-if="!cashierOrder_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data: cashierOrder_calculateEstimation.data.serviceCharge,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
      <div
        v-if="cashierOrder_calculateEstimation.data.roundingAdjustment"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span> Rounding </span>

        <span v-if="!cashierOrder_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data: cashierOrder_calculateEstimation.data.roundingAdjustment,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <!-- Loyalty Point Discount -->
      <div
        v-if="loyaltyRedeemAmount > 0"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span>Loyalty Point Discount</span>
        <span v-if="!cashierOrder_calculateEstimation.isLoading">
          -
          {{
            useCurrencyFormat({
              data: loyaltyRedeemAmount,
            })
          }}
        </span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <!-- Loyalty Point Usage -->
      <div
        v-if="loyaltyPointUsage > 0"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span>Point Usage</span>
        <span>-{{ loyaltyPointUsage }}</span>
      </div>
    </div>

    <div class="flex justify-between font-semibold pt-2">
      <span>{{ useLocalization('cashier.orderSummary.total') }}</span>
      <span v-if="!cashierOrder_calculateEstimation.isLoading">{{
        useCurrencyFormat({
          data: cashierOrder_calculateEstimation?.data?.grandTotal || 0,
        })
      }}</span>
      <PrimeVueSkeleton v-else width="6rem" />
    </div>
  </section>
</template>
