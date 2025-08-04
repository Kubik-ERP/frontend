<script setup lang="ts">
// Icons
import homeIconAsset from '@/app/assets/icons/home.svg';

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
  const breadcrumbItems = route.matched
    .filter(singleRoute => singleRoute.meta.breadcrumb && !singleRoute.meta.breadcrumbDisabled)
    .map((singleRoute, index, filteredRoutes) => {
      // Build the correct URL path for nested routes
      let urlPath = '';

      // For nested routes, we need to construct the full path
      if (index === filteredRoutes.length - 1) {
        // For the last item (current page), use the actual route path
        urlPath = route.path;
      } else {
        // For parent items, construct path from route hierarchy
        const matchedIndex = route.matched.findIndex(r => r === singleRoute);
        const relevantMatched = route.matched.slice(0, matchedIndex + 1);

        // Build path from matched routes
        urlPath =
          relevantMatched
            .map(r => r.path)
            .join('')
            .replace(/\/+/g, '/') // Remove duplicate slashes
            .replace(/\/$/, '') || '/'; // Remove trailing slash except for root

        // Replace route parameters with actual values
        Object.keys(route.params).forEach(paramKey => {
          urlPath = urlPath.replace(`:${paramKey}`, route.params[paramKey] as string);
        });
      }

      return {
        label: singleRoute.meta.breadcrumb,
        url: urlPath,
        to: { name: singleRoute.name as string, params: route.params },
        routeName: singleRoute.name,
      };
    });

  // Debug logging (remove in production)
  console.log('Current route:', {
    name: route.name,
    path: route.path,
    params: route.params,
    matched: route.matched.map(r => ({ name: r.name, path: r.path, meta: r.meta })),
  });
  console.log('Breadcrumb items:', breadcrumbItems);

  return breadcrumbItems;
});

// Insert home icon using DOM manipulation
onMounted(() => {
  const homeIcon = document.querySelector('.p-breadcrumb-home-item');

  if (homeIcon) {
    const homeIconAnchor = homeIcon.querySelector('a');

    if (homeIconAnchor) {
      homeIconAnchor.classList.add('text-text-disabled', 'font-normal', 'text-sm');
      homeIconAnchor.innerHTML = `<img src="${homeIconAsset}" alt="Home" class="inline-block mr-1" /> ${homeIconAnchor.innerHTML}`;
    }
  }
});
</script>

<template>
  <section id="breadcrumbs" class="px-10 py-3 border-b border-solid border-grayscale-10">
    <PrimeVueBreadcrumb
      :home="home"
      :model="items"
      :pt="{
        root: 'p-0',
      }"
    >
      <template #item="{ item }">
        <template v-if="item.routeName === route.name || item.url === route.path">
          <span class="font-normal text-sm text-primary">{{ item.label }}</span>
        </template>

        <template v-else>
          <RouterLink :to="item.to" class="font-normal text-sm text-text-disabled">
            {{ item.label }}
          </RouterLink>
        </template>
      </template>

      <template #separator> / </template>
    </PrimeVueBreadcrumb>
  </section>
</template>
