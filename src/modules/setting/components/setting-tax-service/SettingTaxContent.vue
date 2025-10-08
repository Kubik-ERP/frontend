<script setup lang="ts">
// Interfaces
import type { ISettingTaxAndServiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingTaxService_formDataOfTax,
  settingTaxService_formValidationsOfTax,
  settingTaxService_isLoading,
  settingTaxService_onSubmit,
} = inject<ISettingTaxAndServiceProvided>('settingTaxService')!;
</script>

<template>
  <section id="tax-content" class="flex flex-col col-span-full lg:col-span-6 gap-2">
    <header class="flex items-center gap-2 w-full">
      <h5 class="font-semibold text-black text-lg">Tax</h5>

      <PrimeVueToggleSwitch v-model:model-value="settingTaxService_formDataOfTax.isEnabled" />
    </header>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <div class="flex flex-col w-full gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="tax-name"
            name="Tax Name"
            :validators="settingTaxService_formValidationsOfTax.name"
          >
            <PrimeVueInputText
              id="tax-name"
              v-model:model-value="settingTaxService_formDataOfTax.name"
              class="text-sm w-full"
              :class="{ ...classes }"
              :disabled="!settingTaxService_formDataOfTax.isEnabled"
              v-on="useListenerForm(settingTaxService_formValidationsOfTax, 'name')"
            />
          </AppBaseFormGroup>

          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="tax-percentage"
            name="Tax Percentage"
            :validators="settingTaxService_formValidationsOfTax.percentage"
          >
            <PrimeVueInputGroup>
              <PrimeVueInputNumber
                id="tax-percentage"
                v-model:model-value="settingTaxService_formDataOfTax.percentage"
                class="text-sm w-full"
                :class="{ ...classes }"
                :disabled="!settingTaxService_formDataOfTax.isEnabled"
                v-on="useListenerForm(settingTaxService_formValidationsOfTax, 'percentage')"
              />
              <PrimeVueInputGroupAddon>%</PrimeVueInputGroupAddon>
            </PrimeVueInputGroup>
          </AppBaseFormGroup>

          <section id="tax-configuration" class="flex flex-col gap-2">
            <h6 class="font-semibold text-sm text-black">Tax Configuration</h6>

            <section id="tax-product-price" class="flex flex-col gap-2">
              <p class="font-normal text-sm text-black">Product price includes tax</p>

              <section id="option-values" class="flex items-center gap-4">
                <span class="font-normal text-text-disabled text-sm">No</span>
                <PrimeVueToggleSwitch v-model:model-value="settingTaxService_formDataOfTax.isInclude" :disabled="!settingTaxService_formDataOfTax.isEnabled" />
                <span class="font-normal text-primary text-sm">Yes</span>
              </section>
            </section>

            <section id="tax-product-takeaway" class="flex flex-col gap-2">
              <p class="font-normal text-sm text-black">Tax is not applied to takeaway orders</p>

              <section id="option-values" class="flex items-center gap-4">
                <span class="font-normal text-text-disabled text-sm">No</span>
                <PrimeVueToggleSwitch v-model:model-value="settingTaxService_formDataOfTax.appliedToTakeaway" :disabled="!settingTaxService_formDataOfTax.isEnabled" />
                <span class="font-normal text-primary text-sm">Yes</span>
              </section>
            </section>
          </section>

          <PrimeVueButton
            class="bg-primary border-none text-sm py-[10px] w-40 mt-2"
            label="Save"
            type="submit"
            :disabled="settingTaxService_formValidationsOfTax.$invalid || settingTaxService_isLoading"
            :loading="settingTaxService_isLoading"
            @click="settingTaxService_onSubmit('tax')"
          />
        </div>
      </template>
    </PrimeVueCard>
  </section>
</template>
