<script setup lang="ts">
// Components
import InvoiceHeader from '../components/InvoiceHeader.vue';
import InvoicePaper from '../components/InvoicePaper.vue';
import InvoiceStatus from '../components/InvoiceStatus.vue';

import InvoiceSelfOrderHeader from '../components/self-order/InvoiceHeader.vue';
import InvoiceOrderInformation from '../components/self-order/InvoiceOrderInformation.vue';
import invoiceListProducts from '../components/self-order/InvoiceListProducts.vue';
import InvoiceTotal from '../components/self-order/InvoiceTotal.vue';
import InvoiceCustomerDetails from '../components/self-order/InvoiceCustomerDetails.vue';

import InvoiceStatusMobile from '../components/InvoiceStatusMobile.vue';
import InvoiceMobileButtonAction from '../components/InvoiceMobileButtonAction.vue';

// Services
import { useInvoiceService } from '../services/useInvoice.service';
import InvoiceModalPay from '../components/modal/InvoiceModalPay.vue';
import CashierSummaryModalPaymentQRIS from '@/modules/cashier/components/OrderSummary/Modal/CashierSummaryModalPaymentQRIS.vue';

const route = useRoute();

/**
 * @description Destructure all the data and methods what we need
 */
const {
  invoice_activeInvoice,
  invoice_invoiceData,
  invoice_modalPay,
  invoice_otherOptions,
  invoice_invoiceDataValidation,

  invoice_handleDownload,
  invoice_handlePrint,
  invoice_handleOtherOptions,
  invoice_handlePayInvoice,
  invoice_handleSimulatePayment,
} = useInvoiceService();

provide('invoice', {
  invoice_activeInvoice,
  invoice_invoiceData,
  invoice_modalPay,
  invoice_otherOptions,
  invoice_invoiceDataValidation,

  invoice_handleDownload,
  invoice_handlePrint,
  invoice_handleOtherOptions,
  invoice_handlePayInvoice,
  invoice_handleSimulatePayment,
});

const invoicePaperRef = ref();

const handlePrint = (type: string) => {
  invoicePaperRef.value?.print(type);
};

const handleDownload = () => {
  invoicePaperRef.value?.download();
};
</script>

<template>
  <section id="invoice" class="default-wrapper-fullscreen">
    <template v-if="route.name === 'invoice'">
      <InvoiceHeader />

      <InvoiceStatusMobile translate="no" />
      <section id="content" class="relative grid grid-rows-1 grid-cols-12 h-[calc(100dvh-5rem)]">
        <InvoicePaper ref="invoicePaperRef" translate="no" />
        <InvoiceStatus translate="no" @download="handleDownload" @print="handlePrint"  />
        <InvoiceMobileButtonAction translate="no" @download="handleDownload" @print="handlePrint" />
        <InvoiceModalPay translate="no" />

        <CashierSummaryModalPaymentQRIS
          :modal-place-order-detail="{
            showModalPayment: invoice_modalPay.showModalPayment,
            data: invoice_modalPay.dataPayment,
          }"
          @simulate-payment="invoice_handleSimulatePayment"
          @close="invoice_modalPay.showModalPayment = false"
        />
      </section>
    </template>
    <template v-else>
      <InvoiceSelfOrderHeader />

      <section id="self-order-content" class="flex flex-col gap-2 relative bg-background h-full w-full">
        <InvoiceOrderInformation />
        <invoiceListProducts />
        <InvoiceTotal />
        <InvoiceCustomerDetails />
      </section>
    </template>
  </section>
</template>
