<script setup lang="ts">
// Components
import CashierFilterByCategory from './CashierFilterByCategory.vue';
import CashierSearchProductCategory from './CashierSearchProductCategory.vue';
import CashierModalAddEditProduct from './ListProduct/CashierModalAddEditProduct.vue';
import CashierChangeView from './ListProduct/CashierChangeView.vue';
import CashierMobileButtonCategory from './OrderSummary/CashierMobileButtonCategory.vue';
import CashierMobileButtonCheckout from './OrderSummary/CashierMobileButtonCheckout.vue';
import CashierModalCategory from './ListProduct/CashierModalCategory.vue';
import CashierSummaryModalOrderSummary from './OrderSummary/Modal/CashierSummaryModalOrderSummary.vue';
import CashierListProduct from './ListProduct/CashierListProduct.vue';
</script>

<template>
  <section
    id="cashier-main-section"
    class="col-span-12 xl:col-span-8 lg:col-span-6 h-full overflow-y-auto flex flex-col gap-4 px-4 lg:px-10 py-6"
  >
    <CashierSearchProductCategory />

    <CashierFilterByCategory />

    <CashierChangeView />

    <section id="cashier-main-section-list-product" class="flex flex-col overflow-y-auto flex-grow">
      <CashierListProduct />
    </section>

    <CashierModalAddEditProduct />

    <CashierModalCategory />

    <CashierSummaryModalOrderSummary />

    <CashierMobileButtonCategory />

    <CashierMobileButtonCheckout />
  </section>
</template>

<style scoped>
/* Adjust scrollbar */
#cashier-main-section {
  scrollbar-width: thin;
  scrollbar-color: var(--color-grayscale-10) var(--color-grayscale-5);
}
</style>
