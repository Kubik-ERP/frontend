<script setup lang="ts">
// Components
import authenticationSignInForm from './AuthenticationSignInForm.vue';
</script>

<template>
  <section id="authentication-sign-in-content" class="grid-wrapper-fullscreen">
    <section id="form-content" class="col-span-9 flex items-center justify-center w-full h-full">
      <authenticationSignInForm />
    </section>

    <aside id="linear-gradient" class="col-span-3 w-full h-full">&nbsp;</aside>
  </section>
</template>

<style scoped>
section#authentication-sign-in-content aside#linear-gradient {
  background: linear-gradient(161.35deg, #0f3c56 -18.76%, rgba(15, 60, 86, 0.5) 147.69%);
}
</style>
