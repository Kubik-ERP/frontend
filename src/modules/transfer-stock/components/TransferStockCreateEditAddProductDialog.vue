<script setup lang="ts">
// Interfaces
import type { ITransferStockCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockCreateEdit_formData,
  transferStockCreateEdit_listProductItems,
  transferStockCreateEdit_onCloseDialogAddProductItem,
  transferStockCreateEdit_onSubmitAddProductItem,
  transferStockCreateEdit_selectedProductItem,
} = inject('transferStockCreateEdit') as ITransferStockCreateEditProvided;
</script>

<template>
  <AppBaseDialog id="transfer-stock-create-edit-add-product-item">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Add Product</h5>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-4">
        <!-- Product Selection -->
        <section id="product-selection" class="flex flex-col gap-2">
          <label class="font-medium text-sm text-text-primary">Product</label>

          <PrimeVueSelect
            v-model="transferStockCreateEdit_selectedProductItem"
            :options="transferStockCreateEdit_listProductItems"
            option-label="label"
            option-value="value"
            placeholder="Select a product..."
            filter
            show-clear
            class="text-sm text-text-primary w-full"
            @change="
              (event: any) => {
                if (event.value) {
                  const existingIndex = transferStockCreateEdit_formData.productItems.findIndex(
                    item => item.masterItemId === event.value.masterItemId,
                  );
                  if (existingIndex === -1) {
                    transferStockCreateEdit_formData.productItems.push(event.value);
                  }
                  transferStockCreateEdit_selectedProductItem = null;
                }
              }
            "
          />
        </section>

        <!-- Selected Products List - Minimalist -->
        <section
          v-if="transferStockCreateEdit_formData.productItems.length > 0"
          id="selected-items"
          class="flex flex-col gap-2"
        >
          <label class="font-medium text-sm text-text-primary">
            Selected ({{ transferStockCreateEdit_formData.productItems.length }})
          </label>

          <div class="space-y-2 max-h-[350px] overflow-y-auto">
            <div
              v-for="(item, index) in transferStockCreateEdit_formData.productItems"
              :key="`product-${item.masterItemId}-${index}`"
              class="border border-gray-200 rounded-lg bg-white transition-colors overflow-hidden"
            >
              <!-- Header Row: Product Name + Delete -->
              <div class="flex items-center justify-between gap-3 p-3 border-b border-gray-100">
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-text-primary truncate">{{ item.name }}</p>
                  <div class="flex items-center gap-2 mt-1 flex-wrap">
                    <span class="text-xs text-gray-500">SKU: {{ item.sku }}</span>
                    <span v-if="item.brandName" class="text-xs text-gray-500">Brand: {{ item.brandName }}</span>
                    <span
                      v-if="item.quantity > (item.stockQuantity || 0)"
                      class="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded"
                    >
                      Stok kurang
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  class="flex items-center justify-center w-8 h-8 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors flex-shrink-0 cursor-pointer"
                  @click="
                    () => {
                      transferStockCreateEdit_formData.productItems.splice(index, 1);
                    }
                  "
                >
                  <AppBaseSvg name="delete" class="w-4 h-4" />
                </button>
              </div>

              <!-- Info Row: Stock, Unit Price, Total Price -->
              <div class="grid grid-cols-3 gap-2 px-3 py-2 bg-gray-50 text-xs border-b border-gray-100">
                <div>
                  <p class="text-gray-500">Stok Available</p>
                  <p class="font-semibold text-text-primary">{{ item.stockQuantity || 0 }} {{ item.unit }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Unit Price</p>
                  <p class="font-semibold text-text-primary">
                    {{ useCurrencyFormat({ data: item.unitPrice || 0, hidePrefix: true, addSuffix: false }) }}
                  </p>
                </div>
                <div>
                  <p class="text-gray-500">Total Price</p>
                  <p class="font-semibold text-primary">
                    {{ useCurrencyFormat({ data: item.totalPrice || 0, hidePrefix: true, addSuffix: false }) }}
                  </p>
                </div>
              </div>

              <!-- Quantity Control Row -->
              <div class="flex items-center justify-between gap-3 p-3">
                <label class="text-xs font-medium text-gray-600">Qty:</label>

                <div class="flex items-center gap-2">
                  <button
                    type="button"
                    class="flex items-center justify-center w-8 h-8 rounded-md border border-primary bg-white text-primary hover:bg-primary-background transition-colors disabled:opacity-50 cursor-pointer"
                    :disabled="item.quantity <= 1"
                    @click="
                      () => {
                        if (item.quantity > 1) {
                          item.quantity = item.quantity - 1;
                        }
                      }
                    "
                  >
                    <span class="text-sm font-semibold">−</span>
                  </button>

                  <PrimeVueInputNumber
                    id="quantity"
                    v-model="transferStockCreateEdit_formData.productItems[index].quantity"
                    placeholder="0"
                    :min="1"
                    class="text-sm"
                    :pt="{
                      pcInputText: {
                        root: 'w-full max-w-16 h-9 text-center text-sm',
                      },
                    }"
                  />

                  <button
                    type="button"
                    class="flex items-center justify-center w-8 h-8 rounded-md border border-primary bg-white text-primary hover:bg-primary-background transition-colors disabled:opacity-50 cursor-pointer"
                    :disabled="item.quantity >= (item.stockQuantity || 999)"
                    @click="
                      () => {
                        const maxQuantity = item.stockQuantity || 999;
                        if (item.quantity < maxQuantity) {
                          item.quantity = item.quantity + 1;
                        }
                      }
                    "
                  >
                    <span class="text-sm font-semibold">+</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Empty State -->
        <div
          v-else
          class="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200"
        >
          <p class="text-sm text-gray-500">Belum ada produk dipilih</p>
          <p class="text-xs text-gray-400 mt-1">Pilih produk di atas untuk memulai</p>
        </div>
      </section>
    </template>

    <template #footer>
      <section id="action-buttons" class="flex items-center gap-2 w-full justify-end">
        <PrimeVueButton
          class="border border-gray-300 bg-white font-medium text-base text-text-primary px-5 h-10 hover:bg-gray-50"
          severity="secondary"
          @click="transferStockCreateEdit_onCloseDialogAddProductItem"
        >
          Batal
        </PrimeVueButton>

        <PrimeVueButton
          class="bg-primary border-none font-medium text-base px-5 h-10"
          :disabled="transferStockCreateEdit_formData.productItems.length === 0"
          @click="transferStockCreateEdit_onSubmitAddProductItem"
        >
          Tambah
        </PrimeVueButton>
      </section>
    </template>
  </AppBaseDialog>
</template>

<style scoped>
div::-webkit-scrollbar {
  width: 6px;
}

div::-webkit-scrollbar-track {
  background: transparent;
}

div::-webkit-scrollbar-thumb {
  background: #d9d9d9;
  border-radius: 3px;
}
</style>
