<script setup lang="ts">
// Router
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <header
    class="bg-white border border-solid border-grayscale-10 flex gap-4 items-center justify-between lg:justify-center relative inset-0 z-0 px-4 lg:px-12 py-6 w-full"
  >
    <div class="flex gap-4 justify-center items-center w-full">
      <h1 class="font-semibold text-black text-base lg:text-lg">
        {{ route.name === 'invoice' ? 'Invoice Detail' : 'Order Summary' }}
      </h1>
    </div>
  </header>
</template>
