<script setup lang="ts">
// Components
import SelfOrderFilterByCategory from './SelfOrderFilterByCategory.vue';
import SelfOrderModalAddEditProduct from './ListProduct/SelfOrderModalAddEditProduct.vue';
import SelfOrderChangeView from './ListProduct/SelfOrderChangeView.vue';
import SelfOrderModalCategory from './ListProduct/SelfOrderModalCategory.vue';
import SelfOrderSearchProductCategory from './SelfOrderSearchProductCategory.vue';
import SelfOrderSummaryModalOrderSummary from './OrderSummary/Modal/SelfOrderSummaryModalOrderSummary.vue';
import SelfOrderListProduct from './ListProduct/SelfOrderListProduct.vue';
</script>

<template>
  <section
    id="self-order-main-section"
    class="col-span-12 xl:col-span-8 lg:col-span-6 h-full flex flex-col gap-6 relative inset-0 z-0"
  >
    <section
      id="self-order-quick-overview"
      class="default-wrapper bg-white static xl:sticky inset-0 z-10 gap-4 px-10 py-6"
    >
      <SelfOrderSearchProductCategory />
    </section>

    <section id="content-container" class="px-10 pb-6">
      <SelfOrderFilterByCategory />
      <SelfOrderChangeView />

      <section id="self-order-main-section-list-product" class="flex flex-col overflow-y-auto flex-grow gap-4">
        <SelfOrderListProduct />
      </section>

      <SelfOrderModalAddEditProduct />
      <SelfOrderModalCategory />
      <SelfOrderSummaryModalOrderSummary />
    </section>
  </section>
</template>

<style scoped>
/* Adjust scrollbar */
#self-order-main-section {
  scrollbar-width: thin;
  scrollbar-color: var(--color-grayscale-10) var(--color-grayscale-5);
}
</style>
