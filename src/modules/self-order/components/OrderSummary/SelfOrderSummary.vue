<script setup lang="ts">
// Components
import SelfOrderSummaryButtonAction from './SelfOrderSummaryButtonAction.vue';
import SelfOrderSummaryProductList from './SelfOrderSummaryProductList.vue';
import SelfOrderSummaryPromoPayment from './SelfOrderSummaryPromoPayment.vue';
import SelfOrderSummarySection from './SelfOrderSummarySection.vue';
import SelfOrderSummaryTotal from './SelfOrderSummaryTotal.vue';

import SelfOrderSummaryModalCancelOrder from './Modal/SelfOrderSummaryModalCancelOrder.vue';
import SelfOrderSummaryModalInvoiceDetail from './Modal/SelfOrderSummaryModalInvoiceDetail.vue';
import SelfOrderSummaryModalMoreOptionsMobile from './Modal/SelfOrderSummaryModalMoreOptionsMobile.vue';
import SelfOrderSummaryModalOrderType from './Modal/SelfOrderSummaryModalOrderType.vue';
import SelfOrderSummaryModalPaymentMethod from './Modal/SelfOrderSummaryModalPaymentMethod.vue';
import SelfOrderSummaryModalPaymentQRIS from './Modal/SelfOrderSummaryModalPaymentQRIS.vue';
import SelfOrderSummaryModalAddCustomer from './Modal/SelfOrderSummaryModalAddCustomer.vue';
import SelfOrderSummaryModalRegisterCustomer from './Modal/SelfOrderSummaryModalRegisterCustomer.vue';
import SelfOrderSummaryModalPlaceOrderConfirmation from './Modal/SelfOrderSummaryModalPlaceOrderConfirmation.vue';
import SelfOrderSummaryModalPlaceOrderDetail from './Modal/SelfOrderSummaryModalPlaceOrderDetail.vue';
import SelfOrderSummaryModalSelectTable from './Modal/SelfOrderSummaryModalSelectTable.vue';
import SelfOrderSummaryModalVoucher from './Modal/SelfOrderSummaryModalVoucher.vue';

// Interface
import type { ISelfOrderProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  selfOrder_modalPlaceOrderDetail,
  selfOrder_onSimulatePayment,
  selfOrder_isRetailBusinessType,
} = inject<ISelfOrderProvided>('selfOrder')!;

import { useRoute } from 'vue-router';

const route = useRoute();
const rbac = useRbac();
const voucherPermission = rbac.hasPermission('voucher');
</script>

<template>
  <section
    id="order-summary"
    class="hidden sticky inset-0 z-10 xl:col-span-4 lg:col-span-6 pb-4 overflow-y-auto bg-white w-full lg:flex flex-col h-screen"
  >
    <SelfOrderSummarySection />
    <SelfOrderSummaryProductList />
    <SelfOrderSummaryPromoPayment />
    <SelfOrderSummaryTotal />
    <SelfOrderSummaryButtonAction />

    <section id="order-summary-modal">
      <SelfOrderSummaryModalCancelOrder />
      <SelfOrderSummaryModalInvoiceDetail />

      <SelfOrderSummaryModalOrderType v-if="!selfOrder_isRetailBusinessType" />
      <SelfOrderSummaryModalSelectTable
        v-if="route.name !== 'self-order' && !selfOrder_isRetailBusinessType"
      />

      <SelfOrderSummaryModalMoreOptionsMobile />

      <SelfOrderSummaryModalVoucher v-show="voucherPermission" />
      <SelfOrderSummaryModalPaymentMethod />
      <SelfOrderSummaryModalPlaceOrderDetail />
      <SelfOrderSummaryModalPlaceOrderConfirmation />
      <SelfOrderSummaryModalPaymentQRIS
        :modal-place-order-detail="{
          showModalPayment: selfOrder_modalPlaceOrderDetail.showModalPayment,
          data: selfOrder_modalPlaceOrderDetail.data,
        }"
        @simulate-payment="selfOrder_onSimulatePayment"
      />
      <SelfOrderSummaryModalAddCustomer />
      <SelfOrderSummaryModalRegisterCustomer />
    </section>
  </section>
</template>

<style scoped></style>
