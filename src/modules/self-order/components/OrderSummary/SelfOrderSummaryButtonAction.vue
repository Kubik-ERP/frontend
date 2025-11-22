<script setup lang="ts">
// Interface
import { ISelfOrderProvided } from '@/modules/self-order/interfaces';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_modalPlaceOrderConfirmation,
  selfOrder_isButtonPlaceOrderDisabled,
  selfOrder_modalPaymentMethod,
  selfOrder_isLoadingUnpaidOrder,
  selfOrder_handleSaveUnpaidOrder,
  selfOrder_handleEditOrder,
  selfOrder_modalOrderSummary,
  selfOrder_selectedProduct,
  selfOrder_calculateEstimation,
} = inject<ISelfOrderProvided>('selfOrder')!;
</script>
<template>
  <!-- Mobile Version: Sticky button at bottom (visible only on mobile) -->
  <section
    id="self-order-mobile-button-checkout"
    class="block lg:hidden fixed z-20 inset-x-0 bottom-0 bg-white p-4 shadow-lg"
  >
    <PrimeVueButton
      class="border-none bg-primary w-full text-white py-2.5 px-4"
      type="button"
      label="View Order"
      :disabled="selfOrder_selectedProduct.length === 0"
      @click="selfOrder_modalOrderSummary.show = true"
    >
      <template #default>
        <section class="flex gap-2 justify-between w-full items-center">
          <div class="flex gap-2 items-center">
            <AppBaseSvg name="cart" class="filter-white-color h-4 w-5" />
            <span class="font-semibold text-sm text-white">
              {{ selfOrder_selectedProduct.length }} {{ useLocalization('cashier.items') }}
            </span>
          </div>
          <span
            v-if="!selfOrder_calculateEstimation.isLoading"
            class="font-semibold text-sm text-white"
          >
            {{
              useCurrencyFormat({
                data: selfOrder_calculateEstimation?.data?.grandTotal || 0,
              })
            }}
          </span>
        </section>
      </template>
    </PrimeVueButton>
  </section>

  <!-- Desktop Version: Action buttons in sidebar (visible only on desktop) -->
  <section id="self-order-summary-button-action" class="hidden lg:flex gap-4 px-4 pt-2">
    <template v-if="route.name === 'self-order-order-edit'">
      <PrimeVueButton
        label="Place Order"
        class="p-3 w-full bg-primary border-primary"
        :disabled="selfOrder_isButtonPlaceOrderDisabled || selfOrder_isLoadingUnpaidOrder"
        @click="selfOrder_handleEditOrder()"
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
        :disabled="selfOrder_isButtonPlaceOrderDisabled || selfOrder_isLoadingUnpaidOrder"
        :loading="selfOrder_isLoadingUnpaidOrder"
        @click="selfOrder_handleSaveUnpaidOrder()"
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
          selfOrder_isButtonPlaceOrderDisabled ||
          selfOrder_modalPaymentMethod.selectedPaymentMethod === '' ||
          selfOrder_isLoadingUnpaidOrder
        "
        @click="selfOrder_modalPlaceOrderConfirmation.show = true"
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
