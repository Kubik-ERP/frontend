<script setup lang="ts">
// Interfaces
interface TransferStockShippingDocumentPdfData {
  transactionCode: string;
  storeFrom: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  storeTo: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
  };
  shippedAt: string | Date | null;
  trackingNumber: string | null;
  logisticProvider: string | null;
  deliveryNote: string | null;
  transferStockItems: Array<{
    id: string;
    masterInventoryItems: {
      sku: string;
      name: string;
      unit: string;
    };
    qtyReserved: number;
    unitPrice: unknown;
    subtotal: unknown;
  }>;
  note?: string;
}

/**
 * @description Props
 */
defineProps<{
  shippingDocumentData: TransferStockShippingDocumentPdfData;
}>();

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
</script>

<template>
  <div id="transfer-stock-shipping-document-pdf" class="bg-white p-8 max-w-4xl mx-auto">
    <!-- Header -->
    <header class="text-center mb-8 border-b pb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">TRANSFER SHIPPING DOCUMENT</h1>
      <h2 class="text-xl font-semibold text-gray-600">{{ shippingDocumentData.transactionCode }}</h2>
    </header>

    <!-- Shipping Information -->
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">FROM STORE</h3>
        <div class="bg-gray-50 p-4 rounded">
          <p class="font-medium text-gray-800">{{ shippingDocumentData.storeFrom.name }}</p>
          <p class="text-gray-600">{{ shippingDocumentData.storeFrom.address }}</p>
          <p class="text-gray-600">{{ shippingDocumentData.storeFrom.city }} {{ shippingDocumentData.storeFrom.postalCode }}</p>
        </div>
      </div>
      <div>
        <h3 class="text-lg font-semibold text-gray-800 mb-4">TO STORE</h3>
        <div class="bg-gray-50 p-4 rounded">
          <p class="font-medium text-gray-800">{{ shippingDocumentData.storeTo.name }}</p>
          <p class="text-gray-600">{{ shippingDocumentData.storeTo.address }}</p>
          <p class="text-gray-600">{{ shippingDocumentData.storeTo.city }} {{ shippingDocumentData.storeTo.postalCode }}</p>
        </div>
      </div>
    </div>

    <!-- Shipping Details -->
    <div class="grid grid-cols-2 gap-8 mb-8">
      <div>
        <h4 class="font-semibold text-gray-700 mb-2">Shipped Date:</h4>
        <p class="text-gray-600">
          {{ shippingDocumentData.shippedAt ? useFormatDate(String(shippingDocumentData.shippedAt), 'dd/mm/yyyy') : '-' }}
        </p>
      </div>
      <div>
        <h4 class="font-semibold text-gray-700 mb-2">Tracking Number:</h4>
        <p class="text-gray-600">{{ shippingDocumentData.trackingNumber || '-' }}</p>
      </div>
      <div>
        <h4 class="font-semibold text-gray-700 mb-2">Logistic Provider:</h4>
        <p class="text-gray-600">{{ shippingDocumentData.logisticProvider || '-' }}</p>
      </div>
      <div>
        <h4 class="font-semibold text-gray-700 mb-2">Delivery Notes:</h4>
        <p class="text-gray-600">{{ shippingDocumentData.deliveryNote || '-' }}</p>
      </div>
    </div>

    <!-- Items Table -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-4">TRANSFER ITEMS</h3>
      <div class="overflow-hidden border border-gray-300 rounded-lg">
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in shippingDocumentData.transferStockItems" :key="item.id" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.masterInventoryItems.sku }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.masterInventoryItems.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.masterInventoryItems.unit }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ item.qtyReserved }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ formatCurrency(item.unitPrice) }}</td>
              <td class="px-4 py-3 text-sm text-gray-900">{{ formatCurrency(item.subtotal) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="shippingDocumentData.note" class="mb-8">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">NOTES</h3>
      <p class="text-gray-600 bg-gray-50 p-4 rounded">{{ shippingDocumentData.note }}</p>
    </div>

    <!-- Footer -->
    <footer class="text-center text-gray-500 text-sm border-t pt-4">
      <p>Generated on {{ useFormatDate(new Date(), 'dd/mm/yyyy HH:mm') }}</p>
    </footer>
  </div>
</template>

<style scoped>
/* PDF-specific styles */
@media print {
  body {
    background: white;
  }
  
  #transfer-stock-shipping-document-pdf {
    box-shadow: none;
    margin: 0;
    padding: 20px;
  }
}

/* Ensure proper sizing for PDF generation */
#transfer-stock-shipping-document-pdf {
  width: 210mm; /* A4 width */
  min-height: 297mm; /* A4 height */
  font-family: Arial, sans-serif;
}
</style>