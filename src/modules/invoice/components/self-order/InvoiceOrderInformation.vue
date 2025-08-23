<script setup lang="ts">
// Constant
import { CASHIER_ORDER_TYPE } from '@/modules/cashier/constants';

// Interface
import { IInvoiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData } = inject<IInvoiceProvided>('invoice')!;

const orderTypeLabel = computed(() => {
  const type = CASHIER_ORDER_TYPE.find(f => f.code === invoice_invoiceData.value.data?.orderType);
  return type?.label ?? '';
});
</script>

<template>
  <section id="invoice-order-information" class="flex flex-col gap-2 p-4 bg-white">
    <span class="font-semibold">Customer Details</span>

    <div class="grid grid-cols-2 gap-2 w-full">
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Customer Name</span>
        <span class="text-xs">{{ invoice_invoiceData?.data?.customer.name || '-' }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Table No.</span>
        <span class="text-xs">{{ invoice_invoiceData?.data?.tableCode || '-' }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Order Type</span>
        <span class="text-xs">{{ orderTypeLabel }}</span>
      </div>
      <div class="flex flex-col gap-1">
        <span class="text-text-disabled text-sm">Order Date</span>
        <span class="text-xs">{{
          invoice_invoiceData?.data?.createdAt ? useFormatDate(invoice_invoiceData?.data?.createdAt) : ''
        }}</span>
      </div>
    </div>
  </section>
</template>
