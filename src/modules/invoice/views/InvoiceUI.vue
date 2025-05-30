<script setup lang="ts">
// Components
import InvoiceHeader from '../components/InvoiceHeader.vue';
import InvoicePaper from '../components/InvoicePaper.vue';
import InvoiceStatus from '../components/InvoiceStatus.vue';

import InvoiceSelfOrderHeader from '../components/self-order/InvoiceHeader.vue';
import InvoiceOrderInformation from '../components/self-order/InvoiceOrderInformation.vue';
import invoiceListProducts from '../components/self-order/InvoiceListProducts.vue';
import InvoiceTotal from '../components/self-order/InvoiceTotal.vue';
import InvoiceCustomerDetails from '../components/self-order/InvoiceCustomerDetails.vue';

import InvoiceStatusMobile from '../components/InvoiceStatusMobile.vue';
import InvoiceMobileButtonAction from '../components/InvoiceMobileButtonAction.vue';

// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Services
import { useInvoiceService } from '../services/useInvoice.service';

const route = useRoute();

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

const invoicePaperRef = ref();

const handlePrint = () => {
  invoicePaperRef.value?.print();
};

const handleDownload = () => {
  invoicePaperRef.value?.download();
};
</script>

<template>
  <section id="invoice" class="default-wrapper-fullscreen">
    <template v-if="route.name === 'invoice'">
      <InvoiceHeader />

      <InvoiceStatusMobile />

      <section id="content" class="relative grid grid-rows-1 grid-cols-12 h-[calc(100dvh-5rem)]">
        <InvoicePaper ref="invoicePaperRef" />
        <InvoiceStatus @download="handleDownload" @print="handlePrint" />
        <InvoiceMobileButtonAction @download="handleDownload" @print="handlePrint" />
      </section>
    </template>
    <template v-else>
      <InvoiceSelfOrderHeader />

      <section id="self-order-content" class="flex flex-col gap-2 relative bg-background h-full w-full">
        <InvoiceOrderInformation />
        <invoiceListProducts />
        <InvoiceTotal />
        <InvoiceCustomerDetails />
      </section>
    </template>
  </section>
</template>
