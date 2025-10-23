<script setup lang="ts">
// Interface
import { IInvoiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData } = inject<IInvoiceProvided>('invoice')!;
</script>

<template>
  <section v-if="invoice_invoiceData.data" id="invoice-product">
    <div
      v-for="item in invoice_invoiceData.data.invoiceDetails"
      :key="item.id"
      class="flex flex-col w-full gap-4 py-4"
    >
      <div class="flex justify-between">
        <div class="flex gap-2 font-semibold text-xs">
          <span>{{ item.qty }}x</span>
          <span>{{ item.products?.name ?? item.catalogBundling?.name }}</span>
        </div>
        <div class="flex flex-col items-end">
          <span class="text-xs">{{
            useCurrencyFormat({
              data: item.productPrice - item.productDiscount,
            })
          }}</span>
          <span v-if="item.productDiscount != 0" class="text-text-disabled text-[8px] line-through">{{
            useCurrencyFormat({
              data: item.productPrice,
            })
          }}</span>
        </div>
      </div>

      <div v-if="item.variant || item.notes" class="flex flex-col gap-1 mb-4">
        <div v-if="item.variant" class="flex flex-col">
          <span class="text-text-disabled font-semibold text-[10px]">Variant</span>
          <span class="text-xs">{{ item.variant.name }}</span>
        </div>

        <div v-if="item.notes" class="flex flex-col">
          <span class="text-text-disabled font-semibold text-[10px]">Notes</span>
          <span class="text-xs text-justify">{{ item.notes }} </span>
        </div>
      </div>

      <div v-if="item.invoiceBundlingItems?.length" class="flex flex-col gap-1 mb-4">
        <span class="text-xs font-semibold text-black">Bundling Items:</span>
        <div
          v-for="bundlingItem in item.invoiceBundlingItems"
          :key="bundlingItem.id"
          class="flex justify-between pl-4 text-xs text-black italic"
        >
          <span>{{ bundlingItem.products?.name ?? '-' }}</span>
          <span>{{ useCurrencyFormat({ data: bundlingItem.products?.price ?? 0 }) }}</span>
        </div>
      </div>

      <div class="border border-dashed border-disabled border-spacing-2"></div>
    </div>
  </section>
</template>
