<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockDetail_data,
  transferStockDetail_dynamicButtonAction,
  transferStockDetail_dynamicButtonLabel,
  transferStockDetail_onCancel,
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;
</script>

<template>
  <section
    v-if="
      transferStockDetail_data?.status?.toLowerCase() !== 'cancelled' &&
      transferStockDetail_data?.status?.toLowerCase() !== 'canceled' &&
      transferStockDetail_data?.status?.toLowerCase() !== 'closed'
    "
    id="transfer-stock-detail-button-actions"
    class="flex items-center justify-between w-full"
  >
    <PrimeVueButton
      class="bg-primary border-none text-base py-3 w-full max-w-40"
      :label="transferStockDetail_dynamicButtonLabel(transferStockDetail_data?.status ?? '')"
      type="button"
      @click="transferStockDetail_dynamicButtonAction(transferStockDetail_data?.status ?? '')"
    />

    <PrimeVueButton
      class="w-fit px-4 py-3"
      variant="text"
      @click="transferStockDetail_onCancel()"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2 w-full">
          <AppBaseSvg name="close-red" class="w-4! h-4!" />
          <span class="font-semibold text-sm text-error-main">Cancel Transfer Stock</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>