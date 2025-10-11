<script setup lang="ts">
// Constant
import { CASHIER_ORDER_TYPE } from '../../constants';

// Components`
import CashierSummaryButtonOrderTable from './CashierSummaryButtonOrderTable.vue';

// Interfaces
import { AutoCompleteCompleteEvent } from 'primevue';
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';
import { ICashierOrderType } from '../../interfaces';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

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
  hasCustomerManagementPermission,

  cashierOrderSummary_handleModalAddCustomer,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <section id="cashier-summary-section" class="flex flex-col gap-2 p-4">
    <section id="cashier-summary-section-header" class="flex justify-between items-center">
      <span class="font-semibold text-lg">{{ useLocalization('cashier.orderSummary.orderSummary') }}</span>

      <PrimeVueButton
        text
        aria-haspopup="true"
        aria-controls="overlay_menu_summary_order"
        @click="cashierOrderSummary_menuOrder.toggle($event)"
      >
        <i class="pi pi-ellipsis-h text-primary"></i>

        <span class="text-text-disabled text-xs">{{ useLocalization('cashier.more') }}</span>
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
      <div v-if="hasCustomerManagementPermission" class="flex flex-col gap-2 w-full">
        <label for="username" class="text-sm">
          {{ useLocalization('cashier.mainSection.username') }}
          <span class="text-text-disabled">(Optional)</span>
        </label>

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
            class="w-full text-sm placeholder:text-sm"
            :placeholder="'Select Customer Name (Optional)'"
            :disabled="route.name === 'cashier-order-edit'"
            :virtual-scroller-options="{
              itemSize: 50,
              step: cashierProduct_customerState.limit,
              lazy: true,
              delay: 300,
              loading: cashierProduct_customerState.isLoading,
              onLazyLoad: cashierProduct_onScrollFetchMoreCustomers,
            }"
            :pt="{
              pcInputText: 'text-sm placeholder:text-sm',
              option: 'text-sm',
            }"
            @complete="(event: AutoCompleteCompleteEvent) => cashierProduct_onSearchCustomer(event.query)"
          >
            <template #option="slotProps">
              <div class="flex gap-1 text-xs w-full items-center">
                <div class="flex flex-col w-full">
                  <div class="font-semibold text-sm">{{ slotProps.option.name }}</div>
                  <span class="text-xs text-text-disabled">{{ slotProps.option.email }}</span>
                </div>
                <div class="text-xs">({{ slotProps.option.code }}) {{ slotProps.option.number }}</div>
              </div>
            </template>

            <template #empty>
              <div class="flex flex-col items-center justify-center p-4 h-full">
                <p class="font-semibold text-sm text-black">No customer found</p>
              </div>
            </template>

            <template #footer>
              <div class="px-1 py-1">
                <PrimeVueButton
                  label="Add New"
                  fluid
                  text
                  severity="secondary"
                  size="small"
                  icon="pi pi-plus"
                  class="text-sm"
                  @click="cashierOrderSummary_handleModalAddCustomer(null)"
                />
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
        <div class="flex items-center gap-1">
          <AppBaseSvg name="order-primary" class="h-4 w-4 text-primary tinted-by-css" />

          <span class="text-primary text-sm font-semibold">
            {{
              CASHIER_ORDER_TYPE.find(
                (f: ICashierOrderType) => f.code === cashierOrderSummary_modalOrderType.selectedOrderType,
              )?.label || 'Order Type'
            }}
          </span>
        </div>

        <div v-if="hasCustomerManagementPermission" class="flex items-center gap-1 ">
          <AppBaseSvg name="table-primary" class="h-4 w-4 text-primary tinted-by-css" />

          <span
            v-if="cashierOrderSummary_modalSelectTable.selectedTable.length > 0"
            class="text-primary text-sm font-semibold"
          >
            {{ cashierOrderSummary_modalSelectTable.selectedTable.toString() }}
          </span>
        </div>
      </div>

      <div
        class="relative flex justify-center items-center w-full border-b-2 border-b-grayscale-10 cursor-pointer"
        @click="cashierOrderSummary_handleIsExpandedToggle"
      >
        <div class="absolute top-full rounded-full p-1 bg-white -translate-y-1/2 px-1">
          <AppBaseSvg
            :name="cashierOrderSummary_data.isExpanded ? 'chevron-up' : 'chevron-down'"
            class="h-4 w-4 tinted-by-css"
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

input {
  font-size: 14px !important;
}
</style>
