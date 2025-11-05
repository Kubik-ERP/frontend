<script setup lang="ts">
// Components
import TransferStockCreateEditAddProductDialog from '../components/TransferStockCreateEditAddProductDialog.vue';
import TransferStockCreateEditButtonActions from '../components/TransferStockCreateEditButtonActions.vue';
import TransferStockCreateEditForm from '../components/TransferStockCreateEditForm.vue';
import TransferStockEditQuantityDialog from '../components/TransferStockEditQuantityDialog.vue';

// Services
import { useTransferStockCreateEditService } from '../services/transfer-stock-create-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  transferStockCreateEdit_fetchCreate,
  transferStockCreateEdit_fetchDetails,
  transferStockCreateEdit_fetchUpdate,
  transferStockCreateEdit_formData,
  transferStockCreateEdit_formDataOfEditQuantity,
  transferStockCreateEdit_formValidations,
  transferStockCreateEdit_formValidationsOfEditQuantity,
  transferStockCreateEdit_isDecrementDisabled,
  transferStockCreateEdit_isEditMode,
  transferStockCreateEdit_isIncrementDisabled,
  transferStockCreateEdit_listColumns,
  transferStockCreateEdit_listFromStores,
  transferStockCreateEdit_listProductItems,
  transferStockCreateEdit_listToStores,
  transferStockCreateEdit_onAddProductItem,
  transferStockCreateEdit_onCloseDialogAddProductItem,
  transferStockCreateEdit_onCloseDialogEditQuantity,
  transferStockCreateEdit_onDecrementQuantity,
  transferStockCreateEdit_onDeleteProductItem,
  transferStockCreateEdit_onIncrementQuantity,
  transferStockCreateEdit_onLoadInitialData,
  transferStockCreateEdit_onResetForm,
  transferStockCreateEdit_onShowDialogAddProductItem,
  transferStockCreateEdit_onShowDialogEditQuantity,
  transferStockCreateEdit_onSubmitAddProductItem,
  transferStockCreateEdit_onSubmitEditQuantity,
  transferStockCreateEdit_onSubmitForm,
  transferStockCreateEdit_selectedProductItem,
  transferStockCreateEdit_selectedProductItems,
  transferStockCreateEdit_totalValue,
} = useTransferStockCreateEditService();

/**
 * @description Load initial data on component mount
 */
onMounted(async () => {
  await transferStockCreateEdit_onLoadInitialData();
});

/**
 * @description Provide all the data and methods what we need
 */
provide('transferStockCreateEdit', {
  transferStockCreateEdit_fetchCreate,
  transferStockCreateEdit_fetchDetails,
  transferStockCreateEdit_fetchUpdate,
  transferStockCreateEdit_formData,
  transferStockCreateEdit_formDataOfEditQuantity,
  transferStockCreateEdit_formValidations,
  transferStockCreateEdit_formValidationsOfEditQuantity,
  transferStockCreateEdit_isDecrementDisabled,
  transferStockCreateEdit_isEditMode,
  transferStockCreateEdit_isIncrementDisabled,
  transferStockCreateEdit_listColumns,
  transferStockCreateEdit_listFromStores,
  transferStockCreateEdit_listProductItems,
  transferStockCreateEdit_listToStores,
  transferStockCreateEdit_onAddProductItem,
  transferStockCreateEdit_onCloseDialogAddProductItem,
  transferStockCreateEdit_onCloseDialogEditQuantity,
  transferStockCreateEdit_onDecrementQuantity,
  transferStockCreateEdit_onDeleteProductItem,
  transferStockCreateEdit_onIncrementQuantity,
  transferStockCreateEdit_onLoadInitialData,
  transferStockCreateEdit_onResetForm,
  transferStockCreateEdit_onShowDialogAddProductItem,
  transferStockCreateEdit_onShowDialogEditQuantity,
  transferStockCreateEdit_onSubmitAddProductItem,
  transferStockCreateEdit_onSubmitEditQuantity,
  transferStockCreateEdit_onSubmitForm,
  transferStockCreateEdit_selectedProductItem,
  transferStockCreateEdit_selectedProductItems,
  transferStockCreateEdit_totalValue,
});
</script>

<template>
  <section id="transfer-stock-create-edit" class="default-wrapper gap-10">
    <TransferStockCreateEditForm />
    <TransferStockCreateEditButtonActions />
    <TransferStockCreateEditAddProductDialog />
    <TransferStockEditQuantityDialog />
  </section>
</template>
