<script setup lang="ts">
// Interfaces
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

// Components`
import CashierSummaryButtonOrderTable from './CashierSummaryButtonOrderTable.vue';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_menuOrderItem, cashierOrderSummary_data, cashierOrderSummary_menuOrder } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <section id="cashier-summary-section" class="flex flex-col gap-2 p-4">
    <section id="cashier-summary-section-header" class="flex justify-between items-center">
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
        :popup="true"
        :model="cashierOrderSummary_menuOrderItem"
      >
      </PrimeVueMenu>
    </section>

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

  <CashierSummaryButtonOrderTable />
</template>

<style>
.text-text-action-error .p-menu-item-content {
  color: var(--color-text-action-error) !important;
}
</style>
