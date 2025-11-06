<script setup lang="ts">
// emits
const emit = defineEmits(['print', 'download']);

// Interface
import { IInvoiceProvided } from '../interfaces/index';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData, invoice_modalPay } = inject<IInvoiceProvided>('invoice')!;
</script>
<template>
  <section
    id="invoice-footer"
    class="lg:hidden w-full flex flex-col gap-2 p-4 bg-white border-t border-grayscale-10 col-span-full"
  >
    <!-- <PrimeVueButton outlined class="w-full border-primary" @click="emit('download')">
        <section class="flex gap-2 justify-center w-full items-center">
          <AppBaseSvg name="download" class="filter-primary-color h-5 w-5" />
          <span class="font-semibold text-primary truncate">Download</span>
        </section>
      </PrimeVueButton> -->

    <section id="primary-buttons" class="flex items-center gap-4 w-full">
      <PrimeVueButton
        v-if="invoice_invoiceData?.data?.paymentStatus !== 'unpaid'"
        class="w-full py-4"
        severity="secondary"
        variant="outlined"
        @click="emit('download')"
      >
        <template #default>
          <section id="content" class="flex items-center gap-2">
            <AppBaseSvg name="download" class="filter-primary-color w-6 h-6" />
            <span class="font-semibold text-primary text-sm">Download</span>
          </section>
        </template>
      </PrimeVueButton>

      <PrimeVueButton
        v-else
        class="w-full py-4 bg-primary"
        severity="primary"
        variant="outlined"
        @click="invoice_modalPay.show = true"
      >
        <template #default>
          <section id="content" class="flex items-center gap-2">
            <AppBaseSvg
              :name="invoice_invoiceData?.data?.paymentStatus !== 'unpaid' ? 'cash' : 'cash-white'"
              class="w-6 h-6"
            />
            <span class="font-semibold text-white text-sm">Pay Now</span>
          </section>
        </template>
      </PrimeVueButton>

      <!-- change from print to download -->
      <PrimeVueButton
        class="w-full py-4"
        :class="{
          'bg-primary border-none': invoice_invoiceData?.data?.paymentStatus !== 'unpaid',
          'bg-white border-primary': invoice_invoiceData?.data?.paymentStatus === 'unpaid',
        }"
        severity="primary"
        @click="emit('print', 'invoice')"
      >
        <template #default>
          <section id="content" class="flex items-center gap-2">
            <AppBaseSvg
              :name="invoice_invoiceData?.data?.paymentStatus !== 'unpaid' ? 'printer' : 'printer-primary'"
              class="w-6 h-6"
              :class="[
                invoice_invoiceData?.data?.paymentStatus !== 'unpaid'
                  ? 'filter-white-color'
                  : 'filter-primary-color',
              ]"
              color="primary"
            />
            <span
              class="font-semibold text-sm"
              :class="{
                'text-white': invoice_invoiceData?.data?.paymentStatus !== 'unpaid',
                'text-primary': invoice_invoiceData?.data?.paymentStatus === 'unpaid',
              }"
              >Print Invoice</span
            >
          </section>
        </template>
      </PrimeVueButton>
    </section>

    <PrimeVueButton
      class="py-4 px-14 bg-transparent border-primary"
      type="button"
      @click="emit('print', 'kitchen')"
    >
      <section class="flex gap-2 justify-center w-full items-center">
        <AppBaseSvg name="printer" class="filter-primary-color h-5 w-5" />
        <span class="font-semibold truncate text-primary">Print Kitchen Ticket</span>
      </section>
    </PrimeVueButton>

    <PrimeVueButton class="py-4 px-14 bg-transparent border-primary" type="button" @click="emit('print', 'table')">
      <section class="flex gap-2 justify-center w-full items-center">
        <AppBaseSvg name="printer" class="filter-primary-color h-5 w-5" />
        <span class="font-semibold truncate text-primary">Print Table Ticket</span>
      </section>
    </PrimeVueButton>
  </section>
</template>
