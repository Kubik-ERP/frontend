<script setup lang="ts">
// Components
import PurchaseOrderDetailForm from '../components/PurchaseOrderDetailForm.vue';
import PurchaseOrderDetailConfirmPODialog from '../components/PurchaseOrderDetailConfirmPODialog.vue';
import PurchaseOrderDetailButtonActions from '../components/PurchaseOrderDetailButtonActions.vue';

// Services
import { usePurchaseOrderDetailService } from '../services/purchase-order-detail.service';
/**
 * @description Destructure all the data and methods what we need
 */
const {
  purchaseOrderDetail_data,
  purchaseOrderDetail_dynamicButtonAction,
  purchaseOrderDetail_dynamicButtonLabel,
  purchaseOrderDetail_isLoading,
  purchaseOrderDetail_listColumns,
  purchaseOrderDetail_fetchDetails,
  purchaseOrderDetail_formDataOfConfirm,
  purchaseOrderDetail_formValidationsOfConfirm,
  purchaseOrderDetail_getStatusClass,
  purchaseOrderDetail_onCancel,
  purchaseOrderDetail_onCloseDialogConfirm,
  purchaseOrderDetail_onConfirm,
  purchaseOrderDetail_onShip,
  purchaseOrderDetail_onReceive,
  purchaseOrderDetail_onPay,
  purchaseOrderDetail_onEdit,
  purchaseOrderDetail_onExportDeliveryOrderToPdf,
} = usePurchaseOrderDetailService();

/**
 * @description Provide all the data and methods what we need
 */
provide('purchaseOrderDetail', {
  purchaseOrderDetail_data,
  purchaseOrderDetail_dynamicButtonAction,
  purchaseOrderDetail_dynamicButtonLabel,
  purchaseOrderDetail_fetchDetails,
  purchaseOrderDetail_formDataOfConfirm,
  purchaseOrderDetail_formValidationsOfConfirm,
  purchaseOrderDetail_getStatusClass,
  purchaseOrderDetail_isLoading,
  purchaseOrderDetail_listColumns,
  purchaseOrderDetail_onCancel,
  purchaseOrderDetail_onCloseDialogConfirm,
  purchaseOrderDetail_onConfirm,
  purchaseOrderDetail_onEdit,
  purchaseOrderDetail_onExportDeliveryOrderToPdf,
  purchaseOrderDetail_onPay,
  purchaseOrderDetail_onReceive,
  purchaseOrderDetail_onShip,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await purchaseOrderDetail_fetchDetails();
});
</script>

<template>
  <section id="purchase-order-detail" class="default-wrapper gap-10">
    <PurchaseOrderDetailForm />
    <PurchaseOrderDetailButtonActions />
    <PurchaseOrderDetailConfirmPODialog />
    <AppBaseDialogConfirmation
      id="purchase-order-detail-confirmation-dialog"
      custom-body-class="px-6"
      custom-footer-class="px-6 pb-6"
      custom-header-class="px-6 pt-6"
    />
  </section>
</template>
