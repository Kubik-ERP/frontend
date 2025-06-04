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
const { cashierProduct_productState, cashierProduct_selectedView } =
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
  <template v-if="cashierProduct_productState.searchProduct">
    <section id="cashier-list-product-wrapper-class" :class="wrapperClass">
      <component
        :is="selectedComponent"
        v-for="product in cashierProduct_productState.listProductSearch"
        :key="product.id"
        :product="product"
        :category="product?.categoriesHasProducts?.[0]?.categories.category || ''"
      />
    </section>
  </template>
  <template v-else>
    <section
      v-for="(item, index) in cashierProduct_productState.listProductCategory"
      id="cashier-list-featured-product"
      :key="index"
      class="flex flex-col gap-2"
    >
      <template v-if="item.categoriesHasProducts.length > 0">
        <h2 class="text-xs text-text-disabled">{{ item.category }}</h2>

        <section id="cashier-list-wrapper-class" :class="wrapperClass">
          <component
            :is="selectedComponent"
            v-for="product in item.categoriesHasProducts"
            :key="product.productsId"
            :product="product.products"
            :category="item.category"
          />
        </section>
      </template>
    </section>
  </template>
</template>

<style scoped></style>
