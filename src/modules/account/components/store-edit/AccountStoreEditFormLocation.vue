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
    <h5 class="font-semibold text-black text-lg">Location</h5>

    <section id="form-inputs" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section id="outlet-address" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="address"
          name="Address"
          :validators="accountStoreEdit_formValidations.streetAddress"
        >
          <PrimeVueIconField>
            <PrimeVueTextarea
              v-model="accountStoreEdit_formData.streetAddress"
              placeholder="Input your store address"
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
          name="City"
          :validators="accountStoreEdit_formValidations.city"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.city"
              placeholder="Input your store city"
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
          name="Postal Code"
          :validators="accountStoreEdit_formValidations.postalCode"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.postalCode"
              placeholder="Input your store postal code"
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
          name="Building"
          :validators="accountStoreEdit_formValidations.building"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.building"
              placeholder="Input your store building"
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
