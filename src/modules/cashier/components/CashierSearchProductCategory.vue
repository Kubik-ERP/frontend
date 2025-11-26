<script setup lang="ts">
// Interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierProduct_productState,
  cashierProduct_onSearchData,
  cashierProduct_handleBarcodeScanned,
  isRetailBusinessType,
} = inject<ICashierProductProvided>('cashierProduct')!

/**
 * @description Ref for search input element
 */
const searchInputRef = ref<{ $el: HTMLElement } | null>(null);

/**
 * @description Handle spacebar keypress to focus search input
 */
const handleSpacebarFocus = (event: KeyboardEvent) => {
  // Only trigger if spacebar is pressed and target is not an input/textarea
  if (event.code === 'Space' && 
      event.target instanceof HTMLElement && 
      !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
    event.preventDefault();
    // Use direct DOM query for more reliable access
    const inputElement = document.querySelector('#cashier-search-product-category input') as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
  }
};

/**
 * @description Setup and cleanup event listeners
 */
onMounted(() => {
  window.addEventListener('keydown', handleSpacebarFocus);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleSpacebarFocus);
});

/**
 * @description Handle form submission (when Enter is pressed in search field)
 */
const handleFormSubmit = (event: Event) => {
  event.preventDefault();
  console.log('Form submitted!'); // Debug log

  const searchValue = cashierProduct_productState.value.searchProduct;
  console.log('Search value on form submit:', searchValue); // Debug log

  if (searchValue && searchValue.length >= 3 && isRetailBusinessType.value) {
    console.log('Triggering barcode scan from form submit with:', searchValue); // Debug log
    debouncedBarcodeHandler(searchValue);
  } else {
    console.log('Regular search triggered'); // Debug log
    cashierProduct_onSearchData();
  }

  // Reset search input value after form submission
  cashierProduct_productState.value.searchProduct = '';
};

/**
 * @description Handle search input keydown events
 */
const handleSearchInputKeydown = (event: KeyboardEvent) => {
  console.log('Search input keydown:', event.key); // Debug log

  if (event.key === 'Enter') {
    event.preventDefault();
    const searchValue = cashierProduct_productState.value.searchProduct;
    console.log('Enter pressed in search input, value:', searchValue); // Debug log
    console.log('isRetailBusinessType:', isRetailBusinessType.value); // Debug log

    if (searchValue && searchValue.length >= 3 && isRetailBusinessType.value) {
      console.log('Triggering barcode scan from search input with:', searchValue); // Debug log
      // Call directly without debounce for testing
      cashierProduct_handleBarcodeScanned(searchValue);
    } else {
      console.log('Conditions not met for barcode scanning:');
      console.log('- searchValue:', searchValue);
      console.log('- searchValue.length:', searchValue?.length);
      console.log('- isRetailBusinessType:', isRetailBusinessType.value);
    }

    // Reset search input value after Enter is pressed
    cashierProduct_productState.value.searchProduct = '';
  }
};

/**
 * @description Debounced barcode handler to prevent multiple rapid calls
 */
const debouncedBarcodeHandler = debounce((barcode: string) => {
  console.log('debouncedBarcodeHandler called with barcode:', barcode); // Debug log
  cashierProduct_handleBarcodeScanned(barcode);
}, 100); // Reduced debounce time for faster response
</script>

<template>
  <section id="cashier-search-product-category">
    <form v-focustrap @submit="handleFormSubmit">
      <PrimeVueIconField>
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" class="h-4 w-4" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          ref="searchInputRef"
          v-model="cashierProduct_productState.searchProduct"
          :loading="cashierProduct_productState.isLoadingProduct"
          :placeholder="useLocalization('cashier.mainSection.searchProductPlaceholder')"
          class="text-sm w-full placeholder:text-sm placeholder:text-text-disabled focus:!border-primary"
          :autofocus="true"
          @keydown="handleSearchInputKeydown"
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
