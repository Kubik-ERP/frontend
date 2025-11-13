<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockDetail_onCloseDialogApprove,
  transferStockDetail_onSubmitApprove,
  transferStockDetail_isLoading,
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;
</script>

<template>
  <AppBaseDialog id="transfer-stock-detail-approve">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Approve Transfer Stock</h6>
      </header>
    </template>

    <template #content>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Are you sure you want to approve this transfer stock?
        </p>
      </div>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogApprove"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-3 w-full max-w-40"
          label="Approve"
          type="button"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitApprove"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>