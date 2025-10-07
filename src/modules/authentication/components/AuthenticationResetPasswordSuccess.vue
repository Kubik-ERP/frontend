<script setup lang="ts">
// Interfaces
import type { IAuthenticationResetPasswordProvided } from '../interfaces/authentication-reset-password.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  authenticationResetPassword_resendCooldown,
  authenticationResetPassword_canResend,
  authenticationResetPassword_onResendEmail,
  authenticationResetPassword_isLoading,
} = inject<IAuthenticationResetPasswordProvided>('authenticationResetPassword')!;

/**
 * @description Format time for display (mm:ss)
 */
const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
</script>

<template>
  <section id="authentication-reset-password-success" class="flex flex-col gap-3">
    <img src="@/app/assets/images/app-logo.png" alt="app-logo" class="w-fit h-fit" />

    <h1 class="font-bold text-2xl leading-8">Please Check Your Email</h1>

    <p id="subtitle" class="font-normal text-base">
      Reset password request link has been successfully sent to your registered email.
    </p>

    <span class="information font-normal text-left text-sm text-text-disabled w-full">
      Didn't receive an email?

      <template v-if="authenticationResetPassword_canResend">
        <span
          class="font-semibold text-primary cursor-pointer hover:underline"
          :class="{ 'opacity-50 cursor-not-allowed': authenticationResetPassword_isLoading }"
          @click="authenticationResetPassword_onResendEmail"
        >
          Resend email
        </span>
      </template>

      <template v-else>
        <span class="font-semibold text-gray-400">
          Resend email in {{ formatTime(authenticationResetPassword_resendCooldown) }}
        </span>
      </template>
    </span>
  </section>
</template>
