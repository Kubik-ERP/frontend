<script setup lang="ts">
// Interfaces
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_modalOrderType, cashierOrderSummary_modalSelectTable } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

const props = defineProps({
  isSelfOrder: {
    type: Boolean,
    default: false,
  },
});
</script>
<template>
  <section id="cashier-summary-button-order-table">
    <div class="border-t-2 border-t-grayscale-10">
      <div class="flex justify-between w-full items-center p-4 gap-2">
        <button
          :class="[
            'flex border truncate cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 text-text-disabled border-text-disabled rounded-sm p-2.5 justify-between items-center',
            props.isSelfOrder ? 'w-full' : 'w-1/2',
          ]"
          @click="cashierOrderSummary_modalOrderType.show = true"
        >
          Order Type

          <AppBaseSvg name="order" class="!h-5 !w-5" />
        </button>
        <button
          v-if="!props.isSelfOrder"
          class="flex w-1/2 border truncate cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 text-text-disabled border-text-disabled rounded-sm p-2.5 justify-between items-center"
          @click="cashierOrderSummary_modalSelectTable.show = true"
        >
          Table No.

          <AppBaseSvg name="table" class="!h-5 !w-5" />
        </button>
      </div>
    </div>
  </section>
</template>
