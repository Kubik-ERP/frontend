<script setup lang="ts">
// Services

import { useSupplierPreviewItemService } from '../services/supplier-preview-items.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  supllierPreview_itemSupplier,
  supplierPreview_columnItems,
  supplierPreview_queryItemSupplier,
  supplierPreview_itemsLoading,
  supplierPreview_onChangePage,
  supplierPreview_onSort,
} = useSupplierPreviewItemService();

function formatDate(date: string) {
  if (!date) return '-';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}

const dateRange = ref<[Date, Date] | null>(null);

// Helper format YYYY-MM-DD HH:mm:ss (atau bisa YYYY-MM-DD aja kalau API butuh date doang)

watch(dateRange, () => {
  if (dateRange.value) {
    const [start, end] = dateRange.value;

    supplierPreview_queryItemSupplier.value.startDate = start?.toLocaleDateString("sv-SE") || null;
    supplierPreview_queryItemSupplier.value.endDate = (end || start)?.toLocaleDateString("sv-SE") || null;
  } else {
    supplierPreview_queryItemSupplier.value.startDate = null;
    supplierPreview_queryItemSupplier.value.endDate = null;
  }
});
const realTimePlaceholder = computed(() => {
  return 'Real Time : ' + formatDate(new Date().toLocaleDateString('sv-SE'));
});
</script>
<template>
  <AppBaseDataTable
    :columns="supplierPreview_columnItems"
    :data="supllierPreview_itemSupplier.data.items"
    header-title="Item Supplies"
    :rows-per-page="supplierPreview_queryItemSupplier.pageSize"
    :total-records="supllierPreview_itemSupplier?.data.items.length"
    :first="(supplierPreview_queryItemSupplier.page - 1) * supplierPreview_queryItemSupplier.pageSize"
    :is-loading="supplierPreview_itemsLoading"
    is-using-server-side-pagination
    is-using-custom-header-suffix
    is-using-header
    is-using-custom-body
    :is-using-custom-filter="true"
    @update:currentPage="supplierPreview_onChangePage"
    @update:sort="supplierPreview_onSort"
  >
    <template #header-suffix>
      <div class="flex items-center space-x-2">
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <i class="pi pi-search text-gray-400"></i>
          </PrimeVueInputIcon>
          <PrimeVueInputText
            v-model="supplierPreview_queryItemSupplier.search"
            placeholder="Search sku items..."
            class="w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md"
          />
        </PrimeVueIconField>
      </div>
    </template>

    <!-- header Filter -->
    <template #filter>
      <section class="flex items-center gap-3">
        <span class="font-semibold text-sm text-gray-800">Filter By</span>
        <PrimeVueDatePicker
          v-model="dateRange"
          selection-mode="range"
          show-icon
          class="text-sm"
          :placeholder="realTimePlaceholder"
        />
      </section>
    </template>

    <!-- Body Table -->
    <template #body="{ column, data }">
      <template v-if="column.value === 'sku'">
        {{ data.sku }}
      </template>
      <template v-else-if="column.value === 'itemName'">
        {{ data.itemName }}
      </template>
      <template v-else-if="column.value === 'category'">
        {{ data.category }}
      </template>
      <template v-else-if="column.value === 'brand'">
        {{ data.brand }}
      </template>
      <template v-else-if="column.value === 'pricePerUnit'">
        {{ data.pricePerUnit }}
      </template>
      <template v-else-if="column.value === 'expiryDate'">
        {{ formatDate(data.expiryDate) }}
      </template>
      <template v-else-if="column.value === 'createdAt'">
        {{ formatDate(data.createdAt) }}
      </template>
    </template>
  </AppBaseDataTable>
</template>
