<script setup lang="ts">
// Components
import CashierFilterByCategory from './CashierFilterByCategory.vue';
import CashierModalAddEditProduct from './ListProduct/CashierModalAddEditProduct.vue';
import CashierChangeView from './ListProduct/CashierChangeView.vue';
import CashierMobileButtonCategory from './OrderSummary/CashierMobileButtonCategory.vue';
import CashierMobileButtonCheckout from './OrderSummary/CashierMobileButtonCheckout.vue';
import CashierModalCategory from './ListProduct/CashierModalCategory.vue';
import CashierSummaryModalOrderSummary from './OrderSummary/Modal/CashierSummaryModalOrderSummary.vue';
import CashierListProduct from './ListProduct/CashierListProduct.vue';
import CashierQuickOverview from './CashierQuickOverview.vue';
</script>

<template>
  <section
    id="cashier-main-section"
    class="col-span-12 xl:col-span-8 lg:col-span-6 h-full flex flex-col gap-6 relative inset-0 z-0"
  >
    <CashierQuickOverview />

    <section id="content-container" class="px-10 pb-6">
      <CashierFilterByCategory />
      <CashierChangeView />

      <section id="cashier-main-section-list-product" class="flex flex-col overflow-y-auto flex-grow gap-4">
        <CashierListProduct />
      </section>

      <CashierModalAddEditProduct />
      <CashierModalCategory />
      <CashierSummaryModalOrderSummary />
      <CashierMobileButtonCategory />
      <CashierMobileButtonCheckout />
    </section>
  </section>
</template>

<style scoped>
/* Adjust scrollbar */
#cashier-main-section {
  scrollbar-width: thin;
  scrollbar-color: var(--color-grayscale-10) var(--color-grayscale-5);
}
</style>
