<script setup lang="ts">
// type

// services
import { useLoyaltyPointBenefitService } from '../services/loyalty-point-benefit.service';
// components
import LoyaltyPointBenefitTable from '../components/LoyaltyPointBenefit/Table.vue';
import DialogDiscount from '../components/LoyaltyPointBenefit/DialogDiscount.vue';
import DialogFreeItems from '../components/LoyaltyPointBenefit/DialogFreeItems.vue';

const {
  loyaltyPointBenefit_columns,
  dailySalesList_onChangePage,

  //     loyalty point benefit
  loyaltyPointBenefit_isLoading,
  isEdit,

  loyaltyPointBenefit_fetchProductList,

  discountBenefit_formData,
  discountBenefit_formValidations,
  loyaltyPointBenefit_onSubmitDialogDiscount,
  loyaltyPointBenefit_onShowDialogDiscount,
  loyaltyPointBenefit_onShowEditDialogDiscount,
  loyaltyPointBenefit_onSubmitEditDialogDiscount,
  loyaltyPointBenefit_onCloseDialogDiscount,
  loyaltyPointBenefit_fetchList,

  loyaltyPointBenefit_queryParams,
  loyaltyPointBenefit_list,

  freeItemsBenefit_formData,
  freeItemsBenefit_formValidations,
  loyaltyPointBenefit_onSubmitDialogFreeItems,
  loyaltyPointBenefit_onSubmitEditDialogFreeItems,
  loyaltyPointBenefit_onShowEditDialogFreeItems,
  loyaltyPointBenefit_onShowDialogFreeItems,
  loyaltyPointBenefit_onCloseDialogFreeItems,

  productList_isLoading,
  loyaltyPointBenefit_productList,
} = useLoyaltyPointBenefitService();

provide('loyaltyPointBenefit', {
  loyaltyPointBenefit_columns,
  dailySalesList_onChangePage,

  //     loyalty point benefit
  loyaltyPointBenefit_isLoading,
  isEdit,

  loyaltyPointBenefit_fetchProductList,

  discountBenefit_formData,
  discountBenefit_formValidations,
  loyaltyPointBenefit_onSubmitDialogDiscount,
  loyaltyPointBenefit_onShowDialogDiscount,
  loyaltyPointBenefit_onShowEditDialogDiscount,
  loyaltyPointBenefit_onSubmitEditDialogDiscount,
  loyaltyPointBenefit_onCloseDialogDiscount,
  loyaltyPointBenefit_fetchList,

  loyaltyPointBenefit_queryParams,
  loyaltyPointBenefit_list,

  freeItemsBenefit_formData,
  freeItemsBenefit_formValidations,
  loyaltyPointBenefit_onSubmitDialogFreeItems,
  loyaltyPointBenefit_onSubmitEditDialogFreeItems,
  loyaltyPointBenefit_onShowEditDialogFreeItems,
  loyaltyPointBenefit_onShowDialogFreeItems,
  loyaltyPointBenefit_onCloseDialogFreeItems,

  productList_isLoading,
  loyaltyPointBenefit_productList,
});

onMounted(async () => {
  await loyaltyPointBenefit_fetchList();
  await loyaltyPointBenefit_fetchProductList();
});
</script>

<template>
  <section id="loyalty-point-benefit" class="flex flex-col relative inset-0 z-0">
    <LoyaltyPointBenefitTable />
    <DialogDiscount />
    <DialogFreeItems />
  </section>
</template>
