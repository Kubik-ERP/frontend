<script lang="ts" setup>
import { useInventoryItemPreviewService } from '../services/items-stock-adjustment.service';
import StockAdjustmentModal from './StockAdjustmentModal.vue';

const {
  stockadjustment_listColumns,
  stockadjustment_list,
  stockadjustment_queryParams,
  stockadjustment_isLoading,
  stockadjustment_onChangePage,
  stockadjustment_handleOnSortChange,
  stockadjustment_handleOnFilter,
  stockadjustment_onCreate,
  inventoryItemPreview_onEditItem,
} = useInventoryItemPreviewService();

function formatDate(date: string) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}
</script>

<template>
  <AppBaseDataTable
    :columns="stockadjustment_listColumns"
    :data="stockadjustment_list.data.items"
    header-title="Stock Adjustment"
    :rows-per-page="stockadjustment_queryParams.pageSize"
    :total-records="stockadjustment_list.data.items.length"
    :first="(stockadjustment_queryParams.page - 1) * stockadjustment_queryParams.pageSize"
    :is-loading="stockadjustment_isLoading"
    is-using-server-side-pagination
    is-using-custom-header-suffix
    is-using-header
    is-using-custom-body
    :is-using-custom-filter="true"
    @update:currentPage="stockadjustment_onChangePage"
    @update:sort="stockadjustment_handleOnSortChange"
  >
    <!-- Header Suffix -->
    <template #header-suffix>
      <div class="flex items-center space-x-2 sm:absolute sm:right-4 sm:top-3">
        <PrimeVueButton
          class="bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
          @click="stockadjustment_onCreate"
        >
          <i class="pi pi-plus text-sm"></i>
          Create Adjustment
        </PrimeVueButton>
      </div>
    </template>

    <!-- header Filter -->
    <template #filter>
      <section class="flex items-center gap-3">
        <span class="font-semibold text-sm text-gray-800">Filter by</span>
        <PrimeVueDropdown
          v-model="stockadjustment_queryParams.action"
          :options="[
            { label: 'All Adjustment Type', value: null },
            { label: 'Stock In', value: 'STOCK_IN' },
            { label: 'Stock Out', value: 'STOCK_OUT' },
          ]"
          option-label="label"
          option-value="value"
          placeholder="All Adjustment Type"
          class="w-60"
          @change="stockadjustment_handleOnFilter(stockadjustment_queryParams.action)"
        />
      </section>
    </template>

    <!-- Body Table -->
    <template #body="{ column, data }">
      <template v-if="column.value === 'date'">
        {{ formatDate(data.createdAt) }}
      </template>

      <!-- Adjustment Type -->
      <template v-else-if="column.value === 'action'">
        <span class="flex items-center gap-2">
          <i v-if="data.action === 'STOCK_IN'" class="pi pi-arrow-right text-green-500 rotate-[-45deg]"></i>
          <i v-else class="pi pi-arrow-left text-red-500 rotate-[-45deg]"></i>
          {{ data.action }}
        </span>
      </template>

      <!-- Adjustment Quantity -->
      <template v-else-if="column.value === 'adjustmentQuantity'">
        {{ data.adjustmentQuantity }}
      </template>

      <!-- New Stock Quantity -->
      <template v-else-if="column.value === 'newQuantity'">
        {{ data.newQuantity }}
      </template>

      <!-- Notes -->
      <template v-else-if="column.value === 'notes'">
        {{ data.notes || '-' }}
      </template>

      <!-- Action -->
      <template v-else-if="column.value === 'aksi'">
        <PrimeVueButton
          class="p-button-text text-gray-500 hover:text-primary"
          @click="inventoryItemPreview_onEditItem(data.id)"
        >
          <AppBaseSvg name="edit" class="!w-4 !h-4" />
        </PrimeVueButton>
      </template>
    </template>
  </AppBaseDataTable>
  <StockAdjustmentModal />
</template>
