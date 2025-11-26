<script setup lang="ts">
// component
import PortionStockAdjustmentDialog from '../ProductDetails/PortionStockAdjustmentDialog.vue';
// type
import type { IProductDetailsProvided } from '../../interfaces';

const {
  productDetails_portionStock_columns,
  productDetails,
  productDetails_isLoading,
  portionStock_onShowAdjustment,
} = inject<IProductDetailsProvided>('productDetails')!;
</script>
<template>
  <!-- add portion stock adjustment button -->

  <AppBaseDataTable
    :columns="productDetails_portionStock_columns"
    :data="productDetails.portionStock"
    :is-loading="productDetails_isLoading"
    :is-using-border-on-header="false"
    :is-using-header="true"
    :is-using-pagination="false"
    :is-using-filter="false"
    :is-using-custom-header-suffix="true"
    :is-using-custom-header-prefix="true"
    is-using-custom-body
  >
    <template #header-suffix>
      <PrimeVueButton
        class="mb-4 bg-primary border-primary"
        label="Add portion stock adjustment"
        severity="primary"
        @click="portionStock_onShowAdjustment()"
      >
        <template #icon>
          <AppBaseSvg name="plus-line-white" class="!w-4 !h-4" />
        </template>
      </PrimeVueButton>
    </template>
    <template #header-prefix>
      <h1 class="font-semibold text-2xl text-text-primary">Portion Stock</h1>
    </template>
    <template #body="{ column, data }">
      <template v-if="column.value === 'createdAt'">
        <span class="font-base text-sm text-text-primary whitespace-nowrap">{{
          useFormatDate(data[column.value], 'dd/MMM/yyyy')
        }}</span>
      </template>
      <template v-else-if="column.value === 'users'">
        <span class="font-base text-sm text-text-primary">{{ data[column.value]?.fullname ?? '-' }} </span>
      </template>
      <template v-else>
        <span class="font-base text-sm text-text-primary">{{ data[column.value] }}</span>
      </template>
    </template>
  </AppBaseDataTable>

  <PortionStockAdjustmentDialog />

</template>
