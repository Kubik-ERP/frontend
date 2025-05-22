<script setup lang="ts">
// Components
import AuthenticationResetPasswordSuccess from '../components/AuthenticationResetPasswordSuccess.vue';

// Services
import { useAuthenticationResetPasswordService } from '../services/authentication-reset-password.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationResetPassword_activeStep,
  authenticationResetPassword_formData,
  authenticationResetPassword_formDataOfVerifyPin,
  authenticationResetPassword_formValidations,
  authenticationResetPassword_formValidationsOfVerifyOtp,
  authenticationResetPassword_isLoading,
  authenticationResetPassword_isPinInvalid,
  authenticationResetPassword_isSuccess,
  authenticationResetPassword_onSubmit,
  authenticationResetPassword_stepper,
} = useAuthenticationResetPasswordService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationResetPassword', {
  authenticationResetPassword_formData,
  authenticationResetPassword_formDataOfVerifyPin,
  authenticationResetPassword_formValidations,
  authenticationResetPassword_formValidationsOfVerifyOtp,
  authenticationResetPassword_isLoading,
  authenticationResetPassword_isPinInvalid,
  authenticationResetPassword_onSubmit,
});
</script>

<template>
  <section id="authentication-reset-password" class="default-wrapper-fullscreen flex items-center justify-center">
    <section id="authentication-reset-password-content" class="w-full max-w-sm">
      <template v-if="authenticationResetPassword_isSuccess">
        <AuthenticationResetPasswordSuccess />
      </template>

      <template v-else>
        <component :is="authenticationResetPassword_stepper[authenticationResetPassword_activeStep].component" />
      </template>
    </section>
  </section>
</template>
