<script setup lang="ts">
// Constants
import { CASHIER_ORDER_TYPE } from '../../constants';

// Interfaces
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

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

const selectedOrderTypeLabel = computed(() => {
  const found = CASHIER_ORDER_TYPE.find(
    f => f.code === cashierOrderSummary_modalOrderType.value.selectedOrderType,
  );
  return found?.label || 'Order Type';
});

const selectedTableLabel = computed(() => {
  if (cashierOrderSummary_modalSelectTable.value.selectedTable?.length > 0) {
    return cashierOrderSummary_modalSelectTable.value.selectedTable.toString();
  }
  return 'Select Table';
});
</script>
<template>
  <section id="cashier-summary-button-order-table">
    <div class="border-t-2 border-t-grayscale-10">
      <div class="flex justify-between w-full items-center py-4 gap-2">
        <button
          :class="[
            'flex border truncate rounded-sm p-2.5 justify-between items-center',
            props.isSelfOrder ? 'w-full' : 'w-1/2',
            route.name === 'cashier-order-edit'
              ? 'cursor-not-allowed opacity-50 bg-transparent border-text-disabled'
              : 'cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 border-text-disabled',
          ]"
          :disabled="route.name === 'cashier-order-edit'"
          @click="cashierOrderSummary_modalOrderType.show = true"
        >
          <span v-if="cashierOrderSummary_modalOrderType.selectedOrderType" class="text-black">
            {{ selectedOrderTypeLabel }}
          </span>
          <span v-else class="text-text-disabled">Order Type</span>

          <AppBaseSvg name="order" class="!h-5 !w-5" />
        </button>
        <button
          v-if="!props.isSelfOrder"
          :class="[
            'flex w-1/2 border truncate rounded-sm p-2.5 justify-between items-center',
            route.name === 'cashier-order-edit' ||
            cashierOrderSummary_modalOrderType.selectedOrderType !== 'dine_in'
              ? 'cursor-not-allowed opacity-50 bg-transparent border-text-disabled'
              : 'cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 border-text-disabled',
          ]"
          :disabled="
            route.name === 'cashier-order-edit' ||
            cashierOrderSummary_modalOrderType.selectedOrderType !== 'dine_in'
          "
          @click="cashierOrderSummary_modalSelectTable.show = true"
        >
          <span>
            <span v-if="cashierOrderSummary_modalSelectTable.selectedTable" class="text-black">
              {{ selectedTableLabel }}
            </span>
            <span v-else class="text-text-disabled"> Select Table </span>
          </span>

          <AppBaseSvg name="table" class="!h-5 !w-5" />
        </button>
      </div>
    </div>
  </section>
</template>
