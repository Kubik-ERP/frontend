<script setup lang="ts">
// Interfaces
import type { ISettingTaxAndServiceProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingTaxService_formDataOfService,
  settingTaxService_formValidationsOfService,
  settingTaxService_isLoading,
  settingTaxService_onSubmit,
} = inject<ISettingTaxAndServiceProvided>('settingTaxService')!;
</script>

<template>
  <section id="service-content" class="flex flex-col col-span-full lg:col-span-6 gap-2">
    <header class="flex items-center gap-2 w-full">
      <h5 class="font-semibold text-black text-lg">Service Charge</h5>

      <PrimeVueToggleSwitch v-model:model-value="settingTaxService_formDataOfService.isEnabled" />
    </header>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <div class="flex flex-col w-full gap-4">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="service-charge"
            name="Service Charge"
            :validators="settingTaxService_formValidationsOfService.percentage"
          >
            <PrimeVueInputGroup>
              <PrimeVueInputNumber
                id="service-charge"
                v-model:model-value="settingTaxService_formDataOfService.percentage"
                class="text-sm w-full"
                :disabled="!settingTaxService_formDataOfService.isEnabled"
                fluid
                :class="{ ...classes }"
                v-on="useListenerForm(settingTaxService_formValidationsOfService, 'percentage')"
              />
              <PrimeVueInputGroupAddon>%</PrimeVueInputGroupAddon>
            </PrimeVueInputGroup>
          </AppBaseFormGroup>

          <section id="tax-configuration" class="flex flex-col gap-2">
            <h6 class="font-semibold text-sm text-black">Tax Configuration</h6>

            <section id="tax-product-price" class="flex flex-col gap-2">
              <p class="font-normal text-sm text-black">Product price includes service charge</p>

              <section id="option-values" class="flex items-center gap-4">
                <span class="font-normal text-text-disabled text-sm">No</span>
                <PrimeVueToggleSwitch v-model:model-value="settingTaxService_formDataOfService.isInclude" />
                <span class="font-normal text-primary text-sm">Yes</span>
              </section>
            </section>

            <section id="tax-product-takeaway" class="flex flex-col gap-2">
              <p class="font-normal text-sm text-black">Service charge is applied to takeaway orders</p>

              <section id="option-values" class="flex items-center gap-4">
                <span class="font-normal text-text-disabled text-sm">No</span>
                <PrimeVueToggleSwitch
                  v-model:model-value="settingTaxService_formDataOfService.appliedToTakeaway"
                />
                <span class="font-normal text-primary text-sm">Yes</span>
              </section>
            </section>
          </section>

          <PrimeVueButton
            class="bg-blue-primary border-none text-sm py-[10px] w-40 mt-2"
            label="Save"
            type="submit"
            :disabled="settingTaxService_formValidationsOfService.$invalid"
            :loading="settingTaxService_isLoading"
            @click="settingTaxService_onSubmit('service')"
          />
        </div>
      </template>
    </PrimeVueCard>
  </section>
</template>
