<script setup lang="ts">
// Interfaces
import type { ITransferStockShippingDocumentProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { transferStockShippingDocument_data } =
  inject<ITransferStockShippingDocumentProvided>('transferStockShippingDocument')!;

/**
 * @description Helper functions for currency formatting
 */
const formatCurrency = (value: unknown): string => {
  if (!value) return useCurrencyFormat({ data: 0 });
  
  // Handle Decimal.js format
  if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
    const decimalValue = value as { s: number; e: number; d: number[] };
    const sign = decimalValue.s || 1;
    const digits = decimalValue.d || [0];
    const exponent = decimalValue.e || 0;
    
    let numValue = 0;
    for (let i = 0; i < digits.length; i++) {
      numValue = numValue * 10 + digits[i];
    }
    numValue = numValue * sign * Math.pow(10, exponent - digits.length + 1);
    
    return useCurrencyFormat({ data: numValue });
  }
  
  return useCurrencyFormat({ data: typeof value === 'number' ? value : 0 });
};

/**
 * @description Calculate total value
 */
const getTotalValue = (): string => {
  if (!transferStockShippingDocument_data.value?.transferStockItems) return formatCurrency(0);
  
  const total = transferStockShippingDocument_data.value.transferStockItems.reduce((sum: number, item: { subtotal: unknown }) => {
    const subtotal = item.subtotal;
    if (typeof subtotal === 'object' && subtotal !== null && 's' in subtotal && 'e' in subtotal && 'd' in subtotal) {
      const decimalValue = subtotal as { s: number; e: number; d: number[] };
      const sign = decimalValue.s || 1;
      const digits = decimalValue.d || [0];
      const exponent = decimalValue.e || 0;
      
      let numValue = 0;
      for (let i = 0; i < digits.length; i++) {
        numValue = numValue * 10 + digits[i];
      }
      numValue = numValue * sign * Math.pow(10, exponent - digits.length + 1);
      
      return sum + numValue;
    }
    
    return sum + (typeof subtotal === 'number' ? subtotal : 0);
  }, 0);
  
  return formatCurrency(total);
};
</script>

<template>
  <section id="transfer-stock-shipping-document-content" class="default-wrapper gap-10">
    <header class="flex flex-col gap-2">
      <h1 class="font-bold text-4xl text-black">Transfer Shipping Document</h1>

      <h5 class="font-semibold text-base text-black">
        {{ transferStockShippingDocument_data?.transactionCode }}
      </h5>
    </header>

    <section id="shipping-information" class="grid grid-rows-2 grid-cols-12 gap-4">
      <section id="store-from" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">From Store</h6>

        <span class="font-normal text-base text-text-primary">
          {{ transferStockShippingDocument_data?.storeFrom?.name || '-' }}
        </span>
      </section>

      <section id="store-to" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">To Store</h6>

        <span class="font-normal text-base text-text-primary">
          {{ transferStockShippingDocument_data?.storeTo?.name || '-' }}
        </span>
      </section>

      <section id="shipped-date" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Shipped Date</h6>

        <span class="font-normal text-base text-text-primary">
          <template v-if="transferStockShippingDocument_data?.shippedAt">
            {{
              useFormatDate(String(transferStockShippingDocument_data?.shippedAt ?? ''), 'dd/mm/yyyy')
            }}
          </template>
          <template v-else>
            -
          </template>
        </span>
      </section>

      <section id="tracking-number" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Tracking Number</h6>

        <span class="font-normal text-base text-text-primary">
          {{ transferStockShippingDocument_data?.trackingNumber || '-' }}
        </span>
      </section>

      <section id="logistic-provider" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Logistic Provider</h6>

        <span class="font-normal text-base text-text-primary">
          {{ transferStockShippingDocument_data?.logisticProvider || '-' }}
        </span>
      </section>

      <section id="delivery-notes" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Delivery Notes</h6>

        <span class="font-normal text-base text-text-primary">
          {{ transferStockShippingDocument_data?.deliveryNote || '-' }}
        </span>
      </section>
    </section>

    <section id="shipping-items">
      <header class="flex items-center justify-between mb-4">
        <h6 class="font-semibold text-lg text-primary">Transfer Items</h6>
      </header>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty Shipped
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unit Price
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtotal
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="item in transferStockShippingDocument_data?.transferStockItems" :key="item.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ item.masterInventoryItems?.sku || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.masterInventoryItems?.name || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.masterInventoryItems?.unit || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ item.qtyReserved || 0 }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(item.unitPrice) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(item.subtotal) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-gray-50">
            <tr>
              <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                Total Value:
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                {{ getTotalValue() }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>

    <section id="additional-information" class="grid grid-cols-2 gap-8 mt-8">
      <div>
        <h6 class="font-semibold text-sm text-gray-700 mb-2">From Store Address:</h6>
        <p class="text-sm text-gray-600">
          {{ transferStockShippingDocument_data?.storeFrom?.address || '-' }}
        </p>
        <p class="text-sm text-gray-600">
          {{ transferStockShippingDocument_data?.storeFrom?.city || '' }} {{ transferStockShippingDocument_data?.storeFrom?.postalCode || '' }}
        </p>
      </div>
      <div>
        <h6 class="font-semibold text-sm text-gray-700 mb-2">To Store Address:</h6>
        <p class="text-sm text-gray-600">
          {{ transferStockShippingDocument_data?.storeTo?.address || '-' }}
        </p>
        <p class="text-sm text-gray-600">
          {{ transferStockShippingDocument_data?.storeTo?.city || '' }} {{ transferStockShippingDocument_data?.storeTo?.postalCode || '' }}
        </p>
      </div>
    </section>

    <section v-if="transferStockShippingDocument_data?.note" id="notes" class="mt-8">
      <h6 class="font-semibold text-sm text-gray-700 mb-2">Notes:</h6>
      <p class="text-sm text-gray-600">
        {{ transferStockShippingDocument_data?.note }}
      </p>
    </section>
  </section>
</template>

<style scoped>
.transfer-stock-shipping-document-content {
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>