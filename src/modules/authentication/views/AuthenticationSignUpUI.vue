<script setup lang="ts">
// Services
import { useAuthenticationRegisterService } from '../services/authentication-sign-up.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationSignUp_activeStep,
  authenticationSignUp_formData,
  authenticationSignUp_formValidations,
  authenticationSignUp_isAcceptTnc,
  authenticationSignUp_isLoading,
  authenticationSignUp_onSubmit,
  authenticationSignUp_stepper,
} = useAuthenticationRegisterService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationRegister', {
  authenticationSignUp_formData,
  authenticationSignUp_formValidations,
  authenticationSignUp_isAcceptTnc,
  authenticationSignUp_isLoading,
  authenticationSignUp_onSubmit,
});
</script>

<template>
  <section id="authentication-sign-up" class="default-wrapper-fullscreen">
    <section id="authentication-sign-up-content" class="grid-wrapper-fullscreen">
      <section id="form-content" class="col-span-9 flex items-center justify-center w-full h-full">
        <component :is="authenticationSignUp_stepper[authenticationSignUp_activeStep].component" />
      </section>

      <aside id="linear-gradient" class="col-span-3 w-full h-full">&nbsp;</aside>
    </section>
  </section>
</template>

<style scoped>
section#authentication-sign-up-content aside#linear-gradient {
  background: linear-gradient(161.35deg, #0f3c56 -18.76%, rgba(15, 60, 86, 0.5) 147.69%);
}
</style>
