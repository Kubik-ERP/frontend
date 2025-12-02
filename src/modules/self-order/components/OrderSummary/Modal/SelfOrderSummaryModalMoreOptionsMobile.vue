<script setup lang="ts">
// Interface
import { ISelfOrderProvided } from '@/modules/self-order/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_modalMenuOrderItem, selfOrder_modalCancelOrder } =
  inject<ISelfOrderProvided>('selfOrder')!;
</script>

<template>
  <section id="self-order-summary-modal-more-options-mobile">
    <PrimeVueDrawer
      v-model:visible="selfOrder_modalMenuOrderItem.show"
      position="bottom"
      close-icon="h"
      class="rounded-t-4xl"
      style="height: auto"
    >
      <template #container>
        <div class="flex flex-col gap-6 p-6">
          <PrimeVueButton
            variant="text"
            class="flex justify-start text-start"
            severity="danger"
            @click="selfOrder_modalCancelOrder.show = true"
          >
            {{ useLocalization('cashier.cancelOrder') }}
          </PrimeVueButton>
        </div>
      </template>
    </PrimeVueDrawer>
  </section>
</template>
