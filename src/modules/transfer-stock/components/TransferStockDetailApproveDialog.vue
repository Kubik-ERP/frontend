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
  <AppBaseDialog
    id="transfer-stock-detail-approve"
    title="Approve Transfer Stock"
    custom-body-class="px-6"
    custom-footer-class="px-6 pb-6"
    custom-header-class="px-6 pt-6"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Are you sure you want to approve this transfer stock?
        </p>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="border border-gray-300 text-gray-700 px-4 py-2"
          label="Cancel"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogApprove"
        />
        <PrimeVueButton
          class="bg-blue-600 text-white px-4 py-2"
          label="Approve"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitApprove"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>