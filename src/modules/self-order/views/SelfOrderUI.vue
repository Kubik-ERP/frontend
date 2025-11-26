<script setup lang="ts">
// Vue
import { provide, onMounted } from 'vue';

// Components
import SelfOrderMainSection from '../components/SelfOrderMainSection.vue';
import SelfOrderSummary from '../components/OrderSummary/SelfOrderSummary.vue';
import SelfOrderSummaryButtonAction from '../components/OrderSummary/SelfOrderSummaryButtonAction.vue';

// Interfaces
import type { ISelfOrderProvided } from '../interfaces';

// Services
import { useSelfOrderService } from '../services/self-order.service';

/**
 * @description Destructure all the data and methods from self-order service
 */
const selfOrder = useSelfOrderService();

/**
 * @description Provide all self-order data and methods with single injection key
 * All properties use consistent selfOrder_ prefix
 */
provide<ISelfOrderProvided>('selfOrder', selfOrder);

onMounted(async () => {
  // Initialize self-order specific data
  await selfOrder.selfOrder_onFetchCategory();
  await selfOrder.selfOrder_onFetchProductCategory();
  await selfOrder.selfOrder_onInitialize();
});
</script>

<template>
  <section id="self-order" class="grid grid-cols-12 bg-background h-full min-h-dvh default-wrapper-fullscreen relative">
    <SelfOrderMainSection />
    <SelfOrderSummary />

    <!-- Mobile Button - Shows only on mobile, sticky at bottom -->
    <SelfOrderSummaryButtonAction />
  </section>
</template>

<style scoped></style>
