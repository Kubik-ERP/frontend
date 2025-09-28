<script setup lang="ts">
// Vue
import { provide, ref, onMounted } from 'vue';

// Components
import CashierSelfOrderMainSection from '../components/CashierSelfOrderMainSection.vue';
import CashierOrderSummary from '../components/CashierOrderSummary.vue';

// Interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';
import type { ICashierOrderSummaryProvided } from '../interfaces/cashier-order-summary';

// Services
import { useCashierProductService } from '../services/useCashierProduct.service';
import { useCashierOrderSummaryService } from '../services/useCashierOrderSummary.service';

/**
 * @description Destructure all the data and methods what we need for self-order
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
  cashierProduct_handleBarcodeScanned,
  cashierProduct_handleFetchCategory,
  cashierProduct_handleFetchProductCategory,
  isProductActive,
  cashierProduct_handleQuantity,
  cashierProduct_handleOpenModalAddProduct,
  isRetailBusinessType,
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
  cashierOrderSummary_paymentForm,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_summary,
  cashierOrderSummary_isButtonPlaceOrderDisabled,
  cashierOrderSummary_isLoadingUnpaidOrder,
  cashierProduct_customerState,
  hasCustomerManagementPermission,
  cashierOrderSummary_isRetailBusinessType,
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
  cashierOrderSummary_onOpenDialogStockOverview,
  cashierOrderSummary_onCloseDialogStockOverview,

  // Initialize functions for self-order
  cashierOrderSummary_initializeSelfOrder,
} = useCashierOrderSummaryService();

/**
 * @description Provide all the data and methods for self-order components
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
  cashierProduct_handleBarcodeScanned,
  cashierProduct_handleFetchCategory,
  cashierProduct_handleFetchProductCategory,
  isProductActive,
  cashierProduct_handleQuantity,
  cashierProduct_handleOpenModalAddProduct,
  isRetailBusinessType,
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
  cashierOrderSummary_paymentForm,
  cashierOrderSummary_modalCancelOrder,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_summary,
  cashierOrderSummary_isButtonPlaceOrderDisabled,
  cashierOrderSummary_isLoadingUnpaidOrder,
  cashierProduct_customerState,
  hasCustomerManagementPermission,
  cashierOrderSummary_isRetailBusinessType,
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

  // No need for initialize functions in provider since they're used directly in onMounted
  cashierOrderSummary_initializeSelfOrder: () => Promise.resolve(),
  cashierOrderSummary_initializeRoute: () => {},

  // Self-order specific overrides
  cashierOrderSummary_isShowQuickOverview: ref(false),
  cashierOrderSummary_onCloseDialogCashDrawerOverview: () => {},
  cashierOrderSummary_onCloseDialogQueueOverview: () => {},
  cashierOrderSummary_onCloseDialogTableOverview: () => {},
  cashierOrderSummary_onOpenDialogCashDrawerOverview: () => Promise.resolve(),
  cashierOrderSummary_onOpenDialogQueueOverview: () => Promise.resolve(),
  cashierOrderSummary_onOpenDialogTableOverview: () => {},
  cashierOrderSummary_onOpenDialogStockOverview,
  cashierOrderSummary_onCloseDialogStockOverview,
});

onMounted(async () => {
  // Initialize self-order specific data only
  await cashierProduct_handleFetchCategory();
  await cashierProduct_handleFetchProductCategory();

  // Initialize self-order setup
  await cashierOrderSummary_initializeSelfOrder();
});
</script>

<template>
  <section id="self-order" class="grid grid-cols-12 bg-background h-full min-h-dvh default-wrapper-fullscreen">
    <CashierSelfOrderMainSection />
    <CashierOrderSummary />
  </section>
</template>

<style scoped></style>
