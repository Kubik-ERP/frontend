<script setup lang="ts">
// Interfaces
import type { IInvoiceProvided } from '../interfaces/index';

// Components
import InvoiceCashierInvoice from './paper/InvoiceCashierInvoice.vue';
import InvoiceKitchenTicket from './paper/InvoiceKitchenTicket.vue';
import InvoiceTableTicket from './paper/InvoiceTableTicket.vue';

const { invoice_activeInvoice, invoice_listInvoice } = inject<IInvoiceProvided>('invoice')!;
</script>

<template>
  <section
    id="box-paper"
    class="col-span-12 lg:col-span-8 h-full inset-0 z-0 bg-background flex justify-center p-6 w-full"
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
    </section>
  </section>
</template>

<style scoped></style>
