<script setup lang="ts">
// Components
import AppBaseBreadcrumb from '@/app/components/base/AppBaseBreadcrumb.vue';
import AppBaseNavbar from '@/app/components/base/AppBaseNavbar.vue';
import AppBaseSidebar from '@/app/components/base/AppBaseSidebar.vue';
</script>

<template>
  <section
    id="default-layout"
    class="default-wrapper-fullscreen relative inset-0 z-0 grid grid-rows-1 grid-cols-12"
  >
    <AppBaseSidebar />

    <section id="main-layout" class="default-wrapper col-span-10">
      <AppBaseNavbar />
      <AppBaseBreadcrumb />

      <section id="main-layout" class="w-full h-fit px-7 py-6">
        <RouterView />
      </section>
    </section>
  </section>
</template>
