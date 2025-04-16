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
import CashierSummaryModalPlaceOrderConfirmation from './OrderSummary/Modal/CashierSummaryModalPlaceOrderConfirmation.vue';
import CashierSummaryModalPlaceOrderDetail from './OrderSummary/Modal/CashierSummaryModalPlaceOrderDetail.vue';
import CashierSummaryModalSelectTable from './OrderSummary/Modal/CashierSummaryModalSelectTable.vue';
import CashierSummaryModalVoucher from './OrderSummary/Modal/CashierSummaryModalVoucher.vue';
</script>

<template>
  <section
    id="order-summary"
    class="hidden xl:col-span-4 lg:col-span-6 pb-4 overflow-y-auto bg-white w-full h-full lg:flex flex-col"
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
      <CashierSummaryModalSelectTable />

      <CashierSummaryModalMoreOptionsMobile />

      <CashierSummaryModalVoucher />
      <CashierSummaryModalPaymentMethod />
      <CashierSummaryModalPlaceOrderDetail />
      <CashierSummaryModalPlaceOrderConfirmation />
    </section>
  </section>
</template>

<style scoped></style>
