<script setup lang="ts">
// Interfaces
import type { ICashierInventoryItemsProvided } from '../interfaces/cashier-inventory-items';
import type { ICashierCustomerProvided } from '../interfaces/cashier-customer.interface';
import type { IInventoryItems } from '@/modules/items/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { inventoryItems_values, inventoryItems_isLoading, inventoryItems_queryParams, inventoryItems_fetchData } =
  inject<ICashierInventoryItemsProvided>('cashierInventoryItems')!;

const { cashierCustomer_onCloseDialogStockOverview } =
  inject<ICashierCustomerProvided>('cashierCustomer')!;

/**
 * @description Handle refresh stock data
 */
const handleRefreshStockData = async () => {
  await inventoryItems_fetchData();
};

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
  <section id="cashier-stock-overview-dialog">
    <AppBaseDialog id="cashier-stock-overview-dialog">
      <template #header>
        <header class="flex items-center gap-2">
          <AppBaseSvg name="inventory" class="w-6 h-6 filter-primary-color" />
          <h5 class="font-semibold text-black text-lg">Current Stock Overview</h5>
        </header>
      </template>

      <template #content>
        <!-- Retail Mode: Inventory Items DataTable -->
        <div class="flex flex-col gap-4 p-4 min-w-[1000px]">
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

            <!-- Refresh Button -->
            <PrimeVueButton
              :loading="inventoryItems_isLoading"
              class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary basic-smooth-animation"
              @click="handleRefreshStockData"
            >
              <!-- <AppBaseSvg name="refresh" class="w-4 h-4" color="white" /> -->
              <span class="text-sm font-medium">Refresh</span>
            </PrimeVueButton>
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
            @click="cashierCustomer_onCloseDialogStockOverview"
          />
        </footer>
      </template>
    </AppBaseDialog>
  </section>
</template>

<style scoped>
:deep(.p-datatable .p-datatable-thead > tr > th) {
  background-color: #f8f9fa;
  color: #6c757d;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 1rem;
  border-bottom: 2px solid #dee2e6;
}

:deep(.p-datatable .p-datatable-tbody > tr > td) {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background-color: #f8f9fa;
}

:deep(.p-paginator) {
  background-color: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 0.75rem;
}
</style>
