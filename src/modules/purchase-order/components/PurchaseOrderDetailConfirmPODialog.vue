<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderDetail_formDataOfConfirm,
  purchaseOrderDetail_formValidationsOfConfirm,
  purchaseOrderDetail_onCloseDialogConfirm,
  purchaseOrderDetail_onConfirm,
} = inject<IPurchaseOrderDetailProvided>('purchaseOrderDetail')!;
</script>

<template>
  <AppBaseDialog id="purchase-order-detail-confirm-po-dialog">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Confirm Purchase Order</h6>
      </header>
    </template>

    <template #content>
      <form action="" class="flex flex-col w-full">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="font-normal text-sm text-text-secondary w-full"
          is-name-as-label
          label-for="deliveryDate"
          name="Order Date"
          :validators="purchaseOrderDetail_formValidationsOfConfirm.deliveryDate"
        >
          <PrimeVueDatePicker
            v-model="purchaseOrderDetail_formDataOfConfirm.deliveryDate"
            name="deliveryDate"
            selection-mode="range"
            date-format="dd/mm/yy"
            show-icon
            :class="{ ...classes }"
            class="text-sm w-full"
            v-on="useListenerForm(purchaseOrderDetail_formValidationsOfConfirm, 'deliveryDate')"
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
          @click="purchaseOrderDetail_onCloseDialogConfirm"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-3 w-full max-w-40"
          label="Save"
          type="button"
          @click="purchaseOrderDetail_onConfirm"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
