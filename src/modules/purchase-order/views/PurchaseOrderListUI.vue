<script setup lang="ts">
// Components
import PurchaseOrderListTable from '../components/PurchaseOrderListTable.vue';

// Services
import { usePurchaseOrderListService } from '../services/purchase-order-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  purchaseOrderList_columns,
  purchaseOrderList_getClassOfStatus,
  purchaseOrderList_onShowButtonCancelPO,
  purchaseOrderList_onShowButtonDeliveryOrderDocument,
  purchaseOrderList_values,
} = usePurchaseOrderListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('purchaseOrderList', {
  purchaseOrderList_columns,
  purchaseOrderList_getClassOfStatus,
  purchaseOrderList_onShowButtonCancelPO,
  purchaseOrderList_onShowButtonDeliveryOrderDocument,
  purchaseOrderList_values,
});
</script>

<template>
  <section id="purchase-order-list-ui" class="default-wrapper">
    <PurchaseOrderListTable />
  </section>
</template>
