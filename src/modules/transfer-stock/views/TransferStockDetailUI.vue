<script setup lang="ts">
// Components
import { 
  TransferStockDetailButtonActions, 
  TransferStockDetailForm,
  TransferStockDetailApproveDialog,
  TransferStockDetailCancelDialog,
  TransferStockDetailShipDialog,
  TransferStockDetailReceiveDialog,
  TransferStockShippingDocumentPdfTemplate
} from '../components';

// Html2Pdf
import html2pdf from 'html2pdf.js';

// Services
import { useTransferStockDetailService } from '../services/transfer-stock-detail.service';

/**
 * @description Use transfer stock detail service
 */
const {
  transferStockDetail_data,
  transferStockDetail_dynamicButtonAction,
  transferStockDetail_dynamicButtonLabel,
  transferStockDetail_fetchDetails,
  transferStockDetail_formDataOfApprove,
  transferStockDetail_formDataOfCancel,
  transferStockDetail_formDataOfReceive,
  transferStockDetail_formDataOfShip,
  transferStockDetail_formValidationsOfApprove,
  transferStockDetail_formValidationsOfCancel,
  transferStockDetail_formValidationsOfReceive,
  transferStockDetail_formValidationsOfShip,
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
  shippingDocumentData,
} = useTransferStockDetailService();

/**
 * @description Create ref for PDF template element
 */
const pdfTemplateRef = ref<InstanceType<typeof TransferStockShippingDocumentPdfTemplate> | null>(null);

/**
 * @description Handle export shipping document to PDF
 */
function handleExportShippingDocumentToPdf() {
  if (pdfTemplateRef.value?.$el && transferStockDetail_data.value) {
    const transactionCode = transferStockDetail_data.value.transactionCode ?? 'shipping-document';
    const filename = `${transactionCode.replace(/[^a-zA-Z0-9]/g, '_')}_shipping_document.pdf`;

    const options = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    html2pdf().set(options).from(pdfTemplateRef.value.$el).save();
  } else {
    console.error('PDF template element not found or no data available.');
  }
}

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
  transferStockDetail_fetchDetails,
  transferStockDetail_formDataOfApprove,
  transferStockDetail_formDataOfCancel,
  transferStockDetail_formDataOfReceive,
  transferStockDetail_formDataOfShip,
  transferStockDetail_formValidationsOfApprove,
  transferStockDetail_formValidationsOfCancel,
  transferStockDetail_formValidationsOfReceive,
  transferStockDetail_formValidationsOfShip,
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
  // PDF export functionality
  handleExportShippingDocumentToPdf,
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
    
    <!-- Hidden PDF Template for Export -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <TransferStockShippingDocumentPdfTemplate
        v-if="shippingDocumentData"
        ref="pdfTemplateRef"
        :shipping-document-data="shippingDocumentData"
      />
    </div>
  </section>
</template>
