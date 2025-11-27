<script setup lang="ts">
// Interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service.interface';

// Vue
import { ref } from 'vue';

// Variables
const containerRef = ref<HTMLElement | null>(null);
let isDown = false;
let startX: number;
let scrollLeft: number;

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_productState, cashierProduct_handleSelectCategory } =
  inject<ICashierProductProvided>('cashierProduct')!;

/**
 * @description Start dragging the category container
 * @param {PointerEvent} e
 */
const startDragging = (e: PointerEvent) => {
  isDown = true;
  startX = e.pageX - (containerRef.value?.offsetLeft ?? 0);
  scrollLeft = containerRef.value?.scrollLeft ?? 0;
};

/**
 * @description Stop dragging the category container
 */
const stopDragging = () => {
  isDown = false;
};

/**
 * @description Move the category container
 * @param {PointerEvent} e
 */
const moveDragging = (e: PointerEvent) => {
  if (!isDown || !containerRef.value) return;
  e.preventDefault();
  const x = e.pageX - containerRef.value.offsetLeft;
  const walk = (x - startX) * 1.5;
  containerRef.value.scrollLeft = scrollLeft - walk;
};

const imageUrl = (image: string) => {
  return APP_BASE_BUCKET_URL + image;
};

/**
 * @description Get modal category from product service
 */
const { cashierProduct_modalCategory } = inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <!-- Desktop category filter (horizontal scrolling) -->
  <section id="cashier-filter-by-category" class="hidden lg:flex flex-col gap-4 mb-6 mt-2">
    <h2 class="font-normal text-xs text-text-disabled">
      {{ useLocalization('cashier.mainSection.filterByCategory') }}
    </h2>

    <section
      id="cashier-filter-by-category-card"
      ref="containerRef"
      class="flex gap-4 overflow-x-auto whitespace-nowrap cursor-grab select-none"
      @pointerdown="startDragging"
      @pointerleave="stopDragging"
      @pointerup="stopDragging"
      @pointermove="moveDragging"
    >
      <PrimeVueCard
        v-for="category in cashierProduct_productState.listCategory"
        :key="category.id"
        :unstyled="true"
        :pt="{
          body: 'bg-white border border-grayscale-10 shadow-none drop-shadow-none p-4 rounded-2xl hover:border-grayscale-20 active:bg-grayscale-10/5',
        }"
        class="flex-shrink-0 w-[calc(100%/4)] xl:w-[calc(100%/7)] cursor-pointer"
        :class="{
          'border-primary-border border rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]':
            cashierProduct_productState.selectedCategory === category.id,
        }"
        @click="cashierProduct_handleSelectCategory(category.id)"
      >
        <template #content>
          <section id="cashier-card-content" class="flex flex-col gap-3">
            <AppBaseImage
              :src="imageUrl(category.pictureUrl)"
              :alt="category.category"
              class="h-8 w-8 rounded-full object-cover pointer-events-none"
            />

            <p class="font-semibold text-sm text-grayscale-70 line-clamp-2">
              {{ category.category }}
            </p>
          </section>
        </template>
      </PrimeVueCard>

      <!-- Product Bundles Card -->
      <PrimeVueCard
        :unstyled="true"
        :pt="{
          body: 'bg-white border border-grayscale-10 shadow-none drop-shadow-none p-4 rounded-2xl hover:border-grayscale-20 active:bg-grayscale-10/5',
        }"
        class="flex-shrink-0 w-[calc(100%/4)] xl:w-[calc(100%/7)] cursor-pointer"
        :class="{
          'border-primary-border border rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]':
            cashierProduct_productState.selectedCategory === 'bundle',
        }"
        @click="cashierProduct_handleSelectCategory('bundle')"
      >
        <template #content>
          <section id="cashier-card-content" class="flex flex-col gap-3 items-center">
            <AppBaseImage
              src="/images/icons/package.svg"
              alt="Product Bundles"
              class="h-8 w-8 rounded-full object-cover pointer-events-none"
            />
            <p class="font-semibold text-sm text-grayscale-70 line-clamp-2 text-center">
              Product Bundles
            </p>
          </section>
        </template>
      </PrimeVueCard>
    </section>
  </section>

  <!-- Mobile category button (sticky) -->
  <section
    id="cashier-mobile-button-category"
    class="lg:hidden sticky z-10 inset-x-0 bottom-20 -my-6 flex items-center justify-center"
  >
    <PrimeVueButton
      variant="outlined"
      severity="primary"
      class="bg-white rounded-full border-primary"
      @click="cashierProduct_modalCategory.show = true"
    >
      <div class="flex gap-2 items-center">
        <AppBaseSvg name="catalog" class="filter-primary-color h-4 w-5" />

        <span class="font-semibold text-sm text-primary">{{
          useLocalization('cashier.categoryOrShowBundles')
        }}</span>
      </div>
    </PrimeVueButton>
  </section>
</template>

<style scoped>
#cashier-filter-by-category-card {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
