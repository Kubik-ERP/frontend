<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalOrderType, cashierOrderSummary_handleOrderType } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <section id="cashier-summary-modal-order-type">
    <PrimeVueDialog v-model:visible="cashierOrderSummary_modalOrderType.show" modal :style="{ width: '34rem' }">
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-order-type" class="flex flex-col gap-6 p-6">
          <section id="cashier-summary-modal-order-type-form" class="flex flex-col gap-3">
            <section id="cashier-summary-modal-order-type-form-title" class="flex flex-col gap-2 mb-">
              <span class="font-semibold text-lg"> Order Type </span>
              <span class="text-sm text-grayscale-70"> Select Order Type </span>
            </section>

            <div
              v-for="category in cashierOrderSummary_modalOrderType.data"
              :key="category.code"
              class="flex items-center gap-2 rounded-xs px-3 py-4"
              :class="{
                'cursor-pointer': category.available,
                'border border-primary-border bg-primary-background drop-shadow-sm':
                  cashierOrderSummary_modalOrderType.selectedOrderType === category.code,
                'hover:bg-grayscale-10/25 border border-grayscale-20':
                  cashierOrderSummary_modalOrderType.selectedOrderType !== category.code && category.available,
                'cursor-not-allowed bg-grayscale-20 text-text-disabled': category.available === false,
              }"
              @click="
                category.available ? (cashierOrderSummary_modalOrderType.selectedOrderType = category.code) : null
              "
            >
              <PrimeVueRadioButton
                v-model="cashierOrderSummary_modalOrderType.selectedOrderType"
                :input-id="category.label"
                name="dynamic"
                :disabled="category.available === false"
                :value="category.code"
              />
              <section id="cashier-summary-modal-order-type" class="flex gap-2 items-center">
                <label class="font-semibold" :for="category.label">{{ category.label }}</label>
                <span v-if="!category.available" class="text-xs">Unavailable</span>
              </section>
            </div>
          </section>

          <div class="flex justify-end gap-2">
            <PrimeVueButton
              class="border-primary text-primary py-2.5 px-14"
              type="button"
              label="Cancel"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary border-none text-white py-2.5 px-14"
              type="button"
              label="Apply"
              :disabled="!cashierOrderSummary_modalOrderType.selectedOrderType"
              @click="
                cashierOrderSummary_modalOrderType.show = false;
                cashierOrderSummary_handleOrderType();
              "
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
