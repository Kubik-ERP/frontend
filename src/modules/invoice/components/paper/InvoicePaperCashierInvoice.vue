<script setup lang="ts">
// Component
import InvoicePaperCashierInvoiceLoading from './InvoicePaperCashierInvoiceLoading.vue';

// Constant
import { CASHIER_ORDER_TYPE } from '@/modules/cashier/constants';

// Composables
import { useFormatDate } from '@/app/composables';

// Interface
import { IInvoiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData } = inject<IInvoiceProvided>('invoice')!;

const imageUrl = computed(() => {
  return APP_BASE_BUCKET_URL + '/' + invoice_invoiceData.value.configInvoice?.companyLogoUrl || '';
});
</script>
<template>
  <section
    v-if="
      !invoice_invoiceData.isLoading &&
      invoice_invoiceData.data &&
      invoice_invoiceData.configInvoice &&
      invoice_invoiceData.currentOutlet
    "
    id="invoice-paper"
    class="invoice-paper bg-white flex flex-col items-center gap-2 w-full max-w-xs lg:max-w-md p-4"
  >
    <section v-if="invoice_invoiceData.configInvoice.isShowCompanyLogo" id="logo">
      <AppBaseImage :src="imageUrl" :alt="invoice_invoiceData.currentOutlet.name" class="w-20 h-20" />
    </section>
    <h6 id="outlet-name" class="font-semibold text-black text-sm">{{ invoice_invoiceData.currentOutlet.name }}</h6>

    <p
      v-if="invoice_invoiceData.configInvoice.isShowStoreLocation"
      id="outlet-address"
      class="font-normal text-black text-center text-sm px-4"
    >
      {{ invoice_invoiceData.currentOutlet.address }}
    </p>

    <div class="invoice-datetime-or-status">
      <div class="invoice-datetime-or-status-content">
        <span class="date">{{ useFormatDate(new Date(invoice_invoiceData.data.createdAt)) }}</span>
        <span class="cashier">KASIR {{ invoice_invoiceData.data.invoiceNumber }}</span>
      </div>
    </div>

    <section
      v-if="!invoice_invoiceData.configInvoice?.isHideCashierName || false"
      id="cashier-information"
      class="flex items-center justify-between w-full"
    >
      <p id="label-cashier" class="font-normal text-black text-sm">Cashier</p>
      <!-- TODO: add cashier name -->
      <p id="cashier-name" class="font-normal text-black text-sm">
        {{
          invoice_invoiceData.data.paymentStatus === 'unpaid'
            ? invoice_invoiceData.currentUser?.fullname || '-'
            : invoice_invoiceData.data.users?.fullname
        }}
      </p>
    </section>

    <section id="customer-information" class="flex items-center justify-between w-full">
      <p id="label-customer" class="font-normal text-black text-sm">Cust. Name</p>
      <p id="customer-name" class="font-normal text-black text-sm">
        {{ invoice_invoiceData.data.customer.name }}
      </p>
    </section>

    <section
      v-if="!invoice_invoiceData.configInvoice.isHideOrderType"
      id="order-type"
      class="flex items-center justify-between w-full"
    >
      <p id="label-order-type" class="font-normal text-black text-sm">Order Type</p>
      <p id="order-type-value" class="font-normal text-black text-sm">
        {{ CASHIER_ORDER_TYPE.find(f => f.code === invoice_invoiceData.data?.orderType)?.label ?? '' }}
      </p>
    </section>

    <section
      v-if="!invoice_invoiceData.configInvoice.isHideQueueNumber"
      id="queue"
      class="flex items-center justify-between w-full"
    >
      <p id="label-queue" class="font-normal text-black text-sm">Queue</p>
      <!-- TODO: Add queue -->
      <p id="queue-value" class="font-normal text-black text-sm">38</p>
    </section>

    <section
      v-if="invoice_invoiceData.configInvoice.isShowTableNumber"
      id="table"
      class="flex items-center justify-between w-full"
    >
      <p id="label-table" class="font-normal text-black text-sm">Table No.</p>
      <p id="table-value" class="font-normal text-black text-sm">
        {{ invoice_invoiceData.data?.tableCode || '-' }}
      </p>
    </section>

    <table id="product-items" class="w-full">
      <thead>
        <tr class="border-y border-dashed border-black py-2">
          <th class="font-normal text-black text-sm text-left w-28 py-2">Deskripsi</th>
          <th class="font-normal text-black text-sm text-center w-10 py-2">Qty</th>
          <th
            v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
            class="font-normal text-black text-sm text-center w-28 py-2"
          >
            Harga
          </th>
          <th
            v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
            class="font-normal text-black text-sm text-right w-28 py-2"
          >
            Sub Total
          </th>
        </tr>
      </thead>

      <tbody class="border-b border-solid border-black">
        <template v-for="item in invoice_invoiceData.data.invoiceDetails" :key="item.id">
          <tr>
            <td class="font-normal text-black text-sm">{{ item.products.name }}</td>
            <td class="font-normal text-black text-sm text-center">{{ item.qty }}</td>
            <td
              v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
              class="font-normal text-black text-sm text-center"
            >
              {{ useCurrencyFormat(item.productPrice) }}
            </td>
            <td
              v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
              class="font-normal text-black text-sm text-right"
            >
              {{ useCurrencyFormat(item.productPrice * item.qty) }}
            </td>
          </tr>
          <tr v-if="item.variant">
            <td class="pl-4 font-normal text-black text-xs italic py-2">{{ item.variant.name }}</td>
            <td class="font-normal text-black text-sm text-center py-2"></td>
            <td
              v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
              class="font-normal text-black text-sm text-center py-2"
            >
              {{ useCurrencyFormat(item.variant.price) }}
            </td>
            <td
              v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
              class="font-normal text-black text-sm text-right py-2"
            >
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

        <tr v-if="invoice_invoiceData?.data?.paymentMethods?.name">
          <td class="font-normal text-black text-sm py-2">
            {{ invoice_invoiceData?.data?.paymentMethods?.name || '' }}
          </td>

          <td colspan="3" class="font-normal text-black text-sm text-right py-2">
            {{ useCurrencyFormat(invoice_invoiceData.data.paymentAmount || 0) }}
          </td>
        </tr>

        <tr class="border-b border-dashed border-black">
          <td class="font-normal text-black text-sm py-2">Kembali</td>
          <td colspan="3" class="font-normal text-black text-sm text-right py-2">
            {{ useCurrencyFormat(invoice_invoiceData.data.changeAmount || 0) }}
          </td>
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

    <section
      v-if="invoice_invoiceData.configInvoice.isShowFooter"
      id="closing"
      class="flex flex-col items-center gap-2 w-full"
    >
      <p
        id="closing-footer"
        class="font-normal text-justify text-black text-sm"
        v-html="invoice_invoiceData.configInvoice.footerText || ''"
      ></p>
    </section>
  </section>
  <section v-else-if="invoice_invoiceData.isLoading">
    <InvoicePaperCashierInvoiceLoading />
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
