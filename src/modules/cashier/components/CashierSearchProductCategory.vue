<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_searchData, cashierProduct_isLoading, cashierProduct_onSearchData } =
  inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <section id="cashier-search-product-category">
    <form @submit.prevent="cashierProduct_onSearchData(cashierProduct_searchData)">
      <PrimeVueIconField>
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="search" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          v-model="cashierProduct_searchData"
          :loading="cashierProduct_isLoading"
          placeholder="Search product name or category"
          class="text-sm w-full"
        />
      </PrimeVueIconField>
    </form>
  </section>
</template>

<style scoped></style>
