<script setup lang="ts">
// Interfaces
import type { ISelfOrderProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_productState,
  selfOrder_onSearchData,
  selfOrder_handleBarcodeScanned,
  selfOrder_isRetailBusinessType,
} = inject<ISelfOrderProvided>('selfOrder')!

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
    const inputElement = document.querySelector('#self-order-search-product-category input') as HTMLInputElement;
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
  const searchValue = selfOrder_productState.value.searchProduct;

  if (searchValue && searchValue.length >= 3 && selfOrder_isRetailBusinessType.value) {
    debouncedBarcodeHandler(searchValue);
  } else {
    selfOrder_onSearchData();
  }

  // Reset search input value after form submission
  selfOrder_productState.value.searchProduct = '';
};

/**
 * @description Handle search input keydown events
 */
const handleSearchInputKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    const searchValue = selfOrder_productState.value.searchProduct;

    if (searchValue && searchValue.length >= 3 && selfOrder_isRetailBusinessType.value) {
      selfOrder_handleBarcodeScanned(searchValue);
    }

    // Reset search input value after Enter is pressed
    selfOrder_productState.value.searchProduct = '';
  }
};

/**
 * @description Debounced barcode handler to prevent multiple rapid calls
 */
const debouncedBarcodeHandler = debounce((barcode: string) => {
  selfOrder_handleBarcodeScanned(barcode);
}, 100);
</script>

<template>
  <section id="self-order-search-product-category">
    <form v-focustrap @submit="handleFormSubmit">
      <PrimeVueIconField>
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" class="h-4 w-4" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          ref="searchInputRef"
          v-model="selfOrder_productState.searchProduct"
          :loading="selfOrder_productState.isLoadingProduct"
          :placeholder="useLocalization('cashier.mainSection.searchProductPlaceholder')"
          class="text-sm w-full placeholder:text-sm placeholder:text-text-disabled"
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
