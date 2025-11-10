<script setup lang="ts">
// Interfaces
import type { ITransferStockCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockCreateEdit_isEditMode,
  transferStockCreateEdit_onResetForm,
  transferStockCreateEdit_onSubmitForm,
} = inject('transferStockCreateEdit') as ITransferStockCreateEditProvided;

/**
 * @description Handle cancel button click
 */
const onCancel = () => {
  transferStockCreateEdit_onResetForm();
};
</script>

<template>
  <section id="transfer-stock-create-edit-button-actions" class="flex items-center gap-4 w-fit">
    <PrimeVueButton
      class="border-primary bg-transparent font-semibold text-base text-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
      label="Cancel"
      severity="secondary"
      variant="outlined"
      @click="onCancel"
    />

    <PrimeVueButton
      class="bg-primary border-none text-sm py-[10px] w-36"
      :label="transferStockCreateEdit_isEditMode ? 'Update' : 'Create'"
      type="submit"
      @click="transferStockCreateEdit_onSubmitForm"
    />
  </section>
</template>