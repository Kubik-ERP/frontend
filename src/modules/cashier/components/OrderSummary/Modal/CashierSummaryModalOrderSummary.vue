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
const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_modalOrderSummary,
  cashierOrderSummary_data,
  cashierOrderSummary_modalMenuOrderItem,
  cashierOrderSummary_modalPlaceOrderConfirmation,
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

              <span>A1</span>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <label for="username" class="text-sm">{{ useLocalization('cashier.mainSection.username') }}</label>

              <PrimeVueInputText
                id="customer-name"
                v-model="cashierOrderSummary_data.customerName"
                class="w-full"
                placeholder="Please input Customer Name"
              />
            </div>
          </section>

          <CashierSummaryButtonOrderTable />

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
              <span class="font-semibold text-sm">Rp.120.000</span>
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

          <PrimeVueButton v-if="route.name === 'cashier'" v-slot="slotProps" as-child outlined class="w-full">
            <RouterLink :to="{ name: 'invoice' }" v-bind="slotProps" class="p-3 w-full border border-primary">
              <section class="flex gap-2 justify-center w-full items-center">
                <AppBaseSvg name="order-primary" class="!h-5 !w-5" />
                <span class="font-semibold text-primary truncate">{{
                  useLocalization('cashier.mainSection.saveUnpaidOrder')
                }}</span>
              </section>
            </RouterLink>
          </PrimeVueButton>

          <PrimeVueButton
            class="py-2.5 px-14"
            type="button"
            label="Place Order"
            @click="cashierOrderSummary_modalPlaceOrderConfirmation.show = true"
          ></PrimeVueButton>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
