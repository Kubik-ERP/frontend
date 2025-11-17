<script setup lang="ts">
// Vue
import { provide, onMounted } from 'vue';

// Components
import CashierSelfOrderMainSection from '@/modules/cashier/components/CashierSelfOrderMainSection.vue';
import CashierOrderSummary from '@/modules/cashier/components/CashierOrderSummary.vue';

// Interfaces
import type { ICashierProductProvided } from '@/modules/cashier/interfaces/cashier-product-service';
import type { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';

// Services
import { useSelfOrderService } from '../services/self-order.service';
import { useCashierOrderSummaryService } from '@/modules/cashier/services/useCashierOrderSummary.service';

/**
 * @description Destructure all the data and methods what we need for self-order product
 */
const {
  isProductActive,
  isRetailBusinessType,
  selfOrder_handleBarcodeScanned,
  selfOrder_handleFetchCategory,
  selfOrder_handleFetchProductCategory,
  selfOrder_handleOpenModalAddProduct,
  selfOrder_handleQuantity,
  selfOrder_handleSelectCategory,
  selfOrder_handleSelectProduct,
  selfOrder_modalAddEditItem,
  selfOrder_modalCategory,
  selfOrder_onSearchData,
  selfOrder_productState,
  selfOrder_selectedProduct,
  selfOrder_selectedProductQty,
  selfOrder_selectedView,
} = useSelfOrderService();

/**
 * @description Destructure all the data and methods for order summary
 */
const {
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_data,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_handleCancelOrder,
  cashierOrderSummary_handleEditOrder,
  cashierOrderSummary_handleFetchPaymentMethod,
  cashierOrderSummary_handleInvoiceDetail,
  cashierOrderSummary_handleIsExpandedToggle,
  cashierOrderSummary_handleModalAddCustomer,
  cashierOrderSummary_handlePaymentMethod,
  cashierOrderSummary_handlePlaceOrderConfirmation,
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_handleSaveUnpaidOrder,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleSimulatePayment,
  cashierOrderSummary_handleToggleSelectTable,
  cashierOrderSummary_handleVoucher,
  cashierOrderSummary_initializeSelfOrder,
  cashierOrderSummary_isButtonPlaceOrderDisabled,
  cashierOrderSummary_isLoadingUnpaidOrder,
  cashierOrderSummary_isRetailBusinessType,
  cashierOrderSummary_menuOrder,
  cashierOrderSummary_menuOrderItem,
  cashierOrderSummary_modalAddCustomer,
  cashierOrderSummary_modalAddEditNotes,
  cashierOrderSummary_modalCancelOrder,
  cashierOrderSummary_modalInvoiceDetail,
  cashierOrderSummary_modalMenuOrderItem,
  cashierOrderSummary_modalOrderSummary,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_modalVoucher,
  cashierOrderSummary_onCloseDialogStockOverview,
  cashierOrderSummary_onOpenDialogStockOverview,
  cashierOrderSummary_paymentAmountFormValidation,
  cashierOrderSummary_paymentForm,
  cashierOrderSummary_selectedLoyaltyBenefit,
  cashierOrderSummary_selectedLoyaltyBenefitId,
  cashierOrderSummary_setSelectedLoyaltyBenefit,
  cashierOrderSummary_summary,
  cashierProduct_customerState,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierProduct_onSearchCustomer,
  hasCustomerManagementPermission,
} = useCashierOrderSummaryService();

/**
 * @description Provide all the data and methods for self-order product components
 */
provide<ICashierProductProvided>('cashierProduct', {
  cashierProduct_handleBarcodeScanned: selfOrder_handleBarcodeScanned,
  cashierProduct_handleFetchCategory: selfOrder_handleFetchCategory,
  cashierProduct_handleFetchProductCategory: selfOrder_handleFetchProductCategory,
  cashierProduct_handleOpenModalAddProduct: selfOrder_handleOpenModalAddProduct,
  cashierProduct_handleQuantity: selfOrder_handleQuantity,
  cashierProduct_handleSelectCategory: selfOrder_handleSelectCategory,
  cashierProduct_handleSelectProduct: selfOrder_handleSelectProduct,
  cashierProduct_modalAddEditItem: selfOrder_modalAddEditItem,
  cashierProduct_modalCategory: selfOrder_modalCategory,
  cashierProduct_onSearchData: selfOrder_onSearchData,
  cashierProduct_productState: selfOrder_productState,
  cashierProduct_selectedProduct: selfOrder_selectedProduct,
  cashierProduct_selectedProductQty: selfOrder_selectedProductQty,
  cashierProduct_selectedView: selfOrder_selectedView,
  isProductActive,
  isRetailBusinessType,
});

provide<ICashierOrderSummaryProvided>('cashierOrderSummary', {
  cashierOrderSummary_calculateEstimation,
  cashierOrderSummary_data,
  cashierOrderSummary_getListActiveFloor,
  cashierOrderSummary_handleCancelOrder,
  cashierOrderSummary_handleEditOrder,
  cashierOrderSummary_handleFetchPaymentMethod,
  cashierOrderSummary_handleInvoiceDetail,
  cashierOrderSummary_handleIsExpandedToggle,
  cashierOrderSummary_handleModalAddCustomer,
  cashierOrderSummary_handlePaymentMethod,
  cashierOrderSummary_handlePlaceOrderConfirmation,
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_handleSaveUnpaidOrder,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleSimulatePayment,
  cashierOrderSummary_handleToggleSelectTable,
  cashierOrderSummary_handleVoucher,
  cashierOrderSummary_initializeRoute: () => {},
  cashierOrderSummary_initializeSelfOrder,
  cashierOrderSummary_isButtonPlaceOrderDisabled,
  cashierOrderSummary_isLoadingUnpaidOrder,
  cashierOrderSummary_isRetailBusinessType,
  cashierOrderSummary_isShowQuickOverview: ref(false),
  cashierOrderSummary_menuOrder,
  cashierOrderSummary_menuOrderItem,
  cashierOrderSummary_modalAddCustomer,
  cashierOrderSummary_modalAddEditNotes,
  cashierOrderSummary_modalCancelOrder,
  cashierOrderSummary_modalInvoiceDetail,
  cashierOrderSummary_modalMenuOrderItem,
  cashierOrderSummary_modalOrderSummary,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_modalVoucher,
  cashierOrderSummary_onCloseDialogCashDrawerOverview: () => {},
  cashierOrderSummary_onCloseDialogQueueOverview: () => {},
  cashierOrderSummary_onCloseDialogStockOverview,
  cashierOrderSummary_onCloseDialogTableOverview: () => {},
  cashierOrderSummary_onOpenDialogCashDrawerOverview: () => Promise.resolve(),
  cashierOrderSummary_onOpenDialogQueueOverview: () => Promise.resolve(),
  cashierOrderSummary_onOpenDialogStockOverview,
  cashierOrderSummary_onOpenDialogTableOverview: () => {},
  cashierOrderSummary_paymentAmountFormValidation,
  cashierOrderSummary_paymentForm,
  cashierOrderSummary_selectedLoyaltyBenefit,
  cashierOrderSummary_selectedLoyaltyBenefitId,
  cashierOrderSummary_setSelectedLoyaltyBenefit,
  cashierOrderSummary_summary,
  cashierProduct_customerState,
  cashierProduct_onScrollFetchMoreCustomers,
  cashierProduct_onSearchCustomer,
  hasCustomerManagementPermission,
});

onMounted(async () => {
  // Initialize self-order specific data only
  await selfOrder_handleFetchCategory();
  await selfOrder_handleFetchProductCategory();

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
