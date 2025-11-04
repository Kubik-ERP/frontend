<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_handlePlaceOrderConfirmation,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-place-order-confirmation">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalPlaceOrderConfirmation.show"
      modal
      :style="{ width: '31rem' }"
      class="m-2"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-place-order-confirmation-content" class="flex flex-col gap-6 p-6">
          <section
            id="cashier-summary-modal-place-order-confirmation-content-body"
            class="flex flex-col gap-4 items-center"
          >
            <AppBaseSvg name="confirmation" class="!w-14 !h-14" />

            <div class="flex flex-col gap-3 items-center">
              <span class="font-semibold text-base lg:text-lg">{{
                useLocalization('cashier.orderSummary.placeOrderConfirmation.title')
              }}</span>
              <div class="grid grid-cols-12 py-2.5 px-4 bg-secondary/10 rounded-xl">
                <AppBaseSvg name="info" class="w-5 h-5 col-span-1 mt-1 filter-black-color" />
                <span class="text-xs lg:text-sm text-black text-justify col-span-11">{{
                  useLocalization('cashier.orderSummary.placeOrderConfirmation.description')
                }}</span>
              </div>
            </div>
          </section>

          <div class="flex justify-end gap-6">
            <PrimeVueButton
              class="text-primary border-primary w-1/2 py-2.5 text-sm lg:text-base"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              :disabled="cashierOrderSummary_modalPlaceOrderDetail.isLoading"
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none w-1/2 py-2.5 text-sm lg:text-base"
              type="button"
              :label="useLocalization('cashier.orderSummary.placeOrderConfirmation.placeOrder')"
              :disabled="cashierOrderSummary_modalPlaceOrderDetail.isLoading"
              :loading="cashierOrderSummary_modalPlaceOrderDetail.isLoading"
              @click="cashierOrderSummary_handlePlaceOrderConfirmation()"
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
