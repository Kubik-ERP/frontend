<script setup lang="ts">
// Components
import AppBaseBreadcrumb from '@/app/components/base/AppBaseBreadcrumb.vue';
import AppBaseNavbar from '@/app/components/base/AppBaseNavbar.vue';
import AppBaseSidebar from '@/app/components/base/AppBaseSidebar.vue';
import AppBaseSkeletonWrapper from '@/app/components/base/AppBaseSkeletonWrapper.vue';

// Composables
import { useGlobalLoading } from '@/app/composables/useGlobalLoading';

// Stores
import { useMobileStore } from '@/app/store/mobile.store';

// Global loading state
const { isLoading, clearAllLoading } = useGlobalLoading();

// Mobile store
const mobileStore = useMobileStore();
const { isCurrentlyMobile } = storeToRefs(mobileStore);

// Initialize mobile detection
onMounted(() => {
  const cleanup = mobileStore.initializeMobileDetection();

  // Clean up on unmount
  onUnmounted(() => {
    cleanup();
  });
});

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

// Computed classes for main layout
const mainLayoutClasses = computed(() => {
  const baseClasses = 'default-wrapper flex-1 transition-all duration-300 ease-in-out';

  if (isCurrentlyMobile.value) {
    return `${baseClasses} w-full`;
  }

  return baseClasses;
});
</script>

<template>
  <section id="default-layout" class="default-wrapper-fullscreen relative inset-0 z-0 flex">
    <!-- Sidebar - handles its own mobile/desktop display logic -->
    <AppBaseSidebar />

    <section id="main-layout" :class="mainLayoutClasses">
      <AppBaseNavbar />
      <AppBaseBreadcrumb />

      <section id="main-content" class="w-full h-fit p-4 sm:p-6 lg:p-10">
        <AppBaseSkeletonWrapper variant="card" :rows="4">
          <RouterView />
        </AppBaseSkeletonWrapper>
      </section>
    </section>
  </section>
</template>
