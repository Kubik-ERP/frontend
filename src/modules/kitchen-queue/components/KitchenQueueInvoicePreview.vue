<script setup lang="ts">
// Vue
import { inject } from 'vue';

// Interface
import type { IKitchenQueueProvided } from '@/modules/kitchen-queue/interfaces';
import {
  DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS,
  DAILY_SALES_LIST_TYPES_OF_ORDER_TYPE,
} from '@/modules/daily-sales/constants';

// Inject kitchen queue context
const {
  kitchenQueue_columns,
  kitchenQueue_generateColor,
  kitchenQueue_durations,
  kitchenQueue_generateChipColor,
  kitchenQueue_handleChangeStatus,
} = inject<IKitchenQueueProvided>('kitchenQueue')!;
</script>

<template>
  <div class="w-full h-[calc(100vh)] overflow-hidden box-border">
    <div
      class="grid h-full overflow-x-auto gap-4 px-4"
      style="grid-auto-flow: column; grid-auto-rows: max-content"
    >
      <div
        v-for="(col, i) in kitchenQueue_columns"
        :key="i"
        class="flex flex-col space-y-4 w-72 flex-shrink-0 rounded"
      >
        <div
          v-for="(invoice, j) in col"
          :key="j"
          class="flex flex-col bg-white rounded shadow border"
          :class="kitchenQueue_generateColor(invoice.status).border"
        >
          <!-- Header invoice pertama -->
          <div
            v-if="invoice.isFirst"
            :class="`${kitchenQueue_generateColor(invoice.status).header} text-white px-4 py-3 rounded-t`"
          >
            <div class="flex justify-between">
              <div class="flex gap-2">
                <span>#{{ invoice.globalIndex }}</span>
                <span>{{ invoice.customer }}</span>
              </div>
              <div>
                <span class="text-[10px]">#{{ invoice.id }}</span>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <p class="text-xs">
                Duration:
                <span class="font-bold">
                  {{ kitchenQueue_durations[invoice.id] || '00:00:00' }}
                </span>
              </p>

              <div class="flex items-center gap-2">
                <p class="text-xs">{{ invoice.tableNumber }}</p>
                <PrimeVueChip size="small" class="text-primary text-[10px] p-1 px-2">{{
                  DAILY_SALES_LIST_TYPES_OF_ORDER_TYPE.find(f => f.value === invoice.orderType)?.label ||
                  invoice.orderType
                }}</PrimeVueChip>
              </div>
            </div>
          </div>

          <!-- Content item invoice -->
          <div :class="'space-y-2 overflow-hidden ' + kitchenQueue_generateColor(invoice.status).background">
            <div v-if="!invoice.isFirst" class="text-xs ml-2 pt-2 text-[#434343]">
              #{{ invoice.globalIndex }} Continue {{ invoice.indexCounter + 1 }} of
              {{ invoice.totalPage }}
            </div>

            <div :class="[!invoice.isFirst ? 'py-0 px-4' : 'p-4']">
              <!-- Tombol untuk menyelesaikan pesanan -->
              <div v-if="invoice.isFirst" class="w-full flex mb-2">
                <PrimeVueButton class="w-full flex gap-4 py-1" icon="pi pi-check" size="small">
                  <AppBaseSvg name="checkCircle" />
                  Order Complete
                </PrimeVueButton>
              </div>

              <!-- List item -->
              <div v-for="(item, index) in invoice.items" :key="index" class="flex flex-col gap-1 mt-3">
                <div class="font-semibold text-sm flex justify-between">
                  <span>{{ item.name }}</span>
                  <PrimeVueButton
                    size="small"
                    variant="outlined"
                    class="text-[10px] py-1 px-2 rounded-full"
                    :class="kitchenQueue_generateChipColor(item.status)"
                    @click="kitchenQueue_handleChangeStatus(invoice.id, index, item.status)"
                  >
                    {{
                      DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS.find(f => {
                        return f.value === item.status;
                      })?.label || item.status
                    }}
                  </PrimeVueButton>
                </div>

                <div class="ml-4 flex flex-col gap-1">
                  <div v-if="item.variant" class="text-primary text-xs">
                    {{ item.variant }}
                  </div>
                  <div v-if="item.notes" class="flex flex-col text-xs gap-1">
                    <span class="font-semibold">Notes</span>
                    <span class="text-primary">{{ item.notes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="invoice.totalPage > 1" class="ml-4 pb-2 text-xs text-[#434343]">
              #{{ invoice.globalIndex }} Continue {{ invoice.indexCounter + 1 }} of
              {{ invoice.totalPage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
