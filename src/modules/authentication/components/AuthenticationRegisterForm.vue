<script setup lang="ts">
// Components
import Select from 'primevue/select';

// Interfaces
import type { IAuthenticationRegisterProvided } from '../interfaces/authentication-register.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationRegister_formData,
  authenticationRegister_formValidations,
  authenticationRegister_isAcceptTnc,
  authenticationRegister_isLoading,
  authenticationRegister_onSubmit,
} = inject<IAuthenticationRegisterProvided>('authenticationRegister')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10" @submit.prevent="authenticationRegister_onSubmit">
    <section id="greeting-text" class="flex items-end justify-between">
      <section id="text-information" class="flex flex-col gap-3">
        <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />
        <h1 class="font-bold text-2xl leading-8">Create Account</h1>
      </section>

      <PrimeVueButton
        class="w-fit px-4 py-2 border-blue-primary text-blue-primary text-sm font-bold"
        label="Sign In"
        severity="secondary"
        variant="outlined"
      />
    </section>

    <section id="form-inputs" class="flex flex-col gap-4 w-full">
      <span id="description" class="font-normal text-base text-disabled">Please enter your account details</span>

      <AppBaseFormGroup
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="email"
        name="Email"
        spacing-bottom="mb-0"
        :validators="authenticationRegister_formValidations.email"
        v-slot="{ classes }"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="mail" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-on="useListenerForm(authenticationRegister_formValidations, 'email')"
            v-model="authenticationRegister_formData.email"
            :loading="authenticationRegister_isLoading"
            placeholder="Input your registered email"
            class="text-sm w-full"
            :class="{ ...classes }"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <section id="phone-information" class="flex items-center gap-3">
        <section id="phone-code" class="w-fit">
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phoneCode"
            name="Phone Code"
            spacing-bottom="mb-0"
            :validators="authenticationRegister_formValidations.email"
            v-slot="{ classes }"
          >
            <Select
              v-model="authenticationRegister_formData.phoneCode"
              v-on="useListenerForm(authenticationRegister_formValidations, 'phoneCode')"
              id="phoneCode"
              filter
              :options="COUNTRY_INFORMATIONS"
              option-value="dialCodes"
              placeholder="+62"
              class="text-sm h-full min-h-9 w-full"
              :class="{ ...classes }"
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

        <section id="phone-number" class="w-full">
          <AppBaseFormGroup
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="phoneNumber"
            name="Phone Number"
            spacing-bottom="mb-0"
            :validators="authenticationRegister_formValidations.phoneNumber"
            v-slot="{ classes }"
          >
            <PrimeVueInputText
              v-on="useListenerForm(authenticationRegister_formValidations, 'phoneNumber')"
              v-model="authenticationRegister_formData.phoneNumber"
              :loading="authenticationRegister_isLoading"
              placeholder="Input your phone number"
              class="text-sm w-full"
              :class="{ ...classes }"
              type="tel"
            />
          </AppBaseFormGroup>
        </section>
      </section>

      <AppBaseFormGroup
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="password"
        name="Password"
        spacing-bottom="mb-0"
        :validators="authenticationRegister_formValidations.password"
        v-slot="{ classes }"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-on="useListenerForm(authenticationRegister_formValidations, 'password')"
            v-model="authenticationRegister_formData.password"
            placeholder="Input your new password"
            class="text-sm w-full"
            toggle-mask
            :class="{ ...classes }"
            :loading="authenticationRegister_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <AppBaseFormGroup
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="passwordConfirmation"
        name="Password Confirmation"
        spacing-bottom="mb-0"
        :validators="authenticationRegister_formValidations.passwordConfirmation"
        v-slot="{ classes }"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-on="useListenerForm(authenticationRegister_formValidations, 'passwordConfirmation')"
            v-model="authenticationRegister_formData.passwordConfirmation"
            placeholder="Input your new password again"
            class="text-sm w-full"
            toggle-mask
            :class="{ ...classes }"
            :loading="authenticationRegister_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <section id="terms-and-condition" class="flex items-center gap-2">
        <PrimeVueCheckbox v-model="authenticationRegister_isAcceptTnc" binary />

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
      :disabled="authenticationRegister_formValidations.$invalid"
      :loading="authenticationRegister_isLoading"
    />
  </form>
</template>
