<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

// Components
import CashierListFeaturedProduct from '../components/ListProduct/CashierListFeaturedProduct.vue';
import CashierListFood from '../components/ListProduct/CashierListFood.vue';
import CashierListDrink from '../components/ListProduct/CashierListDrink.vue';

// Services
import { useCashierProductService } from '../services/useCashierProduct.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { cashier_listDrink, cashier_listFeaturedProduct, cashier_listFood } = useCashierProductService();

/**
 * @description Provide all the data and methods what we need
 */
provide<ICashierProductProvided>('cashierProduct', {
  cashier_listDrink,
  cashier_listFeaturedProduct,
  cashier_listFood,
});
</script>

<template>
  <section
    id="cashier"
    class="grid-wrapper-fullscreen bg-background min-h-screen h-full default-wrapper-fullscreen"
  >
    <section id="cashier-main-section" class="col-span-8 px-10 py-6">
      <section id="cashier-content" class="flex flex-col gap-4">
        <section id="cashier-search-product-category">
          <!-- TODO: Search product name or category section -->
        </section>

        <section id="cashier-filter-by-category">
          <!-- TODO: Filter By Category -->
        </section>

        <section id="cashier-featured-product">
          <CashierListFeaturedProduct />
        </section>

        <section id="cashier-food">
          <CashierListFood />
        </section>

        <section id="cashier-drink">
          <CashierListDrink />
        </section>
      </section>
    </section>

    <section id="order-summary" class="col-span-4 bg-white w-full h-full">
      <!-- TODO: Order Summary -->
    </section>
  </section>
</template>

<style scoped></style>
