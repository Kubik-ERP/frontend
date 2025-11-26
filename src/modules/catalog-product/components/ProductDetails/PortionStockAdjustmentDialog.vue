<script setup lang="ts">
// service
import { useProductDetailsService } from '../../services/product-details.service';
const {
  portionStock_formData,
  portionStock_formValidations,
  productDetails_isLoading,
  portionStock_onCloseAdjustment,
  portionStock_onSubmitAdjustment,
  productDetails,
} = useProductDetailsService();
const isQuantityPositive = ref<boolean>(true);
const validateQuantity = () => {
  if (portionStock_formData.type === 'decrease') {
    if (productDetails.value.stockQuantity - portionStock_formData.quantity < 0) {
      isQuantityPositive.value = false;
    } else {
      isQuantityPositive.value = true;
    }
  }
};

watch(
  [() => portionStock_formData.quantity, () => portionStock_formData.type],
  () => {
    validateQuantity();
  },
  { immediate: true },
);
</script>
<template>
  <AppBaseDialog id="product-portion-stock-dialog">
    <template #header>
      <h1 class="font-semibold text-2xl text-text-primary">Portion Stock Adjustment</h1>
    </template>
    <template #content>
      <section class="flex flex-col gap-4">
        <!-- type -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="type"
          :name="'Type'"
          :validators="portionStock_formValidations.type"
        >
          <PrimeVueDropdown
            v-model="portionStock_formData.type"
            :options="['increase', 'decrease']"
            placeholder="Type"
            class="text-sm w-full"
            :class="{ ...classes }"
          >
          </PrimeVueDropdown>
        </AppBaseFormGroup>

        <!-- quantity -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="quantity"
          name="Quantity"
          :validators="portionStock_formValidations.quantity"
        >
          <PrimeVueInputNumber
            id="quantity"
            v-model="portionStock_formData.quantity"
            :min="1"
            placeholder="Quantity"
            :step="1"
            class="text-sm w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <div class="w-full">
          <span v-if="portionStock_formData.type === 'increase'"
            >New Portion Stock : {{ productDetails.stockQuantity + portionStock_formData.quantity }}</span
          >
          <span v-else
            >New Portion Stock : {{ productDetails.stockQuantity - portionStock_formData.quantity }}</span
          >
        </div>

        <!-- notes -->
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
          :validators="portionStock_formValidations.notes"
        >
          <PrimeVueTextarea v-model="portionStock_formData.notes" class="w-full" :class="{ ...classes }" />
        </AppBaseFormGroup>

        <!-- action button -->
        <section class="flex gap-4">
          <PrimeVueButton
            :disabled="productDetails_isLoading"
            :loading="productDetails_isLoading"
            class="w-full border-primary text-primary"
            variant="outlined"
            @click="portionStock_onCloseAdjustment()"
          >
            Cancel
          </PrimeVueButton>

          <PrimeVueButton
            :disabled="portionStock_formValidations.$invalid || productDetails_isLoading || !isQuantityPositive"
            :loading="productDetails_isLoading"
            class="w-full bg-primary border-primary"
            @click="portionStock_onSubmitAdjustment()"
          >
            Submit
          </PrimeVueButton>
        </section>
      </section>
    </template>
  </AppBaseDialog>
</template>
