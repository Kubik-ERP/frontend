<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

// Components
import CashierSummaryProductList from '../CashierSummaryProductList.vue';
import CashierSummaryPromoPayment from '../CashierSummaryPromoPayment.vue';
import CashierSummaryTotal from '../CashierSummaryTotal.vue';
import CashierSummaryButtonOrderTable from '../CashierSummaryButtonOrderTable.vue';

// Route
import { useRoute } from 'vue-router';
import { AutoCompleteCompleteEvent } from 'primevue';
const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_modalOrderSummary,
  cashierOrderSummary_handleModalAddCustomer,
  cashierOrderSummary_handleSaveUnpaidOrder,
  cashierProduct_customerState,
  cashierOrderSummary_modalMenuOrderItem,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_calculateEstimation,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierProduct_onSearchCustomer,
  cashierOrderSummary_isButtonPlaceOrderDisabled,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_isLoadingUnpaidOrder,
  cashierOrderSummary_modalSelectTable,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-order-summary">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalOrderSummary.show"
      :dismissable-mask="true"
      modal
      class="w-screen h-screen rounded-none relative p-0 m-0 max-h-dvh overflow-y-auto"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-order-summary" class="flex flex-col bg-[#F9FAFB]">
          <section
            id="cashier-summary-modal-order-summary-header"
            class="p-4 bg-white flex items-center justify-between"
          >
            <div class="flex items-center gap-2" @click="cashierOrderSummary_modalOrderSummary.show = false">
              <AppBaseSvg name="chevron-left" class="!h-4 !w-4 cursor-pointer" @click="closeCallback" />
              <span class="text-lg font-semibold">{{ useLocalization('cashier.mainSection.cart') }}</span>
            </div>

            <section id="status" class="flex lg:hidden items-center gap-2">
              <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
              <span class="font-normal text-disabled text-xs">{{
                useLocalization('cashier.mainSection.online')
              }}</span>
            </section>
          </section>

          <hr class="border-b border-grayscale-10" />

          <section
            id="cashier-summary-modal-order-summary-customer-detail"
            class="flex flex-col gap-2 p-4 bg-white"
          >
            <span class="font-semibold text-sm">{{ useLocalization('cashier.mainSection.customerDetails') }}</span>

            <div class="flex flex-col text-sm">
              <span class="text-text-disabled font-normal">{{
                useLocalization('cashier.mainSection.tableNo')
              }}</span>

              <span>{{ cashierOrderSummary_modalSelectTable.selectedTable.toString() }}</span>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label for="username" class="text-sm">{{ useLocalization('cashier.mainSection.username') }}</label>

              <PrimeVueIconField v-if="route.name !== 'self-order'" class="flex w-full">
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
                  dropdown
                  class="w-full text-sm"
                  placeholder="Please select Customer Name"
                  :disabled="route.name === 'cashier-order-edit'"
                  :virtual-scroller-options="{
                    itemSize: 50,
                    step: cashierProduct_customerState.limit,
                    lazy: true,
                    delay: 300,
                    loading: cashierProduct_customerState.isLoading,
                    onLazyLoad: cashierProduct_onScrollFetchMoreCustomers,
                  }"
                  @complete="(event: AutoCompleteCompleteEvent) => cashierProduct_onSearchCustomer(event.query)"
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
                      <PrimeVueButton
                        label="Add New"
                        fluid
                        text
                        severity="secondary"
                        size="small"
                        icon="pi pi-plus"
                        @click="cashierOrderSummary_handleModalAddCustomer(null)"
                      />
                    </div>
                  </template>
                </PrimeVueAutoComplete>
              </PrimeVueIconField>

              <PrimeVueIconField v-else class="flex w-full">
                <PrimeVueInputText
                  :value="cashierProduct_customerState.selectedCustomer?.name"
                  class="w-full text-sm"
                  placeholder="Please select Customer Name"
                  disabled
                >
                </PrimeVueInputText>
              </PrimeVueIconField>
            </div>
          </section>

          <CashierSummaryButtonOrderTable
            :is-self-order="!(route.name === 'cashier' || route.name === 'cashier-order-edit')"
          />

          <hr class="border-b border-grayscale-10" />

          <section class="flex flex-col gap-2">
            <span class="text-sm font-semibold mb-2 px-4 mt-4">{{
              useLocalization('cashier.mainSection.orderItem')
            }}</span>

            <CashierSummaryProductList />
          </section>

          <CashierSummaryPromoPayment />

          <CashierSummaryTotal />
        </section>

        <section
          id="cashier-summary-modal-order-summary-footer"
          class="bottom-0 w-full flex flex-col gap-2 p-4 bg-white border-t border-grayscale-10"
        >
          <div class="flex justify-between items-center">
            <div class="flex gap-2 items-center">
              <AppBaseSvg name="cash" class="!h-6 !w-6" />
              <span v-if="!cashierOrderSummary_calculateEstimation.isLoading" class="font-semibold text-sm">{{
                useCurrencyFormat({
                  data: cashierOrderSummary_calculateEstimation?.data?.grandTotal || 0,
                })
              }}</span>
            </div>

            <PrimeVueButton
              text
              aria-haspopup="true"
              aria-controls="overlay_menu_summary_order"
              @click="cashierOrderSummary_modalMenuOrderItem.show = true"
            >
              <i class="pi pi-ellipsis-h text-primary"></i>
            </PrimeVueButton>
          </div>

          <PrimeVueButton
            v-if="route.name === 'cashier' || route.name === 'cashier-order-edit'"
            v-slot="slotProps"
            as-child
            outlined
            class="w-full border-primary"
            @click="cashierOrderSummary_handleSaveUnpaidOrder"
          >
            <RouterLink :to="{ name: 'invoice' }" v-bind="slotProps" class="p-3 w-full border border-primary">
              <section class="flex gap-2 justify-center w-full items-center">
                <AppBaseSvg name="order-primary" class="filter-primary-color h-5 w-5" />
                <span class="font-semibold text-primary truncate">{{
                  useLocalization('cashier.mainSection.saveUnpaidOrder')
                }}</span>
              </section>
            </RouterLink>
          </PrimeVueButton>

          <PrimeVueButton
            :disabled="
              cashierOrderSummary_isButtonPlaceOrderDisabled ||
              cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod === '' ||
              cashierOrderSummary_isLoadingUnpaidOrder
            "
            class="bg-primary border-none py-2.5 px-14"
            type="button"
            label="Place Order"
            @click="cashierOrderSummary_modalPlaceOrderConfirmation.show = true"
          ></PrimeVueButton>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
