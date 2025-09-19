<script setup lang="ts">
// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

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
let lastInputTime = 0;

/**
 * @description Debounced barcode handler to prevent multiple rapid calls
 */
const debouncedBarcodeHandler = debounce((barcode: string) => {
  cashierProduct_handleBarcodeScanned(barcode);
}, 200); // 200ms debounce for barcode processing

const handleKeyPress = (event: KeyboardEvent) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastInputTime;

  // Skip jika sedang mengetik di input field yang sedang fokus
  const activeElement = document.activeElement as HTMLElement;
  if (activeElement &&
      (activeElement.tagName === 'INPUT' ||
       activeElement.tagName === 'TEXTAREA' ||
       activeElement.contentEditable === 'true')) {
    // Jika input terlalu cepat di input field, kemungkinan dari scanner
    if (timeDiff > 50) {
      return; // Skip jika input manual di field
    }
  }

  // Reset buffer jika input terlalu lambat (kemungkinan input manual)
  if (timeDiff > 150) {
    barcodeBuffer = '';
  }

  lastInputTime = currentTime;

  if (barcodeTimeout) {
    clearTimeout(barcodeTimeout);
  }

  // Add character to buffer - perluas karakter yang diizinkan
  if (/[a-zA-Z0-9\-_.*+]/.test(event.key)) {
    barcodeBuffer += event.key;
  }

  // Handle Enter key (end of barcode scan)
  if (event.key === 'Enter' && barcodeBuffer.length >= 4) {
    event.preventDefault();

    console.log('Barcode scanned:', barcodeBuffer); // Debug log

    // Set barcode ke search input dan trigger search dengan debounce
    cashierProduct_productState.value.searchProduct = barcodeBuffer;
    debouncedBarcodeHandler(barcodeBuffer);
    barcodeBuffer = '';
    return;
  }

  // Clear buffer after delay if no more input
  barcodeTimeout = setTimeout(() => {
    barcodeBuffer = '';
  }, 200);
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
    <form @submit.prevent="cashierProduct_onSearchData()">
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
