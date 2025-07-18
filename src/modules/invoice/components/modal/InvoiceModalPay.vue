<script setup lang="ts">
// Interface
import { ICashierOrderSummaryPaymentMethod } from '@/modules/cashier/interfaces/cashier-order-summary';
import { IInvoiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData, invoice_modalPay, invoice_invoiceDataValidation, invoice_handlePayInvoice } =
  inject<IInvoiceProvided>('invoice')!;
</script>
<template>
  <PrimeVueDialog
    v-model:visible="invoice_modalPay.show"
    modal
    :style="{ width: '32rem' }"
    class="p-0 m-0 rounded-t-4xl lg:rounded-lg"
  >
    <template #container="{ closeCallback }">
      <section id="invoice-modal-pay-content" class="flex flex-col gap-5 p-6">
        <div class="flex flex-col gap-2">
          <span class="font-semibold text-lg">Pay Invoice </span>
          <span class="text-text-disabled text-sm">Complete payment details</span>
        </div>

        <div class="flex flex-col gap-1">
          <label for="payment-method" class="text-xs lg:text-sm"
            >Payment Method <span class="text-error-hover">*</span></label
          >
          <PrimeVueSelect
            id="payment-method"
            v-model="invoice_modalPay.data.selectedPaymentMethod"
            :options="invoice_modalPay.listPayment"
            :loading="invoice_modalPay.isLoading"
            :disabled="invoice_modalPay.isLoading"
            clearable
            option-label="name"
            option-value="id"
            :option-disabled="(item: ICashierOrderSummaryPaymentMethod) => !item.isAvailable"
            class="w-full"
            placeholder="Select Payment Method"
          />
        </div>

        <template
          v-if="
            invoice_modalPay.listPayment
              .find(f => f.id === invoice_modalPay.data.selectedPaymentMethod)
              ?.name.toUpperCase() === 'CASH'
          "
        >
          <AppBaseFormGroup
            v-slot="{ classes }"
            class="flex flex-col gap-1"
            label-for="payment-amount"
            name="Payment Amount"
            :validators="invoice_invoiceDataValidation.paymentAmount"
          >          
            <label for="payment-amount" class="text-xs lg:text-sm">Payment Amount</label>

            <PrimeVueIconField class="flex w-full">
              <PrimeVueInputIcon>
                <div class="flex gap-2">
                  <AppBaseSvg name="cash" class="!w-4 !h-4" />
                </div>
              </PrimeVueInputIcon>
              <PrimeVueInputNumber
                id="payment-amount"
                v-model="invoice_invoiceData.form.paymentAmount"
                :class="[classes, 'w-full']"
                placeholder="Enter payment amount"
              />
            </PrimeVueIconField>
          </AppBaseFormGroup>

          <div class="flex flex-col gap-2">
            <div class="flex justify-between">
              <span>Money Received</span>
              <span class="text-sm lg:text-base font-semibold">{{
                useCurrencyFormat(invoice_invoiceData.form.paymentAmount)
              }}</span>
            </div>
          </div>

          <div class="flex w-full justify-between items-center">
            <span class="text-text-disabled">Total Price</span>
            <span class="font-semibold">{{
              useCurrencyFormat(invoice_invoiceData.calculate?.grandTotal || 0)
            }}</span>
          </div>

          <hr />

          <div class="flex justify-between">
            <span class="text-sm lg:text-base font-bold"> Change Amount </span>
            <span class="text-sm lg:text-base font-semibold text-primary">
              {{
                useCurrencyFormat(
                  (invoice_invoiceData?.data?.grandTotal || 0) - invoice_invoiceData.form.paymentAmount,
                )
              }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="flex w-full justify-between items-center">
            <span class="text-text-disabled">Total Price</span>
            <span class="font-semibold">{{
              useCurrencyFormat(invoice_invoiceData.calculate?.grandTotal || 0)
            }}</span>
          </div>
        </template>

        <div class="flex justify-end">
          <PrimeVueButton
            class="bg-white text-black w-36 border-primary-border hover:bg-primary-background-hover"
            @click="closeCallback"
            >Cancel</PrimeVueButton
          >
          <PrimeVueButton
            class="bg-primary text-white w-36 border-primary hover:bg-primary-hover ml-2"
            :disabled="invoice_modalPay.isLoading || !invoice_modalPay.data.selectedPaymentMethod"
            @click="invoice_handlePayInvoice()"
            >Pay
          </PrimeVueButton>
        </div>
      </section>
    </template>
  </PrimeVueDialog>
</template>
