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
  <AppBaseDialog id="transfer-stock-detail-cancel">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Cancel Transfer Stock</h6>
      </header>
    </template>

    <template #content>
      <form action="" class="flex flex-col w-full">
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
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogCancel"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-3 w-full max-w-40"
          label="Confirm Cancel"
          type="button"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitCancel"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>