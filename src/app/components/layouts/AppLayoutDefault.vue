<script setup lang="ts">
// Components
import AppBaseBreadcrumb from '@/app/components/base/AppBaseBreadcrumb.vue';
import AppBaseNavbar from '@/app/components/base/AppBaseNavbar.vue';
import AppBaseSidebar from '@/app/components/base/AppBaseSidebar.vue';
import AppBaseSkeletonWrapper from '@/app/components/base/AppBaseSkeletonWrapper.vue';

// Composables
import { useGlobalLoading } from '@/app/composables/useGlobalLoading';

// Global loading state
const { isLoading, clearAllLoading } = useGlobalLoading();

// Clear loading state when navigating between routes
const route = useRoute();
watch(
  () => route.path,
  () => {
    // Small delay to allow new page requests to start
    setTimeout(() => {
      if (!isLoading.value) {
        clearAllLoading();
      }
    }, 100);
  },
);
</script>

<template>
  <section id="default-layout" class="default-wrapper-fullscreen relative inset-0 z-0 flex">
    <AppBaseSidebar />

    <section id="main-layout" class="default-wrapper flex-1 transition-all duration-300 ease-in-out">
      <AppBaseNavbar />
      <AppBaseBreadcrumb />

      <section id="main-layout" class="w-full h-fit p-10">
        <AppBaseSkeletonWrapper variant="card" :rows="4">
          <RouterView />
        </AppBaseSkeletonWrapper>
      </section>
    </section>
  </section>
</template>
