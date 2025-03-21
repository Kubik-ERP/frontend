<script setup lang="ts">
// Components
import InvoiceHeader from '../components/InvoiceHeader.vue';
import InvoicePaper from '../components/InvoicePaper.vue';
import InvoiceStatus from '../components/InvoiceStatus.vue';
</script>

<template>
  <section id="invoice" class="default-wrapper-fullscreen">
    <InvoiceHeader />

    <section id="content" class="grid grid-rows-1 grid-cols-12">
      <InvoicePaper />
      <InvoiceStatus />
    </section>
  </section>
</template>
