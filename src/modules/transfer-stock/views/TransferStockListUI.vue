<script setup lang="ts">
// Components
import TransferStockListTable from '../components/TransferStockListTable.vue';

// Services
import { useTransferStockListService } from '../services/transfer-stock-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  transferStockList_columns,
  transferStockList_fetchList,
  transferStockList_formDataOfApprove,
  transferStockList_formDataOfCancel,
  transferStockList_formDataOfReceive,
  transferStockList_formDataOfShip,
  transferStockList_formValidationsOfApprove,
  transferStockList_formValidationsOfCancel,
  transferStockList_formValidationsOfReceive,
  transferStockList_formValidationsOfShip,
  transferStockList_getClassOfStatus,
  transferStockList_getStoreName,
  transferStockList_getTotalItems,
  transferStockList_getTotalQty,
  transferStockList_getTotalValue,
  transferStockList_handleOnSortChange,
  transferStockList_isLoading,
  transferStockList_onChangePage,
  transferStockList_onCloseDialogApprove,
  transferStockList_onCloseDialogCancel,
  transferStockList_onCloseDialogReceive,
  transferStockList_onCloseDialogShip,
  transferStockList_onShowButtonApprove,
  transferStockList_onShowButtonCancel,
  transferStockList_onShowButtonReceive,
  transferStockList_onShowButtonShip,
  transferStockList_onShowButtonShippingDocument,
  transferStockList_onShowDialogApprove,
  transferStockList_onShowDialogCancel,
  transferStockList_onShowDialogReceive,
  transferStockList_onShowDialogShip,
  transferStockList_onSubmitApprove,
  transferStockList_onSubmitCancel,
  transferStockList_onSubmitReceive,
  transferStockList_onSubmitShip,
  transferStockList_queryParams,
  transferStockList_values,
} = useTransferStockListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('transferStockList', {
  transferStockList_columns,
  transferStockList_fetchList,
  transferStockList_formDataOfApprove,
  transferStockList_formDataOfCancel,
  transferStockList_formDataOfReceive,
  transferStockList_formDataOfShip,
  transferStockList_formValidationsOfApprove,
  transferStockList_formValidationsOfCancel,
  transferStockList_formValidationsOfReceive,
  transferStockList_formValidationsOfShip,
  transferStockList_getClassOfStatus,
  transferStockList_getStoreName,
  transferStockList_getTotalItems,
  transferStockList_getTotalQty,
  transferStockList_getTotalValue,
  transferStockList_handleOnSortChange,
  transferStockList_isLoading,
  transferStockList_onChangePage,
  transferStockList_onCloseDialogApprove,
  transferStockList_onCloseDialogCancel,
  transferStockList_onCloseDialogReceive,
  transferStockList_onCloseDialogShip,
  transferStockList_onShowButtonApprove,
  transferStockList_onShowButtonCancel,
  transferStockList_onShowButtonReceive,
  transferStockList_onShowButtonShip,
  transferStockList_onShowButtonShippingDocument,
  transferStockList_onShowDialogApprove,
  transferStockList_onShowDialogCancel,
  transferStockList_onShowDialogReceive,
  transferStockList_onShowDialogShip,
  transferStockList_onSubmitApprove,
  transferStockList_onSubmitCancel,
  transferStockList_onSubmitReceive,
  transferStockList_onSubmitShip,
  transferStockList_queryParams,
  transferStockList_values,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  try {
    await transferStockList_fetchList();
  } catch (error) {
    console.error('Error loading transfer stock list:', error);
  }
});
</script>

<template>
  <section id="transfer-stock-list-ui" class="default-wrapper">
    <TransferStockListTable />

    <!-- Enhanced Confirmation Dialogs for Transfer Stock Actions -->
    <AppBaseDialogConfirmation id="transfer-stock-list-approve-dialog" />
    <AppBaseDialogConfirmation id="transfer-stock-list-cancel-dialog" />
    <AppBaseDialogConfirmation id="transfer-stock-list-ship-dialog" />
    <AppBaseDialogConfirmation id="transfer-stock-list-receive-dialog" />
    <AppBaseDialogConfirmation id="transfer-stock-list-close-dialog" />
  </section>
</template>
