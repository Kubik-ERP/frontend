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
              <span class="font-semibold text-lg"> Payment Method </span>
              <span class="text-sm text-grayscale-70"> Select Payment Method </span>
            </div>

            <div
              v-for="category in cashierOrderSummary_modalPaymentMethod.data"
              :key="category.code"
              class="flex items-center gap-2 rounded-xs px-3 py-4"
              :class="{
                'cursor-pointer': category.available,
                'border border-primary-border bg-primary-background drop-shadow-sm':
                  cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod === category.code,
                'hover:bg-grayscale-10/25 border border-grayscale-20':
                  cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod !== category.code &&
                  category.available,
                'cursor-not-allowed bg-grayscale-20 text-text-disabled': category.available === false,
              }"
              @click="
                category.available
                  ? (cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod = category.code)
                  : null
              "
            >
              <PrimeVueRadioButton
                v-model="cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod"
                :input-id="category.label"
                name="dynamic"
                :disabled="category.available === false"
                :value="category.code"
              />
              <section id="cashier-summary-modal-order-type" class="flex gap-2 items-center">
                <AppBaseSvg :name="category.icon" class="!h-6 !w-6" />
                <label class="font-semibold" :for="category.label">{{ category.label }}</label>
                <span v-if="!category.available" class="text-xs">Unavailable</span>
              </section>
            </div>
          </section>

          <div class="flex justify-end gap-4">
            <PrimeVueButton
              class="border-primary text-primary py-2.5 px-8"
              type="button"
              label="Cancel"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none text-white py-2.5 px-8"
              type="button"
              label="Select Method"
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
