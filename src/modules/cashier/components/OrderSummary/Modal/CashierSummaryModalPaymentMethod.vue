<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalPaymentMethod, cashierOrderSummary_handlePaymentMethod } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-payment-method">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalPaymentMethod.show"
      modal
      :style="{ width: '32rem' }"
      :position="useIsMobile() || useIsTablet() ? 'bottom' : 'center'"
      class="p-0 m-0 rounded-t-4xl lg:rounded-lg"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-payment-method" class="flex flex-col gap-6 p-6">
          <section id="cashier-summary-modal-payment-method-form" class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
              <span class="font-semibold text-lg">
                {{ useLocalization('cashier.orderSummary.payment.title') }}
              </span>
              <span class="text-sm text-grayscale-70">
                {{ useLocalization('cashier.orderSummary.payment.description') }}
              </span>
            </div>

            <template v-if="cashierOrderSummary_modalPaymentMethod.isLoading">
              <section
                id="cashier-summary-modal-payment-method-loading"
                class="flex items-center justify-center w-full"
              >
                <div class="flex flex-col w-full gap-3">
                  <PrimeVueSkeleton v-for="id in 4" :key="id" height="3rem"></PrimeVueSkeleton>
                </div>
              </section>
            </template>
            <template v-else>
              <div
                v-for="category in cashierOrderSummary_modalPaymentMethod.data"
                :key="category.id"
                class="flex items-center gap-2 rounded-xs px-3 py-4"
                :class="{
                  'cursor-pointer': category.isAvailable,
                  'border border-primary-border bg-primary-background drop-shadow-sm':
                    cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod === category.id,
                  'hover:bg-grayscale-10/25 border border-grayscale-20':
                    cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod !== category.id &&
                    category.isAvailable,
                  'cursor-not-allowed bg-grayscale-20 text-text-disabled': category.isAvailable === false,
                }"
                @click="
                  category.isAvailable
                    ? (cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod = category.id)
                    : null
                "
              >
                <PrimeVueRadioButton
                  v-model="cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod"
                  :input-id="category.name"
                  name="dynamic"
                  :disabled="category.isAvailable === false"
                  :value="category.id"
                />
                <section id="cashier-summary-modal-order-type" class="flex gap-2 items-center">
                  <AppBaseSvg :name="category.iconName" class="!h-6 !w-6" />
                  <label class="font-semibold" :for="category.name">{{ category.name }}</label>
                  <span v-if="!category.isAvailable" class="text-xs">{{
                    useLocalization('cashier.unavailable')
                  }}</span>
                </section>
              </div>
            </template>
          </section>

          <div class="flex justify-end gap-4">
            <PrimeVueButton
              class="border-primary text-primary py-2.5 px-8"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none text-white py-2.5 px-8"
              type="button"
              :label="useLocalization('cashier.orderSummary.payment.selectMethod')"
              :disabled="!cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod"
              @click="
                cashierOrderSummary_modalPaymentMethod.show = false;
                cashierOrderSummary_handlePaymentMethod();
              "
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
