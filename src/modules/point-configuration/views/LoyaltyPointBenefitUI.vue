<script setup lang="ts">
// type

// services
import { useLoyaltyPointBenefitService } from '../services/loyalty-point-benefit.service';
// components
import LoyaltyPointBenefitTable from '../components/LoyaltyPointBenefit/Table.vue';
import DialogDiscount from '../components/LoyaltyPointBenefit/DialogDiscount.vue';
import DialogFreeItems from '../components/LoyaltyPointBenefit/DialogFreeItems.vue';

const {
  loyaltyPointBenefit_values,
  loyaltyPointBenefit_columns,
  dailySalesList_onChangePage,

    discountBenefit_formData,
    discountBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogDiscount,
    loyaltyPointBenefit_onShowDialogDiscount,
    loyaltyPointBenefit_onCloseDialogDiscount,

    freeItemsBenefit_formData,
    freeItemsBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogFreeItems,
    loyaltyPointBenefit_onShowDialogFreeItems,
    loyaltyPointBenefit_onCloseDialogFreeItems,
} = useLoyaltyPointBenefitService();

provide('loyaltyPointBenefit', {
  loyaltyPointBenefit_values,
  loyaltyPointBenefit_columns,
  dailySalesList_onChangePage,

    discountBenefit_formData,
    discountBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogDiscount,
    loyaltyPointBenefit_onShowDialogDiscount,
    loyaltyPointBenefit_onCloseDialogDiscount,

    freeItemsBenefit_formData,
    freeItemsBenefit_formValidations,
    loyaltyPointBenefit_onSubmitDialogFreeItems,
    loyaltyPointBenefit_onShowDialogFreeItems,
    loyaltyPointBenefit_onCloseDialogFreeItems,
});
</script>

<template>
  <section id="loyalty-point-benefit" class="flex flex-col relative inset-0 z-0">
    <LoyaltyPointBenefitTable />
    <DialogDiscount />
    <DialogFreeItems />
  </section>
</template>
