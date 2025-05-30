<script setup lang="ts">
// Interfaces
import { CASHIER_ORDER_TYPE } from '../../constants';
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

// Components`
import CashierSummaryButtonOrderTable from './CashierSummaryButtonOrderTable.vue';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_menuOrderItem,
  cashierOrderSummary_data,
  cashierOrderSummary_menuOrder,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_handleIsExpandedToggle,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
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

    <section
      v-if="cashierOrderSummary_data.isExpanded"
      id="cashier-summary-section-order-item"
      class="flex flex-col gap-2"
    >
      <div class="flex flex-col gap-2 w-full">
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

      <CashierSummaryButtonOrderTable />
    </section>

    <div
      v-if="!cashierOrderSummary_data.isExpandedVisible"
      class="border-b-0 lg:border-b-2 border-b-grayscale-10"
    ></div>
    <div v-else>
      <div class="flex gap-2 mb-2">
        <div class="flex items-center gap-1 p-1 bg-primary-background">
          <AppBaseSvg name="order-primary" class="!h-4 !w-4 text-primary" />

          <span class="text-primary font-semibold">
            {{
              CASHIER_ORDER_TYPE.find(f => f.code === cashierOrderSummary_modalOrderType.selectedOrderType)
                ?.label || 'Order Type'
            }}
          </span>
        </div>

        <div class="flex items-center gap-1 p-1 bg-primary-background">
          <AppBaseSvg name="table-primary" class="!h-4 !w-4 text-primary" />

          <span
            v-if="cashierOrderSummary_modalSelectTable.selectedTable.length > 0"
            class="text-primary font-semibold"
          >
            {{ cashierOrderSummary_modalSelectTable.selectedTable.toString() }}
          </span>
        </div>
      </div>

      <div
        class="relative flex justify-center items-center w-full border-b-2 border-b-grayscale-10 cursor-pointer"
        @click="cashierOrderSummary_handleIsExpandedToggle"
      >
        <div class="absolute top-full rounded-full p-1 bg-primary-background -translate-y-1/2 px-1">
          <AppBaseSvg
            :name="cashierOrderSummary_data.isExpanded ? 'chevron-up' : 'chevron-down'"
            class="!h-4 !w-4 text-text-disabled"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style>
.text-text-action-error .p-menu-item-content {
  color: var(--color-text-action-error) !important;
}
</style>
