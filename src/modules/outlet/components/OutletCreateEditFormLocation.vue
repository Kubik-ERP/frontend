<script setup lang="ts">
// Interfaces
import type { IOutletCreateEditProvided } from '../interfaces/outlet-create-edit.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { outletCreateEdit_formData, outletCreateEdit_formValidations } =
  inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-location" class="flex flex-col gap-2">
    <h5 class="font-semibold text-black text-lg">Location</h5>

    <section id="form-inputs" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section id="outlet-name" class="col-span-full md:col-span-6">Location GMaps</section>

      <section id="outlet-address" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="address"
          name="Address"
          :validators="outletCreateEdit_formValidations.address"
          v-slot="{ classes }"
        >
          <PrimeVueIconField>
            <PrimeVueTextarea
              v-on="useListenerForm(outletCreateEdit_formValidations, 'address')"
              v-model="outletCreateEdit_formData.address"
              placeholder="Input your store address"
              class="text-sm w-full"
              :class="{ ...classes }"
              rows="5"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-city" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="city"
          name="City"
          :validators="outletCreateEdit_formValidations.city"
          v-slot="{ classes }"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-on="useListenerForm(outletCreateEdit_formValidations, 'city')"
              v-model="outletCreateEdit_formData.city"
              placeholder="Input your store city"
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-postal-code" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="postalCode"
          name="Postal Code"
          :validators="outletCreateEdit_formValidations.postalCode"
          v-slot="{ classes }"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-on="useListenerForm(outletCreateEdit_formValidations, 'postalCode')"
              v-model="outletCreateEdit_formData.postalCode"
              placeholder="Input your store postal code"
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-building" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="building"
          name="Building"
          :validators="outletCreateEdit_formValidations.building"
          v-slot="{ classes }"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-on="useListenerForm(outletCreateEdit_formValidations, 'building')"
              v-model="outletCreateEdit_formData.building"
              placeholder="Input your store building"
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>
    </section>
  </section>
</template>
