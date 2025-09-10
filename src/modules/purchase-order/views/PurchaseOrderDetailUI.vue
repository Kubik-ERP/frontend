<script setup lang="ts">
// Components
import PurchaseOrderDetailForm from '../components/PurchaseOrderDetailForm.vue';
import PurchaseOrderDetailConfirmPODialog from '../components/PurchaseOrderDetailConfirmPODialog.vue';
import PurchaseOrderDetailButtonActions from '../components/PurchaseOrderDetailButtonActions.vue';
import PurchaseOrderDeliveryOrderPdfTemplate from '../components/PurchaseOrderDeliveryOrderPdfTemplate.vue';

// Html2Pdf
import html2pdf from 'html2pdf.js';

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
  purchaseOrderDetail_onExportDeliveryOrderToPdf: handleExportDeliveryOrderToPdf,
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

/**
 * @description Create ref for PDF template element
 */
const pdfTemplateRef = ref<InstanceType<typeof PurchaseOrderDeliveryOrderPdfTemplate> | null>(null);

/**
 * @description Computed property for delivery order data formatted for PDF
 */
const deliveryOrderData = computed(() => {
  const detail = purchaseOrderDetail_data.value;
  if (!detail) return null;

  return {
    orderNumber: detail.orderNumber || '',
    supplierInfo: {
      supplierName: detail.supplierInfo?.supplierName || '',
    },
    orderDate: detail.orderDate || '',
    deliveryDate: detail.deliveryDate || '',
    purchaseOrderItems: detail.purchaseOrderItems || [],
    totalPrice: detail.totalPrice || 0,
  };
});

/**
 * @description Handle export to PDF
 */
function handleExportDeliveryOrderToPdf() {
  if (pdfTemplateRef.value?.$el && purchaseOrderDetail_data.value) {
    const orderNumber = purchaseOrderDetail_data.value.orderNumber ?? 'delivery-order';
    const filename = `${orderNumber.replace(/[^a-zA-Z0-9]/g, '_')}_delivery_order.pdf`;

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

    <!-- Hidden PDF Template for Export -->
    <div class="absolute -top-[9999px] -left-[9999px]">
      <PurchaseOrderDeliveryOrderPdfTemplate
        v-if="deliveryOrderData"
        ref="pdfTemplateRef"
        :delivery-order-data="deliveryOrderData"
      />
    </div>
  </section>
</template>
