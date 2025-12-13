<script setup lang="ts">
// Components
import KitchenQueueCtaButton from '../components/KitchenQueueCtaButton.vue';
import KitchenQueueDummyItemHeight from '../components/KitchenQueueDummyItemHeight.vue';
import KitchenQueueInvoicePreview from '../components/KitchenQueueInvoicePreview.vue';
import KitchenQueueLoading from '../components/KitchenQueueLoading.vue';
import KitchenQueueNavbar from '../components/KitchenQueueNavbar.vue';
import KitchenQueueOrderHistory from '../components/KitchenQueueOrderHistory.vue';

// Service
import { IKitchenQueueProvided } from '../interfaces';
import { useKitchenQueue } from '../services/kitchen-queue.service';

const {
  kitchenQueue_invoices,
  kitchenQueue_isLoading,
  kitchenQueue_dummyRefs,
  kitchenQueue_columns,
  kitchenQueue_durations,
  kitchenQueue_meterValue,
  kitchenQueue_scrollContainer,
  kitchenQueue_listTabs,
  kitchenQueue_generateColor,
  kitchenQueue_generateChipColor,
  kitchenQueue_handleDebounceUpdateStatus,
  kitchenQueue_handleScrollHorizontal,
  kitchenQueue_updateScrollPosition,
  kitchenQueue_handleUpdateStatus,
  kitchenQueue_handleUpdateStatusBulk,
} = useKitchenQueue();

/**
 * @description Provide all the data and methods needed for kitchen queue
 */
provide<IKitchenQueueProvided>('kitchenQueue', {
  kitchenQueue_invoices,
  kitchenQueue_isLoading,
  kitchenQueue_dummyRefs,
  kitchenQueue_columns,
  kitchenQueue_durations,
  kitchenQueue_meterValue,
  kitchenQueue_scrollContainer,
  kitchenQueue_listTabs,
  kitchenQueue_generateColor,
  kitchenQueue_generateChipColor,
  kitchenQueue_handleDebounceUpdateStatus,
  kitchenQueue_handleScrollHorizontal,
  kitchenQueue_updateScrollPosition,
  kitchenQueue_handleUpdateStatus,
  kitchenQueue_handleUpdateStatusBulk,
});
</script>

<template>
  <PrimeVueTabs v-model:value="kitchenQueue_listTabs">
    <KitchenQueueNavbar />
    <PrimeVueTabPanels>
      <PrimeVueTabPanel value="orders">
        <section id="kitchen-queue" class="flex flex-col h-screen">
          <KitchenQueueCtaButton />

          <section id="kitchen-queue-content" class="w-full flex-1 overflow-hidden mt-2 box-border">
            <KitchenQueueDummyItemHeight v-if="kitchenQueue_isLoading" />
            <template v-if="kitchenQueue_columns.length > 0 && !kitchenQueue_isLoading">
              <KitchenQueueInvoicePreview v-if="!kitchenQueue_isLoading" />
            </template>
            <template v-else-if="kitchenQueue_isLoading">
              <KitchenQueueLoading />
            </template>
            <template v-else>
              <div class="flex flex-col items-center justify-center h-full gap-2">
                <AppBaseSvg name="queue" class="!w-14 !h-14 text-gray-400 filter-primary-color" />
                <div class="text-center">
                  <p class="text-lg text-gray-500">No queue available</p>
                  <p class="text-base text-gray-400">Please wait for new orders to be added.</p>
                </div>
              </div>
            </template>
          </section>
        </section>
      </PrimeVueTabPanel>
      <PrimeVueTabPanel value="order-history">
        <KitchenQueueOrderHistory />
      </PrimeVueTabPanel>
    </PrimeVueTabPanels>
  </PrimeVueTabs>
</template>

<style scoped>
::v-deep(.p-metergroup) {
  gap: 4px;
}
</style>
