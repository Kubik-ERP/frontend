<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { purchaseOrderCreateEdit_isEditMode, purchaseOrderCreateEdit_onResetForm } = inject(
  'purchaseOrderCreateEdit',
) as IPurchaseOrderCreateEditProvided;

/**
 * @description Handle cancel button click
 */
const onCancel = () => {
  purchaseOrderCreateEdit_onResetForm();
};
</script>

<template>
  <section id="purchase-order-create-edit-button-actions" class="flex items-center gap-4 w-fit">
    <PrimeVueButton
      class="border-blue-primary bg-transparent font-semibold text-base text-blue-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
      label="Cancel"
      severity="secondary"
      variant="outlined"
      @click="onCancel"
    />

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px] w-36"
      :label="purchaseOrderCreateEdit_isEditMode ? 'Update' : 'Create'"
      type="submit"
    />
  </section>
</template>
