<script setup lang="ts">
// Interfaces
import type { IAccountProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { account_bankAccountFormData, account_bankAccountFormValidations, account_onCloseDialogSetUpBank } =
  inject<IAccountProvided>('account')!;
</script>

<template>
  <AppBaseDialog id="account-setup-bank-dialog-information">
    <template #header>
      <h5 class="font-semibold text-black text-lg">
        {{ useLocalization('account.setup-bank-information') }}
      </h5>
    </template>

    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="bank-name"
            :name="useLocalization('account.form.bank-name')"
            spacing-bottom="mb-0"
            :validators="account_bankAccountFormValidations.bankName"
          >
            <PrimeVueSelect
              v-model="account_bankAccountFormData.bankName"
              :options="[]"
              option-label="label"
              option-value="value"
              :placeholder="useLocalization('account.form.placeholder.bank-name')"
              class="text-sm w-full"
              filter
              :class="{
                ...classes,
              }"
            />
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="account-number"
            :name="useLocalization('account.form.bank-account-number')"
            spacing-bottom="mb-0"
            :validators="account_bankAccountFormValidations.accountNumber"
          >
            <PrimeVueInputNumber
              v-model="account_bankAccountFormData.accountNumber"
              :class="{ ...classes }"
              class="text-sm w-full"
            />
          </AppBaseFormGroup>
        </section>

        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="account-holder-name"
            :name="useLocalization('account.form.bank-account-name')"
            spacing-bottom="mb-0"
            :validators="account_bankAccountFormValidations.accountHolderName"
          >
            <PrimeVueInputText
              v-model="account_bankAccountFormData.accountHolderName"
              :class="{ ...classes }"
              class="text-sm w-full"
            />
          </AppBaseFormGroup>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border-2 border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="account_onCloseDialogSetUpBank"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="account_bankAccountFormValidations.$invalid"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
