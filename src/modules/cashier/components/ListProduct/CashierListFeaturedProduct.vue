<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';

// Component
import CashierProductCard from './CashierProductCard.vue';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_listFeaturedProduct } = inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <section id="cashier-list-featured-product" class="flex flex-col gap-2">
    <h2 class="text-xs text-text-disabled">Featured Products</h2>
    <div class="product-list grid grid-cols-4 gap-4">
      <CashierProductCard
        v-for="product in cashierProduct_listFeaturedProduct"
        :key="product.id"
        :product="product"
      />
    </div>
  </section>
</template>

<style scoped></style>
