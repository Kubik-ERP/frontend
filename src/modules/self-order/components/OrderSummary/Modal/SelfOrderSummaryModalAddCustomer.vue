<script setup lang="ts">
// Components
import AddCustomerUI from '@/modules/customer/views/AddCustomerUI.vue';

// Interfaces
import type {
  ISelfOrderProvided,
  ISelfOrderResponseAddCustomer,
} from '../../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_modalAddCustomer,
  selfOrder_customerState,
  selfOrder_onModalAddCustomer,
} = inject<ISelfOrderProvided>('selfOrder')!;
</script>

<template>
  <PrimeVueDialog
    v-model:visible="selfOrder_modalAddCustomer.show"
    :header="useLocalization('cashier.orderSummary.addCustomer.title')"
    modal
    :style="{ width: '50rem' }"
  >
    <AddCustomerUI
      :is-modal="true"
      @close="
        (response: ISelfOrderResponseAddCustomer) => {
          selfOrder_onModalAddCustomer(response);
          selfOrder_customerState.selectedCustomer = response.data;
        }
      "
    />
  </PrimeVueDialog>
</template>
