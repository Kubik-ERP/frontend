<script setup lang="ts">
// type
import type { IItemDiscountProvided } from '../interfaces';
// inject
const {
  itemDiscount_onCloseDialog,
  itemDiscount_onSubmitDialog,
  itemDiscount_formData,
  itemDiscount_formValidations,
  productDiscount_isLoading,
} = inject<IItemDiscountProvided>('productList')!;

const discountUnit = ref('Rp');

watch(
  () => discountUnit.value,
  discountValue => {
    if (discountValue === '%') {
      itemDiscount_formData.isPercent = true;
    } else {
      itemDiscount_formData.isPercent = false;
    }
  },
);
</script>
<template>
  <AppBaseDialog id="item-discount-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Item Discount</h5>
    </template>

    <template #content>
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="discount_value"
        :name="'Discount Value'"
        :validators="itemDiscount_formValidations.discountValue"
      >
        <div class="relative w-full">
          <div class="flex items-center border shadow-xs border-grayscale-30 rounded-lg overflow-hidden w-full">
            <PrimeVueInputNumber
              v-model="itemDiscount_formData.discountValue"
              class="w-full"
              name="discount_value"
              :prefix="itemDiscount_formData.isPercent === false ? 'Rp ' : ''"
              :suffix="itemDiscount_formData.isPercent === true ? ' %' : ''"
              :class="{ ...classes }"
              v-on="useListenerForm(itemDiscount_formValidations, 'discountValue')"
            />
            <div class="absolute right-0 flex items-center rounded-lg border-none ring-0">
              <PrimeVueSelect v-model="discountUnit" :options="['Rp', '%']" class="border-none bg-transparent">
                <template #dropdownicon>
                  <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
                </template>
                <template #option="{ option }">
                  {{ option }}
                </template>
              </PrimeVueSelect>
            </div>
          </div>
        </div>
      </AppBaseFormGroup>
    </template>
    <template #footer>
      <PrimeVueButton
        class="border-primary bg-transparent font-semibold text-sm text-primary basic-smooth-animation hover:bg-grayscale-10"
        label="Cancel"
        severity="secondary"
        variant="outlined"
        @click="itemDiscount_onCloseDialog"
      />
      <PrimeVueButton
        class="bg-primary border-none text-sm py-[10px]"
        label="Apply"
        type="button"
        :loading="productDiscount_isLoading"
        @click="itemDiscount_onSubmitDialog()"
      />
    </template>
  </AppBaseDialog>
</template>
