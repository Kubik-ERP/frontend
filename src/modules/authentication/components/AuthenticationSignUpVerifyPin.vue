<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpProvided } from '../interfaces/authentication-sign-up.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationSignUp_formDataOfVerifyPin,
  authenticationSignUp_formValidationsOfVerifyPin,
  authenticationSignUp_isLoading,
  authenticationSignUp_onSubmit,
} = inject<IAuthenticationSignUpProvided>('authenticationRegister')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10 w-md" @submit.prevent="authenticationSignUp_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-6">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <section id="text-information" class="flex flex-col gap-2">
        <div class="flex items-center gap-4">
          <PrimeVueButton
            class="bg-transparent border border-solid border-blue-primary p-2 basic-smooth-animation hover:bg-grayscale-10"
          >
            <template #default>
              <AppBaseSvg name="arrow-left" class="w-4 h-4" />
            </template>
          </PrimeVueButton>

          <h1 class="font-bold text-2xl leading-8">Confirm Your PIN</h1>
        </div>

        <p id="subtitle" class="font-normal text-base">Re-enter your PIN to confirm and complete the setup</p>
      </section>
    </section>

    <section id="form-input" class="flex flex-col items-center gap-4">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        label-for="otp"
        name="OTP Code"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidationsOfVerifyPin.pin"
      >
        <PrimeVueInputOtp
          v-model="authenticationSignUp_formDataOfVerifyPin.pin"
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
      :disabled="authenticationSignUp_formValidationsOfVerifyPin.$invalid"
      :loading="authenticationSignUp_isLoading"
    />
  </form>
</template>
