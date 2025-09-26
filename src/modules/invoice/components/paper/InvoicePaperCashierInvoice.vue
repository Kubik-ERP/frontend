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
  return APP_BASE_BUCKET_URL + invoice_invoiceData.value.configInvoice?.companyLogoUrl || '';
});

const orderTypeLabel = computed(() => {
  const type = CASHIER_ORDER_TYPE.find(f => f.code === invoice_invoiceData.value.data?.orderType);
  return type?.label ?? '';
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
    class="invoice-paper bg-white flex flex-col items-center gap-2 w-full p-4 text-xl min-w-[58mm] max-w-[100mm] h-fit"
  >
    <!-- class="invoice-paper bg-white flex flex-col items-center gap-2 w-full p-4 md:max-w-xl max-w-[58mm]" -->
    <section
      v-if="
        invoice_invoiceData.configInvoice.isShowCompanyLogo && invoice_invoiceData.configInvoice.companyLogoUrl
      "
      id="logo"
    >
      <!-- <pre>
        {{ invoice_invoiceData.configInvoice.companyLogoUrl }}
      </pre> -->
      <AppBaseImage :src="imageUrl" :alt="invoice_invoiceData.currentOutlet.name" class="w-16 h-16" />
    </section>
    <h6 id="outlet-name" class="font-semibold text-black text-sm">{{ invoice_invoiceData.currentOutlet.name }}</h6>

    <p
      v-if="invoice_invoiceData.configInvoice.isShowStoreLocation"
      id="outlet-address"
      class="font-normal text-black text-center text-sm px-4"
    >
      {{ invoice_invoiceData.currentOutlet.address }}
    </p>

    <div class="flex flex-col text-xs gap-2 border-y border-dashed border-black py-2 w-full">
      <div class="flex justify-between">
        <span class="text-left">{{ useFormatDate(new Date(invoice_invoiceData.data.createdAt)) }}</span>
        <span class="text-right">KASIR {{ invoice_invoiceData.data.invoiceNumber }}</span>
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

    <section
      v-if="invoice_invoiceData.data.customer"
      id="customer-information"
      class="flex items-center justify-between w-full"
    >
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
        {{ orderTypeLabel }}
      </p>
    </section>

    <section
      v-if="!invoice_invoiceData.configInvoice.isHideQueueNumber"
      id="queue"
      class="flex items-center justify-between w-full"
    >
      <p id="label-queue" class="font-normal text-black text-sm">Queue</p>
      <p id="queue-value" class="font-normal text-black text-sm">{{ invoice_invoiceData.data.queue }}</p>
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

    <section
      v-if="invoice_invoiceData.data.paymentStatus === 'paid'"
      id="table"
      class="flex items-center justify-between w-full"
    >
      <p id="label-table" class="font-normal text-black text-sm">Status</p>
      <p id="table-value" class="font-normal text-black text-sm">
        {{ useCapitalize(invoice_invoiceData.data.paymentStatus) }}
      </p>
    </section>

    <section class="flex flex-col w-full">
      <table id="product-items" class="text-lg">
        <thead>
          <tr class="border-y border-dashed border-black py-2">
            <th class="font-normal pr-0.5 text-black text-left py-2">Deskripsi</th>
            <th class="font-normal pr-0.5 text-black text-center py-2">Qty</th>
            <th
              v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
              class="font-normal pr-0.5 text-black text-center py-2"
            >
              Harga
            </th>
            <th
              v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
              class="font-normal pr-0.5 text-black text-right py-2"
            >
              Sub Total
            </th>
          </tr>
        </thead>

        <tbody class="">
          <template v-for="item in invoice_invoiceData.data.invoiceDetails" :key="item.id">
            <tr>
              <td class="font-normal pr-0.5 text-black text-sm">{{ item.products.name }}</td>
              <td class="font-normal pr-0.5 text-black text-sm text-center">{{ item.qty }}</td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-sm text-center"
              >
                {{
                  useCurrencyFormat({
                    data: item.productPrice,
                  })
                }}
              </td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-sm text-right"
              >
                {{
                  useCurrencyFormat({
                    data: item.productPrice * item.qty,
                  })
                }}
              </td>
            </tr>
            <tr v-if="item.variant">
              <td class="pl-4 font-normal pr-0.5 text-black text-sm italic">{{ item.variant.name }}</td>
              <td class="font-normal pr-0.5 text-black text-sm text-center"></td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-sm text-center"
              >
                {{
                  useCurrencyFormat({
                    data: item.variant.price,
                  })
                }}
              </td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-sm text-right"
              >
                {{
                  useCurrencyFormat({
                    data: item.variant.price * item.qty,
                  })
                }}
              </td>
            </tr>
            <tr v-if="item.notes">
              <td colspan="1" class="pl-4 font-normal pr-0.5 text-black text-sm italic">notes</td>
              <td colspan="3" class="text-right font-normal pr-0.5 text-black text-sm italic">{{ item.notes }}</td>
            </tr>
          </template>
        </tbody>

        <tfoot class="border-b border-solid border-black">
          <tr class="h-2"></tr>
          <tr class="border-t border-solid border-black">
            <td class="font-normal text-black text-sm py-1">Sub Total</td>
            <td class="font-normal text-black text-sm text-center py-1">
              {{
                (invoice_invoiceData.data.invoiceDetails as Array<{ qty: number }>).reduce(
                  (sum: number, item) => sum + item.qty,
                  0,
                )
              }}
            </td>
            <td colspan="2" class="font-normal text-black text-sm text-right py-1">
              {{
                useCurrencyFormat({
                  data:
                    invoice_invoiceData.data.paymentStatus === 'unpaid'
                      ? invoice_invoiceData.calculate?.subTotal || 0
                      : invoice_invoiceData.data.subtotal,
                })
              }}
            </td>
          </tr>

          <tr>
            <td class="font-normal text-black text-sm py-1">Discount Product</td>
            <td colspan="3" class="font-normal text-black text-sm text-right py-1">
              -
              {{
                useCurrencyFormat({
                  data:
                    invoice_invoiceData.data.paymentStatus === 'unpaid'
                      ? invoice_invoiceData.calculate?.discountTotal || 0
                      : invoice_invoiceData.data.totalProductDiscount || 0,
                })
              }}
            </td>
          </tr>

          <tr>
            <td class="font-normal text-black text-sm py-1">Rounding</td>
            <td colspan="3" class="font-normal text-black text-sm text-right py-1">
              {{
                useCurrencyFormat({
                  data: invoice_invoiceData.data.roundingAmount || 0,
                })
              }}
            </td>
          </tr>

          <tr>
            <td class="font-normal text-black text-sm py-1">Promo Voucher</td>
            <td colspan="3" class="font-normal text-black text-sm text-right py-1">
              -
              {{
                useCurrencyFormat({
                  data:
                    invoice_invoiceData.data.paymentStatus === 'unpaid'
                      ? invoice_invoiceData.calculate?.voucherAmount || 0
                      : invoice_invoiceData.data.voucherAmount || 0,
                })
              }}
            </td>
          </tr>

          <tr v-if="invoice_invoiceData?.data?.paymentMethods?.name">
            <td class="font-normal text-black text-sm py-1">
              {{ invoice_invoiceData?.data?.paymentMethods?.name || '' }}
            </td>

            <td colspan="3" class="font-normal text-black text-sm text-right py-1">
              {{ useCurrencyFormat({ data: invoice_invoiceData.data.paymentAmount || 0 }) }}
            </td>
          </tr>

          <tr class="border-b border-dashed border-black">
            <td class="font-normal text-black text-sm py-1">Kembali</td>
            <td colspan="3" class="font-normal text-black text-sm text-right py-1">
              {{ useCurrencyFormat({ data: invoice_invoiceData.data.changeAmount ?? 0 }) }}
            </td>
          </tr>

          <tr>
            <td colspan="2" class="items-center font-normal text-black text-sm py-1">
              Tax

              <span
                v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'"
                class="ml-0.5 text-[10px] italic text-text-disabled"
              >
                ({{ invoice_invoiceData.calculate?.taxInclude ? 'included' : 'excluded' }})
              </span>
            </td>
            <td colspan="2" class="font-normal text-black text-sm text-right py-1">
              {{
                useCurrencyFormat({
                  data:
                    invoice_invoiceData.data.paymentStatus === 'unpaid'
                      ? invoice_invoiceData.calculate?.tax || 0
                      : invoice_invoiceData.data.taxAmount || 0,
                })
              }}
            </td>
          </tr>
          <tr class="border-b border-solid border-black">
            <td colspan="2" class="items-center font-normal text-black text-sm py-1">
              Service

              <span
                v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'"
                class="ml-0.5 text-sm italic text-text-disabled"
              >
                ({{ invoice_invoiceData.calculate?.serviceChargeInclude ? 'included' : 'excluded' }})
              </span>
            </td>
            <td colspan="2" class="font-normal text-black text-sm text-right py-1">
              {{
                useCurrencyFormat({
                  data:
                    invoice_invoiceData.data.paymentStatus === 'unpaid'
                      ? invoice_invoiceData.calculate?.serviceCharge || 0
                      : invoice_invoiceData.data.serviceChargeAmount || 0,
                })
              }}
            </td>
          </tr>

          <tr>
            <td colspan="2" class="font-semibold text-lg text-black text-left py-1">Total</td>
            <td colspan="2" class="font-semibold text-lg text-black text-right py-1">
              {{
                useCurrencyFormat({
                  data:
                    invoice_invoiceData.data.paymentStatus === 'unpaid'
                      ? invoice_invoiceData.calculate?.grandTotal || 0
                      : invoice_invoiceData.data.grandTotal || 0,
                })
              }}
            </td>
          </tr>

          <tr v-if="invoice_invoiceData.data.paymentStatus === 'paid'">
            <td colspan="2" class="font-semibold text-black text-lg text-left py-1">Payment Method</td>
            <td colspan="2" class="font-semibold text-black text-lg text-right py-1">
              {{ useCapitalize(invoice_invoiceData?.data?.paymentMethods?.name || '') }}
            </td>
          </tr>
        </tfoot>
      </table>
    </section>

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

<style lang="css" scoped></style>
