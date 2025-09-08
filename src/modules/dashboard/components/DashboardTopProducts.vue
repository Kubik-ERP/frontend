<script setup lang="ts">
import type { IDashboardProvided } from '../interfaces';
// inject
const { dashboard_values } = inject<IDashboardProvided>('dashboard')!;
</script>
<template>
  <section
    id="dashboard-top-products"
    class="col-span-full lg:col-span-4 flex flex-col bg-white border border-solid border-grayscale-10 p-4 gap-4 rounded-sm"
  >
    <h5 class="font-semibold text-lg text-grayscale-70">Top Products</h5>

    <section id="list-products" class="flex flex-col w-full">
      <section
        v-for="(product, index) in dashboard_values.productSales"
        id="product-item"
        :key="index"
        class="flex items-center border-b border-solid border-grayscale-10 py-2 w-full"
      >
        <section id="product-name" class="flex items-center w-full gap-2">
          <span class="w-1 h-4 rounded-md bg-primary-border"> &nbsp; </span>

          <span class="font-normal text-grayscale-70 text-base"> {{ product.name }} </span>
        </section>

        <section id="amount" class="flex items-center gap-1">
          <span class="font-semibold text-primary text-sm">{{ product.quantity }}</span>
          <span class="font-normal text-text-disabled text-sm">sales</span>
        </section>
      </section>
    </section>
  </section>
</template>
