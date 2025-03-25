<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalVoucher, cashierOrderSummary_modalPaymentMethod } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <section id="cashier-summary-promo-payment" class="border-b-2 border-b-grayscale-10 p-2">
    <div class="flex w-full p-2 gap-4 bg-primary-background">
      <PrimeVueButton
        class="w-1/2 py-2 border border-primary-border text-primary"
        outlined
        @click="cashierOrderSummary_modalVoucher.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <span class="font-semibold"> Promo / Voucher </span>

            <AppBaseSvg name="voucher" class="!h-5 !w-5" />
          </section>
        </template>
      </PrimeVueButton>
      <PrimeVueButton
        class="w-1/2 py-2 border border-primary-border text-primary"
        outlined
        @click="cashierOrderSummary_modalPaymentMethod.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <span class="font-semibold"> Payment Method </span>

            <i class="pi pi-chevron-right" />
          </section>
        </template>
      </PrimeVueButton>
    </div>
  </section>
</template>
