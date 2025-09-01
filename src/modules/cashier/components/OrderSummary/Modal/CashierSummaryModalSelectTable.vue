<script setup lang="ts">
// Interface
import { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

import type { IOutletTable } from '@/modules/outlet/interfaces';
/**
 * @description Destructure all the data and methods what we need
 */
const {
  accountStoreDetail_fetchOutletStoreTable,
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_operationalHours,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_storeTables,
} = useAccountStoreDetailsService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountStoreDetail', {
  accountStoreDetail_fetchOutletStoreTable,
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_operationalHours,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_storeTables,
});

import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  if (route.name !== 'self-order') {
    accountStoreDetail_fetchOutletStoreTable();
  }
});

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
import { useAccountStoreDetailsService } from '@/modules/account/services/account-store-detail.service';
import AccountStoreTableLayout from '@/modules/account/components/store-detail/AccountStoreTableLayout.vue';
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
                  <span class="font-semibold text-lg">{{
                    useLocalization('cashier.orderSummary.table.title')
                  }}</span>
                </div>
                <section id="status" class="flex lg:hidden items-center gap-2">
                  <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
                  <span class="font-normal text-disabled text-xs">{{
                    useLocalization('cashier.mainSection.online')
                  }}</span>
                </section>
              </div>
              <span class="hidden lg:block text-sm text-grayscale-70">{{
                useLocalization('cashier.orderSummary.table.selectTable')
              }}</span>
            </section>
          </section>

          <!-- Body -->
          <section id="cashier-summary-modal-select-table-body" class="gap-4 grid grid-cols-12 flex-1 min-h-0">
            <!-- Left Section -->
            <div
              class="col-span-12 lg:col-span-7 xl:col-span-9 border border-grayscale-10 flex flex-col gap-4 rounded-xs p-2 flex-1 min-h-0"
            >
              <div class="flex gap-4 items-center">
                <span class="font-semibold">{{ useLocalization('cashier.orderSummary.table.floor') }}</span>

                <PrimeVueSelect
                  v-model="accountStoreDetail_selectedFloor"
                  :options="accountStoreDetail_listAvailableFloor"
                  :placeholder="useLocalization('cashier.orderSummary.table.selectFloor')"
                  option-label="label"
                  option-value="value"
                  class="w-full"
                  :disabled="!cashierOrderSummary_modalSelectTable.listFloor.length"
                />
              </div>

              <!-- Scrollable Content -->
              <div
                class="flex-1 overflow-auto border border-grayscale-10 rounded-lg p-4"
                :class="{
                  'flex items-center justify-center h-full w-full ':
                    !cashierOrderSummary_getListActiveFloor.length,
                }"
              >
                <template v-if="accountStoreDetail_storeTables?.length">
                  <section
                    v-for="(storeTable, storeTableIndex) in accountStoreDetail_storeTables.filter(
                      (f: IOutletTable) => {
                        return f.floorName === accountStoreDetail_selectedFloor;
                      },
                    )"
                    :key="`store-table-${storeTableIndex}`"
                  >
                    <AccountStoreTableLayout
                      v-model="cashierOrderSummary_modalSelectTable.selectedTable"
                      :store-table="storeTable"
                      cashier-preview
                    />
                  </section>
                </template>
                <span v-else class="text-text-disabled">{{ useLocalization('cashier.noDataFound') }}</span>
              </div>
            </div>

            <!-- Right Section -->
            <div
              class="col-span-12 lg:col-span-5 xl:col-span-3 flex-1 overflow-auto border border-grayscale-10 flex flex-col gap-2 lg:gap-4 rounded-xs p-2"
            >
              <span class="text-sm lg:text-lg font-semibold">{{
                useLocalization('cashier.orderSummary.table.availableTable')
              }}</span>

              <template
                v-for="(item, key) in accountStoreDetail_storeTables?.filter((f: IOutletTable) => {
                  return f.floorName === accountStoreDetail_selectedFloor;
                })"
                :key="key"
              >
                <span class="text-[10px] lg:text-xs text-text-disabled"> {{ item.floorName }}</span>

                <template v-if="item.storeTables.length > 0">
                  <div
                    v-for="(childItem, childKey) in item.storeTables"
                    :key="childKey"
                    class="flex flex-col gap-2 border border-grayscale-20 rounded-xl"
                  >
                    <div
                      :class="[
                        'flex gap-2 px-3 py-4 rounded-xl',
                        {
                          'cursor-pointer bg-primary-background border-primary-border border drop-shadow-xl drop-shadow-primary-background':
                            cashierOrderSummary_modalSelectTable.selectedTable.includes(childItem.name),

                          'cursor-not-allowed bg-grayscale-20 text-text-disabled border border-grayscale-20': false,

                          'cursor-pointer hover:bg-grayscale-10/25 border border-grayscale-10 hover:border-primary-border':
                            false && !cashierOrderSummary_modalSelectTable.selectedTable.includes(childItem.name),
                        },
                      ]"
                      @click="cashierOrderSummary_handleToggleSelectTable(childItem.name)"
                    >
                      <PrimeVueCheckbox
                        :model-value="cashierOrderSummary_modalSelectTable.selectedTable.includes(childItem.name)"
                        binary
                        :readonly="true"
                      ></PrimeVueCheckbox>
                      <span class="text-sm font-semibold">{{ childItem.name }}</span>
                      <span class="text-text-disabled text-sm"
                        >{{ childItem.seats }} {{ useLocalization('cashier.orderSummary.table.seats') }}</span
                      >
                    </div>
                  </div>
                </template>
                <div v-else class="flex w-full h-full items-center justify-center text-xs text-text-disabled">
                  {{ useLocalization('cashier.noDataFound') }}
                </div>
              </template>

              <section
                v-if="cashierOrderSummary_modalSelectTable.selectedTable.length > 1"
                id="alert-table-will-merge"
                class="flex gap-2 bg-secondary p-2 rounded-xl drop-shadow-lg drop-shadow-secondary/60"
              >
                <AppBaseSvg name="info-secondary" class="mt-1 h-4 w-4" />
                <div class="flex flex-col">
                  <span class="font-semibold text-secondary-hover">Table will be merged</span>
                  <span class="text-secondary-hover text-xs">Selected tables will be merged as one order</span>
                </div>
              </section>
            </div>
          </section>

          <!-- Footer -->
          <div class="flex justify-end gap-2">
            <PrimeVueButton
              class="border-primary hidden lg:block text-primary py-2.5 px-14"
              type="button"
              :label="useLocalization('cashier.cancel')"
              outlined
              @click="closeCallback"
            ></PrimeVueButton>

            <PrimeVueButton
              class="bg-primary w-full lg:w-fit border-none text-white py-2.5 px-14"
              type="button"
              :label="useLocalization('cashier.orderSummary.table.selectTable')"
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
