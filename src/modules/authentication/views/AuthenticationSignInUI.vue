<script setup lang="ts">
// Components
import AuthenticationSignInContent from '../components/AuthenticationSignInContent.vue';

// Services
import { useAuthenticationSignInService } from '../services/authentication-sign-in.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationSignIn_activeStep,
  authenticationSignIn_detectLocationAndBrowser,
  authenticationSignIn_formData,
  authenticationSignIn_formValidations,
  authenticationSignIn_isLoading,
  authenticationSignIn_isNotAuthenticated,
  authenticationSignIn_onSelectRole,
  authenticationSignIn_onSsoWithGoogle,
  authenticationSignIn_onSubmit,
  authenticationSignIn_selectedRole,
  authenticationSignIn_stepper,
} = useAuthenticationSignInService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationSignIn', {
  authenticationSignIn_activeStep,
  authenticationSignIn_detectLocationAndBrowser,
  authenticationSignIn_formData,
  authenticationSignIn_formValidations,
  authenticationSignIn_isLoading,
  authenticationSignIn_isNotAuthenticated,
  authenticationSignIn_onSsoWithGoogle,
  authenticationSignIn_onSelectRole,
  authenticationSignIn_onSubmit,
  authenticationSignIn_selectedRole,
  authenticationSignIn_stepper,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await authenticationSignIn_detectLocationAndBrowser();
});
</script>

<template>
  <section id="authentication-sign-in" class="default-wrapper-fullscreen">
    <AuthenticationSignInContent />
  </section>
</template>
