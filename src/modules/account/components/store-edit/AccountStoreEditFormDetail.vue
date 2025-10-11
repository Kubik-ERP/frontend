<script setup lang="ts">
// Constants
import { IAuthenticationSignUpCountryInformations } from '@/modules/authentication/interfaces';
import { ACCOUNT_STORE_EDIT_BUSINESS_TYPES } from '../../constants';

// Interfaces
import type { IAccountStoreEditProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreEdit_formData,
  accountStoreEdit_formValidations,
  accountStoreEdit_onRemovePhoto,
  accountStoreEdit_onUploadPhoto,
} = inject<IAccountStoreEditProvided>('accountStoreEdit')!;
</script>

<template>
  <section id="outlet-create-edit-form-detail" class="flex flex-col gap-2">
    <h5 class="font-semibold text-black text-lg">{{ useLocalization('account.details') }}</h5>

    <section id="form-inputs" class="grid grid-rows-1 grid-cols-12 gap-4">
      <section id="outlet-name" class="col-span-full md:col-span-6">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="useLocalization('account.form.store-name')"
          :validators="accountStoreEdit_formValidations.storeName"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.storeName"
              :placeholder="useLocalization('account.form.placeholders.store-name')"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(accountStoreEdit_formValidations, 'storeName')"
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
          :name="useLocalization('account.form.email')"
          :validators="accountStoreEdit_formValidations.email"
        >
          <PrimeVueIconField>
            <PrimeVueInputText
              v-model="accountStoreEdit_formData.email"
              :placeholder="useLocalization('account.form.placeholders.email')"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(accountStoreEdit_formValidations, 'email')"
            />
          </PrimeVueIconField>
        </AppBaseFormGroup>
      </section>

      <section id="phone-information" class="col-span-full md:col-span-6">
        <div class="grid grid-rows-1 grid-cols-12 gap-4">
          <section id="phone-code" class="col-span-6 lg:col-span-2">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="phoneCode"
              :name="useLocalization('account.form.phone-code')"
              spacing-bottom="mb-0"
              :validators="accountStoreEdit_formValidations.phoneCode"
            >
              <PrimeVueSelect
                id="phoneCode"
                v-model="accountStoreEdit_formData.phoneCode"
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
                v-on="useListenerForm(accountStoreEdit_formValidations, 'phoneCode')"
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

          <section id="phone-number" class="col-span-6 lg:col-span-10">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="phoneNumber"
              :name="useLocalization('account.form.phone-number')"
              spacing-bottom="mb-0"
              :validators="accountStoreEdit_formValidations.phoneNumber"
            >
              <PrimeVueInputText
                v-model="accountStoreEdit_formData.phoneNumber"
                :placeholder="useLocalization('account.form.placeholders.phone-number')"
                class="text-sm w-full"
                :class="{ ...classes }"
                type="tel"
                v-on="useListenerForm(accountStoreEdit_formValidations, 'phoneNumber')"
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
          :name="useLocalization('account.form.business-type')"
          :validators="accountStoreEdit_formValidations.businessType"
        >
          <div class="flex items-center gap-4 pt-4">
            <template
              v-for="(businessType, businessTypeIndex) in ACCOUNT_STORE_EDIT_BUSINESS_TYPES"
              :key="`business-type-${businessTypeIndex}`"
            >
              <PrimeVueRadioButton
                :id="`business-type-${businessTypeIndex}`"
                v-model="accountStoreEdit_formData.businessType"
                :input-id="`business-type-${businessTypeIndex}`"
                name="businessType"
                class="text-sm"
                :value="businessType.value"
                :class="{ ...classes }"
                v-on="useListenerForm(accountStoreEdit_formValidations, 'businessType')"
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
          v-model="accountStoreEdit_formData.photo"
          url="/api/upload"
          accept="image/*"
          custom-upload
          :max-file-size="2097152"
          :show-cancel-button="false"
          :show-upload-button="false"
          :pt="{
            root: 'border-2 border-dashed border-grayscale-30 bg-primary-background flex flex-col items-center justify-center py-10 relative inset-0 z-0',
            header: `relative inset-0 z-[1] ${accountStoreEdit_formData.photo ? '[&>button]:hidden' : ''}`,
            content: '[&>.p-progressbar]:hidden',
            fileInfo: 'hidden',
            file: '[&>span]:hidden [&>img]:w-fit [&>img]:h-fit [&>img]:max-w-[200px] [&>img]:max-h-[200px] [&>img]:object-cover',
          }"
          @select="accountStoreEdit_onUploadPhoto"
          @remove="accountStoreEdit_onRemovePhoto"
        >
          <template #header="{ chooseCallback }">
            <PrimeVueButton
              v-if="!accountStoreEdit_formData.photo"
              class="bg-white button-shadow border-none font-semibold text-primary text-sm py-[10px] w-full max-w-36"
              @click="chooseCallback()"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="image" class="!w-4 !h-4" />
                  <span class="font-normal text-sm">{{ useLocalization('account.form.select-image') }}</span>
                </section>
              </template>
            </PrimeVueButton>
          </template>

          <template #empty>
            <section id="main-content" class="flex flex-col items-center gap-2 absolute inset-0 z-0 w-full h-full">
              <span class="absolute top-28 font-normal text-black-secondary text-xs">
                {{ useLocalization('account.form.or') }}
                <span class="font-semibold">{{ useLocalization('account.form.drop-image-here') }}</span>
              </span>
            </section>
          </template>
        </PrimeVueFileUpload>
      </section>
    </section>
  </section>
</template>
