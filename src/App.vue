<script setup lang="ts">
import { useLoadingStore } from '@/app/store/loading.store';

const route = useRoute();
const loadingStore = useLoadingStore();

const layout = computed(() => {
  return route.meta.layout ?? 'AppLayoutEmpty';
});

const isDarkMode =
  localStorage.getItem('theme') === 'dark' ||
  (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);

if (isDarkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

// Reactive loading state
const { isInitializing, initializationProgress } = storeToRefs(loadingStore);
</script>

<template>
  <section id="root" class="relative inset-0 z-0">
    <!-- Show initialization loader during app startup -->
    <AppInitializationLoader :is-initializing="isInitializing" :progress="initializationProgress" />

    <!-- Main app content -->
    <div v-show="!isInitializing">
      <component :is="layout" />
    </div>

    <Teleport to="body">
      <AppBaseToast />
    </Teleport>
  </section>
</template>
