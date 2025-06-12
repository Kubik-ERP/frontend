<script setup lang="ts">
/**
 * @description Injected variables
 */
const route = useRoute();
</script>

<template>
  <nav
    id="navbar"
    class="relative inset-0 z-0 flex items-center justify-between border-b border-solid border-grayscale-10 px-10 py-4"
  >
    <section id="left-content" class="flex items-center gap-4">
      <router-link v-if="route.meta.backArrow" :to="route.meta.backArrowPath ?? '/'">
        <PrimeVueButton
          v-if="route.meta.backArrow"
          class="bg-white border-none shadow-xs hover:bg-grayscale-10/50 basic-smooth-animation rounded-lg p-2"
        >
          <AppBaseSvg name="chevron-left" class="!w-5 !h-5" />
        </PrimeVueButton>
      </router-link>

      <h2 class="font-semibold text-black text-lg">
        {{ route.meta.title }}
      </h2>
    </section>

    <PrimeVueIconField class="hidden lg:block">
      <PrimeVueInputIcon>
        <template #default>
          <AppBaseSvg name="search" />
        </template>
      </PrimeVueInputIcon>

      <PrimeVueInputText cll placeholder="Search everything here..." class="text-sm w-full min-w-80" />
    </PrimeVueIconField>

    <section id="right-content" class="flex items-center gap-2">
      <section id="status-and-notification" class="flex items-center gap-4">
        <section id="status" class="flex items-center gap-2">
          <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
          <span class="font-normal text-disabled text-xs">Online</span>
        </section>

        <AppBaseSvg name="notification-primary" class="hidden lg:block !w-6 !h-6" />
      </section>

      <PrimeVueDivider class="hidden lg:block bg-grayscale-10 h-[52px]" layout="vertical" />

      <section id="user-menu" class="hidden lg:flex items-center justify-between pe-2">
        <section id="user-profile" class="flex items-center gap-2">
          <PrimeVueAvatar class="w-10 h-10" label="P" size="large" shape="circle" />

          <section id="user-information" class="hidden lg:flex flex-col w-36">
            <h6 class="font-semibold text-black text-sm">Samantha</h6>
            <span class="font-normal text-text-disabled text-xs">Super Admin</span>
          </section>
        </section>

        <AppBaseSvg name="chevron-down" class="hidden lg:block !w-3 !h-3" />
      </section>

      <AppBaseSvg name="pin-primary" class="hidden lg:block !w-6 !h-6" />
    </section>
  </nav>
</template>

<style scoped>
nav#navbar section#box-icon-back {
  box-shadow: 0px 1px 10px 2px #1018280d;
}
</style>
