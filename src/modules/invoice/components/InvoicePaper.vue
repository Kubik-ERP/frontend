<script setup lang="ts">
// Constants
import { INVOICE_LIST_TAB } from '../constants/invoice.constant';

// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Components
import InvoiceCashierInvoice from './paper/InvoiceCashierInvoice.vue';
import InvoiceKitchenTicket from './paper/InvoiceKitchenTicket.vue';
import InvoiceTableTicket from './paper/InvoiceTableTicket.vue';

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
const print = () => {
  invoice_handlePrint(invoiceRef.value!, kitchenRef.value!, tableRef.value!);
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
    class="overflow-y-auto col-span-12 lg:col-span-8 h-full inset-0 z-0 bg-background flex justify-center p-6 w-full"
  >
    <section id="invoice-change-paper">
      <PrimeVueTabs v-model:value="invoice_activeInvoice" class="max-w-max lg:max-w-md">
        <PrimeVueTabList
          unstyled
          class="flex cursor-pointer mb-6 w-full max-w-md items-center justify-center p-2 bg-secondary-background rounded-xl"
        >
          <PrimeVueTab
            v-for="(item, index) in INVOICE_LIST_TAB"
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
          ref="invoiceRef"
          class="print-invoice-paper hidden relative inset-0 mx-auto min-h-svh min-w-svw m-0 p-0 w-full h-full items-center justify-center"
        >
          <InvoiceCashierInvoice />
        </div>

        <div
          ref="kitchenRef"
          class="print-invoice-paper hidden relative inset-0 mx-auto min-h-svh min-w-svw m-0 p-0 w-full h-full items-center justify-center"
        >
          <InvoiceKitchenTicket />
        </div>

        <div
          ref="tableRef"
          class="print-invoice-paper hidden relative inset-0 mx-auto min-h-svh min-w-svw m-0 p-0 w-full h-full items-center justify-center"
        >
          <InvoiceTableTicket />
        </div>
      </Teleport>
    </section>
  </section>
</template>
