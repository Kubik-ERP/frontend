<script setup lang="ts">
// Interface
import type { ICashierCustomerProvided } from '@/modules/cashier/interfaces/cashier-customer.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierCustomer_modalVoucher, cashierCustomer_handleVoucher } =
  inject<ICashierCustomerProvided>('cashierCustomer')!;

const localSearch = ref('');
// const localId = ref('');

watch(
  () => cashierCustomer_modalVoucher.value.data,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      const isSelectedVoucherStillAvailable = newVal.find(
        (f) => f.id === cashierCustomer_modalVoucher.value.form.voucherId && f.available,
      );

      if (isSelectedVoucherStillAvailable) {
        return;
      }

      const first = newVal.find((f) => f.available === true);
      if (first) {
        cashierCustomer_modalVoucher.value.form.voucher_code = first.code;
        cashierCustomer_modalVoucher.value.form.voucherId = first.id;
      } else {
        // kalau tidak ada voucher yang available, reset
        cashierCustomer_modalVoucher.value.form.voucher_code = '';
        cashierCustomer_modalVoucher.value.form.voucherId = '';
      }
    }
  },
  { immediate: true },
);

const rbac = useRbac();
const voucherPermission = rbac.hasPermission('voucher');
// Composables
import { useIsMobile, useIsTablet } from '@/app/composables/useBreakpoint';
</script>
<template>
  <section v-if="voucherPermission" id="cashier-summary-modal-voucher" >
    <PrimeVueDialog
      v-model:visible="cashierCustomer_modalVoucher.show"
      modal
      :position="useIsMobile() || useIsTablet() ? 'bottom' : 'center'"
      :style="{
        width: '34rem',
        height: useIsMobile() || useIsTablet() ? '100dvh' : '80dvh',
        maxHeight: useIsMobile() || useIsTablet() ? '100dvh' : '80dvh',
      }"
      class="p-0 m-0 rounded-none lg:rounded-lg"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-voucher-content" class="flex flex-col gap-6 p-6 h-full">
          <section
            id="cashier-summary-modal-voucher-content-body"
            class="flex flex-col gap-5 flex-grow overflow-y-auto"
          >
            <div class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="flex gap-2 items-center">
                  <AppBaseSvg
                    name="chevron-left"
                    class="!h-4 !w-4 block lg:hidden cursor-pointer"
                    @click="closeCallback"
                  />

                  <span class="text-lg font-semibold">{{
                    useLocalization('cashier.orderSummary.voucher.title')
                  }}</span>
                </div>

                <section id="status" class="flex lg:hidden items-center gap-2">
                  <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
                  <span class="font-normal text-disabled text-xs">{{
                    useLocalization('cashier.mainSection.online')
                  }}</span>
                </section>
              </div>
              <span class="hidden lg:block text-grayscale-70 text-sm">{{
                useLocalization('cashier.orderSummary.voucher.description')
              }}</span>
            </div>

            <PrimeVueIconField class="flex w-full">
              <PrimeVueInputIcon class="pi pi-user" />
              <PrimeVueInputText
                id="customer-name"
                v-model="localSearch"
                class="w-full"
                :placeholder="useLocalization('cashier.orderSummary.voucher.description')"
              />
            </PrimeVueIconField>

            <section
              class="flex-grow flex flex-col overflow-y-auto border border-grayscale-10 rounded-md p-2"
              :class="{ 'justify-center items-center': !cashierCustomer_modalVoucher.data.length }"
            >
              <span v-if="!cashierCustomer_modalVoucher.data.length" class="text-text-disabled">{{
                useLocalization('cashier.orderSummary.voucher.noDataVoucher')
              }}</span>

              <div
                v-for="(item, index) in cashierCustomer_modalVoucher.data"
                v-else
                :key="index"
                class="p-3 border border-disabled mb-4 rounded-md"
                :class="{
                  'bg-grayscale-10 text-text-disabled cursor-not-allowed': item.available === false,
                  ' text-text-main cursor-pointer ': item.available === true,
                  'border border-primary-border bg-primary-background':
                    cashierCustomer_modalVoucher.form.voucher_code === item.code,
                }"
                @click="
                  () => {
                    if (!item.available) {
                      cashierCustomer_modalVoucher.form.voucher_code = ''
                      cashierCustomer_modalVoucher.form.voucherId = ''
                      return
                    }

                    if (cashierCustomer_modalVoucher.form.voucher_code === item.code) {
                      cashierCustomer_modalVoucher.form.voucher_code = ''
                      cashierCustomer_modalVoucher.form.voucherId = ''
                    } else {
                      cashierCustomer_modalVoucher.form.voucher_code = item.code
                      cashierCustomer_modalVoucher.form.voucherId = item.id
                    }
                  }
                "
              >
                <div class="flex lg:flex-row flex-col items-start lg:items-center gap-2 justify-between">
                  <div class="flex flex-col gap-1">
                    <span class="font-semibold">{{ item.label }}</span>

                    <div class="flex gap-2">
                      <div
                        class="px-2 py-0.5 rounded-full bg-complementary-background"
                        :class="{
                          'bg-disabled': item.available === false,
                          'bg-complementary-background': item.available === true,
                        }"
                      >
                        <span
                          class="text-xs"
                          :class="{
                            'text-text-disabled': item.available === false,
                            'text-complementary-main': item.available === true,
                          }"
                          >{{ useLocalization('cashier.orderSummary.voucher.availableUntil') }}
                          <span class="font-semibold">{{ item.validUntil }}</span></span
                        >
                      </div>
                      <div
                        class="px-2 py-0.5 rounded-full"
                        :class="{
                          'bg-disabled': item.available === false,
                          'bg-complementary-background': item.available === true,
                        }"
                      >
                        <span
                          class="text-xs"
                          :class="{
                            'text-text-disabled': item.available === false,
                            'text-complementary-main': item.available === true,
                          }"
                        >
                          <span class="font-semibold">
                            {{ item.stock }}
                          </span>
                          {{ useLocalization('cashier.left') }}</span
                        >
                      </div>
                    </div>

                    <span class="text-xs">
                      <span class="text-text-disabled">
                        {{ useLocalization('cashier.orderSummary.voucher.minimumTransaction') }} :
                      </span>
                      Rp.{{ item.minPurchase.toLocaleString() }}</span
                    >
                  </div>
                 <div class="flex flex-col lg:text-right text-start gap-1">
                  <span class="text-xs text-text-disabled">
                    {{ useLocalization('cashier.orderSummary.voucher.discount') }}
                  </span>

                  <span class="font-semibold">
                    {{
                      item.type === 'percentage'
                        ? item.discount + '%'
                        : 'Rp ' + item.discount.toLocaleString()
                    }}
                  </span>
                </div>
                </div>
              </div>
            </section>
          </section>

          <div class="flex justify-end gap-4">
            <PrimeVueButton
              class="border-primary hidden lg:block text-primary py-2.5 px-8"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary w-full lg:w-fit border-none text-white py-2.5 px-8"
              type="button"
              :label="useLocalization('cashier.orderSummary.voucher.applyPromo')"
              @click="
                cashierCustomer_handleVoucher(cashierCustomer_modalVoucher.form.voucherId);
              "
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
