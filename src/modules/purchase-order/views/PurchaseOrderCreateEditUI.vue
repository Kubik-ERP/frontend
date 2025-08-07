<script setup lang="ts">
// Components
import PurchaseOrderCreateEditAddProductDialog from '../components/PurchaseOrderCreateEditAddProductDialog.vue';
import PurchaseOrderCreateEditButtonActions from '../components/PurchaseOrderCreateEditButtonActions.vue';
import PurchaseOrderCreateEditForm from '../components/PurchaseOrderCreateEditForm.vue';
import PurchaseOrderEditQuantityDialog from '../components/PurchaseOrderEditQuantityDialog.vue';

// Services
import { usePurchaseOrderCreateEditService } from '../services/purchase-order-create-edit.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  purchaseOrderCreateEdit_formData,
  purchaseOrderCreateEdit_formDataOfEditQuantity,
  purchaseOrderCreateEdit_formValidations,
  purchaseOrderCreateEdit_formValidationsOfEditQuantity,
  purchaseOrderCreateEdit_listColumns,
  purchaseOrderCreateEdit_listProductItems,
  purchaseOrderCreateEdit_listSuppliers,
  purchaseOrderCreateEdit_onAddProductItem,
  purchaseOrderCreateEdit_onCloseDialogAddProductItem,
  purchaseOrderCreateEdit_onCloseDialogEditQuantity,
  purchaseOrderCreateEdit_onDecrementQuantity,
  purchaseOrderCreateEdit_onDeleteProductItem,
  purchaseOrderCreateEdit_onIncrementQuantity,
  purchaseOrderCreateEdit_onShowDialogAddProductItem,
  purchaseOrderCreateEdit_onShowDialogEditQuantity,
  purchaseOrderCreateEdit_onSubmitAddProductItem,
  purchaseOrderCreateEdit_onSubmitEditQuantity,
  purchaseOrderCreateEdit_selectedProductItem,
  purchaseOrderCreateEdit_selectedProductItems,
  purchaseOrderCreateEdit_totalPrice,
} = usePurchaseOrderCreateEditService();

/**
 * @description Provide all the data and methods what we need
 */
provide('purchaseOrderCreateEdit', {
  purchaseOrderCreateEdit_formData,
  purchaseOrderCreateEdit_formDataOfEditQuantity,
  purchaseOrderCreateEdit_formValidations,
  purchaseOrderCreateEdit_formValidationsOfEditQuantity,
  purchaseOrderCreateEdit_listColumns,
  purchaseOrderCreateEdit_listProductItems,
  purchaseOrderCreateEdit_listSuppliers,
  purchaseOrderCreateEdit_onAddProductItem,
  purchaseOrderCreateEdit_onCloseDialogAddProductItem,
  purchaseOrderCreateEdit_onCloseDialogEditQuantity,
  purchaseOrderCreateEdit_onDecrementQuantity,
  purchaseOrderCreateEdit_onDeleteProductItem,
  purchaseOrderCreateEdit_onIncrementQuantity,
  purchaseOrderCreateEdit_onShowDialogAddProductItem,
  purchaseOrderCreateEdit_onShowDialogEditQuantity,
  purchaseOrderCreateEdit_onSubmitAddProductItem,
  purchaseOrderCreateEdit_onSubmitEditQuantity,
  purchaseOrderCreateEdit_selectedProductItem,
  purchaseOrderCreateEdit_selectedProductItems,
  purchaseOrderCreateEdit_totalPrice,
});
</script>

<template>
  <section id="purchase-order-create-edit" class="default-wrapper gap-10">
    <PurchaseOrderCreateEditForm />
    <PurchaseOrderCreateEditButtonActions />
    <PurchaseOrderCreateEditAddProductDialog />
    <PurchaseOrderEditQuantityDialog />
  </section>
</template>
