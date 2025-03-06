<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

// Components
import CashierListFeaturedProduct from '../components/ListProduct/CashierListFeaturedProduct.vue';

// Services
import { useCashierProductService } from '../services/useCashierProduct.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { cashier_drink, cashier_featured_product, cashier_food } = useCashierProductService();

/**
 * @description Provide all the data and methods what we need
 */
provide<ICashierProductProvided>('cashierProduct', {
  cashier_drink,
  cashier_featured_product,
  cashier_food,
});
</script>

<template>
  <section id="cashier" class="grid-wrapper-fullscreen bg-background default-wrapper-fullscreen">
    <section id="cashier-main-section" class="col-span-9 px-10 py-6">
      <section id="cashier-content">
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
          <!-- TODO: Featured Food -->
        </section>
      </section>
    </section>

    <section id="order-summary" class="col-span-3 bg-white w-full h-full">
      <!-- TODO: Order Summary -->
    </section>
  </section>
</template>

<style scoped></style>
