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
 * @description Inject all the data and methods we need
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
    <!-- Logo -->
    <section
      v-if="
        invoice_invoiceData.configInvoice.isShowCompanyLogo && invoice_invoiceData.configInvoice.companyLogoUrl
      "
      id="logo"
    >
      <AppBaseImage :src="imageUrl" :alt="invoice_invoiceData.currentOutlet.name" class="w-16 h-16" />
    </section>

    <!-- Store name -->
    <h6 id="outlet-name" class="font-semibold text-black text-[12pt]">
      {{ invoice_invoiceData.currentOutlet.name }}
    </h6>

    <!-- Store address -->
    <p
      v-if="invoice_invoiceData.configInvoice.isShowStoreLocation"
      id="outlet-address"
      class="font-normal text-black text-center text-[12pt] px-4"
    >
      {{ invoice_invoiceData.currentOutlet.address }}
    </p>

    <!-- Header info -->
    <div class="flex flex-col text-xs gap-2 border-y border-dashed border-black py-2 w-full">
      <div class="flex justify-between">
        <span class="text-left">{{ useFormatDate(new Date(invoice_invoiceData.data.createdAt)) }}</span>
        <span class="text-right">KASIR {{ invoice_invoiceData.data.invoiceNumber }}</span>
      </div>
    </div>

    <!-- Cashier -->
    <section
      v-if="!invoice_invoiceData.configInvoice?.isHideCashierName || false"
      id="cashier-information"
      class="flex items-center justify-between w-full"
    >
      <p class="font-normal text-black text-[12pt]">Cashier</p>
      <p class="font-normal text-black text-[12pt]">
        {{
          invoice_invoiceData.data.paymentStatus === 'unpaid'
            ? invoice_invoiceData.currentUser?.fullname || '-'
            : invoice_invoiceData.data.users?.fullname
        }}
      </p>
    </section>

    <!-- Customer -->
    <section
      v-if="invoice_invoiceData.data.customer"
      id="customer-information"
      class="flex items-center justify-between w-full"
    >
      <p class="font-normal text-black text-[12pt]">Cust. Name</p>
      <p class="font-normal text-black text-[12pt]">{{ invoice_invoiceData.data.customer.name }}</p>
    </section>

    <!-- Order Type -->
    <section
      v-if="!invoice_invoiceData.configInvoice.isHideOrderType"
      id="order-type"
      class="flex items-center justify-between w-full"
    >
      <p class="font-normal text-black text-[12pt]">Order Type</p>
      <p class="font-normal text-black text-[12pt]">{{ orderTypeLabel }}</p>
    </section>

    <!-- Queue -->
    <section
      v-if="!invoice_invoiceData.configInvoice.isHideQueueNumber"
      id="queue"
      class="flex items-center justify-between w-full"
    >
      <p class="font-normal text-black text-[12pt]">Queue</p>
      <p class="font-normal text-black text-[12pt]">{{ invoice_invoiceData.data.queue }}</p>
    </section>

    <!-- Table -->
    <section
      v-if="invoice_invoiceData.configInvoice.isShowTableNumber"
      id="table"
      class="flex items-center justify-between w-full"
    >
      <p class="font-normal text-black text-[12pt]">Table No.</p>
      <p class="font-normal text-black text-[12pt]">{{ invoice_invoiceData.data?.tableCode || '-' }}</p>
    </section>

    <!-- Status -->
    <section
      v-if="invoice_invoiceData.data.paymentStatus === 'paid'"
      id="status"
      class="flex items-center justify-between w-full"
    >
      <p class="font-normal text-black text-[12pt]">Status</p>
      <p class="font-normal text-black text-[12pt]">
        {{ useCapitalize(invoice_invoiceData.data.paymentStatus) }}
      </p>
    </section>

    <!-- Product Table -->
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

        <tbody>
          <template v-for="item in invoice_invoiceData.data.invoiceDetails" :key="item.id">
            <!-- Main Product -->
            <tr>
              <td class="font-normal pr-0.5 text-black text-[12pt]">
                {{ item.products?.name ?? item.catalogBundling?.name }}
              </td>
              <td class="font-normal pr-0.5 text-black text-[12pt] text-center">
                {{ item.qty }}
              </td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-[12pt] text-center"
              >
                {{ useCurrencyFormat({ data: item.productPrice }) }}
              </td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-[12pt] text-right"
              >
                {{ useCurrencyFormat({ data: item.productPrice * item.qty }) }}
              </td>
            </tr>

            <tr v-if="item.invoiceBundlingItems.length > 0">
              <td class="font-normal pr-0.5 text-black text-[12pt]">Bundling Items:</td>
            </tr>

            <!-- Bundling Products (Sub-items) -->
            <template v-for="bundlingItem in item.invoiceBundlingItems" :key="bundlingItem.id">
              <tr>
                <td class="pl-6 font-normal pr-0.5 text-black text-[12pt] italic">
                  {{ bundlingItem.products?.name }}
                </td>
                <td class="font-normal pr-0.5 text-black text-[12pt] text-center"></td>
                <td class="font-normal pr-0.5 text-black text-[12pt] text-center">
                  {{ useCurrencyFormat({ data: bundlingItem.products?.price ?? 0 }) }}
                </td>
                <td class="font-normal pr-0.5 text-black text-[12pt] text-right"></td>
              </tr>
            </template>

            <!-- Variant -->
            <tr v-if="item.variant">
              <td class="pl-6 font-normal pr-0.5 text-black text-[12pt] italic">
                {{ item.variant.name }}
              </td>
              <td class="font-normal pr-0.5 text-black text-[12pt] text-center"></td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-[12pt] text-center"
              >
                {{ useCurrencyFormat({ data: item.variant.price }) }}
              </td>
              <td
                v-if="!invoice_invoiceData.configInvoice.isHideItemPrices"
                class="font-normal pr-0.5 text-black text-[12pt] text-right"
              >
                {{ useCurrencyFormat({ data: item.variant.price * item.qty }) }}
              </td>
            </tr>

            <!-- Notes -->
            <tr v-if="item.notes">
              <td colspan="1" class="pl-6 font-normal pr-0.5 text-black text-[12pt] italic">Notes</td>
              <td colspan="3" class="text-right font-normal pr-0.5 text-black text-[12pt] italic">
                {{ item.notes }}
              </td>
            </tr>
          </template>
        </tbody>

        <!-- Footer / Totals -->
        <tfoot class="border-b border-solid border-black">
          <tr class="h-2"></tr>
          <tr class="border-t border-solid border-black">
            <td class="font-normal text-black text-[12pt] py-1">Sub Total</td>
            <td class="font-normal text-black text-[12pt] text-center py-1">
              {{
                (invoice_invoiceData.data.invoiceDetails as Array<{ qty: number }>).reduce(
                  (sum, item) => sum + item.qty,
                  0,
                )
              }}
            </td>
            <td colspan="2" class="font-normal text-black text-[12pt] text-right py-1">
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
            <td class="font-normal text-black text-[12pt] py-1">Discount Product</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
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
            <td class="font-normal text-black text-[12pt] py-1">Rounding</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
              {{ useCurrencyFormat({ data: invoice_invoiceData.data.roundingAmount || 0 }) }}
            </td>
          </tr>

          <tr>
            <td class="font-normal text-black text-[12pt] py-1">Promo Voucher</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
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

           <tr
            v-if="
              invoice_invoiceData.configInvoice?.isShowLoyaltyPointsUsed 
              
            "
          >
            <td class="font-normal text-black text-[12pt] py-1">Loyalty Point Discount</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
              -
              {{ useCurrencyFormat({ data: invoice_invoiceData.data.loyaltyDiscount || 0 }) }}
            </td>
          </tr>

           <tr
            v-if="
              invoice_invoiceData.configInvoice?.isShowLoyaltyPointsUsed
            "
          >
            <td class="font-normal text-black text-[12pt] py-1">Loyalty Point</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
              -{{ invoice_invoiceData.data.loyaltyPointsBenefit?.pointsNeeds || 0 }} pts
            </td>
          </tr>

          <tr
            v-if="
              invoice_invoiceData.configInvoice?.isShowTotalPointsAccumulated
            "
          >
            <td class="font-normal text-black text-[12pt] py-1">Points Accumulated</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
              {{ invoice_invoiceData.data.totalEarnPoints }} pts
            </td>
          </tr>

          <tr>
            <td colspan="2" class="items-center font-normal text-black text-[12pt] py-1">
              Service
              <span
                v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'"
                class="ml-0.5 text-[12pt] italic text-text-disabled"
              >
                ({{ invoice_invoiceData.calculate?.serviceChargeInclude ? 'included' : 'excluded' }})
              </span>
            </td>
            <td colspan="2" class="font-normal text-black text-[12pt] text-right py-1">
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

          <tr class="border-b border-dashed border-black">
            <td colspan="2" class="items-center font-normal text-black text-[12pt] py-1">
              Tax
              <span
                v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'"
                class="ml-0.5 text-[10px] italic text-text-disabled"
              >
                ({{ invoice_invoiceData.calculate?.taxInclude ? 'included' : 'excluded' }})
              </span>
            </td>
            <td colspan="2" class="font-normal text-black text-[12pt] text-right py-1">
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

          <tr v-if="invoice_invoiceData?.data?.paymentMethods?.name" class="">
            <td class="font-normal text-black text-[12pt] py-1">
              {{ invoice_invoiceData?.data?.paymentMethods?.name || '' }}
            </td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
              {{ useCurrencyFormat({ data: invoice_invoiceData.data.paymentAmount || 0 }) }}
            </td>
          </tr>

          <tr  class="border-b border-solid border-black">
            <td class="font-normal text-black text-[12pt] py-1">Kembali</td>
            <td colspan="3" class="font-normal text-black text-[12pt] text-right py-1">
              {{ useCurrencyFormat({ data: invoice_invoiceData.data.changeAmount ?? 0 }) }}
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

    <!-- Footer -->
    <section
      v-if="invoice_invoiceData.configInvoice.isShowFooter"
      id="closing"
      class="flex flex-col items-center gap-2 w-full"
    >
      <p
        id="closing-footer"
        class="font-normal text-justify text-black text-[12pt]"
        v-html="invoice_invoiceData.configInvoice.footerText || ''"
      ></p>
    </section>
  </section>

  <!-- Loading State -->
  <section v-else-if="invoice_invoiceData.isLoading">
    <InvoicePaperCashierInvoiceLoading />
  </section>

  <section v-else></section>
</template>

<style lang="css" scoped></style>
