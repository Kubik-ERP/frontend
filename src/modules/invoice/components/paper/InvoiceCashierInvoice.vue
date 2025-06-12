<script setup lang="ts">
// Component
import InvoiceCashierInvoiceLoading from './InvoiceCashierInvoiceLoading.vue';

// Composables
import { useFormatDate } from '@/app/composables';

// Interface
import { IInvoiceProvided } from '../../interfaces';
import { CASHIER_ORDER_TYPE } from '@/modules/cashier/constants';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData } = inject<IInvoiceProvided>('invoice')!;
</script>
<template>
  <section
    v-if="!invoice_invoiceData.isLoading && invoice_invoiceData.data"
    id="invoice-paper"
    class="invoice-paper bg-white flex flex-col items-center gap-2 w-full max-w-xs lg:max-w-md p-4"
  >
    <section id="logo" class="w-20 h-20 bg-grayscale-10">&nbsp;</section>
    <!-- TODO: add store name -->
    <h6 id="outlet-name" class="font-semibold text-black text-sm">Lawson Kaliurang</h6>

    <!-- TODO: Add address name -->
    <p id="outlet-address" class="font-normal text-black text-center text-sm px-4">
      Lawson Kaliurang - Jl. Kaliurang KM 6, Blotan, Sukoharjo, Kec. Ngaglik, Kabupaten Sleman, Daerah Istimewa
      Yogyakarta
    </p>

    <div class="invoice-datetime-or-status">
      <div class="invoice-datetime-or-status-content">
        <span class="date">{{ useFormatDate(new Date(invoice_invoiceData.data.createdAt)) }}</span>
        <!-- TODO: add id invoice -->
        <span class="cashier">KASIR {{ invoice_invoiceData.data.id }}</span>
      </div>
    </div>

    <section id="cashier-information" class="flex items-center justify-between w-full">
      <p id="label-cashier" class="font-normal text-black text-sm">Cashier</p>
      <!-- TODO: add cashier name -->
      <p id="cashier-name" class="font-normal text-black text-sm">
        {{
          invoice_invoiceData.data.paymentStatus === 'unpaid'
            ? invoice_invoiceData.currentUser?.fullname || '-'
            : invoice_invoiceData.data.users?.fullName
        }}
      </p>
    </section>

    <section id="customer-information" class="flex items-center justify-between w-full">
      <p id="label-customer" class="font-normal text-black text-sm">Cust. Name</p>
      <p id="customer-name" class="font-normal text-black text-sm">
        {{ invoice_invoiceData.data.customer.name }}
      </p>
    </section>

    <section id="order-type" class="flex items-center justify-between w-full">
      <p id="label-order-type" class="font-normal text-black text-sm">Order Type</p>
      <p id="order-type-value" class="font-normal text-black text-sm">
        {{ CASHIER_ORDER_TYPE.find(f => f.code === invoice_invoiceData.data?.orderType)?.label ?? '' }}
      </p>
    </section>

    <section id="queue" class="flex items-center justify-between w-full">
      <p id="label-queue" class="font-normal text-black text-sm">Queue</p>
      <!-- TODO: Add queue -->
      <p id="queue-value" class="font-normal text-black text-sm">38</p>
    </section>

    <table id="product-items" class="w-full">
      <thead>
        <tr class="border-y border-dashed border-black py-2">
          <th class="font-normal text-black text-sm text-left w-28 py-2">Deskripsi</th>
          <th class="font-normal text-black text-sm text-center w-10 py-2">Qty</th>
          <th class="font-normal text-black text-sm text-center w-28 py-2">Harga</th>
          <th class="font-normal text-black text-sm text-right w-28 py-2">Sub Total</th>
        </tr>
      </thead>

      <tbody class="border-b border-solid border-black">
        <template v-for="item in invoice_invoiceData.data.invoiceDetails" :key="item.id">
          <tr>
            <td class="font-normal text-black text-sm">{{ item.products.name }}</td>
            <td class="font-normal text-black text-sm text-center">{{ item.qty }}</td>
            <td class="font-normal text-black text-sm text-center">
              {{ useCurrencyFormat(item.productPrice) }}
            </td>
            <td class="font-normal text-black text-sm text-right">
              {{ useCurrencyFormat(item.productPrice * item.qty) }}
            </td>
          </tr>
          <tr v-if="item.variant">
            <td class="pl-4 font-normal text-black text-xs italic py-2">{{ item.variant.name }}</td>
            <td class="font-normal text-black text-sm text-center py-2"></td>
            <td class="font-normal text-black text-sm text-center py-2">
              {{ useCurrencyFormat(item.variant.price) }}
            </td>
            <td class="font-normal text-black text-sm text-right py-2">
              {{ useCurrencyFormat(item.variant.price * item.qty) }}
            </td>
          </tr>
        </template>
      </tbody>

      <tfoot class="border-b border-solid border-grayscale-10">
        <tr>
          <td class="font-normal text-black text-sm py-2">Sub Total</td>
          <td class="font-normal text-black text-sm text-center py-2">
            {{ invoice_invoiceData.data.invoiceDetails.reduce((sum, item) => sum + item.qty, 0) }}
          </td>
          <td colspan="2" class="font-normal text-black text-sm text-right py-2">
            {{
              useCurrencyFormat(
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.total || 0
                  : invoice_invoiceData.data.subtotal,
              )
            }}
          </td>
        </tr>

        <tr>
          <td class="font-normal text-black text-sm py-2">Promo</td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">
            -
            {{ useCurrencyFormat(invoice_invoiceData.data.paymentStatus === 'unpaid' ? 0 : 0) }}
          </td>
        </tr>

        <tr>
          <td class="font-normal text-black text-sm py-2">Debit</td>
          <!-- TODO: Add field debit -->
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">
            {{ useCurrencyFormat(0) }}
          </td>
        </tr>

        <tr class="border-b border-dashed border-black">
          <td class="font-normal text-black text-sm py-2">Kembali</td>
          <!-- TODO: Add field change -->
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">{{ useCurrencyFormat(0) }}</td>
        </tr>

        <tr>
          <td class="flex items-center font-normal text-black text-sm py-2">
            Tax

            <div
              v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'"
              class="ml-1 text-xs italic text-text-disabled"
            >
              ({{ invoice_invoiceData.calculate?.taxInclude ? 'included' : 'excluded' }})
            </div>
          </td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">
            {{
              useCurrencyFormat(
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.tax || 0
                  : invoice_invoiceData.data.taxAmount || 0,
              )
            }}
          </td>
        </tr>
        <tr class="border-b border-solid border-black">
          <td class="flex items-center font-normal text-black text-sm py-2">
            Service

            <div
              v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'"
              class="ml-1 text-xs italic text-text-disabled"
            >
              ({{ invoice_invoiceData.calculate?.serviceChargeInclude ? 'included' : 'excluded' }})
            </div>
          </td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">
            {{
              useCurrencyFormat(
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.serviceCharge || 0
                  : invoice_invoiceData.data.serviceChargeAmount || 0,
              )
            }}
          </td>
        </tr>

        <tr>
          <td colspan="2" class="font-semibold text-black text-sm text-center py-2">Total</td>
          <td colspan="2" class="font-semibold text-black text-sm text-right py-2">
            {{
              useCurrencyFormat(
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.grandTotal || 0
                  : invoice_invoiceData.data.grandTotal || 0,
              )
            }}
          </td>
        </tr>
      </tfoot>
    </table>

    <!-- TODO: Footer -->
    <section id="closing" class="flex flex-col items-center gap-2 w-full">
      <p id="label-social-media" class="font-normal text-black text-sm">Social Media</p>
      <p id="social-media-ig" class="font-normal text-black text-sm">Instagram : @lawsonkal</p>
      <p id="closing-text" class="font-normal text-black text-sm">
        Terima kasih dan kami tunggu kehadiran Anda kembali
      </p>
    </section>
  </section>
  <section v-else-if="invoice_invoiceData.isLoading">
    <InvoiceCashierInvoiceLoading />
  </section>
  <section v-else></section>
</template>

<style lang="css" scoped>
.invoice-datetime-or-status {
  position: relative;
  width: 100%;
  font-family: 'Inter', monospace; /* Ensures uniform spacing */
  font-size: 12px;
}

.invoice-datetime-or-status::before {
  content: '====================================================';
  display: block;
  text-align: center;
  color: #000;
}

.invoice-datetime-or-status::after {
  content: '====================================================';
  display: block;
  text-align: center;
  color: #000;
}

@media (max-width: 1024px) {
  .invoice-datetime-or-status::before {
    content: '====================================';
  }

  .invoice-datetime-or-status::after {
    content: '====================================';
  }
}

/* Content styling with flexbox for alignment */
.invoice-datetime-or-status-content {
  display: flex;
  justify-content: space-between; /* Pushes date and cashier to opposite ends */
}

.date {
  text-align: left;
}

.cashier {
  text-align: right;
}
</style>
