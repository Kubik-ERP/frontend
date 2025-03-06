<script setup lang="ts">
// Components
import AuthenticationResetPasswordForm from '../components/AuthenticationResetPasswordForm.vue';
import AuthenticationResetPasswordSuccess from '../components/AuthenticationResetPasswordSuccess.vue';

// Services
import { useAuthenticationResetPasswordService } from '../services/authentication-reset-password.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationResetPassword_formData,
  authenticationResetPassword_formValidations,
  authenticationResetPassword_isLoading,
  authenticationResetPassword_isSuccess,
  authenticationResetPassword_onSubmit,
} = useAuthenticationResetPasswordService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationResetPassword', {
  authenticationResetPassword_formData,
  authenticationResetPassword_formValidations,
  authenticationResetPassword_isLoading,
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
        <AuthenticationResetPasswordForm />
      </template>
    </section>
  </section>
</template>
