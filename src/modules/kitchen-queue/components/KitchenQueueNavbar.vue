<script setup lang="ts">
// Vue
import { inject } from 'vue';

// Interface
import type { IKitchenQueueProvided } from '@/modules/kitchen-queue/interfaces';

// Inject kitchen queue context
const { kitchenQueue_invoices, kitchenQueue_listTabs } = inject<IKitchenQueueProvided>('kitchenQueue')!;
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
      <PrimeVueTabList
        unstyled
        class="flex cursor-pointer w-full max-w-md items-center justify-center p-2 bg-secondary-background rounded-xl"
      >
        <PrimeVueTab
          unstyled
          value="orders"
          :class="[
            'py-2 px-12 mx-2 cursor-pointer rounded-xl text-[10px] lg:text-base font-semibold',
            kitchenQueue_listTabs === 'orders'
              ? 'bg-[#64C9B1] text-white'
              : 'text-secondary-hover hover:bg-secondary/20',
          ]"
        >
          ({{ kitchenQueue_invoices.length }}) Orders
        </PrimeVueTab>

        <PrimeVueTab
          unstyled
          value="order-history"
          :class="[
            'py-2 px-12 mx-2 cursor-pointer rounded-xl text-[10px] lg:text-base font-semibold',
            kitchenQueue_listTabs === 'order-history'
              ? 'bg-[#64C9B1] text-white'
              : 'text-secondary-hover hover:bg-secondary/20',
          ]"
        >
          Order History
        </PrimeVueTab>
      </PrimeVueTabList>
    </section>

    <section></section>
  </nav>
</template>
