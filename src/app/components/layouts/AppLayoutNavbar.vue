<script setup lang="ts">
// Components
import AppBaseNavbar from '@/app/components/base/AppBaseNavbar.vue';
import AppBaseBreadcrumb from '../base/AppBaseBreadcrumb.vue';
import AppBaseSubscriptionAlert from '@/app/components/base/AppBaseSubscriptionAlert.vue';

/**
 * @description Injected variables
 */
const route = useRoute();
</script>

<template>
  <section
    id="default-navbar"
    class="default-wrapper-fullscreen relative inset-0 z-0 grid grid-rows-1 grid-cols-12"
  >
    <!-- Subscription Alert - Global sticky alert -->
    <AppBaseSubscriptionAlert />
    
    <section id="main-layout" class="default-wrapper col-span-12">
      <AppBaseNavbar />
      <AppBaseBreadcrumb v-if="route.meta.breadcrumb" />

      <section id="main-layout" class="w-full h-fit">
        <RouterView />
      </section>
    </section>
  </section>
</template>
