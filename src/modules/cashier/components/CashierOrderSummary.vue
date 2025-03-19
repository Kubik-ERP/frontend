<script setup lang="ts">
import CashierSummaryButtonAction from './OrderSummary/CashierSummaryButtonAction.vue';
import CashierSummaryProductList from './OrderSummary/CashierSummaryProductList.vue';
import CashierSummaryPromoPayment from './OrderSummary/CashierSummaryPromoPayment.vue';
import CashierSummarySection from './OrderSummary/CashierSummarySection.vue';
import CashierSummaryTotal from './OrderSummary/CashierSummaryTotal.vue';
</script>

<template>
  <section id="order-summary" class="col-span-4 pb-4 overflow-y-auto bg-white w-full h-full flex flex-col">
    <CashierSummarySection />
    <CashierSummaryProductList />
    <CashierSummaryPromoPayment />
    <CashierSummaryTotal />
    <CashierSummaryButtonAction />
  </section>
</template>

<style scoped></style>
