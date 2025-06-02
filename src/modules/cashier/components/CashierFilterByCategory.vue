<script setup lang="ts">
// Interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

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
const { cashierProduct_listCategory, cashierProduct_handleSelectCategory, cashierProduct_selectedCategory } =
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
</script>

<template>
  <section id="cashier-filter-by-category" class="hidden lg:flex flex-col gap-2 mb-6 mt-2">
    <h2 class="text-xs text-text-disabled">Filter by Category</h2>
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
        v-for="category in cashierProduct_listCategory"
        :key="category.id"
        :unstyled="true"
        :pt="{
          body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2 hover:border-grayscale-20 active:bg-grayscale-10/5',
        }"
        class="flex-shrink-0 w-[calc(100%/4)] xl:w-[calc(100%/7)] cursor-pointer"
        :class="{
          'border-primary-border border rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]':
            cashierProduct_selectedCategory.includes(category.name),
        }"
        @click="cashierProduct_handleSelectCategory(category.name)"
      >
        <template #content>
          <section id="cashier-card-content" class="flex flex-col gap-[3px]">
            <img :src="category.image" class="h-10 w-10 rounded-full object-cover pointer-events-none" />

            <p class="font-semibold text-sm line-clamp-2">
              {{ category.name }}
            </p>

            <p class="text-text-disabled text-xs">{{ category.total }} items</p>
          </section>
        </template>
      </PrimeVueCard>
    </section>
  </section>
</template>

<style scoped>
#cashier-filter-by-category-card {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>
