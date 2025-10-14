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
  loyaltyPointBenefit_onDelete,

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
  loyaltyPointSettings_initiate,
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
  loyaltyPointBenefit_onDelete,

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
    <section
      v-if="!loyaltyPointBenefit_list.loyaltySettingsStatus"
      class="flex flex-col items-center justify-center p-8 border border-primary bg-primary-background rounded-lg"
    >
      <h1 class="font-semibold text-2xl">You haven't configured your point settings yet.</h1>
      <p>
        Please set up your point configuration before creating any loyalty point benefit programs for customers.
      </p>
      <PrimeVueButton class="mt-8" label="Set Up Point Configuration" @click="loyaltyPointSettings_initiate()">
        <template #icon>
          <AppBaseSvg name="gear" class="!w-5 !h-5" />
        </template>
      </PrimeVueButton>
    </section>
    <section v-else>
      <LoyaltyPointBenefitTable />
      <DialogDiscount />
      <DialogFreeItems />
    </section>
    <AppBaseDialogConfirmation id="loyalty-point-benefit-delete-dialog-confirmation" />
  </section>
</template>
