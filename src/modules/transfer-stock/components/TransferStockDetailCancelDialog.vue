<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockDetail_formDataOfCancel,
  transferStockDetail_formValidationsOfCancel,
  transferStockDetail_onCloseDialogCancel,
  transferStockDetail_onSubmitCancel,
  transferStockDetail_isLoading,
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;
</script>

<template>
  <AppBaseDialog
    id="transfer-stock-detail-cancel"
    title="Cancel Transfer Stock"
    custom-body-class="px-6"
    custom-footer-class="px-6 pb-6"
    custom-header-class="px-6 pt-6"
  >
    <template #body>
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Are you sure you want to cancel this transfer stock? Please provide a reason for cancellation.
        </p>
        <div>
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="font-normal text-sm text-text-secondary w-full"
            is-name-as-label
            label-for="note"
            name="Cancellation Reason"
            :validators="transferStockDetail_formValidationsOfCancel.note"
          >
            <PrimeVueTextarea
              v-model="transferStockDetail_formDataOfCancel.note"
              name="note"
              placeholder="Enter reason for cancellation..."
              :class="{ ...classes }"
              class="text-sm w-full"
              rows="3"
              v-on="useListenerForm(transferStockDetail_formValidationsOfCancel, 'note')"
            />
          </AppBaseFormGroup>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="border border-gray-300 text-gray-700 px-4 py-2"
          label="Cancel"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogCancel"
        />
        <PrimeVueButton
          class="bg-red-600 text-white px-4 py-2"
          label="Confirm Cancel"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitCancel"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>