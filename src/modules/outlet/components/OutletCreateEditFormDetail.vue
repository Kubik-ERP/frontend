<script setup lang="ts">
// Components
import Select from 'primevue/select';

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
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          name="Store Name"
          :validators="outletCreateEdit_formValidations.name"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="outletCreateEdit_formData.name"
              placeholder="Input your store name"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(outletCreateEdit_formValidations, 'name')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-email" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="email"
          name="Email"
          :validators="outletCreateEdit_formValidations.email"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="outletCreateEdit_formData.email"
              placeholder="Input your store email"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(outletCreateEdit_formValidations, 'email')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="phone-information" class="col-span-full md:col-span-6">
        <div class="grid grid-rows-1 grid-cols-12 gap-4">
          <section id="phone-code" class="col-span-2">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="phoneCode"
              name="Phone Code"
              spacing-bottom="mb-0"
              :validators="outletCreateEdit_formValidations.phoneCode"
            >
              <Select
                id="phoneCode"
                v-model="outletCreateEdit_formData.phoneCode"
                filter
                :options="COUNTRY_INFORMATIONS"
                option-value="dialCodes"
                placeholder="+62"
                class="text-sm h-full min-h-9 w-full"
                :class="{ ...classes }"
                v-on="useListenerForm(outletCreateEdit_formValidations, 'phoneCode')"
              >
                <template #option="{ option }">
                  <section id="phone-option" class="flex items-center gap-1">
                    <img :src="option.image" alt="country-flag" class="w-6 h-6" />
                    <span class="text-sm">{{ option.dialCodes }}</span>
                  </section>
                </template>

                <template #value="{ value }">
                  <section id="phone-value" class="flex items-center gap-1">
                    <span class="text-sm">{{ value }}</span>
                  </section>
                </template>
              </Select>
            </AppBaseFormGroup>
          </section>

          <section id="phone-number" class="col-span-10">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="phoneNumber"
              name="Phone Number"
              spacing-bottom="mb-0"
              :validators="outletCreateEdit_formValidations.phoneNumber"
            >
              <PrimeVueInputText
                v-model="outletCreateEdit_formData.phoneNumber"
                placeholder="Input your phone number"
                class="text-sm w-full mt-2"
                :class="{ ...classes }"
                type="tel"
                v-on="useListenerForm(outletCreateEdit_formValidations, 'phoneNumber')"
              />
            </AppBaseFormGroup>
          </section>
        </div>
      </section>

      <section id="business-type" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="business-type"
          name="Business Type"
          :validators="outletCreateEdit_formValidations.businessType"
        >
          <div class="flex items-center gap-4 pt-4">
            <template
              v-for="(businessType, businessTypeIndex) in OUTLET_CREATE_EDIT_BUSINESS_TYPES"
              :key="`business-type-${businessTypeIndex}`"
            >
              <PrimeVueRadioButton
                :id="`business-type-${businessTypeIndex}`"
                v-model="outletCreateEdit_formData.businessType"
                :input-id="`business-type-${businessTypeIndex}`"
                name="businessType"
                class="text-sm"
                :value="businessType"
                :class="{ ...classes }"
                v-on="useListenerForm(outletCreateEdit_formValidations, 'businessType')"
              />

              <label :label-for="`business-type-${businessTypeIndex}`" class="font-normal text-black text-sm">
                {{ businessType }}
              </label>
            </template>
          </div>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-photo" class="col-span-full md:col-span-6">
        <PrimeVueFileUpload
          url="/api/upload"
          accept="image/*"
          :max-file-size="1000000"
          :show-cancel-button="false"
          :show-upload-button="false"
          :pt="{
            header: '!hidden',
            root: 'border-2 border-dashed border-grayscale-30 bg-primary-background flex flex-col items-center justify-center py-10',
          }"
        >
          <template #empty>
            <section id="main-content" class="flex flex-col items-center gap-2">
              <PrimeVueButton
                class="bg-white button-shadow border-none font-semibold text-blue-primary text-sm py-[10px] w-full max-w-36"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="image" class="!w-4 !h-4" />
                    <span class="font-normal text-sm">Select Image</span>
                  </section>
                </template>
              </PrimeVueButton>

              <span class="font-normal text-black-secondary text-xs">
                or
                <span class="font-semibold"> Drop Image here </span>
              </span>
            </section>
          </template>
        </PrimeVueFileUpload>
      </section>
    </section>
  </section>
</template>
