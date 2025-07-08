<script setup lang="ts">
// Components
import KitchenQueueCtaButton from '../components/KitchenQueueCtaButton.vue';
import KitchenQueueDummyItemHeight from '../components/KitchenQueueDummyItemHeight.vue';
import KitchenQueueInvoicePreview from '../components/KitchenQueueInvoicePreview.vue';
import KitchenQueueNavbar from '../components/KitchenQueueNavbar.vue';

// Service
import { IKitchenQueueProvided } from '../interfaces';
import { useKitchenQueue } from '../services/kitchen-queue.service';

const {
  kitchenQueue_invoices,
  kitchenQueue_dummyRefs,
  kitchenQueue_columns,
  kitchenQueue_durations,
  kitchenQueue_generateColor,
  kitchenQueue_generateChipColor,
  kitchenQueue_handleChangeStatus,
} = useKitchenQueue();

/**
 * @description Provide all the data and methods needed for kitchen queue
 */
provide<IKitchenQueueProvided>('kitchenQueue', {
  kitchenQueue_invoices,
  kitchenQueue_dummyRefs,
  kitchenQueue_columns,
  kitchenQueue_durations,
  kitchenQueue_generateColor,
  kitchenQueue_generateChipColor,
  kitchenQueue_handleChangeStatus,
});
</script>

<template>
  <section id="kitchen-queue" class="flex flex-col h-screen">
    <KitchenQueueNavbar />
    <KitchenQueueCtaButton />

    <section id="kitchen-queue-content" class="w-full flex-1 overflow-hidden mt-2 box-border">
      <KitchenQueueDummyItemHeight />
      <KitchenQueueInvoicePreview />
    </section>
  </section>
</template>

<style scoped>
::v-deep(.p-metergroup) {
  gap: 4px;
}
</style>
