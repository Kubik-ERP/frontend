<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderDetail_data,
  purchaseOrderDetail_dynamicButtonAction,
  purchaseOrderDetail_dynamicButtonLabel,
  purchaseOrderDetail_onCancel,
} = inject<IPurchaseOrderDetailProvided>('purchaseOrderDetail')!;
</script>

<template>
  <section
    v-if="
      purchaseOrderDetail_data?.orderStatus.toUpperCase() !== 'CANCELLED' &&
      purchaseOrderDetail_data?.orderStatus.toUpperCase() !== 'PAID'
    "
    id="purchase-order-detail-button-actions"
    class="flex items-center justify-between w-full"
  >
    <PrimeVueButton
      class="bg-primary border-none text-base py-3 w-full max-w-40"
      :label="purchaseOrderDetail_dynamicButtonLabel(purchaseOrderDetail_data?.orderStatus ?? '')"
      type="button"
      @click="purchaseOrderDetail_dynamicButtonAction(purchaseOrderDetail_data?.orderStatus ?? '')"
    />

    <PrimeVueButton
      class="w-fit px-4 py-3"
      variant="text"
      @click="purchaseOrderDetail_onCancel(purchaseOrderDetail_data?.id ?? '')"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2 w-full">
          <AppBaseSvg name="close-red" class="!w-4 !h-4" />
          <span class="font-semibold text-sm text-error-main">Cancel Purchase Order</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
