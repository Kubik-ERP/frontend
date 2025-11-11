<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockDetail_data,
  transferStockDetail_onCloseDialogReceive,
  transferStockDetail_onSubmitReceive,
  transferStockDetail_isLoading,
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;
</script>

<template>
  <AppBaseDialog
    id="transfer-stock-detail-receive"
    title="Receive Transfer Stock"
    custom-body-class="px-6"
    custom-footer-class="px-6 pb-6"
    custom-header-class="px-6 pt-6"
    :custom-dialog-class="'w-full max-w-4xl'"
  >
    <template #body>
      <div class="space-y-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Shipped</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty Received</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in transferStockDetail_data?.transferStockItems" :key="item.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ item.masterInventoryItems?.name }}</div>
                  <div class="text-sm text-gray-500">{{ item.masterInventoryItems?.sku }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.qtyReserved }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ item.qtyReceived }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {{ item.qtyReceived === item.qtyReserved ? 'Complete' : 'Partial' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="false">
          <p class="text-sm text-gray-600">
            Please review the received quantities above before confirming the receipt.
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="border border-gray-300 text-gray-700 px-4 py-2"
          label="Cancel"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogReceive"
        />
        <PrimeVueButton
          class="bg-green-600 text-white px-4 py-2"
          label="Confirm Receipt"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitReceive"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>