<script setup lang="ts">
// Constants
import { CASHIER_ORDER_TYPE } from '../../../cashier/constants';

// Interfaces
import { ISelfOrderProvided, ISelfOrderOrderType } from '../../interfaces';

// Route
import { useRoute } from 'vue-router';

const route = useRoute();

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_modalOrderType,
  selfOrder_modalSelectTable,
  selfOrder_hasCustomerManagementPermission: hasCustomerManagementPermission,
  selfOrder_isRetailBusinessType,
} = inject<ISelfOrderProvided>('selfOrder')!;

const props = defineProps({
  isSelfOrder: {
    type: Boolean,
    default: false,
  },
});

const selectedOrderTypeLabel = computed(() => {
  const found = CASHIER_ORDER_TYPE.find(
    (f: ISelfOrderOrderType) => f.code === selfOrder_modalOrderType.value.selectedOrderType,
  );
  return found?.label || 'Order Type';
});

const selectedTableLabel = computed(() => {
  if (selfOrder_modalSelectTable.value.selectedTable?.length > 0) {
    return selfOrder_modalSelectTable.value.selectedTable.toString();
  }
  return 'Select Table';
});
</script>
<template>
  <section v-if="!selfOrder_isRetailBusinessType" id="self-order-summary-button-order-table">
    <div class="border-t-2 border-t-grayscale-10 mx-4 lg:mx-0">
      <div class="flex justify-between w-full items-center py-4 gap-2">
        <button
          :class="[
            'flex border truncate rounded-sm p-2.5 text-sm justify-between items-center',
            props.isSelfOrder ? 'w-full' : 'w-1/2',
            route.name === 'self-order-order-edit' || route.name === 'self-order'
              ? 'cursor-not-allowed opacity-50 bg-transparent border-text-disabled'
              : 'cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 border-text-disabled',
          ]"
          :disabled="route.name === 'self-order-order-edit' || route.name === 'self-order'"
          @click="selfOrder_modalOrderType.show = true"
        >
          <span v-if="route.name === 'self-order'" class="text-black"> Self Order </span>
          <span v-else-if="selfOrder_modalOrderType.selectedOrderType" class="text-black">
            {{ selectedOrderTypeLabel }}
          </span>

          <span v-else class="text-text-disabled">Order Type</span>

          <AppBaseSvg name="order" class="!h-5 !w-5" />
        </button>
        <button
          v-if="!props.isSelfOrder && hasCustomerManagementPermission"
          :class="[
            'flex w-1/2 border truncate rounded-sm p-2.5 text-sm justify-between items-center',
            route.name === 'self-order-order-edit'
              ? 'cursor-not-allowed opacity-50 bg-transparent border-text-disabled'
              : 'cursor-pointer active:bg-text-disabled/10 hover:bg-text-disabled/5 border-text-disabled',
          ]"
          :disabled="route.name === 'self-order-order-edit'"
          @click="selfOrder_modalSelectTable.show = true"
        >
          <span>
            <span v-if="selfOrder_modalSelectTable.selectedTable" class="text-black">
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
