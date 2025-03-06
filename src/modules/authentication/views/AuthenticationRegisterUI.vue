<script setup lang="ts">
// Services
import { useAuthenticationRegisterService } from '../services/authentication-register.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  authenticationRegister_activeStep,
  authenticationRegister_formData,
  authenticationRegister_formValidations,
  authenticationRegister_isAcceptTnc,
  authenticationRegister_isLoading,
  authenticationRegister_onSubmit,
  authenticationRegister_stepper,
} = useAuthenticationRegisterService();

/**
 * @description Provide all the data and methods what we need
 */
provide('authenticationRegister', {
  authenticationRegister_formData,
  authenticationRegister_formValidations,
  authenticationRegister_isAcceptTnc,
  authenticationRegister_isLoading,
  authenticationRegister_onSubmit,
});
</script>

<template>
  <section id="authentication-register" class="default-wrapper-fullscreen">
    <section id="authentication-register-content" class="grid-wrapper-fullscreen">
      <section id="form-content" class="col-span-9 flex items-center justify-center w-full h-full">
        <component :is="authenticationRegister_stepper[authenticationRegister_activeStep].component" />
      </section>

      <aside id="linear-gradient" class="col-span-3 w-full h-full">&nbsp;</aside>
    </section>
  </section>
</template>

<style scoped>
section#authentication-register-content aside#linear-gradient {
  background: linear-gradient(161.35deg, #0f3c56 -18.76%, rgba(15, 60, 86, 0.5) 147.69%);
}
</style>
