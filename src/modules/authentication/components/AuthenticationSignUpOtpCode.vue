<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignUpProvided } from '../interfaces/authentication-sign-up.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationSignUp_durationOtpFormatted,
  authenticationSignUp_formData,
  authenticationSignUp_formValidationsOfVerifyOtp,
  authenticationSignUp_maskedPhoneNumber,
  authenticationSignUp_onResendOtp,
  authenticationSignUp_onSubmit,
  authenticationSignUp_verifyOtpFormData,
} = inject<IAuthenticationSignUpProvided>('authenticationRegister')!;
</script>

<template>
  <form class="form-group flex flex-col gap-10 w-sm" @submit.prevent="authenticationSignUp_onSubmit">
    <section id="greeting-text" class="flex flex-col gap-3">
      <PrimeVueAvatar label="P" class="mr-2" size="xlarge" shape="circle" />

      <h1 class="font-bold text-2xl leading-8">We sent you a code</h1>
      <section id="text-information" class="flex flex-col">
        <p id="subtitle" class="font-normal text-base text-disabled">Enter the verification code sent to</p>

        <section id="phone-number" class="flex items-center gap-1">
          <p id="phone-number" class="font-normal text-base">
            {{ authenticationSignUp_formData.phoneCountryCode }}
            {{ authenticationSignUp_maskedPhoneNumber }}
          </p>
          <AppBaseSvg name="edit" class="cursor-pointer" />
        </section>
      </section>
    </section>

    <section id="form-input" class="flex flex-col items-center gap-4">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        label-for="otp"
        name="OTP Code"
        spacing-bottom="mb-0"
        :validators="authenticationSignUp_formValidationsOfVerifyOtp.otp"
      >
        <PrimeVueInputOtp
          v-model="authenticationSignUp_verifyOtpFormData.otp"
          :class="{ ...classes }"
          class="[&>input]:bg-white [&>input]:border-grayscale-30 [&>input]:font-bold [&>input]:text-2xl [&>input]:w-16 [&>input]:h-16!"
        />
      </AppBaseFormGroup>

      <span class="information font-normal text-center text-sm text-gray w-full">
        Didn’t get verification code?

        <template v-if="authenticationSignUp_durationOtpFormatted === '00:00'">
          <span class="font-semibold text-blue-primary cursor-pointer" @click="authenticationSignUp_onResendOtp"
            >Send a new code</span
          >
        </template>

        <template v-else>
          <span class="font-semibold text-disabled"
            >Send a new code {{ authenticationSignUp_durationOtpFormatted }}</span
          >
        </template>
      </span>
    </section>

    <PrimeVueButton class="bg-blue-primary border-none text-sm py-[10px]" label="Continue" type="submit" />
  </form>
</template>
