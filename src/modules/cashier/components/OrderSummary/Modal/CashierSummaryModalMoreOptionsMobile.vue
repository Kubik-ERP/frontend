<script setup lang="ts">
// Interface
import type { ICashierOrderProvided } from '@/modules/cashier/interfaces/cashier-order.interface';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrder_modalCancelOrder, cashierOrder_modalMenuOrderItem } =
  inject<ICashierOrderProvided>('cashierOrder')!;
</script>
<template>
  <!-- Mobile and tablet bottom drawer, hidden on desktop -->
  <section id="cashier-summary-modal-more-options">
    <PrimeVueDrawer
      v-model:visible="cashierOrder_modalMenuOrderItem.show"
      position="bottom"
      close-icon="h"
      class="lg:hidden rounded-t-4xl"
      style="height: auto"
    >
      <template #container>
        <div class="flex flex-col gap-6 p-6">
          <PrimeVueButton
            variant="text"
            class="flex justify-start text-start"
            severity="danger"
            @click="cashierOrder_modalCancelOrder.show = true"
          >
            {{ useLocalization('cashier.cancelOrder') }}
          </PrimeVueButton>
        </div>
      </template>
    </PrimeVueDrawer>
  </section>
</template>
