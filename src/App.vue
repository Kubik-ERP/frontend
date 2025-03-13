<script setup lang="ts">
const route = useRoute();

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
</script>

<template>
  <section id="root" class="relative inset-0 z-0">
    <component :is="layout" />

    <Teleport to="body">
      <AppBaseToast />
    </Teleport>
  </section>
</template>
