<script setup lang="ts">
// Constants
import {
  OUTLET_CREATE_EDIT_BUSINESS_TYPES,
  OUTLET_CREATE_EDIT_BUSINESS_TYPES_NOT_ACCESS,
} from '../constants/outlet-create-edit.constant';
import { FILE_UPLOAD_LIMITS, FILE_UPLOAD_LIMITS_DISPLAY } from '@/app/constants/file-upload.constant';

// Interfaces
import type { IOutletCreateEditProvided } from '../interfaces/outlet-create-edit.interface';
import { useAuthenticationStore } from '@/modules/authentication/store';
import { IAuthenticationSignUpCountryInformations } from '@/modules/authentication/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  outletCreateEdit_formData,
  outletCreateEdit_formValidations,
  outletCreateEdit_onRemovePhoto,
  outletCreateEdit_onUploadPhoto,
} = inject<IOutletCreateEditProvided>('outletCreateEdit')!;

const authenticationStore = useAuthenticationStore();
const { authentication_userData } = storeToRefs(authenticationStore);
</script>

<template>
  <section id="outlet-create-edit-form-detail" class="flex flex-col gap-2">
    <h5 class="font-semibold text-black text-lg">Details</h5>

    <section id="form-inputs" class="grid grid-rows-1 grid-cols-12 gap-0 lg:gap-4">
      <section id="outlet-name" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          name="Store Name"
          :validators="outletCreateEdit_formValidations.storeName"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="outletCreateEdit_formData.storeName"
              placeholder="Input your store name"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(outletCreateEdit_formValidations, 'storeName')"
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
          <section id="phone-code" class="col-span-4 lg:col-span-2">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="phoneCode"
              name="Phone Code"
              spacing-bottom="mb-0"
              :validators="outletCreateEdit_formValidations.phoneCode"
            >
              <PrimeVueSelect
                id="phoneCode"
                v-model="outletCreateEdit_formData.phoneCode"
                filter
                :options="COUNTRY_INFORMATIONS"
                :option-label="
                  (value: IAuthenticationSignUpCountryInformations) => {
                    return `${value.name} (${value.dialCodes})`;
                  }
                "
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
              </PrimeVueSelect>
            </AppBaseFormGroup>
          </section>

          <section id="phone-number" class="col-span-8 lg:col-span-10">
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
                class="text-sm w-full"
                :class="{ ...classes }"
                type="tel"
                v-on="useListenerForm(outletCreateEdit_formValidations, 'phoneNumber')"
              />
            </AppBaseFormGroup>
          </section>
        </div>
      </section>

      <section id="business-type" class="col-span-full md:col-span-6 mt-4 lg:mt-0">
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
              v-for="(businessType, businessTypeIndex) in authentication_userData?.isAccessRetail
                ? OUTLET_CREATE_EDIT_BUSINESS_TYPES
                : OUTLET_CREATE_EDIT_BUSINESS_TYPES_NOT_ACCESS"
              :key="`business-type-${businessTypeIndex}`"
            >
              <PrimeVueRadioButton
                :id="`business-type-${businessTypeIndex}`"
                v-model="outletCreateEdit_formData.businessType"
                :input-id="`business-type-${businessTypeIndex}`"
                name="businessType"
                class="text-sm"
                :value="businessType.value"
                :class="{ ...classes }"
                v-on="useListenerForm(outletCreateEdit_formValidations, 'businessType')"
              />

              <label :for="`business-type-${businessTypeIndex}`" class="font-normal text-black text-sm">
                {{ businessType.label }}
              </label>
            </template>
          </div>
        </AppBaseFormGroup>
      </section>

      <section id="outlet-photo" class="col-span-full md:col-span-6 relative inset-0 z-0">
        <PrimeVueFileUpload
          v-model="outletCreateEdit_formData.photo"
          url="/api/upload"
          accept="image/*"
          custom-upload
          :max-file-size="FILE_UPLOAD_LIMITS.IMAGE_MAX_SIZE"
          :file-limit="1"
          :show-cancel-button="false"
          :show-upload-button="false"
          :pt="{
            root: 'border-2 border-dashed border-grayscale-30 bg-primary-background flex flex-col items-center justify-center py-10 relative inset-0 z-0',
            header: `relative inset-0 z-[1] ${outletCreateEdit_formData.photo ? '[&>button]:hidden' : ''}`,
            content: '[&>.p-progressbar]:hidden',
            fileInfo: 'hidden',
            file: '[&>span]:hidden [&>img]:w-fit [&>img]:h-fit [&>img]:max-w-[200px] [&>img]:max-h-[200px] [&>img]:object-cover',
          }"
          @select="outletCreateEdit_onUploadPhoto"
          @remove="outletCreateEdit_onRemovePhoto"
        >
          <template #header="{ chooseCallback }">
            <PrimeVueButton
              v-if="!outletCreateEdit_formData.photo"
              class="bg-white button-shadow border-none font-semibold text-blue-primary text-sm py-[10px] w-full max-w-36"
              @click="chooseCallback()"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="image" class="!w-4 !h-4" />
                  <span class="font-normal text-sm">Select Image</span>
                </section>
              </template>
            </PrimeVueButton>
          </template>

          <template #empty>
            <section id="main-content" class="flex flex-col items-center gap-2 absolute inset-0 z-0 w-full h-full">
              <span class="absolute top-28 font-normal text-black-secondary text-xs">
                or
                <span class="font-semibold"> Drop Image here </span>
              </span>
              <span class="absolute bottom-6 font-normal text-black-secondary text-xs">
                Maximum file size: {{ FILE_UPLOAD_LIMITS_DISPLAY.IMAGE_MAX_SIZE_MB }}
              </span>
            </section>
          </template>
        </PrimeVueFileUpload>
      </section>
    </section>
  </section>
</template>
