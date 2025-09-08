<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_productState, cashierProduct_onSearchData } =
  inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <section id="cashier-search-product-category">
    <form @submit.prevent="cashierProduct_onSearchData(cashierProduct_productState.searchProduct)">
      <PrimeVueIconField>
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" class="!h-4 !w-4" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          v-model="cashierProduct_productState.searchProduct"
          :loading="cashierProduct_productState.isLoadingProduct"
          :placeholder="useLocalization('cashier.mainSection.searchProductPlaceholder')"
          class="text-sm w-full"
        />
      </PrimeVueIconField>
    </form>
  </section>
</template>

<style scoped></style>
