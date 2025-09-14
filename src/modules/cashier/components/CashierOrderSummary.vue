<script setup lang="ts">
// Components
import CashierSummaryButtonAction from './OrderSummary/CashierSummaryButtonAction.vue';
import CashierSummaryProductList from './OrderSummary/CashierSummaryProductList.vue';
import CashierSummaryPromoPayment from './OrderSummary/CashierSummaryPromoPayment.vue';
import CashierSummarySection from './OrderSummary/CashierSummarySection.vue';
import CashierSummaryTotal from './OrderSummary/CashierSummaryTotal.vue';

import CashierSummaryModalCancelOrder from './OrderSummary/Modal/CashierSummaryModalCancelOrder.vue';
import CashierSummaryModalInvoiceDetail from './OrderSummary/Modal/CashierSummaryModalInvoiceDetail.vue';
import CashierSummaryModalMoreOptionsMobile from './OrderSummary/Modal/CashierSummaryModalMoreOptionsMobile.vue';
import CashierSummaryModalOrderType from './OrderSummary/Modal/CashierSummaryModalOrderType.vue';
import CashierSummaryModalPaymentMethod from './OrderSummary/Modal/CashierSummaryModalPaymentMethod.vue';
import CashierSummaryModalPaymentQRIS from './OrderSummary/Modal/CashierSummaryModalPaymentQRIS.vue';
import CashierSummaryModalAddCustomer from './OrderSummary/Modal/CashierSummaryModalAddCustomer.vue';
import CashierSummaryModalPlaceOrderConfirmation from './OrderSummary/Modal/CashierSummaryModalPlaceOrderConfirmation.vue';
import CashierSummaryModalPlaceOrderDetail from './OrderSummary/Modal/CashierSummaryModalPlaceOrderDetail.vue';
import CashierSummaryModalSelectTable from './OrderSummary/Modal/CashierSummaryModalSelectTable.vue';
import CashierSummaryModalVoucher from './OrderSummary/Modal/CashierSummaryModalVoucher.vue';

// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalPlaceOrderDetail, cashierOrderSummary_handleSimulatePayment } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <section
    id="order-summary"
    class="hidden sticky inset-0 z-10 xl:col-span-4 lg:col-span-6 pb-4 overflow-y-auto bg-white w-full h-full lg:flex flex-col max-h-[120dvh]"
  >
    <CashierSummarySection />
    <CashierSummaryProductList />
    <CashierSummaryPromoPayment />
    <CashierSummaryTotal />
    <CashierSummaryButtonAction />

    <section id="order-summary-modal">
      <CashierSummaryModalCancelOrder />
      <CashierSummaryModalInvoiceDetail />

      <CashierSummaryModalOrderType />
      <CashierSummaryModalSelectTable v-if="route.name !== 'self-order'" />

      <CashierSummaryModalMoreOptionsMobile />

      <CashierSummaryModalVoucher />
      <CashierSummaryModalPaymentMethod />
      <CashierSummaryModalPlaceOrderDetail />
      <CashierSummaryModalPlaceOrderConfirmation />
      <CashierSummaryModalPaymentQRIS
        :modal-place-order-detail="{
          showModalPayment: cashierOrderSummary_modalPlaceOrderDetail.showModalPayment,
          data: cashierOrderSummary_modalPlaceOrderDetail.data,
        }"
        @simulate-payment="cashierOrderSummary_handleSimulatePayment"
      />
      <CashierSummaryModalAddCustomer />
    </section>
  </section>
</template>

<style scoped></style>
