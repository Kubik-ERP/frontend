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
    .filter(singleRoute => singleRoute.meta.breadcrumb && !singleRoute.meta.breadcrumbDisabled)
    .map(singleRoute => ({
      label: singleRoute.meta.breadcrumb,
      url: singleRoute.path,
      to: { name: singleRoute.name as string, params: route.params },
    }));
});

// Insert home icon using DOM manipulation
onMounted(() => {
  const homeIcon = document.querySelector('.p-breadcrumb-home-item');

  if (homeIcon) {
    const homeIconAnchor = homeIcon.querySelector('a');

    if (homeIconAnchor) {
      homeIconAnchor.classList.add('text-text-disabled', 'font-normal', 'text-sm');
      homeIconAnchor.innerHTML = '<span class="p-breadcrumb-item-icon pi pi-home" data-pc-section="itemicon"></span>';
    }
  }
});
</script>

<template>
  <section id="breadcrumbs" class="px-10 py-3 border-b border-solid border-grayscale-10">
    <PrimeVueBreadcrumb :home="home" :model="items" :pt="{
      root: 'p-0',
    }">
      <template #item="{ item }">
        <template v-if="item.url === route.path">
          <span class="font-normal text-sm text-primary">{{ item.label }}</span>
        </template>

        <template v-else>
          <RouterLink :to="item.url ?? '/'" class="font-normal text-sm text-text-disabled">
            {{ item.label }}
          </RouterLink>
        </template>
      </template>

      <template #separator> / </template>
    </PrimeVueBreadcrumb>
  </section>
</template>
