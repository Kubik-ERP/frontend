<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

import { minValue, numeric, required } from '@vuelidate/validators';

import { CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE } from '@/modules/cash-drawer/constants';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_paymentForm,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

// Composables
import { useIsMobile, useIsTablet } from '@/app/composables/useBreakpoint';
import useVuelidate from '@vuelidate/core';

const rules = computed(() => ({
  paymentAmount: {
    required,
    numeric,
    minValue: minValue(computed(() => cashierOrderSummary_calculateEstimation.value.data.grandTotal)),
  },
}));

const v$ = useVuelidate(rules, cashierOrderSummary_paymentForm, {
  $autoDirty: true,
});

/**
 * @description Reactive change amount that updates automatically
 */
const changeAmount = ref(0);

/**
 * @description Calculate change amount
 * Positive = customer gets change back
 * Negative = customer still owes money
 */
const calculateChangeAmount = () => {
  const paymentAmount = cashierOrderSummary_paymentForm.paymentAmount || 0;
  const totalPrice = cashierOrderSummary_calculateEstimation.value.data.grandTotal || 0;
  changeAmount.value = +paymentAmount - +totalPrice;
};

/**
 * @description Handle real-time input changes
 */
const handlePaymentInput = (event: { value: string | number | undefined }) => {
  // Update the model value immediately
  const numericValue = typeof event.value === 'string' ? parseFloat(event.value) || 0 : event.value || 0;
  cashierOrderSummary_paymentForm.paymentAmount = numericValue;
  // Trigger calculation immediately
  calculateChangeAmount();
};

/**
 * @description Watch for changes in payment amount and auto-calculate change
 */
watch(
  () => cashierOrderSummary_paymentForm.paymentAmount,
  () => {
    calculateChangeAmount();
  },
  { immediate: true },
);

/**
 * @description Watch for changes in total price and auto-calculate change
 */
watch(
  () => cashierOrderSummary_calculateEstimation.value.data.grandTotal,
  () => {
    calculateChangeAmount();
  },
  { immediate: true },
);

const handleSubmit = () => {
  v$.value.$touch();
  if (v$.value.$invalid) return;

  cashierOrderSummary_handlePlaceOrderDetail();
};
</script>
<template>
  <section id="cashier-summary-modal-place-order-detail">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalPlaceOrderDetail.show"
      modal
      class="rounded-t-4xl lg:rounded-lg p-0 m-0"
      :position="useIsMobile() || useIsTablet() ? 'bottom' : 'center'"
      :style="{ width: '34rem' }"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-place-order-detail-content" class="flex flex-col gap-6 p-6 h-full">
          <section
            id="cashier-summary-modal-place-order-detail-content-body"
            class="flex flex-col gap-5 flex-grow overflow-y-auto"
          >
            <div class="flex flex-col gap-2">
              <span class="text-base lg:text-lg font-semibold">{{
                useLocalization('cashier.orderSummary.placeOrderDetail.title')
              }}</span>
              <span class="hidden lg:block text-grayscale-70 text-xs lg:text-sm">{{
                useLocalization('cashier.orderSummary.placeOrderDetail.enterPaymentAmount')
              }}</span>
            </div>

            <PrimeVueButton class="cursor-default text-black border-primary-border bg-primary-background">
              <div class="flex justify-between w-full">
                <span class="text-sm lg:text-base">{{
                  useLocalization('cashier.orderSummary.placeOrderDetail.paymentMethod')
                }}</span>
                <div class="gap-1 font-semibold flex items-center text-sm lg:text-base">
                  <AppBaseSvg name="cash" class="!w-4 !h-4" />
                  {{ useLocalization('cashier.orderSummary.placeOrderDetail.cash') }}
                </div>
              </div>
            </PrimeVueButton>

            <AppBaseFormGroup
              v-slot="{ classes }"
              class="flex flex-col gap-1"
              label-for="payment-amount"
              name="Payment Amount"
              :validators="v$.paymentAmount"
            >
              <label for="payment-amount" class="text-xs lg:text-sm">
                {{ useLocalization('cashier.orderSummary.placeOrderDetail.paymentAmount') }}
              </label>

              <PrimeVueIconField class="flex w-full">
                <PrimeVueInputIcon>
                  <div class="flex gap-2">
                    <AppBaseSvg name="cash" class="!w-4 !h-4" />
                  </div>
                </PrimeVueInputIcon>
                <PrimeVueInputNumber
                  id="payment-amount"
                  v-model="cashierOrderSummary_paymentForm.paymentAmount"
                  :class="[classes, 'w-full']"
                  :placeholder="useLocalization('cashier.orderSummary.placeOrderDetail.paymentAmountPlaceholder')"
                  @input="handlePaymentInput"
                  @update:model-value="calculateChangeAmount"
                />
              </PrimeVueIconField>
            </AppBaseFormGroup>

            <section id="list-balances" class="flex flex-wrap items-center gap-2 w-full">
              <PrimeVueChip
                v-for="suggestionPrice in CASH_DRAWER_LIST_SUGGESTION_REGISTER_BALANCE"
                :key="suggestionPrice"
                class="bg-secondary-background cursor-pointer hover:bg-secondary basic-smooth-animation"
                @click="
                  cashierOrderSummary_paymentForm.paymentAmount = suggestionPrice;
                  calculateChangeAmount();
                "
              >
                <template #default>
                  <div class="flex items-center gap-2">
                    <AppBaseSvg name="plus-line" class="!w-[10px] !h-[10px] text-secondary-hover" />

                    <span class="font-semibold text-green-primary text-xs">
                      {{
                        useCurrencyFormat({
                          data: suggestionPrice,
                          addSuffix: true,
                        })
                      }}
                    </span>
                  </div>
                </template>
              </PrimeVueChip>
            </section>

            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <span>{{ useLocalization('cashier.orderSummary.placeOrderDetail.moneyReceived') }}</span>
                <span class="text-sm lg:text-base font-semibold">{{
                  useCurrencyFormat({
                    data: cashierOrderSummary_paymentForm.paymentAmount,
                  })
                }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ useLocalization('cashier.orderSummary.placeOrderDetail.totalPrice') }}</span>
                <span class="text-sm lg:text-base font-semibold">{{
                  useCurrencyFormat({
                    data: cashierOrderSummary_calculateEstimation?.data?.grandTotal || 0,
                  })
                }}</span>
              </div>

              <hr />

              <div class="flex justify-between">
                <span class="text-sm lg:text-base font-bold">
                  {{
                    changeAmount >= 0
                      ? useLocalization('cashier.orderSummary.placeOrderDetail.changeAmount')
                      : 'Amount Due'
                  }}
                </span>
                <span
                  class="text-sm lg:text-base font-semibold"
                  :class="changeAmount >= 0 ? 'text-primary' : 'text-error'"
                >
                  {{ useCurrencyFormat({ data: changeAmount }) }}
                </span>
              </div>
            </div>
            <div class="flex flex-col gap-2 justify-between"></div>
          </section>

          <div class="flex justify-end gap-4 w-full">
            <PrimeVueButton
              class="border-primary text-primary py-2.5 w-1/2"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              :disabled="cashierOrderSummary_modalPlaceOrderDetail.isLoading"
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none text-white py-2.5 w-1/2"
              type="button"
              :label="useLocalization('cashier.orderSummary.placeOrderDetail.placeOrder')"
              :disabled="cashierOrderSummary_modalPlaceOrderDetail.isLoading"
              :loading="cashierOrderSummary_modalPlaceOrderDetail.isLoading"
              @click="handleSubmit()"
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
