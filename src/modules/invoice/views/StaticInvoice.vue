<script setup lang="ts">
// Components
import InvoicePaperCashierInvoice from '../components/paper/InvoicePaperCashierInvoice.vue';

// Services
import { useInvoiceService } from '../services/useInvoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  invoice_invoiceData,

  invoice_handleFetchInvoiceByOrderId,
} = useInvoiceService();

provide('invoice', {
  invoice_invoiceData,

  invoice_handleFetchInvoiceByOrderId,
});

const route = useRoute();
onMounted(async () => {
  await invoice_handleFetchInvoiceByOrderId(route.params.orderId as string);
});
</script>

<template>
  <section id="invoice" class="flex items-center justify-center bg-grayscale-10 min-h-screen">
    <InvoicePaperCashierInvoice />
  </section>
</template>
