<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpCountryInformations, IAuthenticationSignUpProvided } from '../interfaces/authentication-sign-up.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationSignUp_formData,
  authenticationSignUp_formValidations,
  authenticationSignUp_isAcceptTnc,
  authenticationSignUp_isLoading,
  authenticationSignUp_onSubmit,
} = inject<IAuthenticationSignUpProvided>('authenticationRegister')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10 w-full max-w-md" @submit.prevent="authenticationSignUp_onSubmit">
    <section id="greeting-text" class="flex items-end justify-between">
      <section id="text-information" class="flex flex-col gap-3">
        <img src="@/app/assets/images/app-logo.png" alt="app-logo" class="w-fit h-fit" />
        <h1 class="font-bold text-2xl leading-8">Create Account</h1>
      </section>

      <PrimeVueButton
        class="w-fit px-4 py-2 border-blue-primary text-blue-primary text-sm font-bold"
        label="Sign In"
        severity="secondary"
        variant="outlined"
        as="a"
        href="/authentication/sign-in"
      />
    </section>

    <section id="form-inputs" class="flex flex-col gap-4 w-full">
      <span id="description" class="font-normal text-base text-disabled">Please enter your account details</span>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="fullName"
        name="Full Name"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidations.fullName"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="user" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="authenticationSignUp_formData.fullName"
            :loading="authenticationSignUp_isLoading"
            placeholder="Input your full name"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(authenticationSignUp_formValidations, 'fullName')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="email"
        name="Email"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidations.email"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="mail" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="authenticationSignUp_formData.email"
            :loading="authenticationSignUp_isLoading"
            placeholder="Input your registered email"
            class="text-sm w-full"
            :class="{ ...classes }"
            v-on="useListenerForm(authenticationSignUp_formValidations, 'email')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <section id="phone-information" class="flex items-center gap-3">
        <section id="phone-code" class="w-fit">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phoneCountryCode"
            name="Phone Code"
            spacing-bottom="mb-0"
            :validators="authenticationSignUp_formValidations.phoneCountryCode"
          >
            <PrimeVueSelect
              id="phoneCountryCode"
              v-model="authenticationSignUp_formData.phoneCountryCode"
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
              v-on="useListenerForm(authenticationSignUp_formValidations, 'phoneCountryCode')"
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
        </section>

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phoneNumber"
            name="Phone Number"
            spacing-bottom="mb-0"
            :validators="authenticationSignUp_formValidations.phoneNumber"
          >
            <PrimeVueInputText
              v-model="authenticationSignUp_formData.phoneNumber"
              :loading="authenticationSignUp_isLoading"
              placeholder="Input your phone number"
              class="text-sm w-full"
              :class="{ ...classes }"
              type="tel"
              v-on="useListenerForm(authenticationSignUp_formValidations, 'phoneNumber')"
            />
          </AppBaseFormGroup>
        </section>
      </section>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="password"
        name="Password"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidations.password"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-model="authenticationSignUp_formData.password"
            placeholder="Input your new password"
            class="text-sm w-full"
            toggle-mask
            :class="{ ...classes }"
            :loading="authenticationSignUp_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
            v-on="useListenerForm(authenticationSignUp_formValidations, 'password')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="passwordConfirmation"
        name="Password Confirmation"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidations.passwordConfirmation"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-model="authenticationSignUp_formData.passwordConfirmation"
            placeholder="Input your new password again"
            class="text-sm w-full"
            toggle-mask
            :class="{ ...classes }"
            :loading="authenticationSignUp_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
            v-on="useListenerForm(authenticationSignUp_formValidations, 'passwordConfirmation')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <section id="terms-and-condition" class="flex items-center gap-2">
        <PrimeVueCheckbox v-model="authenticationSignUp_isAcceptTnc" binary />

        <span class="font-normal text-sm">
          By signing up, you are agree to Cubic’s
          <strong>Terms</strong> and
          <strong>Policy</strong>
        </span>
      </section>
    </section>

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px]"
      label="Sign Up"
      type="submit"
      :disabled="authenticationSignUp_formValidations.$invalid"
      :loading="authenticationSignUp_isLoading"
    />
  </form>
</template>
