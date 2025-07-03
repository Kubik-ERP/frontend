<script setup lang="ts">
// Vue
import { inject } from 'vue';

// Interface
import type { IKitchenQueueProvided } from '@/modules/kitchen-queue/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { kitchenQueue_dummyRefs, kitchenQueue_invoices } = inject<IKitchenQueueProvided>('kitchenQueue')!;
</script>

<template>
  <!-- Invisible wrapper to calculate item heights -->
  <div class="absolute top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none">
    <div v-for="invoice in kitchenQueue_invoices" :key="invoice.id">
      <div
        v-for="(item, idx) in invoice.items"
        :key="idx"
        :ref="
          el => {
            const element = el as HTMLElement | null;
            if (element) {
              kitchenQueue_dummyRefs.push(element);
            }
          }
        "
        class="rounded p-2 flex flex-col gap-1 mt-3 w-72"
      >
        <div class="font-semibold text-sm flex justify-between">
          <span>{{ item.name }}</span>
          <PrimeVueCheckbox size="small" />
        </div>

        <div class="ml-4 flex flex-col gap-1">
          <div v-if="item.variant" class="text-primary text-xs">{{ item.variant }}</div>

          <div v-if="item.notes" class="flex flex-col text-xs gap-1">
            <span class="font-semibold">Notes</span>
            <span class="text-primary">{{ item.notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
