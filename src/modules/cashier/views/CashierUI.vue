<script setup lang="ts">
// Components
import CashierMainSection from '../components/CashierMainSection.vue';
import CashierOrderSummary from '../components/CashierOrderSummary.vue';

// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

// Services
import { useCashierProductService } from '../services/useCashierProduct.service';
import { useCashierOrderSummaryService } from '../services/useCashierOrderSummary.service';
import { ICashierOrderSummaryProvided } from '../interfaces/cashier-order-summary';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashierProduct_productState,

  cashierProduct_modalAddEditItem,
  cashierProduct_modalCategory,

  cashierProduct_selectedView,
  cashierProduct_selectedProduct,

  cashierProduct_selectedProductQty,

  cashierProduct_handleSelectCategory,
  cashierProduct_handleSelectProduct,

  cashierProduct_onSearchData,

  isProductActive,
  cashierProduct_handleQuantity,
  cashierProduct_handleOpenModalAddProduct,
} = useCashierProductService();

const {
  cashierOrderSummary_menuOrder,
  cashierOrderSummary_menuOrderItem,
  cashierOrderSummary_data,

  cashierOrderSummary_modalAddCustomer,
  cashierOrderSummary_modalMenuOrderItem,
  cashierOrderSummary_modalOrderSummary,
  cashierOrderSummary_modalAddEditNotes,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalVoucher,
  cashierOrderSummary_modalInvoiceDetail,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_modalCancelOrder,

  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_summary,

  cashierOrderSummary_isButtonPlaceOrderDisabled,

  cashierOrderSummary_isLoadingUnpaidOrder,

  cashierProduct_customerState,

  cashierOrderSummary_paymentAmountFormValidation,

  cashierOrderSummary_handleModalAddCustomer,

  cashierOrderSummary_handleIsExpandedToggle,

  cashierOrderSummary_handleSaveUnpaidOrder,

  cashierOrderSummary_handleInvoiceDetail,
  cashierOrderSummary_handleCancelOrder,
  cashierOrderSummary_handleFetchPaymentMethod,
  cashierOrderSummary_handlePaymentMethod,
  cashierOrderSummary_handlePlaceOrderConfirmation,
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleVoucher,
  cashierOrderSummary_handleToggleSelectTable,

  cashierOrderSummary_handleSimulatePayment,
  cashierProduct_onSearchCustomer,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierOrderSummary_handleEditOrder,
} = useCashierOrderSummaryService();

/**
 * @description Provide all the data and methods what we need
 */
provide<ICashierProductProvided>('cashierProduct', {
  cashierProduct_productState,

  cashierProduct_modalAddEditItem,
  cashierProduct_modalCategory,

  cashierProduct_selectedView,
  cashierProduct_selectedProduct,

  cashierProduct_selectedProductQty,

  cashierProduct_handleSelectCategory,
  cashierProduct_handleSelectProduct,

  cashierProduct_onSearchData,

  isProductActive,
  cashierProduct_handleQuantity,
  cashierProduct_handleOpenModalAddProduct,
});

provide<ICashierOrderSummaryProvided>('cashierOrderSummary', {
  cashierOrderSummary_menuOrder,
  cashierOrderSummary_menuOrderItem,
  cashierOrderSummary_data,

  cashierOrderSummary_modalAddCustomer,
  cashierOrderSummary_modalMenuOrderItem,
  cashierOrderSummary_modalOrderSummary,
  cashierOrderSummary_modalAddEditNotes,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalVoucher,
  cashierOrderSummary_modalInvoiceDetail,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_modalCancelOrder,

  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_summary,

  cashierOrderSummary_isButtonPlaceOrderDisabled,

  cashierOrderSummary_isLoadingUnpaidOrder,

  cashierProduct_customerState,

  cashierOrderSummary_paymentAmountFormValidation,

  cashierOrderSummary_handleModalAddCustomer,

  cashierOrderSummary_handleIsExpandedToggle,

  cashierOrderSummary_handleSaveUnpaidOrder,

  cashierOrderSummary_handleInvoiceDetail,
  cashierOrderSummary_handleCancelOrder,
  cashierOrderSummary_handleFetchPaymentMethod,
  cashierOrderSummary_handlePaymentMethod,
  cashierOrderSummary_handlePlaceOrderConfirmation,
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleVoucher,
  cashierOrderSummary_handleToggleSelectTable,

  cashierOrderSummary_handleSimulatePayment,
  cashierProduct_onSearchCustomer,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierOrderSummary_handleEditOrder,
});
</script>

<template>
  <section
    id="cashier"
    class="grid grid-cols-12 bg-background min-h-[calc(100dvh-85px)] h-[88dvh] default-wrapper-fullscreen"
  >
    <CashierMainSection />

    <CashierOrderSummary />
  </section>
</template>

<style scoped></style>
