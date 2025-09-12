<script setup lang="ts">
// Constants
import { INVOICE_LIST_TAB } from '../constants/invoice.constant';

// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Components
import InvoicePaperCashierInvoice from './paper/InvoicePaperCashierInvoice.vue';
import InvoicePaperKitchenTicket from './paper/InvoicePaperKitchenTicket.vue';
import InvoicePaperTableTicket from './paper/InvoicePaperTableTicket.vue';

const { invoice_activeInvoice, invoice_handleDownload, invoice_handlePrint } =
  inject<IInvoiceProvided>('invoice')!;

/**
 * @description Ref for invoice paper
 */
const invoiceRef = ref<HTMLElement | null>(null);
const kitchenRef = ref<HTMLElement | null>(null);
const tableRef = ref<HTMLElement | null>(null);

/**
 * @description Print function
 */
const print = (type: string) => {
  invoice_handlePrint(type, invoiceRef.value!, kitchenRef.value!, tableRef.value!);
};

const download = () => {
  invoice_handleDownload(invoiceRef.value!, kitchenRef.value!, tableRef.value!);
};

/**
 * @description Define expose for print function
 */

defineExpose({ invoiceRef, kitchenRef, tableRef, print, download });
</script>

<template>
  <section
    id="box-paper"
    class="overflow-y-auto overflow-x-clip col-span-12 lg:col-span-8 h-full inset-0 z-0 bg-background flex justify-center p-6 w-full"
  >
    <section id="invoice-change-paper" class="max-w-screen md:max-w-xl">
      <PrimeVueTabs
        v-model:value="invoice_activeInvoice"
        class="flex items-center justify-center max-w-screen md:max-w-xl"
      >
        <PrimeVueTabList
          unstyled
          class="flex cursor-pointer mb-6 w-fit items-center justify-center p-2 bg-secondary-background rounded-md"
        >
          <PrimeVueTab
            v-for="(item, index) in INVOICE_LIST_TAB"
            :key="index"
            unstyled
            :value="item.id"
            :class="[
              'p-2 cursor-pointer rounded-md',
              invoice_activeInvoice === item.id
                ? 'bg-[#64C9B1] text-white font-semibold'
                : 'text-secondary-hover hover:bg-secondary/20',
            ]"
            >{{ item.name }}</PrimeVueTab
          >
        </PrimeVueTabList>
        <PrimeVueTabPanels>
          <PrimeVueTabPanel :value="1">
            <InvoicePaperCashierInvoice />
          </PrimeVueTabPanel>
          <PrimeVueTabPanel :value="2">
            <InvoicePaperKitchenTicket />
          </PrimeVueTabPanel>
          <PrimeVueTabPanel :value="3">
            <InvoicePaperTableTicket />
          </PrimeVueTabPanel>
        </PrimeVueTabPanels>
      </PrimeVueTabs>

      <Teleport to="body">
        <div
          ref="invoiceRef"
          class="print-invoice-paper hidden relative inset-0 mx-auto m-0 p-0 w-full items-center justify-center"
        >
          <InvoicePaperCashierInvoice />
        </div>

        <div
          ref="kitchenRef"
          class="print-invoice-paper hidden relative inset-0 mx-auto m-0 p-0 w-full items-center justify-center"
        >
          <InvoicePaperKitchenTicket />
        </div>

        <div
          ref="tableRef"
          class="print-invoice-paper hidden relative inset-0 mx-auto m-0 p-0 w-full items-center justify-center"
        >
          <InvoicePaperTableTicket />
        </div>
      </Teleport>
    </section>
  </section>
</template>
