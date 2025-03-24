<script setup lang="ts">
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_menuOrderItem, cashierOrderSummary_data, cashierOrderSummary_menuOrder } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <section id="cashier-summary-section" class="flex flex-col gap-2 p-4">
    <div class="flex justify-between items-center">
      <span class="font-semibold text-lg">Order Summary</span>

      <PrimeVueButton
        text
        aria-haspopup="true"
        aria-controls="overlay_menu_summary_order"
        @click="cashierOrderSummary_menuOrder.toggle($event)"
      >
        <i class="pi pi-ellipsis-h text-primary"></i>

        <span class="text-text-disabled text-xs">More</span>
      </PrimeVueButton>

      <PrimeVueMenu
        id="overlay_menu_summary_order"
        ref="cashierOrderSummary_menuOrder"
        append-to="body"
        :model="cashierOrderSummary_menuOrderItem"
      >
      </PrimeVueMenu>
    </div>

    <div class="flex flex-col gap-2 w-full">
      <span class="text-text-disabled text-xs"
        >Order ID <span class="text-black">#{{ cashierOrderSummary_data.orderId }}</span></span
      >
      <label for="username" class="text-sm">Username</label>

      <PrimeVueIconField class="flex w-full">
        <PrimeVueInputIcon class="pi pi-user" />
        <PrimeVueInputText
          id="customer-name"
          v-model="cashierOrderSummary_data.customerName"
          class="w-full"
          placeholder="Please input Customer Name"
        />
      </PrimeVueIconField>
    </div>
  </section>

  <div class="border-t-2 border-t-grayscale-10">
    <div class="flex justify-between items-center p-4 gap-2">
      <button
        class="flex w-1/2 border cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 text-text-disabled border-text-disabled rounded-sm p-2.5 justify-between items-center"
      >
        Order Type

        <AppBaseSvg name="order" class="!h-5 !w-5" />
      </button>
      <button
        class="flex w-1/2 border cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 text-text-disabled border-text-disabled rounded-sm p-2.5 justify-between items-center"
      >
        Table No.

        <AppBaseSvg name="table" class="!h-5 !w-5" />
      </button>
    </div>
  </div>
</template>
