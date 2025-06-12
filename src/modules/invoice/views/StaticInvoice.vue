<script setup lang="ts">
// Components
import InvoiceCashierInvoice from '../components/paper/InvoiceCashierInvoice.vue';

// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Services
import { useInvoiceService } from '../services/useInvoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  invoice_activeInvoice,
  invoice_invoiceData,
  invoice_handleOtherOptions,
  invoice_handleDownload,
  invoice_handlePrint,
} = useInvoiceService();

provide<IInvoiceProvided>('invoice', {
  invoice_activeInvoice,

  invoice_invoiceData,

  invoice_handleDownload,
  invoice_handlePrint,
  invoice_handleOtherOptions,
});
</script>

<template>
  <section id="invoice" class="default-wrapper-fullscreen">
    <InvoiceCashierInvoice />
  </section>
</template>
