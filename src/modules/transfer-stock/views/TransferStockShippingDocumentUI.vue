<script setup lang="ts">
// Components
import TransferStockShippingDocumentContent from '../components/TransferStockShippingDocumentContent.vue';

// Services
import { useTransferStockShippingDocumentService } from '../services/transfer-stock-shipping-document.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  transferStockShippingDocument_data,
  transferStockShippingDocument_fetchDetails,
  transferStockShippingDocument_isLoading,
} = useTransferStockShippingDocumentService();

/**
 * @description Provide all the data and methods what we need
 */
provide('transferStockShippingDocument', {
  transferStockShippingDocument_data,
  transferStockShippingDocument_isLoading,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await transferStockShippingDocument_fetchDetails();
});
</script>

<template>
  <section id="transfer-stock-shipping-document" class="default-wrapper-fullscreen container py-16">
    <TransferStockShippingDocumentContent />
  </section>
</template>
