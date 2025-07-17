<script setup lang="ts">
const a = ref();

// Vue
import { inject } from 'vue';

// Interface
import type { IKitchenQueueProvided } from '@/modules/kitchen-queue/interfaces';

// Inject kitchen queue context
const { kitchenQueue_invoices } = inject<IKitchenQueueProvided>('kitchenQueue')!;
</script>
<template>
  <nav
    id="kitchen-queue-navbar"
    class="relative inset-0 z-0 flex items-center border-b border-solid border-grayscale-10 px-10 py-4"
  >
    <section id="left-content" class="flex items-center gap-4">
      <router-link to="/" class="flex items-center gap-2 text-secondary-hover hover:text-secondary">
        <img src="@/app/assets/images/app-icon.png" />

        <h2 class="font-semibold text-black text-lg">Kubik POS</h2>
      </router-link>
    </section>

    <section id="kitchen-queue-tab-panel" class="absolute left-1/2 transform -translate-x-1/2">
      <PrimeVueTabs v-model:value="a" class="max-w-max lg:max-w-md">
        <PrimeVueTabList
          unstyled
          class="flex cursor-pointer w-full max-w-md items-center justify-center p-2 bg-secondary-background rounded-xl"
        >
          <PrimeVueTab
            unstyled
            value="order"
            :class="[
              'py-2 px-12 mx-2 cursor-pointer rounded-xl text-[10px] lg:text-base bg-[#64C9B1] text-white font-semibold',
            ]"
            >({{ kitchenQueue_invoices.length }}) Orders</PrimeVueTab
          >
          <PrimeVueTab
            unstyled
            value="history"
            :class="[
              'py-2 px-12 mx-2 cursor-pointer rounded-xl text-[10px] lg:text-base text-secondary-hover hover:bg-secondary/20',
            ]"
            >Order History</PrimeVueTab
          >
        </PrimeVueTabList>
      </PrimeVueTabs>
    </section>

    <section></section>
  </nav>
</template>
