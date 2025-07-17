<script setup lang="ts">
// Interface
import type { IKitchenQueueProvided } from '@/modules/kitchen-queue/interfaces';

// Inject kitchen queue context
const { kitchenQueue_invoices, kitchenQueue_meterValue, kitchenQueue_handleScrollHorizontal } =
  inject<IKitchenQueueProvided>('kitchenQueue')!;
</script>
<template>
  <section
    id="kitchen-queue-nav-control"
    class="flex w-full p-2 items-center justify-center border-t border-t-grayscale-10 border-b border-b-grayscale-10 gap-6"
  >
    <PrimeVueButton @click="kitchenQueue_handleScrollHorizontal('left')">
      <AppBaseSvg name="chevron-left-white" />
    </PrimeVueButton>
    <PrimeVueMeterGroup
      :value="[kitchenQueue_meterValue.meter]"
      :max="kitchenQueue_meterValue.max"
      label-position="start"
    >
      <template #label>
        <div class="pr-72">
          <div class="flex text-xs gap-2.5">
            <AppBaseSvg name="order-primary" />

            <span
              >Showing <span class="font-semibold">{{ kitchenQueue_invoices.length }} Invoices</span></span
            >
          </div>
        </div>
      </template>
    </PrimeVueMeterGroup>
    <PrimeVueButton @click="kitchenQueue_handleScrollHorizontal('right')">
      <AppBaseSvg name="chevron-right-white" />
    </PrimeVueButton>
  </section>
</template>
