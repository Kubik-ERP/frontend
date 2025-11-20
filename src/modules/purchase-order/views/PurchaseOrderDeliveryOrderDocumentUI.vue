<script setup lang="ts">
// Components
import PurchaseOrderDeliveryOrderDocumentContent from '../components/PurchaseOrderDeliveryOrderDocumentContent.vue';

// Services
import { usePurchaseOrderDeliveryOrderDocumentService } from '../services/purchase-order-delivery-order-document.service';

// Stores

/**
 * @description Destructure all the data and methods what we need
 */
const {
  purchaseOrderDeliveryOrderDocument_data,
  purchaseOrderDeliveryOrderDocument_fetchDetails,
  purchaseOrderDeliveryOrderDocument_isLoading,
  purchaseOrderDeliveryOrderDocument_listColumns,
} = usePurchaseOrderDeliveryOrderDocumentService();

/**
 * @description Provide all the data and methods what we need
 */
provide('purchaseOrderDeliveryOrderDocument', {
  purchaseOrderDeliveryOrderDocument_data,
  purchaseOrderDeliveryOrderDocument_isLoading,
  purchaseOrderDeliveryOrderDocument_listColumns,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await purchaseOrderDeliveryOrderDocument_fetchDetails();
});
</script>

<template>
  <section id="purchase-order-delivery-order-document" class="default-wrapper-fullscreen container py-16">

    <PurchaseOrderDeliveryOrderDocumentContent />
  </section>
</template>
