<script setup lang="ts">
// Components
import InvoicePaperCashierInvoice from '../components/paper/InvoicePaperCashierInvoice.vue';

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
  invoice_modalPay,
  invoice_otherOptions,
  invoice_invoiceDataValidation,

  invoice_handleDownload,
  invoice_handlePrint,
  invoice_handleOtherOptions,
  invoice_handlePayInvoice,
  invoice_handleSimulatePayment,
} = useInvoiceService();

provide<IInvoiceProvided>('invoice', {
  invoice_activeInvoice,
  invoice_invoiceData,
  invoice_modalPay,
  invoice_otherOptions,
  invoice_invoiceDataValidation,

  invoice_handleDownload,
  invoice_handlePrint,
  invoice_handleOtherOptions,
  invoice_handlePayInvoice,
  invoice_handleSimulatePayment,
});
</script>

<template>
  <section id="invoice" class="mx-auto w-full">
    <InvoicePaperCashierInvoice />
  </section>
</template>
