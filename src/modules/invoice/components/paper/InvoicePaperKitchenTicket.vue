<script setup lang="ts">
// Constants
import { CASHIER_ORDER_TYPE } from '@/modules/cashier/constants';

// Interface
import { IInvoiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData } = inject<IInvoiceProvided>('invoice')!;
</script>
<template>
  <section
    id="kitchen-invoice"
    class="invoice-paper bg-white flex flex-col items-center gap-2 w-full p-4 min-w-[58mm] max-w-[100mm] h-fit"
  >
    <div class="invoice-name">
      <span class="font-bold w-full flex justify-center text-sm">{{
        invoice_invoiceData.tableKitchenTicket?.customer?.name || ''
      }}</span>
      <span class="w-full flex justify-center">Kitchen Ticket</span>
    </div>

    <section id="cashier-information" class="flex items-center justify-between w-full border-b border-black py-2">
      <p id="label-cashier" class="font-normal text-black text-sm">Order Date</p>
      <p id="cashier-name" class="font-normal text-black text-sm">
        {{ invoice_invoiceData.tableKitchenTicket?.createdAtFormatted }}
      </p>
    </section>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Invoice Number</p>
      <p id="cashier-name" class="font-normal text-black text-sm">
        {{ invoice_invoiceData.tableKitchenTicket?.invoiceNumber }}
      </p>
    </section>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Staff</p>
      <p id="cashier-name" class="font-normal text-black text-sm">
        {{ invoice_invoiceData.tableKitchenTicket?.users.fullname }}
      </p>
    </section>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Order Type</p>
      <p id="cashier-name" class="font-normal text-black text-sm">
        {{
          CASHIER_ORDER_TYPE.find(f => f.code === invoice_invoiceData.tableKitchenTicket?.orderType)?.label ?? ''
        }}
      </p>
    </section>

    <table id="product-items" class="w-full">
      <thead>
        <tr class="border-y border-dashed border-black py-2">
          <th class="font-normal text-black text-sm text-start py-2">Qty</th>
          <th class="font-normal text-black text-sm text-start py-2 whitespace-nowrap">Order Item</th>
        </tr>
      </thead>
      <tbody
        v-for="(item, index) in invoice_invoiceData.tableKitchenTicket?.invoiceDetails"
        :key="index"
        class="border-b border-dashed border-black"
      >
        <tr>
          <td class="text-black text-sm font-bold w-full">{{ item.qty }}x</td>
          <td class="text-black text-sm whitespace-nowrap">
            <div class="flex flex-col">
              <span class="font-bold">{{ item.products.name }}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td>variants</td>
          <td class="font-bold text-right">{{ item.variant?.name || '-' }}</td>
        </tr>
        <tr>
          <td>notes</td>

          <td class="font-bold text-right">{{ item.notes || '-' }}</td>
        </tr>
        <tr class="h-2"></tr>
      </tbody>
    </table>
  </section>
</template>