<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalPlaceOrderDetail, cashierOrderSummary_handleSimulatePayment } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

// env
const isDevelopmentMode = import.meta.env.VITE_APP_MODE === 'development';

// Router
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <section id="cashier-summary-modal-payment-qris" class="">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalPlaceOrderDetail.showModalPayment"
      modal
      :style="{
        width: '100dvw',
        minHeight: '100dvh',
        maxHeight: '100dvh',
      }"
      class="p-0 m-0 w-full h-full flex items-center justify-center rounded-none lg:rounded-lg"
    >
      <template #container="{ closeCallback }">
        <section
          id="cashier-summary-modal-payment-content"
          class="flex flex-col gap-6 p-6 h-full w-full max-w-3xl"
        >
          <section
            id="cashier-summary-modal-payment-content-body"
            class="items-center justify-center flex flex-col gap-4 flex-grow overflow-y-auto"
          >
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="flex flex-col gap-2 items-center">
                  <AppBaseSvg
                    name="chevron-left"
                    class="!h-4 !w-4 block lg:hidden cursor-pointer"
                    @click="closeCallback"
                  />
                  <span class="text-2xl font-semibold">Payment</span>

                  <img
                    v-for="(item, index) in cashierOrderSummary_modalPlaceOrderDetail.data.actions"
                    :key="index"
                    :src="item.url"
                    alt="qris"
                  />
                </div>
              </div>
            </div>

            <PrimeVueButton
              v-if="isDevelopmentMode"
              class="w-full bg-primary text-white py-2.5 px-8"
              type="button"
              label="Simulate Payment"
              @click="
                cashierOrderSummary_handleSimulatePayment(
                  cashierOrderSummary_modalPlaceOrderDetail?.data?.orderId ?? '',
                )
              "
            >
            </PrimeVueButton>

            <PrimeVueButton
              class="w-full bg-primary text-white py-2.5 px-8"
              type="button"
              label="Close"
              @click="
                router.push({
                  name: 'invoice',
                  params: {
                    orderId: cashierOrderSummary_modalPlaceOrderDetail.data.orderId,
                  },
                })
              "
            >
            </PrimeVueButton>
          </section>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
