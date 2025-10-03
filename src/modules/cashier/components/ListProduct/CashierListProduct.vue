<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';

// Component
import CashierProductCard from './CashierProductCard.vue';
import CashierProductGrid from './CashierProductGrid.vue';
import CashierProductInline from './CashierProductInline.vue';
import CashierListProductNotFound from './CashierListProductNotFound.vue';

// Vue
import { computed } from 'vue';
import CashierCategoryNotFound from './CashierCategoryNotFound.vue';

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
  <template v-if="!cashierProduct_productState.isLoadingProduct">
    <template v-if="cashierProduct_productState.listProductCategory.length > 0">
      <section
        v-for="(item, index) in cashierProduct_productState.listProductCategory"
        id="cashier-list-featured-product"
        :key="index"
        class="flex flex-col gap-4"
      >
        <template v-if="item.items.length > 0">
          <h2 class="font-normal text-xs text-text-disabled">{{ item.category }}</h2>

          <section id="cashier-list-wrapper-class" :class="wrapperClass">
            <component
              :is="selectedComponent"
              v-for="product in item.items"
              :key="product.id"
              :product="product"
              :category="item.category"
              :stock="10"
            />
          </section>
        </template>
        <template v-else-if="item.items.length === 0 && cashierProduct_productState.selectedCategory === item.id">
          <CashierCategoryNotFound />
        </template>
      </section>
    </template>
    <template v-else>
      <CashierListProductNotFound />
    </template>
  </template>
  <template v-else>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <PrimeVueCard
        v-for="i in 5"
        :key="i"
        :unstyled="true"
        :pt="{
          body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2',
        }"
      >
        <template #content>
          <section class="flex flex-col gap-2 relative">
            <PrimeVueSkeleton height="98px" class="w-full rounded-sm" />

            <div
              class="absolute py-1 px-1.5 border border-primary-border bg-blue-primary left-0 ml-1 mt-1 rounded-full flex gap-2"
            >
              <PrimeVueSkeleton shape="circle" width="12px" height="12px" />
              <PrimeVueSkeleton width="40px" height="12px" />
            </div>

            <PrimeVueSkeleton height="32px" class="rounded-sm" />

            <div class="flex w-full mt-2 justify-between items-end">
              <PrimeVueSkeleton width="60px" height="20px" border-radius="9999px" />

              <div class="flex flex-col items-end">
                <PrimeVueSkeleton width="40px" height="12px" />
                <PrimeVueSkeleton width="60px" height="16px" />
              </div>
            </div>
          </section>
        </template>
      </PrimeVueCard>
    </div>
  </template>
</template>

<style scoped></style>
