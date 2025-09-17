<script setup lang="ts">
// components
import ItemDiscountTable from '../components/itemDiscountTable.vue';
import itemDiscountDialog from '../components/itemDiscountDialog.vue';
// service
import { useDiscountService } from '../services/item-discount.service';
// rbac
import { useRbac } from '@/app/composables/useRbac';
const rbac = useRbac();
const hasPermission = rbac.hasPermission('product_management');

const {
  productList_columns,
  productList_isLoading,
  productList_values,

  productList_queryParams,
  productList_onChangePage,

  selectedProducts,
  isProductSelected,
  toggleSelection,

  itemDiscount_onShowDialog,
  itemDiscount_onCloseDialog,
  itemDiscount_onSubmitDialog,

  itemDiscount_formData,
  itemDiscount_formValidations,

  fetchProductList,
} = useDiscountService();

provide('productList', {
  hasPermission,
  productList_columns,
  productList_isLoading,
  productList_values,

  productList_queryParams,
  productList_onChangePage,

  selectedProducts,
  isProductSelected,
  toggleSelection,

  itemDiscount_onShowDialog,
  itemDiscount_onCloseDialog,
  itemDiscount_onSubmitDialog,

  itemDiscount_formData,
  itemDiscount_formValidations,

  fetchProductList,
});

onMounted(async () => {
  await fetchProductList();
});
</script>
<template>
  <section>
    <ItemDiscountTable />
  </section>

  <itemDiscountDialog />
</template>
