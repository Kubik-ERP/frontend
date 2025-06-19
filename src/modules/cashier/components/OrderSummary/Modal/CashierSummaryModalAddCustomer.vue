<script setup lang="ts">
// Interfaces
import AddCustomerUI from '@/modules/customer/views/AddCustomerUI.vue';
import {
  ICashierOrderSummaryProvided,
  ICashierResponseAddCustomer,
} from '../../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierOrderSummary_modalAddCustomer,
  cashierProduct_customerState,
  cashierOrderSummary_handleModalAddCustomer,
} = inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
</script>
<template>
  <PrimeVueDialog
    v-model:visible="cashierOrderSummary_modalAddCustomer.show"
    header="Add Customer"
    modal
    :style="{ width: '50rem' }"
  >
    <AddCustomerUI
      :is-modal="true"
      @close="
        (response: ICashierResponseAddCustomer) => {
          cashierOrderSummary_handleModalAddCustomer();
          cashierProduct_customerState.selectedCustomer = response.data;
        }
      "
    />
  </PrimeVueDialog>
</template>
