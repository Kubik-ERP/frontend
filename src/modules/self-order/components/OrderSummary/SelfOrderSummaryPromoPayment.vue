<script setup lang="ts">
// Interface
import { ISelfOrderProvided, ISelfOrderVoucher, ISelfOrderPaymentMethod } from '@/modules/self-order/interfaces';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_modalVoucher, selfOrder_modalPaymentMethod } =
  inject<ISelfOrderProvided>('selfOrder')!;

const selectedVoucherLabel = computed(() => {
  const selected = selfOrder_modalVoucher.value.data.find(
    (f: ISelfOrderVoucher) => f.code === selfOrder_modalVoucher.value.form.voucher_code,
  );
  return selected?.label || useLocalization('cashier.orderSummary.promoVoucher');
});

const selectedPaymentMethod = computed(() =>
  selfOrder_modalPaymentMethod.value.data.find(
    (f: ISelfOrderPaymentMethod) => f.id === selfOrder_modalPaymentMethod.value.selectedPaymentMethod,
  ),
);

const selectedPaymentIcon = computed(() => selectedPaymentMethod.value?.iconName || 'voucher');

const selectedPaymentName = computed(
  () => selectedPaymentMethod.value?.name || useLocalization('cashier.orderSummary.paymentMethod'),
);

const rbac = useRbac();
const voucherPermission = rbac.hasPermission('voucher');
</script>

<template>
  <section id="self-order-summary-promo-payment" class="border-b-2 border-b-grayscale-10 p-2">
    <div class="flex flex-col lg:flex-row w-full gap-4">
      <PrimeVueButton
        v-if="voucherPermission"
        class="w-full lg:w-1/2 py-2 border border-primary-border text-primary "
        :class="selfOrder_modalVoucher.form.voucher_code ? 'bg-white' : ''"
        outlined
        :disabled="route.name === 'self-order-order-edit'"
        @click="selfOrder_modalVoucher.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <div v-if="selfOrder_modalVoucher.form.voucher_code" class="flex gap-2 items-center">
              <AppBaseSvg name="tag" class="h-5 w-5 filter-primary-color" />

              <span class="font-semibold text-sm truncate">
                {{ selectedVoucherLabel }}
              </span>
            </div>
            <div v-else class="flex gap-2 w-full items-center justify-between">
              <span class="font-semibold text-sm truncate">
                {{ useLocalization('cashier.orderSummary.promoVoucher') }}
              </span>

              <AppBaseSvg name="voucher" class="h-5 w-5 filter-primary-color" />
            </div>
          </section>
        </template>
      </PrimeVueButton>
      <PrimeVueButton
        class="w-full lg:w-1/2 py-2 border border-primary-border text-sm text-primary"
        :class="selfOrder_modalPaymentMethod.selectedPaymentMethod ? 'bg-white' : ''"
        outlined
        :disabled="route.name === 'self-order-order-edit'"
        @click="selfOrder_modalPaymentMethod.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <div
              v-if="selfOrder_modalPaymentMethod.selectedPaymentMethod"
              class="flex gap-2 items-center"
            >
              <AppBaseSvg :name="selectedPaymentIcon" class="h-5 w-5 filter-primary-color" />

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
