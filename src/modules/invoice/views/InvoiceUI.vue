<script setup lang="ts">
// Components
import InvoiceHeader from '../components/InvoiceHeader.vue';
import InvoicePaper from '../components/InvoicePaper.vue';
import InvoiceStatus from '../components/InvoiceStatus.vue';
import InvoiceStatusMobile from '../components/InvoiceStatusMobile.vue';

// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Services
import { useInvoiceService } from '../services/useInvoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { invoice_activeInvoice, invoice_listInvoice } = useInvoiceService();

provide<IInvoiceProvided>('invoice', {
  invoice_activeInvoice,
  invoice_listInvoice,
});
</script>

<template>
  <section id="invoice" class="default-wrapper-fullscreen">
    <InvoiceHeader />

    <InvoiceStatusMobile />

    <section id="content" class="grid grid-rows-1 grid-cols-12 h-[calc(100dvh-4rem)]">
      <InvoicePaper />
      <InvoiceStatus />
    </section>
  </section>
</template>
