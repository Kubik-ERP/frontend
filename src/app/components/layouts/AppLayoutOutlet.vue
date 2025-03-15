<script setup lang="ts">
// Components
import Avatar from 'primevue/avatar';
</script>

<template>
  <section id="app-layout-outlet" class="default-wrapper-fullscreen flex flex-col gap-5">
    <nav class="flex items-center justify-between px-7 py-3 border-b border-solid border-disabled">
      <section id="app-information" class="flex items-center gap-2">
        <Avatar label="P" class="mr-2" size="xlarge" shape="circle" />
        <h3 class="font-bold text-base">Cubic POS</h3>
        <AppBaseSvg name="chevron-left" class="w-4 h-4 cursor-pointer" />
      </section>
    </nav>

    <section id="content" class="container flex flex-col h-full">
      <RouterView />
    </section>
  </section>
</template>
