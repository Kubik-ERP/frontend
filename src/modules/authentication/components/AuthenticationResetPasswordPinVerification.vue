<script setup lang="ts">
// Interfaces
import type { IAuthenticationResetPasswordProvided } from '../interfaces/authentication-reset-password.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationResetPassword_formValidationsOfVerifyOtp,
  authenticationResetPassword_isLoading,
  authenticationResetPassword_isPinInvalid,
  authenticationResetPassword_onSubmit,
  authenticationResetPassword_verifyOtpFormData,
} = inject<IAuthenticationResetPasswordProvided>('authenticationResetPassword')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10 w-fit" @submit.prevent="authenticationResetPassword_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-6">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <section id="text-information" class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <PrimeVueButton
            class="bg-transparent border border-solid border-blue-primary p-2 basic-smooth-animation hover:bg-grayscale-10"
            as="a"
            href="/authentication/login"
          >
            <template #default>
              <AppBaseSvg name="arrow-left" class="w-4 h-4" />
            </template>
          </PrimeVueButton>

          <h1 class="font-bold text-2xl leading-8">Enter Your PIN</h1>
        </div>

        <p id="subtitle" class="font-normal text-base">For security, please enter your PIN to proceed</p>
      </section>
    </section>

    <AppBaseFormGroup
      v-slot="{ classes }"
      class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
      label-for="otp"
      name="OTP Code"
      spacing-bottom="mb-0"
      :validators="authenticationResetPassword_formValidationsOfVerifyOtp.otp"
    >
      <PrimeVueInputOtp
        v-model="authenticationResetPassword_verifyOtpFormData.otp"
        class="[&>input]:bg-white [&>input]:border-grayscale-30 [&>input]:font-bold [&>input]:text-2xl [&>input]:w-16 [&>input]:h-16!"
        :class="[classes, authenticationResetPassword_isPinInvalid ? '[&>input]:!border-border-error' : '']"
        :length="6"
        mask
      />

      <span
        v-if="authenticationResetPassword_isPinInvalid"
        class="inline-block font-normal text-error-main text-sm text-center w-full mt-3"
      >
        Incorrect PIN. Please try again
      </span>
    </AppBaseFormGroup>

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px]"
      label="Submit"
      type="submit"
      :disabled="authenticationResetPassword_formValidationsOfVerifyOtp.$invalid"
      :loading="authenticationResetPassword_isLoading"
    />
  </form>
</template>
