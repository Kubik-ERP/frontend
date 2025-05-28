<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';

// Component
import CashierProductCard from './CashierProductCard.vue';
import CashierProductGrid from './CashierProductGrid.vue';
import CashierProductInline from './CashierProductInline.vue';

// Vue
import { computed } from 'vue';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_listDrink, cashierProduct_selectedView } =
  inject<ICashierProductProvided>('cashierProduct')!;

/**
 * @description Computed properties to determine which component to use
 */
const selectedComponent = computed(() => {
  const components = {
    image: CashierProductCard,
    grid: CashierProductGrid,
    inline: CashierProductInline,
  };

  return components[cashierProduct_selectedView.value] || null;
});

/**
 * @description Wrapper class for the list of products
 */
const wrapperClass = computed(() => {
  return {
    'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4':
      cashierProduct_selectedView.value === 'image' || cashierProduct_selectedView.value === 'grid',
    'flex flex-col gap-4': cashierProduct_selectedView.value === 'inline',
  };
});
</script>

<template>
  <section id="cashier-list-drink" class="flex flex-col gap-2">
    <h2 class="text-xs text-text-disabled">Drinks</h2>

    <section id="cahshier-list-wrapper-class" :class="wrapperClass">
      <component
        :is="selectedComponent"
        v-for="product in cashierProduct_listDrink"
        :key="product.productId"
        :product="product"
      />
    </section>
  </section>
</template>

<style scoped></style>
