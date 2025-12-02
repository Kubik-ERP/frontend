<script setup lang="ts">
// Vue
import { computed, inject } from 'vue';

// Interfaces
import { ISelfOrderProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_calculateEstimation, selfOrder_selectedLoyaltyBenefit } =
  inject<ISelfOrderProvided>('selfOrder')!;

const loyaltyRedeemAmount = computed(() => selfOrder_calculateEstimation.value?.data?.totalRedeemDiscount ?? 0);

const loyaltyPointUsage = computed(() => selfOrder_selectedLoyaltyBenefit.value?.pointNeeds ?? 0);
</script>

<template>
  <section id="self-order-summary-total" class="p-4 border-b-2 border-b-grayscale-10">
    <div class="flex flex-col gap-1 pb-2 border-b-2 border-b-grayscale-10">
      <div class="flex justify-between text-sm font-semibold">
        <span>{{ useLocalization('cashier.orderSummary.subTotal') }}</span>
        <span v-if="!selfOrder_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: selfOrder_calculateEstimation?.data?.subTotal || 0,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="selfOrder_calculateEstimation?.data?.discountTotal > 0"
        class="flex justify-between text-sm font-semibold"
      >
        <span>Discount Product</span>
        <span v-if="!selfOrder_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data:
                selfOrder_calculateEstimation?.data?.discountTotal > 0
                  ? -selfOrder_calculateEstimation?.data?.discountTotal
                  : selfOrder_calculateEstimation?.data?.discountTotal || 0,
            })
          }}
        </span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="selfOrder_calculateEstimation.data.voucherAmount"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >Voucher

          <span>({{ useLocalization('cashier.orderSummary.included') }})</span></span
        >

        <span v-if="!selfOrder_calculateEstimation.isLoading">
          -
          {{
            useCurrencyFormat({
              data: selfOrder_calculateEstimation.data.voucherAmount,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>

      <div
        v-if="selfOrder_calculateEstimation.data.tax"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >{{ useLocalization('cashier.orderSummary.tax') }}
          <span v-if="selfOrder_calculateEstimation.data.taxInclude"
            >({{ useLocalization('cashier.orderSummary.included') }})</span
          >
          <span v-else>({{ useLocalization('cashier.orderSummary.excluded') }})</span></span
        >

        <span v-if="!selfOrder_calculateEstimation.isLoading">{{
          useCurrencyFormat({
            data: selfOrder_calculateEstimation.data.tax,
          })
        }}</span>
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
      <div
        v-if="selfOrder_calculateEstimation.data.serviceCharge"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span
          >{{ useLocalization('cashier.orderSummary.service') }}

          <span v-if="selfOrder_calculateEstimation.data.serviceChargeInclude"
            >({{ useLocalization('cashier.orderSummary.included') }})</span
          >
          <span v-else>({{ useLocalization('cashier.orderSummary.excluded') }})</span></span
        >

        <span v-if="!selfOrder_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data: selfOrder_calculateEstimation.data.serviceCharge,
            })
          }}</span
        >
        <PrimeVueSkeleton v-else width="6rem" />
      </div>
      <div
        v-if="selfOrder_calculateEstimation.data.roundingAdjustment"
        class="flex justify-between text-sm text-text-disabled"
      >
        <span> Rounding </span>

        <span v-if="!selfOrder_calculateEstimation.isLoading">
          {{
            useCurrencyFormat({
              data: selfOrder_calculateEstimation.data.roundingAdjustment,
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
        <span v-if="!selfOrder_calculateEstimation.isLoading">
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
      <span v-if="!selfOrder_calculateEstimation.isLoading">{{
        useCurrencyFormat({
          data: selfOrder_calculateEstimation?.data?.grandTotal || 0,
        })
      }}</span>
      <PrimeVueSkeleton v-else width="6rem" />
    </div>
  </section>
</template>
