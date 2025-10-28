<script setup lang="ts">
// Interfaces
import type { IAuthenticationSignInProvided } from '../interfaces/authentication-sign-in.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { authenticationSignIn_activeStep, authenticationSignIn_stepper } =
  inject<IAuthenticationSignInProvided>('authenticationSignIn')!;
</script>

<template>
  <section id="authentication-sign-in-content" class="grid-wrapper-fullscreen">
    <section id="form-content" class="col-span-12 lg:col-span-9 flex items-center justify-center w-full h-full">
      <component :is="authenticationSignIn_stepper[authenticationSignIn_activeStep].component" />
    </section>

    <aside id="linear-gradient" class="hidden lg:block col-span-3 w-full h-full">&nbsp;</aside>
  </section>
</template>

<style scoped>
section#authentication-sign-in-content aside#linear-gradient {
  background: linear-gradient(161.35deg, #f4631e -18.76%, rgba(244, 99, 30, 0.2) 147.69%);
}
</style>
