<script setup lang="ts">
// Router
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

function handleBack() {
  const previousRouteName = router.options.history.state.back;

  if (previousRouteName === 'cashier-order-edit') {
    router.push('/cashier');
  } else if (previousRouteName) {
    router.go(-1);
  } else {
    router.push('/cashier');
  }
}
</script>

<template>
  <header
    class="bg-white border border-solid border-grayscale-10 flex gap-4 items-center justify-between lg:justify-center relative inset-0 z-0 px-4 lg:px-12 py-6 w-full"
  >
    <div class="flex gap-4 items-center" @click="handleBack">
      <AppBaseSvg name="close" class="block lg:hidden !h-3.5 !w-3.5" />

      <h1 class="font-semibold text-black text-base lg:text-lg">
        {{ route.name === 'invoice' ? 'Invoice Detail' : 'Order Summary' }}
      </h1>
    </div>

    <section
      id="box-icon"
      class="hidden lg:block absolute top-5 left-5 bg-transparent basic-smooth-animation hover:bg-grayscale-10 p-2 rounded-md cursor-pointer"
      @click="handleBack"
    >
      <AppBaseSvg name="close" class="h-4 w-4" />
    </section>

    <section id="status" class="flex lg:hidden items-center gap-2">
      <section id="dot-status" class="w-2 h-2 rounded-full bg-success">&nbsp;</section>
      <span class="font-normal text-disabled text-xs">Online</span>
    </section>
  </header>
</template>
