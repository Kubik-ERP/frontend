<script setup lang="ts">
// Interfaces
import type { ISettingPaymentMethodProvided } from '../../interfaces/setting-payment-method.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  settingPaymentMethod_formData,
  settingPaymentMethod_formValidations,
  settingPaymentMethod_isLoading,
  settingPaymentMethod_onClose,
  settingPaymentMethod_onSubmit,
} = inject('settingPaymentMethod') as ISettingPaymentMethodProvided;
</script>

<template>
  <AppBaseDialog id="setting-payment-method-create-edit-dialog">
    <template #header>
      <header class="flex flex-col gap-2 w-full">
        <h6 class="font-semibold text-black text-lg">Payment Method</h6>
      </header>
    </template>

    <template #content>
      <form action="" class="flex flex-col gap-4 w-full">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-normal leading-6 text-text-secondary w-full"
          is-name-as-label
          label-for="name"
          name="Payment Method Name"
          spacing-bottom="mb-0"
          :validators="settingPaymentMethod_formValidations.name"
        >
          <PrimeVueInputText
            v-model="settingPaymentMethod_formData.name"
            placeholder=""
            class="text-sm w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <section id="active-payment-method" class="flex items-center justify-between w-full">
          <label for="activate" class="font-normal text-base text-black"> Activate this payment method </label>

          <PrimeVueToggleSwitch id="activate" v-model:model-value="settingPaymentMethod_formData.isAvailable" />
        </section>
      </form>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border-2 border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="settingPaymentMethod_onClose"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="settingPaymentMethod_formValidations.$invalid"
          :loading="settingPaymentMethod_isLoading"
          @click="settingPaymentMethod_onSubmit"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
