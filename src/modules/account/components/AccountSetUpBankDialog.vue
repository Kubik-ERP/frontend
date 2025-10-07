<script setup lang="ts">
// Interfaces
import type { IAccountProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  account_bankAccountFormData,
  account_bankAccountFormValidations,
  account_onCloseDialogSetUpBank,
  account_onSubmitBankAccount,
} = inject<IAccountProvided>('account')!;
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
            <PrimeVueInputText
              v-model="account_bankAccountFormData.bankName"
              class="text-sm w-full"
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
            <PrimeVueInputText
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
            :validators="account_bankAccountFormValidations.accountName"
          >
            <PrimeVueInputText
              v-model="account_bankAccountFormData.accountName"
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
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          :label="useLocalization('account.buttons.cancel')"
          severity="secondary"
          variant="outlined"
          @click="account_onCloseDialogSetUpBank"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          :label="useLocalization('account.buttons.save')"
          type="button"
          :disabled="account_bankAccountFormValidations.$invalid"
          @click="account_onSubmitBankAccount()"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
