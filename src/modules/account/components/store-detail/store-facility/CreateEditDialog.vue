<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../../interfaces';

const {
  accountStoreDetail_formData,
  accountStoreDetail_formValidations,
  accountStoreDetail_onCloseDialogCreateEdit,
  accoutnStoreDetail_onSubmitDialogCreateEdit,
} = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>
<template>
  <AppBaseDialog id="account-store-facility-create-edit-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">{{ useLocalization('account.store-facilities') }}</h5>
    </template>
    <template #content>
      <section id="form-groups" class="grid-wrapper gap-4">
        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="name"
            :name="useLocalization('account.form.name')"
            spacing-bottom="mb-0"
            :validators="accountStoreDetail_formValidations.facility"
          >
            <PrimeVueInputText
              v-model="accountStoreDetail_formData.facility"
              :class="{ ...classes }"
              class="text-sm w-full"
              v-on="useListenerForm(accountStoreDetail_formValidations, 'facility')"
            />
          </AppBaseFormGroup>
        </section>
        <section id="form-input" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="description"
            :name="useLocalization('account.form.description')"
            spacing-bottom="mb-0"
            :validators="accountStoreDetail_formValidations.description"
          >
            <PrimeVueTextarea
              v-model="accountStoreDetail_formData.description"
              :auto-resize="true"
              :rows="5"
              :cols="30"
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
          @click="accountStoreDetail_onCloseDialogCreateEdit"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          :label="
            accountStoreDetail_formData.id
              ? useLocalization('account.buttons.update')
              : useLocalization('account.buttons.add')
          "
          type="button"
          :disabled="accountStoreDetail_formValidations.$invalid"
          @click="accoutnStoreDetail_onSubmitDialogCreateEdit"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
