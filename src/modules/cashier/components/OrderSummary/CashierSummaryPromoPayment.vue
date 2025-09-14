<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalVoucher, cashierOrderSummary_modalPaymentMethod } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

const selectedVoucherLabel = computed(() => {
  const selected = cashierOrderSummary_modalVoucher.value.data.find(
    f => f.code === cashierOrderSummary_modalVoucher.value.form.voucher_code,
  );
  return selected?.label || useLocalization('cashier.orderSummary.promoVoucher');
});

const selectedPaymentMethod = computed(() =>
  cashierOrderSummary_modalPaymentMethod.value.data.find(
    f => f.id === cashierOrderSummary_modalPaymentMethod.value.selectedPaymentMethod,
  ),
);

const selectedPaymentIcon = computed(() => selectedPaymentMethod.value?.iconName || 'voucher');

const selectedPaymentName = computed(
  () => selectedPaymentMethod.value?.name || useLocalization('cashier.orderSummary.paymentMethod'),
);
</script>

<template>
  <section id="cashier-summary-promo-payment" class="border-b-2 border-b-grayscale-10 p-2">
    <div class="flex flex-col lg:flex-row w-full p-2 gap-4 bg-primary-background">
      <PrimeVueButton
        class="w-full lg:w-1/2 py-2 border border-primary-border text-sm text-primary"
        :class="cashierOrderSummary_modalVoucher.form.voucher_code ? 'bg-white' : ''"
        outlined
        :disabled="route.name === 'cashier-order-edit'"
        @click="cashierOrderSummary_modalVoucher.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <div v-if="cashierOrderSummary_modalVoucher.form.voucher_code" class="flex gap-2 items-center">
              <AppBaseSvg name="tag" class="!h-5 !w-5" />

              <span class="font-semibold text-sm truncate">
                {{ selectedVoucherLabel }}
              </span>
            </div>
            <div v-else class="flex gap-2 w-full items-center justify-between">
              <span class="font-semibold text-sm truncate">
                {{ useLocalization('cashier.orderSummary.promoVoucher') }}
              </span>

              <AppBaseSvg name="voucher" class="!h-5 !w-5" />
            </div>
          </section>
        </template>
      </PrimeVueButton>
      <PrimeVueButton
        class="w-full lg:w-1/2 py-2 border border-primary-border text-sm text-primary"
        :class="cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod ? 'bg-white' : ''"
        outlined
        :disabled="route.name === 'cashier-order-edit'"
        @click="cashierOrderSummary_modalPaymentMethod.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <div
              v-if="cashierOrderSummary_modalPaymentMethod.selectedPaymentMethod"
              class="flex gap-2 items-center"
            >
              <AppBaseSvg :name="selectedPaymentIcon" class="!h-5 !w-5" />

              <span class="font-semibold text-sm truncate">
                {{ selectedPaymentName }}
              </span>
            </div>
            <span v-else class="font-semibold text-sm truncate">
              {{ useLocalization('cashier.orderSummary.paymentMethod') }}
            </span>

            <i class="pi pi-chevron-right" />
          </section>
        </template>
      </PrimeVueButton>
    </div>
  </section>
</template>
