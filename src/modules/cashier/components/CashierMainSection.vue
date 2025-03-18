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
  <section id="cashier-main-section" class="col-span-8 h-full overflow-x-auto flex flex-col gap-4 px-10 py-6">
    <CashierSearchProductCategory />

    <CashierFilterByCategory />

    <CashierChangeView />

    <CashierListFeaturedProduct />

    <CashierListFood />

    <CashierListDrink />

    <CashierAddEditProduct />
  </section>
</template>

<style scoped></style>
