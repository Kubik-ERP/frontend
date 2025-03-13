<script setup lang="ts">
// Components
import authenticationSignInContent from '../components/AuthenticationSignInContent.vue';

// Services
import { useAuthenticationSignInService } from '../services/authentication-sign-in.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationSignIn_formData,
  authenticationSignIn_formValidations,
  authenticationSignIn_isLoading,
  authenticationSignIn_onSubmit,
} = useAuthenticationSignInService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationSignIn', {
  authenticationSignIn_formData,
  authenticationSignIn_formValidations,
  authenticationSignIn_isLoading,
  authenticationSignIn_onSubmit,
});
</script>

<template>
  <section id="authentication-sign-in" class="default-wrapper-fullscreen">
    <authenticationSignInContent />
  </section>
</template>
