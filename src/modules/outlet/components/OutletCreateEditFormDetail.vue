<script setup lang="ts">
// Constants
import { OUTLET_CREATE_EDIT_BUSINESS_TYPES } from '../constants/outlet-create-edit.constant';

// Interfaces
import type { IOutletCreateEditProvided } from '../interfaces/outlet-create-edit.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { outletCreateEdit_formData, outletCreateEdit_formValidations } =
  inject<IOutletCreateEditProvided>('outletCreateEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-detail" class="flex flex-col gap-2">
    <h5 class="font-semibold text-black text-lg">Details</h5>

    <section id="form-inputs" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section id="outlet-name" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          name="Store Name"
          :validators="outletCreateEdit_formValidations.name"
          v-slot="{ classes }"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-on="useListenerForm(outletCreateEdit_formValidations, 'name')"
              v-model="outletCreateEdit_formData.name"
              placeholder="Input your store name"
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-email" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="email"
          name="Email"
          :validators="outletCreateEdit_formValidations.email"
          v-slot="{ classes }"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-on="useListenerForm(outletCreateEdit_formValidations, 'email')"
              v-model="outletCreateEdit_formData.email"
              placeholder="Input your store email"
              class="text-sm w-full"
              :class="{ ...classes }"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="business-type" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="business-type"
          name="Business Type"
          :validators="outletCreateEdit_formValidations.businessType"
          v-slot="{ classes }"
        >
          <div class="flex items-center gap-4">
            <template
              v-for="(businessType, businessTypeIndex) in OUTLET_CREATE_EDIT_BUSINESS_TYPES"
              :key="`business-type-${businessTypeIndex}`"
            >
              <PrimeVueRadioButton
                v-on="useListenerForm(outletCreateEdit_formValidations, 'businessType')"
                v-model="outletCreateEdit_formData.businessType"
                :id="`business-type-${businessTypeIndex}`"
                :input-id="`business-type-${businessTypeIndex}`"
                name="businessType"
                class="text-sm"
                :value="businessType"
                :class="{ ...classes }"
              />

              <label :label-for="`business-type-${businessTypeIndex}`" class="font-normal text-black text-sm">
                {{ businessType }}
              </label>
            </template>
          </div>
        </AppBaseFormGroup>
      </section>
    </section>
  </section>
</template>
