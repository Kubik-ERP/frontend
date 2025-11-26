<script setup lang="ts">
// Interfaces
import AddCustomerUI from '@/modules/customer/views/AddCustomerUI.vue';
import type { ICashierCustomerProvided } from '../../../interfaces/cashier-customer.interface';
import {
  ICashierResponseAddCustomer,
} from '../../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashierCustomer_modalAddCustomer,
  cashierCustomer_customerState,
  cashierCustomer_handleModalAddCustomer,
} = inject<ICashierCustomerProvided>('cashierCustomer')!;
</script>
<template>
  <PrimeVueDialog
    v-model:visible="cashierCustomer_modalAddCustomer.show"
    :header="useLocalization('cashier.orderSummary.addCustomer.title')"
    modal
    :style="{ width: '50rem' }"
  >
    <AddCustomerUI
      :is-modal="true"
      @close="
        (response: ICashierResponseAddCustomer) => {
          cashierCustomer_handleModalAddCustomer(response);
          cashierCustomer_customerState.selectedCustomer = response.data;
        }
      "
    />
  </PrimeVueDialog>
</template>
