<script setup lang="ts">
// Composables
import { useIsMobile, useIsTablet } from '@/app/composables/useBreakpoint';

// Interface
import { ISelfOrderProvided } from '@/modules/self-order/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_modalOrderType } = inject<ISelfOrderProvided>('selfOrder')!;
</script>

<template>
  <section id="self-order-summary-modal-order-type">
    <PrimeVueDialog
      v-model:visible="selfOrder_modalOrderType.show"
      modal
      :style="{ width: '34rem' }"
      :position="useIsMobile() || useIsTablet() ? 'bottom' : 'center'"
      class="p-0 m-0 rounded-t-4xl lg:rounded-lg"
    >
      <template #container>
        <section id="self-order-summary-modal-order-type" class="flex flex-col gap-6 p-6">
          <section id="self-order-summary-modal-order-type-form" class="flex flex-col gap-3">
            <section id="self-order-summary-modal-order-type-form-title" class="flex flex-col gap-2 mb-">
              <span class="font-semibold text-lg">
                /* Lines 27-28 omitted */
              </span>
              <span class="text-sm text-grayscale-70">
                /* Lines 30-31 omitted */
              </span>
            </section>

            <div
              v-for="category in selfOrder_modalOrderType.data"
              :key="category.code"
              class="flex items-center gap-2 rounded-xs px-3 py-4"
              :class="{
                'cursor-pointer': category.available,
                'border border-primary-border bg-primary-background drop-shadow-sm':
                  selfOrder_modalOrderType.selectedOrderType === category.code,
                'hover:bg-grayscale-10/25 border border-grayscale-20':
                  selfOrder_modalOrderType.selectedOrderType !== category.code && category.available,
                'cursor-not-allowed bg-grayscale-20 text-text-disabled': category.available === false,
              }"
              @click="
                category.available ? (selfOrder_modalOrderType.selectedOrderType = category.code) : null
              "
            >
              <PrimeVueRadioButton
                v-model="selfOrder_modalOrderType.selectedOrderType"
                :input-id="category.label"
                name="dynamic"
                :disabled="category.available === false"
                :value="category.code"
              />
              <section id="self-order-summary-modal-order-type-item" class="flex gap-2 items-center">
                <label class="font-semibold" :for="category.label">{{ category.label }}</label>
                <span v-if="!category.available" class="text-xs">{{
                  useLocalization('cashier.unavailable')
                }}</span>
              </section>
            </div>
          </section>

          <div class="flex justify-end gap-2">
            <PrimeVueButton
              :label="useLocalization('common.button.cancel')"
              severity="secondary"
              @click="selfOrder_modalOrderType.show = false"
            />
            <PrimeVueButton
              :label="useLocalization('common.button.save')"
              @click="selfOrder_modalOrderType.show = false"
            />
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
