<script setup lang="ts">
// Components
import { 
  TransferStockDetailButtonActions, 
  TransferStockDetailForm,
  TransferStockDetailApproveDialog,
  TransferStockDetailCancelDialog,
  TransferStockDetailShipDialog,
  TransferStockDetailReceiveDialog,
} from '../components';

// Services
import { useTransferStockDetailService } from '../services/transfer-stock-detail.service';

/**
 * @description Use transfer stock detail service
 */
const {
  transferStockDetail_data,
  transferStockDetail_dynamicButtonAction,
  transferStockDetail_dynamicButtonLabel,
  transferStockDetail_fetchApprove,
  transferStockDetail_fetchCancel,
  transferStockDetail_fetchDetails,
  transferStockDetail_fetchReceive,
  transferStockDetail_fetchShip,
  transferStockDetail_formDataOfApprove,
  transferStockDetail_formDataOfCancel,
  transferStockDetail_formDataOfReceive,
  transferStockDetail_formDataOfShip,
  transferStockDetail_formValidationsOfApprove,
  transferStockDetail_formValidationsOfCancel,
  transferStockDetail_formValidationsOfReceive,
  transferStockDetail_formValidationsOfShip,
  transferStockDetail_formatStatusText,
  transferStockDetail_getStatusClass,
  transferStockDetail_isLoading,
  transferStockDetail_onApprove,
  transferStockDetail_onCancel,
  transferStockDetail_onCloseDialogApprove,
  transferStockDetail_onCloseDialogCancel,
  transferStockDetail_onCloseDialogReceive,
  transferStockDetail_onCloseDialogShip,
  transferStockDetail_onLoadInitialData,
  transferStockDetail_onReceive,
  transferStockDetail_onShip,
  transferStockDetail_onShowDialogApprove,
  transferStockDetail_onShowDialogCancel,
  transferStockDetail_onShowDialogReceive,
  transferStockDetail_onShowDialogShip,
  transferStockDetail_onSubmitApprove,
  transferStockDetail_onSubmitCancel,
  transferStockDetail_onSubmitReceive,
  transferStockDetail_onSubmitShip,
  transferStockDetail_shouldShowActionButton,
  transferStockDetail_shouldShowCancelButton,
  shippingDocumentData,
} = useTransferStockDetailService();
/**
 * @description Load initial data on component mount
 */
onMounted(async () => {
  const route = useRoute();
  const id = route.params.id as string;
  if (id) {
    await transferStockDetail_onLoadInitialData(id);
  }
});

/**
 * @description Provide all the data and methods what we need
 */
provide('transferStockDetail', {
  transferStockDetail_data,
  transferStockDetail_dynamicButtonAction,
  transferStockDetail_dynamicButtonLabel,
  transferStockDetail_fetchApprove,
  transferStockDetail_fetchCancel,
  transferStockDetail_fetchDetails,
  transferStockDetail_fetchReceive,
  transferStockDetail_fetchShip,
  transferStockDetail_formDataOfApprove,
  transferStockDetail_formDataOfCancel,
  transferStockDetail_formDataOfReceive,
  transferStockDetail_formDataOfShip,
  transferStockDetail_formValidationsOfApprove,
  transferStockDetail_formValidationsOfCancel,
  transferStockDetail_formValidationsOfReceive,
  transferStockDetail_formValidationsOfShip,
  transferStockDetail_formatStatusText,
  transferStockDetail_getStatusClass,
  transferStockDetail_isLoading,
  transferStockDetail_onApprove,
  transferStockDetail_onCancel,
  transferStockDetail_onCloseDialogApprove,
  transferStockDetail_onCloseDialogCancel,
  transferStockDetail_onCloseDialogReceive,
  transferStockDetail_onCloseDialogShip,
  transferStockDetail_onLoadInitialData,
  transferStockDetail_onReceive,
  transferStockDetail_onShip,
  transferStockDetail_onShowDialogApprove,
  transferStockDetail_onShowDialogCancel,
  transferStockDetail_onShowDialogReceive,
  transferStockDetail_onShowDialogShip,
  transferStockDetail_onSubmitApprove,
  transferStockDetail_onSubmitCancel,
  transferStockDetail_onSubmitReceive,
  transferStockDetail_onSubmitShip,
  transferStockDetail_shouldShowActionButton,
  transferStockDetail_shouldShowCancelButton,
  // PDF export functionality data
  shippingDocumentData,
});
</script>

<template>
  <section id="transfer-stock-detail" class="default-wrapper gap-10">
    <TransferStockDetailForm />
    <TransferStockDetailButtonActions />
    <TransferStockDetailApproveDialog />
    <TransferStockDetailCancelDialog />
    <TransferStockDetailShipDialog />
    <TransferStockDetailReceiveDialog />
  </section>
</template>
