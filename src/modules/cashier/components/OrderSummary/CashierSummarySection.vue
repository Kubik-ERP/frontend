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
  cashierProduct_customerState,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierProduct_onSearchCustomer,
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

          <PrimeVueAutoComplete
            v-model="cashierProduct_customerState.selectedCustomer"
            :suggestions="cashierProduct_customerState.customerList"
            :options="cashierProduct_customerState.customerList"
            :field="'name'"
            :option-value="'id'"
            :option-value-key="'id'"
            option-label="name"
            :min-length="1"
            :loading="cashierProduct_customerState.isLoading"
            :dropdown="true"
            class="w-full"
            placeholder="Please select Customer Name"
            :virtual-scroller-options="{
              itemSize: 50,
              step: cashierProduct_customerState.limit,
              lazy: true,
              delay: 300,
              loading: cashierProduct_customerState.isLoading,
              onLazyLoad: cashierProduct_onScrollFetchMoreCustomers,
            }"
            @complete="event => cashierProduct_onSearchCustomer(event.query)"
          >
            <template #option="slotProps">
              <div class="flex gap-1 text-xs w-full items-center">
                <div class="flex flex-col w-full">
                  <div class="font-semibold">{{ slotProps.option.name }}</div>
                  <span class="text-[10px] text-text-disabled">{{ slotProps.option.email }}</span>
                </div>
                <div class="text-[10px]">({{ slotProps.option.code }}) {{ slotProps.option.number }}</div>
              </div>
            </template>

            <template #footer>
              <div class="px-1 py-1">
                <PrimeVueButton label="Add New" fluid severity="secondary" text size="small" icon="pi pi-plus" />
              </div>
            </template>
          </PrimeVueAutoComplete>
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
