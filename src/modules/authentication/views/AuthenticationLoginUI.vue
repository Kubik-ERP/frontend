<script setup lang="ts">
// Components
import AuthenticationLoginContent from '../components/AuthenticationLoginContent.vue';

// Services
import { useAuthenticationLoginService } from '../services/authentication-login.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationLogin_formData,
  authenticationLogin_formValidations,
  authenticationLogin_isLoading,
  authenticationLogin_onSubmit,
} = useAuthenticationLoginService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationLogin', {
  authenticationLogin_formData,
  authenticationLogin_formValidations,
  authenticationLogin_isLoading,
  authenticationLogin_onSubmit,
});
</script>

<template>
  <section id="authentication-login" class="default-wrapper-fullscreen">
    <AuthenticationLoginContent />
  </section>
</template>
