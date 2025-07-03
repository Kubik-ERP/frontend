<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpCountryInformations } from '@/modules/authentication/interfaces';
import type { IAccountEditProfileProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { accountEditProfile_formData, accountEditProfile_formValidations, accountEditProfile_isLoading } =
  inject<IAccountEditProfileProvided>('accountEditProfile')!;
</script>

<template>
  <section id="account-edit-profile" class="grid-wrapper gap-4">
    <section id="full-name" class="col-span-full lg:col-span-6">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="fullName"
        :name="useLocalization('app.form.full-name')"
        spacing-bottom="mb-0"
        :validators="accountEditProfile_formValidations.name"
      >
        <PrimeVueInputText
          v-model="accountEditProfile_formData.name"
          :loading="accountEditProfile_isLoading"
          placeholder="Input your full name"
          class="text-sm w-full"
          :class="{ ...classes }"
          v-on="useListenerForm(accountEditProfile_formValidations, 'name')"
        />
      </AppBaseFormGroup>
    </section>

    <section id="email" class="col-span-full lg:col-span-6">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="email"
        :name="useLocalization('app.form.email')"
        spacing-bottom="mb-0"
        :validators="accountEditProfile_formValidations.email"
      >
        <PrimeVueInputText
          v-model="accountEditProfile_formData.email"
          :loading="accountEditProfile_isLoading"
          placeholder="Input your email"
          class="text-sm w-full"
          :class="{ ...classes }"
          v-on="useListenerForm(accountEditProfile_formValidations, 'email')"
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
          v-model="accountEditProfile_formData.phoneCode"
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
          :validators="accountEditProfile_formValidations.phone"
        >
          <PrimeVueInputText
            v-model="accountEditProfile_formData.phone"
            :loading="accountEditProfile_isLoading"
            class="text-sm w-full"
            :class="{ ...classes }"
            type="tel"
            v-on="useListenerForm(accountEditProfile_formValidations, 'phone')"
          />
        </AppBaseFormGroup>
      </section>
    </section>
  </section>
</template>
