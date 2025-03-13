<script setup lang="ts">
// Interfaces
import type { IAuthenticationResetPasswordProvided } from '../interfaces/authentication-reset-password.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationResetPassword_formData,
  authenticationResetPassword_formValidations,
  authenticationResetPassword_isLoading,
  authenticationResetPassword_onSubmit,
} = inject<IAuthenticationResetPasswordProvided>('authenticationResetPassword')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10" @submit.prevent="authenticationResetPassword_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-3">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <section id="text-information" class="flex flex-col">
        <h1 class="font-bold text-2xl leading-8">Reset Password</h1>
        <p id="subtitle" class="font-normal text-base">Enter your registered email to reset password</p>
      </section>
    </section>

    <AppBaseFormGroup
      v-slot="{ classes }"
      class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
      is-name-as-label
      label-for="email"
      name="Email"
      :validators="authenticationResetPassword_formValidations.email"
    >
      <PrimeVueIconField>
        <PrimeVueInputIcon>
          <template #default>
            <AppBaseSvg name="mail" />
          </template>
        </PrimeVueInputIcon>

        <PrimeVueInputText
          v-model="authenticationResetPassword_formData.email"
          :loading="authenticationResetPassword_isLoading"
          placeholder="Input your registered email"
          class="text-sm w-full"
          :class="{ ...classes }"
          v-on="useListenerForm(authenticationResetPassword_formValidations, 'email')"
        />
      </PrimeVueIconField>
    </AppBaseFormGroup>

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px]"
      label="Submit"
      type="submit"
      :disabled="authenticationResetPassword_formValidations.$invalid"
    />
  </form>
</template>
