<script setup lang="ts">
// Interface
import { ICashierOrderProvided } from '@/modules/cashier/interfaces/cashier-order.interface';
import { ICashierPaymentProvided } from '@/modules/cashier/interfaces/cashier-payment.interface';
import { ICashierCustomerProvided } from '@/modules/cashier/interfaces/cashier-customer.interface';

/**
 * @description Inject all the data and methods what we need
 */
const cashierOrder = inject<ICashierOrderProvided>('cashierOrder')!;
const cashierPayment = inject<ICashierPaymentProvided>('cashierPayment')!;
const cashierCustomer = inject<ICashierCustomerProvided>('cashierCustomer')!;

// Destructure non-ref values for cleaner usage
const {
  cashierOrder_modalPlaceOrderConfirmation,
  cashierOrder_modalPlaceOrderDetail,
  cashierOrder_handlePlaceOrderConfirmation,
  cashierOrder_handlePlaceOrderDetail,
} = cashierOrder;
</script>

<template>
  <section id="cashier-summary-modal-place-order-confirmation">
    <PrimeVueDialog
      v-model:visible="cashierOrder_modalPlaceOrderConfirmation.show"
      modal
      :style="{ width: '31rem' }"
      class="m-2"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-place-order-confirmation-content" class="flex flex-col gap-6 p-6">
          <section
            id="cashier-summary-modal-place-order-confirmation-content-body"
            class="flex flex-col gap-4 items-center"
          >
            <AppBaseSvg name="confirmation" class="!w-14 !h-14" />

            <div class="flex flex-col gap-3 items-center">
              <span class="font-semibold text-base lg:text-lg">{{
                useLocalization('cashier.orderSummary.placeOrderConfirmation.title')
              }}</span>
              <div class="grid grid-cols-12 py-2.5 px-4 bg-secondary/10 rounded-xl">
                <AppBaseSvg name="info" class="w-5 h-5 col-span-1 mt-1 filter-black-color" />
                <span class="text-xs lg:text-sm text-black text-justify col-span-11">{{
                  useLocalization('cashier.orderSummary.placeOrderConfirmation.description')
                }}</span>
              </div>
            </div>
          </section>

          <div class="flex justify-end gap-6">
            <PrimeVueButton
              class="text-primary border-primary w-1/2 py-2.5 text-sm lg:text-base"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              :disabled="cashierOrder_modalPlaceOrderDetail.isLoading"
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none w-1/2 py-2.5 text-sm lg:text-base"
              type="button"
              :label="useLocalization('cashier.orderSummary.placeOrderConfirmation.placeOrder')"
              :disabled="cashierOrder_modalPlaceOrderDetail.isLoading"
              :loading="cashierOrder_modalPlaceOrderDetail.isLoading"
              @click="
                cashierOrder_handlePlaceOrderConfirmation(
                  cashierPayment.cashierPayment_modalPaymentMethod,
                  async () =>
                    await cashierOrder_handlePlaceOrderDetail(
                      cashierPayment.cashierPayment_modalPaymentMethod,
                      cashierPayment.cashierPayment_paymentForm,
                      cashierCustomer.cashierCustomer_modalVoucher,
                      cashierCustomer.cashierCustomer_customerState,
                    ),
                )
              "
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
