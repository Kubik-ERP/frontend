<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockDetail_data,
  transferStockDetail_formDataOfReceive,
  transferStockDetail_onCloseDialogReceive,
  transferStockDetail_onSubmitReceive,
  transferStockDetail_isLoading,
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;

/**
 * @description Update quantity received for an item
 */
const updateQtyReceived = (index: number, value: number) => {
  if (transferStockDetail_formDataOfReceive.value.items[index]) {
    transferStockDetail_formDataOfReceive.value.items[index].qty_received = value;

    // Auto-detect if there's any issue (qty_received !== qty_shipped)
    const hasIssue = transferStockDetail_formDataOfReceive.value.items.some(
      item => item.qty_received !== item.qty_shipped,
    );

    transferStockDetail_formDataOfReceive.value.status = hasIssue ? 'received_with_issue' : 'received';
  }
};

/**
 * @description Update notes for an item
 */
const updateNotes = (index: number, notes: string | undefined) => {
  if (transferStockDetail_formDataOfReceive.value.items[index] && notes !== undefined) {
    transferStockDetail_formDataOfReceive.value.items[index].notes = notes;
  }
};
</script>

<template>
  <AppBaseDialog id="transfer-stock-detail-receive" :custom-dialog-class="'w-full max-w-5xl'">
    <template #header>
      <header class="flex flex-col gap-1 w-full">
        <h6 class="font-semibold text-black text-lg">Receive Transfer Stock</h6>
        <p class="text-xs text-gray-500">Verify and adjust quantities if needed</p>
      </header>
    </template>

    <template #content>
      <div class="space-y-4">
        <!-- Status indicator at top -->
        <div
          v-if="transferStockDetail_formDataOfReceive.status === 'received_with_issue'"
          class="p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <span class="pi pi-exclamation-triangle text-yellow-600 text-sm"></span>
            <span class="text-xs font-medium text-yellow-800">
              Quantity discrepancies detected. Will be marked as "Received with Issue".
            </span>
          </div>
        </div>

        <!-- Compact table with better spacing -->
        <div class="border border-gray-200 rounded-lg overflow-hidden">
          <div class="overflow-x-auto max-h-[400px] overflow-y-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th
                    class="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-2/5"
                  >
                    Item
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[100px]"
                  >
                    Shipped
                  </th>
                  <th
                    class="px-3 py-2 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[140px]"
                  >
                    Received
                  </th>
                  <th class="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(item, index) in transferStockDetail_formDataOfReceive.items"
                  :key="item.itemId"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <!-- Item Info -->
                  <td class="px-3 py-2.5">
                    <div class="flex flex-col gap-0.5">
                      <p class="text-sm font-medium text-gray-900 line-clamp-1">
                        {{ transferStockDetail_data?.transferStockItems[index]?.masterInventoryItems?.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        SKU: {{ transferStockDetail_data?.transferStockItems[index]?.masterInventoryItems?.sku }}
                      </p>
                    </div>
                  </td>

                  <!-- Qty Shipped -->
                  <td class="px-3 py-2.5 text-center">
                    <span
                      class="inline-flex items-center justify-center px-2 py-1 text-sm font-semibold text-gray-700 bg-gray-100 rounded"
                    >
                      {{ item.qty_shipped }}
                    </span>
                  </td>

                  <!-- Qty Received with controls -->
                  <td class="px-3 py-2.5">
                    <div class="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        class="flex items-center justify-center w-7 h-7 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="item.qty_received <= 0"
                        @click="updateQtyReceived(index, item.qty_received - 1)"
                      >
                        <span class="text-base leading-none">−</span>
                      </button>

                      <input
                        :value="item.qty_received"
                        type="number"
                        :min="0"
                        :max="item.qty_shipped"
                        class="w-14 h-7 px-2 text-center text-sm font-medium border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        @input="updateQtyReceived(index, parseInt(($event.target as HTMLInputElement).value) || 0)"
                      />

                      <button
                        type="button"
                        class="flex items-center justify-center w-7 h-7 rounded border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="item.qty_received >= item.qty_shipped"
                        @click="updateQtyReceived(index, item.qty_received + 1)"
                      >
                        <span class="text-base leading-none">+</span>
                      </button>

                      <span
                        v-if="item.qty_received !== item.qty_shipped"
                        class="ml-1 px-1.5 py-0.5 text-xs font-semibold rounded bg-yellow-100 text-yellow-700"
                      >
                        !
                      </span>
                    </div>
                  </td>

                  <!-- Notes -->
                  <td class="px-3 py-2.5">
                    <input
                      :value="item.notes"
                      type="text"
                      placeholder="Optional..."
                      class="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent"
                      @input="updateNotes(index, ($event.target as HTMLInputElement).value)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Summary info -->
        <div class="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg text-xs">
          <span class="text-gray-600"
            >Total Items:
            <span class="font-semibold text-gray-900">{{
              transferStockDetail_formDataOfReceive.items.length
            }}</span></span
          >
          <span class="text-gray-600">
            Status:
            <span
              :class="
                transferStockDetail_formDataOfReceive.status === 'received_with_issue'
                  ? 'font-semibold text-yellow-700'
                  : 'font-semibold text-green-700'
              "
            >
              {{
                transferStockDetail_formDataOfReceive.status === 'received_with_issue' ? 'With Issues' : 'Complete'
              }}
            </span>
          </span>
        </div>
      </div>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-3">
        <PrimeVueButton
          class="font-semibold text-sm text-primary px-4 py-2 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogReceive"
        />

        <PrimeVueButton
          class="bg-primary border-none text-sm px-6 py-2"
          label="Confirm Receipt"
          type="button"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitReceive"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>

<style scoped>
/* Custom scrollbar for table */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a0aec0;
}

/* Remove number input arrows */
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
