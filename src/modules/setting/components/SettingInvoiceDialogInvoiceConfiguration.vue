<script setup lang="ts">
// Interfaces
import type {
  ISettingInvoiceProvided,
} from '../interfaces/setting-invoice.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingInvoice_formData,
  settingInvoice_formValidations,
  settingInvoice_listResetSequences,
  settingInvoice_onCloseEditInvoiceNumberConfigurationDialog,
} = inject<ISettingInvoiceProvided>('settingInvoice')!;
</script>


<template>
  <AppBaseDialog id="setting-invoice-dialog-invoice-configuration">
    <template #header>
      <h5 class="font-semibold text-black text-lg">
        Invoice Number Configuration
      </h5>
    </template>

    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <section id="form-input" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label label-for="starting-number" name="Starting Number" spacing-bottom="mb-0"
            :validators="settingInvoice_formValidations.invoiceNumberConfigurations.startingNumber">
            <PrimeVueInputNumber v-model="settingInvoice_formData.invoiceNumberConfigurations.startingNumber" :class="{
              ...classes,
            }" placeholder="0" class="text-sm w-full" />
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label label-for="increment-by" name="Increment By" spacing-bottom="mb-0"
            :validators="settingInvoice_formValidations.invoiceNumberConfigurations.incrementBy">
            <PrimeVueInputNumber v-model="settingInvoice_formData.invoiceNumberConfigurations.incrementBy" :class="{
              ...classes,
            }" placeholder="0" class="text-sm w-full" />
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup v-slot="{ classes }" class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label label-for="reset-sequence" name="Reset Sequence" spacing-bottom="mb-0"
            :validators="settingInvoice_formValidations.invoiceNumberConfigurations.resetSequence">
            <PrimeVueSelect v-model="settingInvoice_formData.invoiceNumberConfigurations.resetSequence"
              :options="settingInvoice_listResetSequences" option-label="label" option-value="value"
              placeholder="Select type" class="text-sm w-full" :class="{
                ...classes,
              }" />
          </AppBaseFormGroup>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border-2 border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel" severity="secondary" variant="outlined"
          @click="settingInvoice_onCloseEditInvoiceNumberConfigurationDialog" />

        <PrimeVueButton class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40" label="Update"
          type="button" :disabled="settingInvoice_formValidations.invoiceNumberConfigurations.$invalid" />
      </footer>
    </template>
  </AppBaseDialog>
</template>