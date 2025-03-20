<script setup lang="ts">
// Components
import CashierFilterByCategory from './CashierFilterByCategory.vue';
import CashierSearchProductCategory from './CashierSearchProductCategory.vue';
import CashierAddEditProduct from './ListProduct/CashierAddEditProduct.vue';
import CashierChangeView from './ListProduct/CashierChangeView.vue';
import CashierListDrink from './ListProduct/CashierListDrink.vue';
import CashierListFeaturedProduct from './ListProduct/CashierListFeaturedProduct.vue';
import CashierListFood from './ListProduct/CashierListFood.vue';
</script>

<template>
  <section id="cashier-main-section" class="col-span-8 h-full overflow-y-auto flex flex-col gap-4 px-10 py-6">
    <CashierSearchProductCategory />

    <CashierFilterByCategory />

    <CashierChangeView />

    <section id="cashier-main-section-list-product" class="flex flex-col overflow-y-auto flex-grow">
      <CashierListFeaturedProduct />

      <CashierListFood />

      <CashierListDrink />
    </section>

    <CashierAddEditProduct />
  </section>
</template>

<style scoped>
/* Adjust scrollbar */

#cashier-main-section {
  scrollbar-width: thin;
  scrollbar-color: var(--color-grayscale-10) var(--color-grayscale-5);
}
</style>
