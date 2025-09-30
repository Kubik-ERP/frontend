<script setup lang="ts">
// Components
import AccountStoreTableLayout from '@/modules/account/components/store-detail/AccountStoreTableLayout.vue';

// Interface
import type { IAccountStoreDetailProvided } from '@/modules/account/interfaces';
import type { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';
// import type { IOutletTable } from '@/modules/outlet/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_listAvailableFloor, accountStoreDetail_selectedFloor, accountStoreDetail_storeTables } =
  inject<IAccountStoreDetailProvided>('accountStoreDetail')!;

const {
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_onCloseDialogTableOverview,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>

<template>
  <AppBaseDialog id="cashier-table-overview-dialog" width="w-fit min-w-[1200px]">
    <template #header>
      <header class="flex items-center gap-2">
        <AppBaseSvg name="table" class="w-5 h-5" />
        <h5 class="font-semibold text-black text-lg">Table Summary</h5>
      </header>
    </template>

    <template #content>
      <!-- Restaurant Mode: Table Layout -->
      <div
        class="col-span-12 lg:col-span-7 xl:col-span-9 border border-grayscale-10 flex flex-col gap-4 rounded-xs p-2 flex-1 min-h-0 min-w-6xl"
      >
        <div class="flex gap-4 items-center">
          <span class="font-semibold">{{ useLocalization('cashier.orderSummary.table.floor') }}</span>

          <PrimeVueSelect
            v-model="accountStoreDetail_selectedFloor"
            :options="accountStoreDetail_listAvailableFloor"
            :placeholder="useLocalization('cashier.orderSummary.table.selectFloor')"
            option-label="label"
            option-value="value"
            class="w-full max-w-60"
            :disabled="!cashierOrderSummary_modalSelectTable.listFloor.length"
          />
        </div>

        <!-- Scrollable Content -->
        <div
          id="table-overview-container"
          class="flex-1 overflow-auto border border-grayscale-10 rounded-lg p-4"
          :class="{
            'flex items-center justify-center h-full w-full ': !cashierOrderSummary_getListActiveFloor.length,
          }"
        >
          <template v-if="accountStoreDetail_storeTables?.length">
            <section
              v-for="(storeTable, storeTableIndex) in accountStoreDetail_storeTables"
              :key="`store-table-${storeTableIndex}`"
            >
              <AccountStoreTableLayout
                v-model="cashierOrderSummary_modalSelectTable.selectedTable"
                :store-table="storeTable"
              />
            </section>
          </template>
          <span v-else class="text-text-disabled">{{ useLocalization('cashier.noDataFound') }}</span>
        </div>
      </div>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary rounded-lg w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Close"
          severity="secondary"
          variant="outlined"
          @click="cashierOrderSummary_onCloseDialogTableOverview"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>

<style>
#table-overview-container {
  background-image: url('@/app/assets/images/bg-layout-table.png');
  background-size: 100% 100%;
  border-radius: 4px;
  border: 1px solid #8cc8eb;
}
</style>
