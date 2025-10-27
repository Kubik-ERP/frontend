<script setup lang="ts">
// type
import type { IProductDetailsProvided } from '../../interfaces';

const { productDetails_productVariants_columns, productDetails, productDetails_isLoading } =
  inject<IProductDetailsProvided>('productDetails')!;
</script>
<template>
  <AppBaseDataTable
    :columns="productDetails_productVariants_columns"
    :data="productDetails.productVariant"
    :is-loading="productDetails_isLoading"
    :is-using-border-on-header="false"
    :is-using-header="false"
    :is-using-pagination="false"
    :is-using-custom-body="true"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'additionalPrice'">
        <span class="font-base text-sm text-text-primary">{{
          useCurrencyFormat({ data: data[column.value] })
        }}</span>
      </template>
      <template v-else>
        <span class="font-base text-sm text-text-primary">{{ data[column.value] }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
