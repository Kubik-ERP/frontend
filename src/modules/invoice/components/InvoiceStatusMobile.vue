<script setup lang="ts">
// Constant
import { INVOICE_PAYMENT_STATUS } from '../constants/invoice.constant';
import { IInvoiceProvided } from '../interfaces/index';

const popover = ref();

const { invoice_invoiceData, invoice_handleOtherOptions } = inject<IInvoiceProvided>('invoice')!;
const paymentStatusLabel = computed(() => {
  const status = INVOICE_PAYMENT_STATUS.find(f => f.id === invoice_invoiceData.value.data?.paymentStatus);
  return status?.name ?? '';
});
</script>
<template>
  <section
    id="invoice-status"
    class="flex lg:hidden relative inset-0 z-0 bg-white border-l border-solid border-grayscale-10 flex-col p-4 gap-2"
  >
    <section id="invoice-id" class="flex flex-col">
      <p id="label-invoice-id" class="font-normal text-text-disabled text-sm">Invoice ID</p>

      <p id="invoice-id" class="font-semibold text-black text-lg">{{ invoice_invoiceData.data?.invoiceNumber }}</p>
    </section>

    <section
      id="box-icon"
      class="absolute top-5 right-5 bg-transparent basic-smooth-animation flex items-center gap-2 hover:bg-grayscale-10 p-2 rounded-md cursor-pointer"
    >
      <PrimeVueButton
        variant="outlined"
        severity="primary"
        size="small"
        class="rounded-lg"
        @click="popover.toggle($event)"
      >
        <AppBaseSvg name="share" class="!w-3 !h-3" />
        <span class="font-semibold text-primary text-xs"> Share </span>
      </PrimeVueButton>
      <AppBaseSvg name="more" class="!w-6 !h-6" />

      <PrimeVuePopover
        ref="popover"
        :pt="{
          content: 'p-0',
        }"
      >
        <section id="popover-content" class="flex flex-col">
          <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="invoice_handleOtherOptions('whatsapp')">
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <AppBaseSvg name="whatsapp" class="!w-4 !h-4" />
                <span class="font-normal text-sm text-text-primary">Whatsapp</span>
              </section>
            </template>
          </PrimeVueButton>

          <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="invoice_handleOtherOptions('email')">
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <AppBaseSvg name="mail" class="!w-4 !h-4" />
                <span class="font-normal text-sm text-text-primary">Email</span>
              </section>
            </template>
          </PrimeVueButton>

          <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="invoice_handleOtherOptions('copy')">
            <template #default>
              <section id="content" class="flex items-center gap-2 w-full">
                <AppBaseSvg name="link" class="!w-4 !h-4" />
                <span class="font-normal text-sm text-text-primary">Copy link</span>
              </section>
            </template>
          </PrimeVueButton>
        </section>
      </PrimeVuePopover>
    </section>

    <div>
      <PrimeVueChip
        class="bg-primary-background px-4 py-2 rounded-full"
        :class="{
          'bg-primary-background': invoice_invoiceData.data?.paymentStatus === 'paid',
          'bg-warning-background': invoice_invoiceData.data?.paymentStatus === 'unpaid',
          'bg-error-background': invoice_invoiceData.data?.paymentStatus === 'refund',
        }"
      >
        <AppBaseSvg :name="invoice_invoiceData.data?.paymentStatus" class="!w-8 !h-8" />

        <span
          class="font-semibold text-primary text-lg"
          :class="{
            'text-primary': invoice_invoiceData.data?.paymentStatus === 'paid',
            'text-warning-main': invoice_invoiceData.data?.paymentStatus === 'unpaid',
            'text-error-main': invoice_invoiceData.data?.paymentStatus === 'refund',
          }"
        >
          {{ paymentStatusLabel }}
        </span>
      </PrimeVueChip>
    </div>

    <div class="grid grid-cols-2 w-full gap-2">
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Created on</span>
        <span class="text-grayscale-70 text-sm"> {{ useFormatDate(invoice_invoiceData.data?.createdAt!) }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Paid On</span>
        <span class="text-grayscale-70 text-sm">{{
          invoice_invoiceData.data?.paymentStatus === 'paid'
            ? useFormatDate(invoice_invoiceData.data.paidAt!)
            : '-'
        }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Payment Method</span>
        <span class="text-grayscale-70 text-sm">{{ invoice_invoiceData?.data?.paymentMethods?.name || '-' }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">By</span>
        <span class="text-grayscale-70 text-sm">{{
          invoice_invoiceData.data?.paymentStatus === 'unpaid'
            ? invoice_invoiceData.currentUser?.fullname || '-'
            : invoice_invoiceData.data?.users?.fullname
        }}</span>
      </div>
    </div>
  </section>
</template>
