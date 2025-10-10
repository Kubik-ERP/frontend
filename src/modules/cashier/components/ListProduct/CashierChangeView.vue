<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';

// Variables
const listView: { name: string; value: 'image' | 'grid' | 'inline' }[] = [
  {
    name: 'list-image',
    value: 'image',
  },
  {
    name: 'list-grid',
    value: 'grid',
  },
  {
    name: 'list-inline',
    value: 'inline',
  },
];

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_selectedView } = inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <section id="cashier-change-view" class="justify-start w-full flex gap-4 lg:justify-end">
    <AppBaseSvg
      v-for="item in listView"
      :key="item"
      class="!h-6 !w-6 cursor-pointer hover:opacity-90 active:opacity-75"
      :class="cashierProduct_selectedView === item.value ? 'tinted-by-css' : ''"
      :name="cashierProduct_selectedView === item.value ? item.name + '-active' : item.name"
      @click="cashierProduct_selectedView = item.value"
    />
  </section>
</template>
