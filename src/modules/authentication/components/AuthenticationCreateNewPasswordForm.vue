<script setup lang="ts">
// Interfaces
import type { IAuthenticationCreateNewPasswordProvided } from '../interfaces/authentication-create-new-password.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationCreateNewPassword_formData,
  authenticationCreateNewPassword_formValidations,
  authenticationCreateNewPassword_isLoading,
  authenticationCreateNewPassword_onSubmit,
} = inject<IAuthenticationCreateNewPasswordProvided>('authenticationCreateNewPassword')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10" @submit.prevent="authenticationCreateNewPassword_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-3">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <h1 class="font-bold text-2xl leading-8">Create New Password</h1>
      <p id="subtitle" class="font-normal text-base">Create a new password for this account</p>
    </section>

    <section id="form-inputs" class="flex flex-col">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="email"
        name="Email"
        :validators="authenticationCreateNewPassword_formValidations.email"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="mail" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="authenticationCreateNewPassword_formData.email"
            placeholder="Input your registered email"
            class="text-sm w-full"
            disabled
            :class="{ ...classes }"
            :loading="authenticationCreateNewPassword_isLoading"
            v-on="useListenerForm(authenticationCreateNewPassword_formValidations, 'email')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="password"
        name="Password"
        :validators="authenticationCreateNewPassword_formValidations.password"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-model="authenticationCreateNewPassword_formData.password"
            placeholder="Input your new password"
            class="text-sm w-full"
            toggle-mask
            :class="{ ...classes }"
            :loading="authenticationCreateNewPassword_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
            v-on="useListenerForm(authenticationCreateNewPassword_formValidations, 'password')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="passwordConfirmation"
        name="Password Confirmation"
        :validators="authenticationCreateNewPassword_formValidations.passwordConfirmation"
      >
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="key" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVuePassword
            v-model="authenticationCreateNewPassword_formData.passwordConfirmation"
            placeholder="Input your new password again"
            class="text-sm w-full"
            toggle-mask
            :class="{ ...classes }"
            :loading="authenticationCreateNewPassword_isLoading"
            :pt="{
              root: '[&>input]:text-sm [&>input]:w-full',
            }"
            v-on="useListenerForm(authenticationCreateNewPassword_formValidations, 'passwordConfirmation')"
          />
        </PrimeVueIconField>
      </AppBaseFormGroup>
    </section>

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px]"
      label="Reset Password"
      type="submit"
      :disabled="authenticationCreateNewPassword_formValidations.$invalid"
      :loading="authenticationCreateNewPassword_isLoading"
    />
  </form>
</template>
