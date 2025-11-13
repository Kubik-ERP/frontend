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
  <AppBaseDialog id="transfer-stock-detail-receive" :custom-dialog-class="'w-full max-w-4xl'">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Receive Transfer Stock</h6>
      </header>
    </template>

    <template #content>
      <div class="space-y-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Item
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty Shipped
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Qty Received
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
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
                  <span
                    class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                  >
                    {{ item.qtyReceived === item.qtyReserved ? 'Complete' : 'Partial' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full py-3 max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="transferStockDetail_onCloseDialogReceive"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-3 w-full max-w-40"
          label="Confirm Receipt"
          type="button"
          :loading="transferStockDetail_isLoading"
          @click="transferStockDetail_onSubmitReceive"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
