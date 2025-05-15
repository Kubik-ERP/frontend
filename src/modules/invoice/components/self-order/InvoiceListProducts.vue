<script setup lang="ts">
// Components
import InvoiceProduct from './InvoiceProduct.vue';
</script>

<template>
  <section id="invoice-list-products" class="w-full flex flex-col gap-2 p-4 bg-white">
    <div class="flex flex-col gap-1">
      <span class="font-semibold text-sm">Order Item</span>
    </div>

    <div class="flex flex-col gap-2 w-full">
      <InvoiceProduct />
      <InvoiceProduct />
      <InvoiceProduct />
    </div>

    <div class="flex w-full justify-center">
      <span class="text-sm text-primary font-semibold">Show Less</span>
    </div>
  </section>
</template>
