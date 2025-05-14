<script setup lang="ts">
// Router
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
  <header
    class="bg-white border border-solid border-grayscale-10 flex gap-4 items-center justify-between lg:justify-center relative inset-0 z-0 px-4 lg:px-12 py-6 w-full"
  >
    <div class="flex gap-4 items-center">
      <AppBaseSvg name="close" class="block lg:hidden !h-3.5 !w-3.5" @click="router.go(-1)" />

      <h1 class="font-semibold text-black text-base lg:text-lg">Invoice Detail</h1>
    </div>

    <section
      id="box-icon"
      class="hidden lg:block absolute top-5 left-5 bg-transparent basic-smooth-animation hover:bg-grayscale-10 p-2 rounded-md cursor-pointer"
    >
      <AppBaseSvg name="close" />
    </section>

    <section id="status" class="flex lg:hidden items-center gap-2">
      <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
      <span class="font-normal text-disabled text-xs">Online</span>
    </section>
  </header>
</template>
