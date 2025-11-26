<script setup lang="ts">
// Interfaces
import type { ICashierOrderProvided } from '@/modules/cashier/interfaces/cashier-order.interface';
import type { ICashierPaymentProvided } from '@/modules/cashier/interfaces/cashier-payment.interface';
import type { ICashierProductProvided } from '@/modules/cashier/interfaces/cashier-product-service.interface';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrder_calculateEstimation,
  cashierOrder_handleEditOrder,
  cashierOrder_isButtonPlaceOrderDisabled,
  cashierOrder_isLoadingUnpaidOrder,
  cashierOrder_modalOrderSummary,
  cashierOrder_modalPlaceOrderConfirmation,
} = inject<ICashierOrderProvided>('cashierOrder')!;

const { cashierPayment_handleSaveUnpaidOrder, cashierPayment_modalPaymentMethod } =
  inject<ICashierPaymentProvided>('cashierPayment')!;

const { cashierProduct_selectedProduct } = inject<ICashierProductProvided>('cashierProduct')!;
</script>
<template>
  <!-- Mobile sticky checkout button (bottom) -->
  <section
    id="cashier-mobile-button-checkout"
    class="block lg:hidden sticky z-10 inset-x-0 bottom-0 bg-white p-4"
  >
    <PrimeVueButton
      class="border-none bg-primary w-full text-white py-2.5 px-4"
      type="button"
      label="Place Order"
      :disabled="cashierProduct_selectedProduct.length === 0"
      @click="cashierOrder_modalOrderSummary.show = true"
    >
      <template #default>
        <section class="flex gap-2 justify-between w-full items-center">
          <div class="flex gap-2 items-center">
            <AppBaseSvg name="cart" class="filter-white-color h-4 w-5" />
            <span class="font-semibold text-sm text-white"
              >{{ cashierProduct_selectedProduct.length }} {{ useLocalization('cashier.items') }}</span
            >
          </div>
          <span
            v-if="!cashierOrder_calculateEstimation.isLoading"
            class="font-semibold text-sm text-white"
            >{{
              useCurrencyFormat({
                data: cashierOrder_calculateEstimation?.data?.grandTotal || 0,
              })
            }}</span
          >
        </section>
      </template>
    </PrimeVueButton>
  </section>

  <!-- Desktop action buttons (right sidebar) -->
  <section id="cashier-desktop-button-action" class="hidden lg:flex gap-4 px-4 pt-2">
    <template v-if="route.name === 'cashier-order-edit'">
      <PrimeVueButton
        label="Place Order"
        class="p-3 w-full bg-primary border-primary"
        :disabled="cashierOrder_isButtonPlaceOrderDisabled || cashierOrder_isLoadingUnpaidOrder"
        @click="cashierOrder_handleEditOrder()"
      >
        <template #default>
          <section class="flex gap-2 justify-center w-full items-center">
            <span class="font-semibold text-xl text-white">{{
              useLocalization('cashier.orderSummary.editOrder')
            }}</span>
          </section>
        </template>
      </PrimeVueButton>
    </template>

    <template v-else>
      <PrimeVueButton
        class="p-3 w-1/2 border border-primary"
        outlined
        :disabled="cashierOrder_isButtonPlaceOrderDisabled || cashierOrder_isLoadingUnpaidOrder"
        :loading="cashierOrder_isLoadingUnpaidOrder"
        @click="cashierPayment_handleSaveUnpaidOrder()"
      >
        <section class="flex gap-2 justify-center w-full items-center">
          <AppBaseSvg name="order-primary" class="h-5 w-5 filter-primary-color" />
          <span class="font-semibold text-primary truncate">{{
            useLocalization('cashier.mainSection.saveUnpaidOrder')
          }}</span>
        </section>
      </PrimeVueButton>

      <PrimeVueButton
        label="Place Order"
        class="p-3 w-1/2 bg-primary border-primary"
        :disabled="
          cashierOrder_isButtonPlaceOrderDisabled ||
          cashierPayment_modalPaymentMethod.selectedPaymentMethod === '' ||
          cashierOrder_isLoadingUnpaidOrder
        "
        @click="cashierOrder_modalPlaceOrderConfirmation.show = true"
      >
        <template #default>
          <section class="flex gap-2 justify-center w-full items-center">
            <span class="font-semibold text-base text-white">{{
              useLocalization('cashier.orderSummary.placeOrder')
            }}</span>
          </section>
        </template>
      </PrimeVueButton>
    </template>
  </section>
</template>
