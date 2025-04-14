<script setup lang="ts">
// Components
import AppBaseNavbar from '@/app/components/base/AppBaseNavbar.vue';
</script>

<template>
  <section
    id="default-navbar"
    class="default-wrapper-fullscreen relative inset-0 z-0 grid grid-rows-1 grid-cols-12"
  >
    <section id="main-layout" class="default-wrapper col-span-12">
      <AppBaseNavbar />

      <section id="main-layout" class="w-full h-fit">
        <RouterView />
      </section>
    </section>
  </section>
</template>
