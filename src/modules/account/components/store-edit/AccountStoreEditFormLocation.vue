<script setup lang="ts">
// Interfaces
import type { IAccountStoreEditProvided } from '../../interfaces/';

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreEdit_formData, accountStoreEdit_formValidations } =
  inject<IAccountStoreEditProvided>('accountStoreEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-location" class="flex flex-col gap-2">
    <h5 class="font-semibold text-black text-lg">{{ useLocalization('account.location') }}</h5>

    <section id="form-inputs" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section id="outlet-address" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="address"
          :name="useLocalization('account.form.address')"
          :validators="accountStoreEdit_formValidations.streetAddress"
        >
          <PrimeVueIconField>
            <PrimeVueTextarea
              v-model="accountStoreEdit_formData.streetAddress"
              :placeholder="useLocalization('account.form.placeholders.address')"
              class="text-sm w-full"
              :class="{ ...classes }"
              rows="5"
              v-on="useListenerForm(accountStoreEdit_formValidations, 'streetAddress')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-name" class="col-span-full md:col-span-6">&nbsp;</section>

      <section id="outlet-city" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="city"
          :name="useLocalization('account.form.city')"
          :validators="accountStoreEdit_formValidations.city"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.city"
              :placeholder="useLocalization('account.form.placeholders.city')"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(accountStoreEdit_formValidations, 'city')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-postal-code" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="postalCode"
          :name="useLocalization('account.form.postal-code')"
          :validators="accountStoreEdit_formValidations.postalCode"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.postalCode"
              :placeholder="useLocalization('account.form.placeholders.postal-code')"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(accountStoreEdit_formValidations, 'postalCode')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-building" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="building"
          :name="useLocalization('account.form.building')"
          :validators="accountStoreEdit_formValidations.building"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.building"
              :placeholder="useLocalization('account.form.placeholders.building')"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(accountStoreEdit_formValidations, 'building')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>
    </section>
  </section>
</template>
