<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpCountryInformations } from '@/modules/authentication/interfaces';
import type { IStaffMemberCreateEditProvided } from '../interfaces';

const {
  staffMemberCreateEdit_formData,
  staffMemberCreateEdit_formValidations,
  staffMemberCreateEdit_isLoading,
  staffMemberCreateEdit_typesOfSocialMedia,
  staffMemberCreateEdit_typesOfUserPermissions,
} = inject<IStaffMemberCreateEditProvided>('staffMemberCreateEdit')!;
</script>

<template>
  <section id="staff-member-detail-form" class="flex flex-col gap-3">
    <h6 class="font-semibold text-black text-lg">Staff Details</h6>

    <section id="staff-information-form" class="grid-wrapper gap-4">
      <section id="staff-title" class="col-span-full lg:col-span-6 flex flex-col gap-1">
        <label for="staff-title-input" class="font-normal text-sm text-text-secondary">
          Staff Title <span class="text-text-disabled">(Optional)</span>
        </label>

        <PrimeVueInputText
          id="staff-title-input"
          v-model="staffMemberCreateEdit_formData.role"
          class="text-sm w-full"
        />
      </section>

      <section id="staff-first-name" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="staff-permission"
          name="Staff"
          :validators="staffMemberCreateEdit_formValidations.permission"
        >
          <PrimeVueSelect
            id="staff-permission"
            v-model="staffMemberCreateEdit_formData.permission"
            filter
            :options="staffMemberCreateEdit_typesOfUserPermissions"
            option-label="label"
            option-value="value"
            placeholder="Select Staff Permission"
            class="text-base text-text-primary w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'permission')"
          />
        </AppBaseFormGroup>
      </section>

      <section id="email" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="email"
          name="Email"
          spacing-bottom="mb-0"
          :validators="staffMemberCreateEdit_formValidations.email"
        >
          <PrimeVueInputText
            v-model="staffMemberCreateEdit_formData.email"
            :loading="staffMemberCreateEdit_isLoading"
            placeholder="Input your registered email"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'email')"
          />
        </AppBaseFormGroup>
      </section>

      <section id="phone-number" class="col-span-full lg:col-span-6 flex items-center gap-3">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="phoneCountryCode"
          name="Phone Code"
          spacing-bottom="mb-0"
        >
          <PrimeVueSelect
            id="phoneCountryCode"
            v-model="staffMemberCreateEdit_formData.phoneCode"
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
          >
            <template #option="{ option }">
              <section id="phone-option" class="flex items-center gap-1">
                <img :src="option.image" alt="country-flag" class="w-6 h-6" />
                <span class="text-sm">{{ option.name }} ({{ option.dialCodes }})</span>
              </section>
            </template>

            <template #value="{ value }">
              <section id="phone-value" class="flex items-center gap-1">
                <span class="text-sm">{{ value }}</span>
              </section>
            </template>
          </PrimeVueSelect>
        </AppBaseFormGroup>

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phoneNumber"
            name="Phone Number"
            spacing-bottom="mb-0"
            :validators="staffMemberCreateEdit_formValidations.phoneNumber"
          >
            <PrimeVueInputText
              v-model="staffMemberCreateEdit_formData.phoneNumber"
              :loading="staffMemberCreateEdit_isLoading"
              placeholder="Input your phone number"
              class="text-sm w-full"
              :class="{ ...classes }"
              type="tel"
              v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'phoneNumber')"
            />
          </AppBaseFormGroup>
        </section>
      </section>

      <section id="gender" class="col-span-full lg:col-span-6 flex flex-col">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="business-type"
          name="Business Type"
          :validators="staffMemberCreateEdit_formValidations.gender"
        >
          <div class="flex items-center gap-4 pt-4">
            <PrimeVueRadioButton
              id="`option-male`"
              v-model="staffMemberCreateEdit_formData.gender"
              input-id="option-male"
              name="businessType"
              class="text-sm"
              value="MALE"
              :class="{ ...classes }"
              v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'gender')"
            />

            <label for="option-male" class="font-normal text-black text-sm"> Male </label>

            <PrimeVueRadioButton
              id="`option-female`"
              v-model="staffMemberCreateEdit_formData.gender"
              input-id="option-female"
              name="businessType"
              class="text-sm"
              value="FEMALE"
              :class="{ ...classes }"
              v-on="useListenerForm(staffMemberCreateEdit_formValidations, 'gender')"
            />

            <label for="option-female" class="font-normal text-black text-sm"> Female </label>
          </div>
        </AppBaseFormGroup>
      </section>

      <div class="col-span-full lg:col-span-6">&nbsp;</div>

      <section id="social-media" class="col-span-full lg:col-span-6 flex items-center gap-3">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="socialMediaType"
          name="Social Media"
          spacing-bottom="mb-0"
        >
          <PrimeVueSelect
            id="socialMediaType"
            filter
            :options="staffMemberCreateEdit_typesOfSocialMedia"
            option-label="label"
            option-value="value"
            class="text-sm h-full min-h-9 w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <section id="social-media-type" class="w-full">
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="socialMediaType"
            name="Social Media Type"
          >
            <PrimeVueInputText
              :loading="staffMemberCreateEdit_isLoading"
              placeholder="Input your phone number"
              class="text-sm w-full"
              type="tel"
            />
          </AppBaseFormGroup>
        </section>
      </section>
    </section>
  </section>
</template>
