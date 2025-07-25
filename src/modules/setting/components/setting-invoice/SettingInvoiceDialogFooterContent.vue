<script setup lang="ts">
// Interfaces
import type { ISettingInvoiceProvided } from '../../interfaces/setting-invoice.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingInvoice_formData,
  footerText_formData,
  settingInvoice_formValidations,
  settingInvoice_onCloseEditFooterContentDialog,
} = inject<ISettingInvoiceProvided>('settingInvoice')!;

const settingInvoice_onUpdateFooterContent = () => {
  // Here you can handle the update logic for footer content
  settingInvoice_formData.contentSettings.footerText = footerText_formData.text;
  settingInvoice_onCloseEditFooterContentDialog();
};
</script>

<template>
  <AppBaseDialog id="setting-invoice-dialog-footer-content">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Edit Footer Content</h5>
      <!-- {{ settingInvoice_formData.contentSettings.footerText }}
      <br>
      {{ footerText_formData.text }} -->
    </template>

    <template #content>
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="footer-text"
        name="Footer Content"
        :validators="settingInvoice_formValidations.contentSettings.footerText"
      >
        <PrimeVueTextarea
          v-model="footerText_formData.text"
          class="text-sm w-full"
          :class="{ ...classes }"
          rows="5"
          v-on="useListenerForm(settingInvoice_formValidations.contentSettings, 'footerText')"
        />
      </AppBaseFormGroup>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="settingInvoice_onCloseEditFooterContentDialog"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Update"
          type="button"
          :disabled="settingInvoice_formValidations.contentSettings.footerText.$invalid"
          @click="settingInvoice_onUpdateFooterContent"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
