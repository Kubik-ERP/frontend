<script setup lang="ts">
// Components
import AppBaseBreadcrumb from '../base/AppBaseBreadcrumb.vue';
import AppBaseSvg from '../base/AppBaseSvg.vue';

// Injected variables
const route = useRoute();
</script>

<template>
  <section id="app-layout-simple-navbar" class="default-wrapper-fullscreen flex flex-col">
    <nav class="flex items-center justify-between border-b border-solid border-grayscale-10 px-7 py-4">
      <section id="app-information" class="flex items-center gap-2">
        <PrimeVueButton
          class="w-fit border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10 p-2 rounded-sm"
          severity="secondary"
          @click="$router.back()"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="chevron-left" class="w-4 h-4 cursor-pointer" />
            </section>
          </template>
        </PrimeVueButton>

        <h3 class="font-bold text-base">
          {{ route.meta?.title ?? '' }}
        </h3>
      </section>
    </nav>
    <AppBaseBreadcrumb v-if="route.meta.breadcrumb" />

    <section id="content" class="container flex flex-col h-full mt-5">
      <RouterView />
    </section>
  </section>
</template>
