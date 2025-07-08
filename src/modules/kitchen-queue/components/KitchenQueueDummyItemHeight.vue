<script setup lang="ts">
// Vue
import { inject } from 'vue';

// Interface
import type { IKitchenQueueProvided } from '@/modules/kitchen-queue/interfaces';
import { DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS } from '@/modules/daily-sales/constants';

/**
 * @description Inject all the data and methods what we need
 */
const { kitchenQueue_dummyRefs, kitchenQueue_invoices } = inject<IKitchenQueueProvided>('kitchenQueue')!;

// Inject kitchen queue context
const { kitchenQueue_generateChipColor, kitchenQueue_handleChangeStatus } =
  inject<IKitchenQueueProvided>('kitchenQueue')!;
</script>

<template>
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
          <span>{{ item.products.name }}</span>
          <PrimeVueButton
            size="small"
            variant="outlined"
            class="text-[10px] py-1 px-2 rounded-full"
            :class="kitchenQueue_generateChipColor(item.products.orderStatus)"
            @click="kitchenQueue_handleChangeStatus(invoice.id, idx, item.products.orderStatus)"
          >
            {{
              DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS.find(f => {
                return f.value === item.products.orderStatus;
              })?.label || item.products.orderStatus
            }}
          </PrimeVueButton>
        </div>

        <div class="ml-4 flex flex-col gap-1">
          <div v-if="item.products.variant.name" class="text-primary text-xs">
            {{ item.products.variant.name }}
          </div>
          <div v-if="item.products.notes" class="flex flex-col text-xs gap-1">
            <span class="font-semibold">Notes</span>
            <span class="text-primary">{{ item.products.notes }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
