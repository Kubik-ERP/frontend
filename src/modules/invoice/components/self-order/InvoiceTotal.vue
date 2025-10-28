<script setup lang="ts">
// Composables
import { useFormatDate } from '@/app/composables';

// Interface
import { IInvoiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData } = inject<IInvoiceProvided>('invoice')!;
</script>

<template>
  <section
    v-if="invoice_invoiceData.data"
    id="invoice-total"
    class="w-full flex flex-col gap-2 bg-white py-5 px-4"
  >
    <div class="flex justify-between">
      <span class="font-semibold">Sub Total</span>

      <div class="flex flex-col items-end">
        <span class="text-xs font-semibold">{{
          useCurrencyFormat({
            data:
              invoice_invoiceData.data.paymentStatus === 'unpaid'
                ? invoice_invoiceData.calculate?.total || 0
                : invoice_invoiceData.data.subtotal,
          })
        }}</span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="font-semibold">Discount Product</span>

      <div class="flex flex-col items-end">
        <span class="text-xs font-semibold">-{{
          useCurrencyFormat({
            data:
              invoice_invoiceData.data.paymentStatus === 'unpaid'
                ? invoice_invoiceData.calculate?.discountTotal || 0
                : invoice_invoiceData.data.totalProductDiscount || 0,
          })
        }}</span>
      </div>
    </div>

    <div v-if="invoice_invoiceData.data.loyaltyDiscount && invoice_invoiceData.data.loyaltyDiscount > 0" class="flex justify-between">
      <span class="font-semibold">Loyalty Point Discount</span>

      <div class="flex flex-col items-end">
        <span class="text-xs font-semibold">
          -{{ useCurrencyFormat({ data: invoice_invoiceData.data.loyaltyDiscount || 0 }) }}
        </span>
      </div>
    </div>

    <div v-if="invoice_invoiceData.data.loyaltyPointsBenefit && invoice_invoiceData.data.loyaltyPointsBenefit.pointsNeeds > 0" class="flex justify-between">
      <span class="font-semibold">Loyalty Point</span>

      <div class="flex flex-col items-end">
        <span class="text-xs font-semibold">
          -{{ invoice_invoiceData.data.loyaltyPointsBenefit?.pointsNeeds || 0 }} pts
        </span>
      </div>
    </div>

    <div v-if="invoice_invoiceData.data.loyaltyPointsBenefit && invoice_invoiceData.data.loyaltyPointsBenefit.benefitName" class="flex justify-between">
      <span class="pl-6 text-text-disabled text-xs italic">Benefit name</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled italic">
          {{ invoice_invoiceData.data.loyaltyPointsBenefit?.benefitName }}
        </span>
      </div>
    </div>

    <div v-if="invoice_invoiceData.data.totalEarnPoints && invoice_invoiceData.data.totalEarnPoints > 0" class="flex justify-between">
      <span class="font-semibold">Points Accumulated</span>

      <div class="flex flex-col items-end">
        <span class="text-xs font-semibold">
          {{ invoice_invoiceData.data.totalEarnPoints }} pts
        </span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">Tax</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">
          <span v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'">
            ({{ invoice_invoiceData.calculate?.taxInclude ? 'included' : 'excluded' }})
          </span>

          <span>{{
            useCurrencyFormat({
              data:
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.tax || 0
                  : invoice_invoiceData.data.taxAmount || 0,
            })
          }}</span>
        </span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">Service</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">
          <span v-if="invoice_invoiceData.data.paymentStatus === 'unpaid'">
            ({{ invoice_invoiceData.calculate?.serviceChargeInclude ? 'included' : 'excluded' }})
          </span>

          <span>{{
            useCurrencyFormat({
              data:
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.serviceCharge || 0
                  : invoice_invoiceData.data.serviceChargeAmount || 0,
            })
          }}</span>
        </span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">Rounding</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">
          <span>{{
            useCurrencyFormat({
              data: invoice_invoiceData.data.roundingAmount || 0,
            })
          }}</span>
        </span>
      </div>
    </div>

    <div class="flex justify-between">
      <span class="text-text-disabled text-xs">Promo</span>

      <div class="flex flex-col items-end">
        <span class="text-xs text-text-disabled">
          {{
            useCurrencyFormat({
              data: invoice_invoiceData.data.paymentStatus === 'unpaid' ? 0 : 0,
            })
          }}</span
        >
      </div>
    </div>

    <hr class="border border-solid border-grayscale-10 my-1" />

    <div class="flex justify-between">
      <span class="font-semibold text-sm">Total</span>

      <div class="flex flex-col items-end">
        <span class="text-sm font-semibold">
          {{
            useCurrencyFormat({
              data:
                invoice_invoiceData.data.paymentStatus === 'unpaid'
                  ? invoice_invoiceData.calculate?.grandTotal || 0
                  : invoice_invoiceData.data.grandTotal || 0,
            })
          }}</span
        >
      </div>
    </div>

    <div class="mt-5 flex flex-col gap-2">
      <div class="flex justify-between">
        <span class="text-sm font-semibold">Payment Method</span>
        <span class="text-sm font-semibold">{{ invoice_invoiceData?.data?.paymentMethods?.name || '' }}</span>
      </div>
      <div class="flex justify-between">
        <span class="text-sm">Payment Date</span>
        <span class="text-sm">{{
          invoice_invoiceData.data.paymentStatus === 'paid' ? useFormatDate(invoice_invoiceData.data.paidAt!) : '-'
        }}</span>
      </div>
    </div>

    <div class="mt-5 p-2 flex items-center justify-between border border-primary-border rounded-lg">
      <div class="flex gap-2 items-center">
        <AppBaseSvg name="order-primary" class="!w-6 !h-6" />
        <span class="text-sm">Your queue number is</span>
      </div>
      <span class="text-sm font-semibold">{{ invoice_invoiceData.data.queue }}</span>
    </div>
  </section>
</template>
