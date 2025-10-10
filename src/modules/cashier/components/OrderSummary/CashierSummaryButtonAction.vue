<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_isButtonPlaceOrderDisabled,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_isLoadingUnpaidOrder,
  cashierOrderSummary_handleSaveUnpaidOrder,
  cashierOrderSummary_handleEditOrder,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-button-action" class="flex gap-4 px-4 pt-2">
    <template v-if="route.name === 'cashier-order-edit'">
      <PrimeVueButton
        label="Place Order"
        class="p-3 w-full bg-primary border-primary"
        :disabled="cashierOrderSummary_isButtonPlaceOrderDisabled || cashierOrderSummary_isLoadingUnpaidOrder"
        @click="cashierOrderSummary_handleEditOrder()"
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
        :disabled="cashierOrderSummary_isButtonPlaceOrderDisabled || cashierOrderSummary_isLoadingUnpaidOrder"
        :loading="cashierOrderSummary_isLoadingUnpaidOrder"
        @click="cashierOrderSummary_handleSaveUnpaidOrder()"
      >
        <section class="flex gap-2 justify-center w-full items-center">
          <AppBaseSvg name="order-primary" class="h-5 w-5 tinted-by-css" />
          <span class="font-semibold text-primary truncate">{{
            useLocalization('cashier.mainSection.saveUnpaidOrder')
          }}</span>
        </section>
      </PrimeVueButton>

      <PrimeVueButton
        label="Place Order"
        class="p-3 w-1/2 bg-primary border-primary"
        :disabled="
          cashierOrderSummary_isButtonPlaceOrderDisabled ||
          cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod === '' ||
          cashierOrderSummary_isLoadingUnpaidOrder
        "
        @click="cashierOrderSummary_modalPlaceOrderConfirmation.show = true"
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
