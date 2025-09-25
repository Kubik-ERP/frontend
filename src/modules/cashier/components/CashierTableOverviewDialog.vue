<script setup lang="ts">
// Components
import AccountStoreTableLayout from '@/modules/account/components/store-detail/AccountStoreTableLayout.vue';

// Interface
import type { IAccountStoreDetailProvided } from '@/modules/account/interfaces';
import type { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';
import type { ICashierInventoryItemsProvided } from '@/modules/cashier/interfaces/cashier-inventory-items';
import type { IOutletTable } from '@/modules/outlet/interfaces';
import type { IInventoryItems } from '@/modules/items/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_listAvailableFloor, accountStoreDetail_selectedFloor, accountStoreDetail_storeTables } =
  inject<IAccountStoreDetailProvided>('accountStoreDetail')!;

const {
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_onCloseDialogTableOverview,
  cashierOrderSummary_isRetailBusinessType,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

const { inventoryItems_values, inventoryItems_isLoading, inventoryItems_queryParams } =
  inject<ICashierInventoryItemsProvided>('cashierInventoryItems')!;

/**
 * @description Helper function to calculate qty left before reorder
 */
const calculateQtyBeforeReorder = (item: IInventoryItems) => {
  return Math.max(0, item.stockQuantity - item.minimumStockQuantity);
};

/**
 * @description Custom columns for retail inventory table
 */
const retailInventoryColumns = computed(() => [
  {
    label: 'Item Name / SKU / Barcode',
    value: 'itemNameSku',
    sortable: false,
  },
  {
    label: 'Qty (Current) / Unit',
    value: 'qtyUnit',
    sortable: false,
  },
  {
    label: 'Storage Location',
    value: 'storageLocation',
    sortable: false,
  },
  {
    label: 'Qty Left Before Reorder',
    value: 'qtyBeforeReorder',
    sortable: false,
  },
]);
</script>

<template>
  <AppBaseDialog id="cashier-table-overview-dialog" width="w-fit min-w-[1200px]">
    <template #header>
      <header class="flex items-center gap-2">
        <AppBaseSvg :name="cashierOrderSummary_isRetailBusinessType ? 'inventory' : 'table'" class="w-5 h-5" />
        <h5 class="font-semibold text-black text-lg">
          {{ cashierOrderSummary_isRetailBusinessType ? 'Inventory Summary' : 'Table Summary' }}
        </h5>
      </header>
    </template>

    <template #content>
      <!-- Restaurant Mode: Table Layout -->
      <div
        v-if="!cashierOrderSummary_isRetailBusinessType"
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
              v-for="(storeTable, storeTableIndex) in accountStoreDetail_storeTables.filter((f: IOutletTable) => {
                return f.floorName === accountStoreDetail_selectedFloor;
              })"
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

      <!-- Retail Mode: Inventory Items DataTable -->
      <div v-else class="flex flex-col gap-4 p-4 min-w-[1000px]">
        <!-- Search Header -->
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <span class="font-semibold">Search Items:</span>
            <PrimeVueIconField class="w-full sm:w-auto">
              <PrimeVueInputIcon>
                <i class="pi pi-search text-gray-400"></i>
              </PrimeVueInputIcon>
              <PrimeVueInputText
                v-model="inventoryItems_queryParams.search"
                placeholder="Search by item name, SKU, or barcode..."
                class="w-full sm:w-64 md:w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md"
              />
            </PrimeVueIconField>
          </div>
        </div>

        <!-- DataTable -->
        <AppBaseDataTable
          :columns="retailInventoryColumns"
          :data="inventoryItems_values.data.items"
          :rows-per-page="inventoryItems_values.data.meta.pageSize"
          :total-records="inventoryItems_values.data.meta.total"
          :first="(inventoryItems_values.data.meta.page - 1) * inventoryItems_values.data.meta.pageSize"
          :is-loading="inventoryItems_isLoading"
          is-using-server-side-pagination
          is-using-custom-body
          :is-using-header="false"
          :is-using-border-on-header="false"
          class="w-full"
        >
          <!-- Custom Body for Inventory Items -->
          <template #body="{ column, data }">
            <div class="">
              <!-- Item Name / SKU / Barcode -->
              <template v-if="column.value === 'itemNameSku'">
                <div class="flex flex-col gap-1">
                  <span class="font-semibold text-gray-900">{{ data.itemName || '-' }}</span>
                  <div class="flex gap-2 text-sm text-gray-600">
                    <span>SKU: {{ data.sku || '-' }}</span>
                    <span v-if="data.barcode">| Barcode: {{ data.barcode }}</span>
                  </div>
                </div>
              </template>

              <!-- Qty (Current) / Unit -->
              <template v-else-if="column.value === 'qtyUnit'">
                <div class="flex flex-col gap-1">
                  <span class="font-semibold text-gray-900">{{ data.stockQuantity ?? 0 }}</span>
                  <span class="text-sm text-gray-600">{{ data.unit || '-' }}</span>
                </div>
              </template>

              <!-- Storage Location -->
              <template v-else-if="column.value === 'storageLocation'">
                <span class="text-gray-700">{{ data.storageLocation || '-' }}</span>
              </template>

              <!-- Qty Left Before Reorder -->
              <template v-else-if="column.value === 'qtyBeforeReorder'">
                <div class="flex items-center gap-2">
                  <span
                    :class="{
                      'text-red-600 font-semibold': calculateQtyBeforeReorder(data) <= 0,
                      'text-orange-600 font-semibold':
                        calculateQtyBeforeReorder(data) > 0 &&
                        calculateQtyBeforeReorder(data) <= data.reorderLevel,
                      'text-green-600': calculateQtyBeforeReorder(data) > data.reorderLevel,
                    }"
                  >
                    {{ calculateQtyBeforeReorder(data) }}
                  </span>
                  <span
                    v-if="calculateQtyBeforeReorder(data) <= 0"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                  >
                    Reorder Now
                  </span>
                  <span
                    v-else-if="calculateQtyBeforeReorder(data) <= data.reorderLevel"
                    class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                  >
                    Low Stock
                  </span>
                </div>
              </template>
            </div>
          </template>
        </AppBaseDataTable>
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
