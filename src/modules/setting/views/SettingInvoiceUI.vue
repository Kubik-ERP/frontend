<script setup lang="ts">
// Components
import InvoicePaper from '@/modules/invoice/components/InvoicePaper.vue';

// Services
import { useInvoiceService } from '@/modules/invoice/services/useInvoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const { invoice_activeInvoice, invoice_listInvoice } = useInvoiceService();

provide('invoice', {
  invoice_activeInvoice,
  invoice_listInvoice,
});
</script>

<template>
  <section id="setting-invoice" class="grid-wrapper gap-8">
    <section id="invoice-configuration" class="col-span-8 flex flex-col gap-2">
      <header class="flex items-center justify-between w-full">
        <h5 class="font-semibold text-black text-lg">Invoice Configuration</h5>

        <div class="flex items-center gap-2">
          <AppBaseSvg name="edit" />
          <span class="font-semibold text-primary text-sm"> Edit Invoice Config </span>
        </div>
      </header>
    </section>

    <section id="invoice-preview" class="col-span-4">
      <InvoicePaper />
    </section>
  </section>
</template>
