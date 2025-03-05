<script setup lang="ts">
// Components
import AuthenticationCreateNewPasswordForm from '../components/AuthenticationCreateNewPasswordForm.vue';
import AuthenticationCreateNewPasswordSuccess from '../components/AuthenticationCreateNewPasswordSuccess.vue';

// Services
import { useAuthenticationCreateNewPasswordService } from '../services/authentication-create-new-password.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationCreateNewPassword_formData,
  authenticationCreateNewPassword_formValidations,
  authenticationCreateNewPassword_isLoading,
  authenticationCreateNewPassword_isSuccess,
  authenticationCreateNewPassword_onSubmit,
} = useAuthenticationCreateNewPasswordService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationCreateNewPassword', {
  authenticationCreateNewPassword_formData,
  authenticationCreateNewPassword_formValidations,
  authenticationCreateNewPassword_isLoading,
  authenticationCreateNewPassword_onSubmit,
});
</script>

<template>
  <section
    id="authentication-create-new-password"
    class="default-wrapper-fullscreen flex items-center justify-center"
  >
    <section id="authentication-create-new-password-content" class="w-full max-w-sm">
      <template v-if="authenticationCreateNewPassword_isSuccess">
        <AuthenticationCreateNewPasswordSuccess />
      </template>

      <template v-else>
        <AuthenticationCreateNewPasswordForm />
      </template>
    </section>
  </section>
</template>
