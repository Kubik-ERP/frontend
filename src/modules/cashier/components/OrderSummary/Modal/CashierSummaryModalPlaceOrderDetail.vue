<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_handlePlaceOrderDetail, cashierOrderSummary_modalPlaceOrderDetail } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-place-order-detail">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalPlaceOrderDetail.show"
      modal
      :style="{ width: '34rem' }"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-place-order-detail-content" class="flex flex-col gap-6 p-6 h-full">
          <section
            id="cashier-summary-modal-place-order-detail-content-body"
            class="flex flex-col gap-5 flex-grow overflow-y-auto"
          >
            <div class="flex flex-col gap-2">
              <span class="text-lg font-semibold">Place Order</span>
              <span class="text-grayscale-70 text-sm">Enter payment amount</span>
            </div>

            <PrimeVueButton class="text-black border-primary-border bg-primary-background">
              <div class="flex justify-between w-full">
                <span>Payment Method</span>
                <div class="gap-1 font-semibold flex items-center">
                  <AppBaseSvg name="cash" class="!w-4 !h-4" />
                  Cash
                </div>
              </div>
            </PrimeVueButton>

            <div class="flex flex-col gap-1">
              <label for="payment-amount" class="text-sm">Payment Amount</label>

              <PrimeVueIconField class="flex w-full">
                <PrimeVueInputIcon>
                  <div class="flex gap-2">
                    <AppBaseSvg name="cash" class="!w-4 !h-4" />
                  </div>
                </PrimeVueInputIcon>
                <PrimeVueInputText
                  id="payment-amount"
                  readonly
                  class="w-full"
                  placeholder="Enter payment amount"
                />
              </PrimeVueIconField>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <span>Money Received</span>
                <span class="font-semibold">Rp 119.800.000</span>
              </div>
              <div class="flex justify-between">
                <span>Total Price</span>
                <span class="font-semibold">Rp 119.800.000</span>
              </div>

              <hr />

              <div class="flex justify-between">
                <span class="font-bold"> Change Amount </span>
                <span class="font-semibold text-primary"> Rp 0 </span>
              </div>
            </div>
            <div class="flex flex-col gap-2 justify-between"></div>
          </section>

          <div class="flex justify-end gap-4">
            <PrimeVueButton
              class="border-primary text-primary py-2.5 px-8"
              type="button"
              label="Cancel"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none text-white py-2.5 px-8"
              type="button"
              label="Place Order"
              @click="
                cashierOrderSummary_modalPlaceOrderDetail.show = false;
                cashierOrderSummary_handlePlaceOrderDetail();
              "
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
