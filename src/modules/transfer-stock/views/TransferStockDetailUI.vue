<script setup lang="ts">
// Services
import { useTransferStockDetailService } from '../services/transfer-stock-detail.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  transferStockDetail_fetchDetails,
  transferStockDetail_isLoading,
} = useTransferStockDetailService();

/**
 * @description Transfer stock detail data
 */
const transferStockDetail_data = ref(null);

/**
 * @description Provide all the data and methods what we need
 */
provide('transferStockDetail', {
  transferStockDetail_data,
  transferStockDetail_fetchDetails,
  transferStockDetail_isLoading,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  const route = useRoute();
  const id = route.params.id as string;
  if (id) {
    await transferStockDetail_fetchDetails(id);
  }
});
</script>

<template>
  <section id="transfer-stock-detail" class="default-wrapper gap-10">
    <!-- Loading State -->
    <div v-if="transferStockDetail_isLoading" class="bg-white rounded-lg shadow-sm p-6">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded mb-6"></div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
          </div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Stock Detail Form -->
    <div v-else class="bg-white rounded-lg shadow-sm p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-900">Transfer Stock Details</h2>
        
        <!-- Back Button -->
        <PrimeVueButton
          class="bg-gray-500 text-white px-4 py-2"
          label="Back to List"
          @click="$router.push({ name: 'transfer-stock.list' })"
        />
      </div>

      <!-- Transfer Information -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Transfer Number</label>
            <p class="text-sm text-gray-900">{{ (transferStockDetail_data as any)?.transferNumber || 'TS-001' }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">From Store</label>
            <p class="text-sm text-gray-900">{{ (transferStockDetail_data as any)?.fromOutletName || 'Main Store' }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">To Store</label>
            <p class="text-sm text-gray-900">{{ (transferStockDetail_data as any)?.toOutletName || 'Branch Store' }}</p>
          </div>
        </div>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Transfer Date</label>
            <p class="text-sm text-gray-900">
              {{ (transferStockDetail_data as any)?.transferDate ? useFormatDate((transferStockDetail_data as any).transferDate, 'dd/mm/yyyy') : useFormatDate(new Date(), 'dd/mm/yyyy') }}
            </p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <PrimeVueChip
              class="text-xs font-normal bg-blue-100 text-blue-800"
              :label="((transferStockDetail_data as any)?.status || 'draft').charAt(0).toUpperCase() + ((transferStockDetail_data as any)?.status || 'draft').slice(1)"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Total Value</label>
            <p class="text-sm text-gray-900">
              {{ useCurrencyFormat({ data: (transferStockDetail_data as any)?.totalValue || 150000 }) }}
            </p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="bg-blue-600 text-white px-6 py-2"
          label="Edit Transfer"
          @click="$router.push({ name: 'transfer-stock.edit', params: { id: $route.params.id } })"
        />
      </div>
    </div>

    <!-- Confirmation Dialogs -->
    <AppBaseDialogConfirmation
      id="transfer-stock-detail-confirmation-dialog"
      custom-body-class="px-6"
      custom-footer-class="px-6 pb-6"
      custom-header-class="px-6 pt-6"
    />
  </section>
</template>
