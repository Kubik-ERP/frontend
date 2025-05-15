<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleToggleSelectTable,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

// Composables
import { useIsMobile, useIsTablet } from '@/app/composables/useBreakpoint';
</script>
<template>
  <section id="cashier-summary-modal-select-table">
    <PrimeVueDialog
      v-model:visible="cashierOrderSummary_modalSelectTable.show"
      modal
      :style="{
        width: useIsMobile() || useIsTablet() ? '100dvw' : '85%',
        minHeight: useIsMobile() || useIsTablet() ? '100dvh' : '500px',
        maxHeight: useIsMobile() || useIsTablet() ? '100dvh' : 'calc(100dvh - 50px)',
      }"
      class="p-0 m-0 rounded-none lg:rounded-lg"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-select-table" class="flex flex-col gap-6 p-6 flex-1 min-h-0">
          <!-- Form -->
          <section id="cashier-summary-modal-select-table-form" class="flex flex-col gap-3">
            <section id="cashier-summary-modal-select-table-form-title" class="flex flex-col gap-2">
              <div class="flex justify-between">
                <div class="flex gap-2 items-center">
                  <AppBaseSvg
                    name="chevron-left"
                    class="!h-4 !w-4 block lg:hidden cursor-pointer"
                    @click="closeCallback"
                  />
                  <span class="font-semibold text-lg">Table</span>
                </div>
                <section id="status" class="flex lg:hidden items-center gap-2">
                  <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
                  <span class="font-normal text-disabled text-xs">Online</span>
                </section>
              </div>
              <span class="hidden lg:block text-sm text-grayscale-70">Select Table</span>
            </section>
          </section>

          <!-- Body -->
          <section id="cashier-summary-modal-select-table-body" class="gap-4 grid grid-cols-12 flex-1 min-h-0">
            <!-- Left Section -->
            <div
              class="col-span-12 lg:col-span-7 xl:col-span-9 border border-grayscale-10 flex flex-col gap-4 rounded-xs p-2 flex-1 min-h-0"
            >
              <div class="flex gap-4 items-center">
                <span class="font-semibold">Floor</span>

                <PrimeVueSelect
                  v-model="cashierOrderSummary_modalSelectTable.activeFloor"
                  :options="cashierOrderSummary_modalSelectTable.listFloor"
                  placeholder="Select Floor"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  :disabled="!cashierOrderSummary_modalSelectTable.listFloor.length"
                />
              </div>

              <!-- Scrollable Content -->
              <div
                class="flex-1 overflow-auto"
                :class="{
                  'flex items-center justify-center h-full w-full': !cashierOrderSummary_getListActiveFloor.length,
                }"
              >
                <div
                  class="hidden col-span-1 col-span-2 col-span-3 col-span-4 col-span-5 col-span-6 col-span-7 col-span-8 col-span-9 col-span-10 col-span-11 col-span-12"
                ></div>

                <template v-if="cashierOrderSummary_getListActiveFloor.length">
                  <div class="grid grid-cols-12 gap-2">
                    <div
                      v-for="(item, key) in cashierOrderSummary_getListActiveFloor"
                      :key="key"
                      :class="[
                        `col-span-${item.totalSeat}`,
                        'relative flex flex-col items-center justify-center gap-1 border py-6',
                        {
                          'cursor-pointer text-secondary-hover border-secondary': item.available,
                          'bg-secondary-hover text-white':
                            cashierOrderSummary_modalSelectTable.selectedTable.includes(item.value),
                          'bg-disabled text-text-disabled cursor-not-allowed border-disabled':
                            item.available === false,
                        },
                      ]"
                      @click="item.available ? cashierOrderSummary_handleToggleSelectTable(item.value) : null"
                    >
                      <span class="text-xs lg:text-base font-semibold">{{ item.label }}</span>
                      <span class="text-[10px] lg:text-sm">{{
                        item.available ? 'Available' : 'Unavailable'
                      }}</span>
                      <span v-if="item.available" class="text-[10px] lg:text-sm">{{ item.totalSeat }} seats</span>
                    </div>
                  </div>
                </template>
                <span v-else class="text-text-disabled">No Data Found</span>
              </div>
            </div>

            <!-- Right Section -->
            <div
              class="col-span-12 lg:col-span-5 xl:col-span-3 flex-1 overflow-auto border border-grayscale-10 flex flex-col gap-2 lg:gap-4 rounded-xs p-2"
            >
              <span class="text-sm lg:text-lg font-semibold">Available Table</span>

              <span class="text-[10px] lg:text-xs text-text-disabled"
                >Floor {{ cashierOrderSummary_modalSelectTable.activeFloor }}</span
              >

              <template v-if="cashierOrderSummary_getListActiveFloor.length">
                <div
                  v-for="(item, key) in cashierOrderSummary_getListActiveFloor"
                  :key="key"
                  class="flex flex-col gap-2"
                >
                  <div
                    :class="[
                      'flex gap-2 px-3 py-4 rounded-xs',
                      {
                        'cursor-pointer bg-primary-background border-primary-border':
                          cashierOrderSummary_modalSelectTable.selectedTable.includes(item.value),

                        'cursor-not-allowed bg-grayscale-20 text-text-disabled border border-grayscale-20':
                          item.available === false,

                        'cursor-pointer hover:bg-grayscale-10/25 border border-grayscale-10 hover:border-primary-border':
                          item.available &&
                          !cashierOrderSummary_modalSelectTable.selectedTable.includes(item.value),
                      },
                    ]"
                    @click="cashierOrderSummary_handleToggleSelectTable(item.value)"
                  >
                    <PrimeVueCheckbox
                      :model-value="cashierOrderSummary_modalSelectTable.selectedTable.includes(item.value)"
                      binary
                      :disabled="item.available === false"
                    ></PrimeVueCheckbox>
                    <span class="text-sm font-semibold">{{ item.label }}</span>
                    <span class="text-text-disabled text-sm">{{ item.totalSeat }} Seats</span>
                  </div>
                </div>
              </template>
              <div v-else class="flex w-full h-full items-center justify-center text-xs text-text-disabled">
                No Data Found
              </div>
            </div>
          </section>

          <!-- Footer -->
          <div class="flex justify-end gap-2">
            <PrimeVueButton
              class="border-primary hidden lg:block text-primary py-2.5 px-14"
              type="button"
              label="Cancel"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary w-full lg:w-fit border-none text-white py-2.5 px-14"
              type="button"
              label="Select Table"
              :disabled="!cashierOrderSummary_modalSelectTable.selectedTable"
              @click="
                cashierOrderSummary_modalSelectTable.show = false;
                cashierOrderSummary_handleSelectTable();
              "
            ></PrimeVueButton>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
