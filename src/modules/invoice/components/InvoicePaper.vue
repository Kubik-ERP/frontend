<script setup lang="ts">
// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Components
import InvoiceCashierInvoice from './paper/InvoiceCashierInvoice.vue';
import InvoiceKitchenTicket from './paper/InvoiceKitchenTicket.vue';
import InvoiceTableTicket from './paper/InvoiceTableTicket.vue';

// HTML2PDF
import html2pdf from 'html2pdf.js';

const { invoice_activeInvoice, invoice_listInvoice } = inject<IInvoiceProvided>('invoice')!;

/**
 * @description Ref for invoice paper
 */
const invoiceRef = ref<HTMLElement | null>(null);

/**
 * @description Print function
 */
const print = () => {
  if (!invoiceRef.value) return;

  invoiceRef.value.classList.remove('hidden');
  invoiceRef.value.classList.add('flex');

  window.print();

  setTimeout(() => {
    invoiceRef?.value?.classList.add('hidden');
  }, 1000);
};

const download = () => {
  if (!invoiceRef.value) return;

  invoiceRef.value?.classList.remove('hidden');

  html2pdf()
    .from(invoiceRef.value)
    .set({
      margin: 0,
      filename: 'invoice.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    })
    .save()
    .then(() => {
      invoiceRef.value?.classList.add('hidden');
    });
};

/**
 * @description Define expose for print function
 */

defineExpose({ invoiceRef, print, download });
</script>

<template>
  <section
    id="box-paper"
    class="overflow-y-auto col-span-12 lg:col-span-8 h-full inset-0 z-0 bg-background flex justify-center p-6 w-full"
  >
    <section id="invoice-change-paper">
      <PrimeVueTabs v-model:value="invoice_activeInvoice" class="max-w-max lg:max-w-md">
        <PrimeVueTabList
          unstyled
          class="flex cursor-pointer mb-6 w-full max-w-md items-center justify-center p-2 bg-secondary-background rounded-xl"
        >
          <PrimeVueTab
            v-for="(item, index) in invoice_listInvoice"
            :key="index"
            unstyled
            :value="item.id"
            :class="[
              'p-2 mx-2 cursor-pointer rounded-xl text-[10px] lg:text-base',
              invoice_activeInvoice === item.id
                ? 'bg-[#64C9B1] text-white font-semibold'
                : 'text-secondary-hover hover:bg-secondary/20',
            ]"
            >{{ item.name }}</PrimeVueTab
          >
        </PrimeVueTabList>
        <PrimeVueTabPanels>
          <PrimeVueTabPanel :value="1">
            <InvoiceCashierInvoice />
          </PrimeVueTabPanel>
          <PrimeVueTabPanel :value="2">
            <InvoiceKitchenTicket />
          </PrimeVueTabPanel>
          <PrimeVueTabPanel :value="3">
            <InvoiceTableTicket />
          </PrimeVueTabPanel>
        </PrimeVueTabPanels>
      </PrimeVueTabs>

      <Teleport to="body">
        <div
          id="print-invoice-paper"
          ref="invoiceRef"
          class="hidden relative inset-0 mx-auto min-h-svh min-w-svw m-0 p-0 w-full h-full items-center justify-center"
        >
          <InvoiceCashierInvoice />
        </div>
      </Teleport>
    </section>
  </section>
</template>

<style scoped></style>
