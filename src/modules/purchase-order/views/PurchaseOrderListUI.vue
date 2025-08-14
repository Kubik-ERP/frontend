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
  purchaseOrderList_fetchList,
  purchaseOrderList_formDataOfCancel,
  purchaseOrderList_formDataOfConfirm,
  purchaseOrderList_formValidationsOfCancel,
  purchaseOrderList_formValidationsOfConfirm,
  purchaseOrderList_getClassOfStatus,
  purchaseOrderList_handleOnSortChange,
  purchaseOrderList_isLoading,
  purchaseOrderList_onChangePage,
  purchaseOrderList_onCloseDialogCancel,
  purchaseOrderList_onCloseDialogConfirm,
  purchaseOrderList_onPay,
  purchaseOrderList_onReceive,
  purchaseOrderList_onShip,
  purchaseOrderList_onShowButtonCancelPO,
  purchaseOrderList_onShowButtonDeliveryOrderDocument,
  purchaseOrderList_onShowDialogCancel,
  purchaseOrderList_onShowDialogConfirm,
  purchaseOrderList_onSubmitCancel,
  purchaseOrderList_onSubmitConfirm,
  purchaseOrderList_queryParams,
  purchaseOrderList_values,
} = usePurchaseOrderListService();

/**
 * @description Load initial data
 */
onMounted(async () => {
  try {
    await purchaseOrderList_fetchList();
  } catch (error) {
    console.error('Error loading purchase order list:', error);
  }
});

/**
 * @description Provide all the data and methods what we need
 */
provide('purchaseOrderList', {
  purchaseOrderList_columns,
  purchaseOrderList_fetchList,
  purchaseOrderList_formDataOfCancel,
  purchaseOrderList_formDataOfConfirm,
  purchaseOrderList_formValidationsOfCancel,
  purchaseOrderList_formValidationsOfConfirm,
  purchaseOrderList_getClassOfStatus,
  purchaseOrderList_handleOnSortChange,
  purchaseOrderList_isLoading,
  purchaseOrderList_onChangePage,
  purchaseOrderList_onCloseDialogCancel,
  purchaseOrderList_onCloseDialogConfirm,
  purchaseOrderList_onPay,
  purchaseOrderList_onReceive,
  purchaseOrderList_onShip,
  purchaseOrderList_onShowButtonCancelPO,
  purchaseOrderList_onShowButtonDeliveryOrderDocument,
  purchaseOrderList_onShowDialogCancel,
  purchaseOrderList_onShowDialogConfirm,
  purchaseOrderList_onSubmitCancel,
  purchaseOrderList_onSubmitConfirm,
  purchaseOrderList_queryParams,
  purchaseOrderList_values,
});
</script>

<template>
  <section id="purchase-order-list-ui" class="default-wrapper">
    <PurchaseOrderListTable />
  </section>
</template>
