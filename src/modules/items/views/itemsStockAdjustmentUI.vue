<script setup lang="ts">
import StockAdjustmentTabel from '../components/StockAdjustmentTabel.vue';
import { useInventoryItemPreviewService } from '../services/items-stock-adjustment.service';

const {
  inventoryItemPreview_item: item,
} = useInventoryItemPreviewService();


function formatCurrency(value?: number) {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

</script>

<template>
  <!-- Item Preview -->
  <section id="item-preview" class="flex justify-center my-10 px-4 sm:px-6 lg:px-20">
    <div class="w-full border border-primary rounded-lg p-6 text-base text-gray-800">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
        <div>
          <p class="text-lg font-semibold text-black">{{ item?.itemName }}</p>
          <p class="text-base text-gray-600">{{ item?.sku }}</p>
        </div>
      </div>

      <!-- Item Details -->
      <div class="mb-4">
        <p class="text-base font-semibold text-primary mb-3">{{ useLocalization('items.form.details') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.brand') }}</p>
            <p class="text-base font-medium text-black">{{ item?.brand ?? '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.barcode') }}</p>
            <p class="text-base text-black">{{ item?.barcode ?? '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.category') }}</p>
            <p class="text-base text-black">{{ item?.category }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.unit') }}</p>
            <p class="text-base text-black">{{ item?.unit }}</p>
          </div>
        </div>
      </div>

      <!-- Stock & Inventory -->
      <div class="mb-4">
        <p class="text-base font-semibold text-primary mb-3">{{ useLocalization('items.form.stock') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.stockAdjustment.currentStock') }}</p>
            <p class="text-base text-black">{{ item?.stockQuantity }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.reorderLevel') }}</p>
            <p class="text-base text-black">{{ item?.reorderLevel }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.minStockQuantity') }}</p>
            <p class="text-base text-black">{{ item?.minimumStockQuantity }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.expiryDate') }}</p>
            <p class="text-base text-black">{{ item?.expiryDate || '-' }}</p>
          </div>
        </div>
      </div>

      <!-- Price & Supplier -->
      <div>
        <p class="text-base font-semibold text-primary mb-3">{{ useLocalization('items.form.priceAndSupplier') }}</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.pricePerUnit') }}</p>
            <p class="text-base text-black">{{ formatCurrency(item?.pricePerUnit) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.form.supplier') }}</p>
            <p class="text-base text-black">{{ item?.supplier ?? '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ useLocalization('items.preview.location') }}</p>
            <p class="text-base text-black">{{ item?.storageLocation ?? '-' }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stock Adjustment -->
  <section id="stock-adjustment" class="flex justify-center my-10 px-4 sm:px-6 lg:px-20">
    <div class="w-full">
      <StockAdjustmentTabel />
    </div>
  </section>
</template>
