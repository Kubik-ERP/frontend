<script setup lang="ts">
// type
import type { IItemDiscountProvided } from '../interfaces';
// inject
const {
  hasPermission,
  productList_columns,
  productList_isLoading,
  productList_values,

  productList_queryParams,
  productList_onChangePage,

  isProductSelected,
  toggleSelection,

  itemDiscount_onShowDialog,
} = inject<IItemDiscountProvided>('productList')!;
</script>
<template>
  <section>
    <AppBaseDataTable
      :columns="productList_columns"
      :data="productList_values.products"
      :is-loading="productList_isLoading"
      :rows-per-page="productList_queryParams.limit"
      :total-records="productList_values.total"
      :first="(productList_values.page - 1) * productList_queryParams.limit"
      is-using-custom-body
      :is-using-filter="false"
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-header
      is-using-server-side-pagination
      @update:currentPage="productList_onChangePage"
    >
      <template #header-prefix>
        <div class="flex items-center gap-2">
          <h6 class="font-semibold text-gray-900 text-xl">Products</h6>

          <PrimeVueChip
            class="text-xs font-normal text-primary px-1.5 py-0.5"
            :label="`${productList_values.total} Products`"
          />
        </div>
      </template>

      <template #header-suffix>
        <div class="flex items-center gap-4">
          <PrimeVueIconField>
            <PrimeVueInputIcon>
              <template #default>
                <AppBaseSvg name="search" class="!w-4 !h-4" />
              </template>
            </PrimeVueInputIcon>

            <PrimeVueInputText
              v-model="productList_queryParams.search"
              placeholder="Search Product"
              class="w-full min-w-80"
            />
          </PrimeVueIconField>

          <PrimeVueButton
            v-if="hasPermission"
            label="Add Discount"
            class="bg-primary border-primary text-white"
            @click="itemDiscount_onShowDialog()"
          >
            <template #icon>
              <AppBaseSvg name="plus-line-white" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'selection'">
          <PrimeVueCheckbox
            binary
            :model-value="isProductSelected(data)"
            @update:modelValue="toggleSelection(data)"
          />
        </template>
        <template v-else-if="column.value === 'category'">
          <div class="flex gap-2">
            <span v-if="data.categoriesHasProducts.length === 0"> - </span>
            <span
              v-for="item in data.categoriesHasProducts"
              :key="item"
              class="font-normal text-xs text-text-primary"
            >
              <PrimeVueChip class="px-2 py-1 bg-secondary text-white">{{ item.categories.category }}</PrimeVueChip>
            </span>
          </div>
        </template>
        <template v-else-if="column.value === 'variant'">
          <div class="flex gap-2">
            <span v-if="data.variantHasProducts.length === 0"> - </span>
            <span
              v-for="item in data.variantHasProducts"
              :key="item"
              class="font-normal text-xs text-text-primary"
            >
              <PrimeVueChip class="px-2 py-1 bg-secondary text-white">{{ item.variant.name }}</PrimeVueChip>
            </span>
          </div>
        </template>
        <template v-else-if="column.value === 'price'">
          <span class="font-normal text-sm text-text-primary"> {{ useCurrencyFormat({ data: data.price }) }}</span>
        </template>
        <template v-else-if="column.value === 'discountPrice'">
          <span class="font-normal text-sm text-text-primary">
            {{ useCurrencyFormat({ data: data.discountPrice }) }}</span
          >
        </template>
        <template v-else>
          <span class="font-normal text-sm text-text-primary"> {{ data[column.value] ?? '-' }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
