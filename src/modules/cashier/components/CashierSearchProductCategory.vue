<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_productState, cashierProduct_onSearchData, cashierProduct_handleBarcodeScanned } =
  inject<ICashierProductProvided>('cashierProduct')!;

/**
 * @description Handle barcode scanning for external device
 */
let barcodeBuffer = '';
let barcodeTimeout: NodeJS.Timeout | null = null;

const handleKeyPress = (event: KeyboardEvent) => {
  // Check if scan is from barcode scanner (rapid input)
  if (barcodeTimeout) {
    clearTimeout(barcodeTimeout);
  }

  // Add character to buffer if it's alphanumeric or dash/underscore
  if (/[a-zA-Z0-9\-_]/.test(event.key)) {
    barcodeBuffer += event.key;
  }

  // Handle Enter key (end of barcode scan)
  if (event.key === 'Enter' && barcodeBuffer.length > 3) {
    event.preventDefault();
    cashierProduct_handleBarcodeScanned(barcodeBuffer);
    barcodeBuffer = '';
    return;
  }

  // Clear buffer after delay if no more input (not a barcode scanner)
  barcodeTimeout = setTimeout(() => {
    barcodeBuffer = '';
  }, 100);
};

onMounted(() => {
  document.addEventListener('keypress', handleKeyPress);
});

onUnmounted(() => {
  document.removeEventListener('keypress', handleKeyPress);
  if (barcodeTimeout) {
    clearTimeout(barcodeTimeout);
  }
});
</script>

<template>
  <section id="cashier-search-product-category">
    <form @submit.prevent="cashierProduct_onSearchData(cashierProduct_productState.searchProduct)">
      <PrimeVueIconField>
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" class="h-4 w-4" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          v-model="cashierProduct_productState.searchProduct"
          :loading="cashierProduct_productState.isLoadingProduct"
          :placeholder="useLocalization('cashier.mainSection.searchProductPlaceholder')"
          class="text-sm w-full placeholder:text-sm placeholder:text-text-disabled"
        />

        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="scan" class="h-4 w-4" />
          </template>
        </PrimeVueInputIcon>
      </PrimeVueIconField>
    </form>
  </section>
</template>

<style scoped></style>
