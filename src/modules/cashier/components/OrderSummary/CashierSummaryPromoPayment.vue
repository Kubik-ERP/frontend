<script setup lang="ts">
// Interface
import type { ICashierCustomerProvided } from '@/modules/cashier/interfaces/cashier-customer.interface';
import type { ICashierPaymentProvided } from '@/modules/cashier/interfaces/cashier-payment.interface';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const { cashierCustomer_modalVoucher } =
  inject<ICashierCustomerProvided>('cashierCustomer')!;

const { cashierPayment_modalPaymentMethod } =
  inject<ICashierPaymentProvided>('cashierPayment')!;

const selectedVoucherLabel = computed(() => {
  const selected = cashierCustomer_modalVoucher.value.data.find(
    f => f.code === cashierCustomer_modalVoucher.value.form.voucher_code,
  );
  return selected?.label || useLocalization('cashier.orderSummary.promoVoucher');
});

const selectedPaymentMethod = computed(() =>
  cashierPayment_modalPaymentMethod.value.data.find(
    f => f.id === cashierPayment_modalPaymentMethod.value.selectedPaymentMethod,
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
  <section id="cashier-summary-promo-payment" class="border-b-2 border-b-grayscale-10 p-2">
    <div class="flex flex-col lg:flex-row w-full gap-4">
      <PrimeVueButton
        v-if="voucherPermission"
        class="w-full lg:w-1/2 py-2 border border-primary-border text-primary "
        :class="cashierCustomer_modalVoucher.form.voucher_code ? 'bg-white' : ''"
        outlined
        :disabled="route.name === 'cashier-order-edit'"
        @click="cashierCustomer_modalVoucher.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <div v-if="cashierCustomer_modalVoucher.form.voucher_code" class="flex gap-2 items-center">
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
        :class="cashierPayment_modalPaymentMethod.selectedPaymentMethod ? 'bg-white' : ''"
        outlined
        :disabled="route.name === 'cashier-order-edit'"
        @click="cashierPayment_modalPaymentMethod.show = true"
      >
        <template #default>
          <section class="flex justify-between px-5 w-full items-center">
            <div
              v-if="cashierPayment_modalPaymentMethod.selectedPaymentMethod"
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
