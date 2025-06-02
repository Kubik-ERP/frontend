<script setup lang="ts">
/**
 * @description Injected variables
 */
const route = useRoute();

// Home item (e.g., redirect to dashboard or homepage)
const home = {
  icon: 'pi pi-home',
  to: { name: 'dashboard' },
};

// Generate breadcrumb items from matched routes
const items = computed(() => {
  return route.matched
    .filter(r => r.meta.breadcrumb && !r.meta.breadcrumbDisabled)
    .map(r => ({
      label: r.meta.breadcrumb,
      to: { name: r.name as string, params: route.params },
    }));
});
</script>

<template>
  <section id="breadcrumbs" class="px-10 py-3 border-b border-solid border-grayscale-10">
    <PrimeVueBreadcrumb
      :home="home"
      :model="items"
      :pt="{
        root: 'p-0',
        itemLabel: 'font-normal text-sm text-primary',
      }"
    />
  </section>
</template>
