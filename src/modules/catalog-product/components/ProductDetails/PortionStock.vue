<script setup lang="ts">
// type
import type { IProductDetailsProvided } from '../../interfaces';

const { productDetails_portionStock_columns, productDetails, productDetails_isLoading } =
  inject<IProductDetailsProvided>('productDetails')!;
</script>
<template>
  <AppBaseDataTable
    :columns="productDetails_portionStock_columns"
    :data="productDetails.portionStock"
    :is-loading="productDetails_isLoading"
    :is-using-border-on-header="false"
    :is-using-header="false"
    :is-using-pagination="false"
    is-using-custom-body
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'batchDate'">
        <span class="font-base text-sm text-text-primary">{{
          useFormatDate(data[column.value], 'dd/MMM/yyyy')
        }}</span>
      </template>
      <template v-else>
        <span class="font-base text-sm text-text-primary">{{ data[column.value] }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
