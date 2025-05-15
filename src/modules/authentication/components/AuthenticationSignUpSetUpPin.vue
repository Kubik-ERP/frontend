<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpProvided } from '../interfaces/authentication-sign-up.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationSignUp_formDataOfSetUpPin,
  authenticationSignUp_formValidationsOfSetUpPin,
  authenticationSignUp_isLoading,
  authenticationSignUp_onSubmit,
} = inject<IAuthenticationSignUpProvided>('authenticationRegister')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10 w-md" @submit.prevent="authenticationSignUp_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-3">
      <img src="@/app/assets/images/app-logo.png" alt="app-logo" class="w-fit h-fit" />

      <h1 class="font-bold text-2xl leading-8">Set Up Your PIN</h1>
      <p id="subtitle" class="font-normal text-base text-disabled">
        Create a secure 6 digit PIN to access your account quickly and safely
      </p>
    </section>

    <section id="form-input" class="flex flex-col items-center gap-4">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        label-for="otp"
        name="OTP Code"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidationsOfSetUpPin.pin"
      >
        <PrimeVueInputOtp
          v-model="authenticationSignUp_formDataOfSetUpPin.pin"
          :class="{ ...classes }"
          class="[&>input]:bg-white [&>input]:border-grayscale-30 [&>input]:font-bold [&>input]:text-2xl [&>input]:w-16 [&>input]:h-16!"
          :length="6"
          mask
        />
      </AppBaseFormGroup>
    </section>

    <PrimeVueButton
      class="bg-blue-primary border-none text-sm py-[10px]"
      label="Create PIN"
      type="submit"
      :disabled="authenticationSignUp_formValidationsOfSetUpPin.$invalid"
      :loading="authenticationSignUp_isLoading"
    />
  </form>
</template>
