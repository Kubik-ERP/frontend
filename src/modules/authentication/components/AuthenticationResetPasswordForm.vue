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
    <section id="greeting-text" class="flex flex-col gap-6">
      <img src="@/app/assets/images/app-logo.png" alt="app-logo" class="w-fit h-fit" />

      <section id="text-information" class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <PrimeVueButton
            class="bg-transparent border border-solid border-blue-primary p-2 basic-smooth-animation hover:bg-grayscale-10"
            as="a"
            href="/authentication/sign-in"
          >
            <template #default>
              <AppBaseSvg name="arrow-left" class="w-4 h-4" />
            </template>
          </PrimeVueButton>

          <h1 class="font-bold text-2xl leading-8">Reset Password</h1>
        </div>

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
            <AppBaseSvg name="mail" class="w-4 h-4" />
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
      :loading="authenticationResetPassword_isLoading"
    />
  </form>
</template>
