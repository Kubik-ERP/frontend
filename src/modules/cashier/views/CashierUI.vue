<script setup lang="ts">
// Components
import CashDrawerAddTransactionDialog from '@/modules/cash-drawer/components/CashDrawerAddTransactionDialog.vue';
import CashDrawerCloseTransactionDialog from '@/modules/cash-drawer/components/CashDrawerCloseTransactionDialog.vue';
import CashierCashDrawerOverviewDialog from '../components/CashierCashDrawerOverviewDialog.vue';
import CashierMainSection from '../components/CashierMainSection.vue';
import CashierOrderSummary from '../components/CashierOrderSummary.vue';
import CashierQueueOverviewDialog from '../components/CashierQueueOverviewDialog.vue';
import CashierTableOverviewDialog from '../components/CashierTableOverviewDialog.vue';

// Interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';
import type { ICashierOrderSummaryProvided } from '../interfaces/cashier-order-summary';

// Services
import { useAccountStoreDetailsService } from '@/modules/account/services/account-store-detail.service';
import { useCashierProductService } from '../services/useCashierProduct.service';
import { useCashierOrderSummaryService } from '../services/useCashierOrderSummary.service';
import { useCashDrawerListService } from '@/modules/cash-drawer/services/cash-drawer-list.service';
import { useCashDrawerCashRegisterService } from '@/modules/cash-drawer/services/cash-drawer-cash-register.service';
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useInvoiceService } from '@/modules/invoice/services/useInvoice.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  accountStoreDetail_fetchOutletStoreTable,
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_onShowDialogDetailTable,
  accountStoreDetail_operationalHours,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_storeTables,
} = useAccountStoreDetailsService();

const {
  cashDrawerCashRegister_detail,
  cashDrawerCashRegister_formDataOfCloseTransaction,
  cashDrawerCashRegister_formDataOfTransaction,
  cashDrawerCashRegister_formValidationsOfCloseTransaction,
  cashDrawerCashRegister_formValidationsOfTransaction,
  cashDrawerCashRegister_getIconOfTypeCashRegister,
  cashDrawerCashRegister_getValueOfTypeCashRegister,
  cashDrawerCashRegister_isFormInvalid,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_isOpenCashRegisterSummary,
  cashDrawerCashRegister_listColumns,
  cashDrawerCashRegister_listTypesOfCashRegister,
  cashDrawerCashRegister_listValuesOfCashRegister,
  cashDrawerCashRegister_onCloseDialogAddTransaction,
  cashDrawerCashRegister_onCloseDialogCloseTransaction,
  cashDrawerCashRegister_onExportToPdf,
  cashDrawerCashRegister_onOpenDialogAddTransaction,
  cashDrawerCashRegister_onOpenDialogCloseTransaction,
  cashDrawerCashRegister_onSubmitAddTransaction,
  cashDrawerCashRegister_onSubmitCloseTransaction,
  cashDrawerCashRegister_queryParamsOfTransaction,
  cashDrawerCashRegister_suggestionRegisterBalance,
  cashDrawerCashRegister_toggleCashRegisterSummary,
  cashDrawerCashRegister_typeOfTransaction,
} = useCashDrawerCashRegisterService();

const { cashDrawerList_fetchTodayStatus, cashDrawerList_todayStatus } = useCashDrawerListService();

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

  cashierOrderSummary_isShowQuickOverview,
  cashierOrderSummary_onCloseDialogCashDrawerOverview,
  cashierOrderSummary_onCloseDialogQueueOverview,
  cashierOrderSummary_onCloseDialogTableOverview,
  cashierOrderSummary_onOpenDialogCashDrawerOverview,
  cashierOrderSummary_onOpenDialogQueueOverview,
  cashierOrderSummary_onOpenDialogTableOverview,

  // Initialize functions
  cashierOrderSummary_initializeRoute,
} = useCashierOrderSummaryService();

const {
  dailySalesList_columns,
  dailySalesList_fetchListInvoices,
  dailySalesList_getClassOfOrderStatus,
  dailySalesList_getClassOfOrderType,
  dailySalesList_getClassOfPaymentStatus,
  dailySalesList_isLoading,
  dailySalesList_onChangePage,
  dailySales_handleOnSortChange,
  dailySalesList_queryParams,
  dailySalesList_typesOfOrderStatus,
  dailySalesList_typesOfOrderType,
  dailySalesList_typesOfPaymentStatus,
  dailySalesList_values,
} = useDailySalesListService();

const { invoice_invoiceData, invoice_handleFetchInvoiceById } = useInvoiceService();

/**
 * @description Provide all the data and methods what we need
 */
provide('accountStoreDetail', {
  accountStoreDetail_fetchOutletStoreTable,
  accountStoreDetail_listAvailableFloor,
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listColumnsOfOperationalHours,
  accountStoreDetail_listColumnsOfStoreFacilities,
  accountStoreDetail_listValuesOfOperationalHours,
  accountStoreDetail_listValuesOfStoreFacilities,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_onShowDialogDetailTable,
  accountStoreDetail_operationalHours,
  accountStoreDetail_selectedFloor,
  accountStoreDetail_storeTables,
});

provide('cashDrawerCashRegister', {
  cashDrawerCashRegister_detail,
  cashDrawerCashRegister_formDataOfCloseTransaction,
  cashDrawerCashRegister_formDataOfTransaction,
  cashDrawerCashRegister_formValidationsOfCloseTransaction,
  cashDrawerCashRegister_formValidationsOfTransaction,
  cashDrawerCashRegister_getIconOfTypeCashRegister,
  cashDrawerCashRegister_getValueOfTypeCashRegister,
  cashDrawerCashRegister_isFormInvalid,
  cashDrawerCashRegister_isLoading,
  cashDrawerCashRegister_isOpenCashRegisterSummary,
  cashDrawerCashRegister_listColumns,
  cashDrawerCashRegister_listTypesOfCashRegister,
  cashDrawerCashRegister_listValuesOfCashRegister,
  cashDrawerCashRegister_onCloseDialogAddTransaction,
  cashDrawerCashRegister_onCloseDialogCloseTransaction,
  cashDrawerCashRegister_onExportToPdf,
  cashDrawerCashRegister_onOpenDialogAddTransaction,
  cashDrawerCashRegister_onOpenDialogCloseTransaction,
  cashDrawerCashRegister_onSubmitAddTransaction,
  cashDrawerCashRegister_onSubmitCloseTransaction,
  cashDrawerCashRegister_queryParamsOfTransaction,
  cashDrawerCashRegister_suggestionRegisterBalance,
  cashDrawerCashRegister_toggleCashRegisterSummary,
  cashDrawerCashRegister_typeOfTransaction,
});

provide('cashDrawerList', {
  cashDrawerList_todayStatus,
});

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

  cashierOrderSummary_isShowQuickOverview,
  cashierOrderSummary_onCloseDialogCashDrawerOverview,
  cashierOrderSummary_onCloseDialogQueueOverview,
  cashierOrderSummary_onCloseDialogTableOverview,
  cashierOrderSummary_onOpenDialogCashDrawerOverview,
  cashierOrderSummary_onOpenDialogTableOverview,
  cashierOrderSummary_onOpenDialogQueueOverview,

  // Initialize functions
  cashierOrderSummary_initializeSelfOrder: () => Promise.resolve(), // Empty implementation for cashier
  cashierOrderSummary_initializeRoute,
});

provide('dailySalesList', {
  dailySalesList_columns,
  dailySalesList_getClassOfOrderStatus,
  dailySalesList_getClassOfOrderType,
  dailySalesList_getClassOfPaymentStatus,
  dailySalesList_isLoading,
  dailySalesList_onChangePage,
  dailySales_handleOnSortChange,
  dailySalesList_queryParams,
  dailySalesList_typesOfOrderStatus,
  dailySalesList_typesOfOrderType,
  dailySalesList_typesOfPaymentStatus,
  dailySalesList_values,
});

provide('invoice', {
  invoice_invoiceData,
  invoice_handleFetchInvoiceById,
});

// Route is not needed in cashier since self-order is handled separately

onMounted(async () => {
  // Initialize product data (only for cashier, not self-order)
  await cashierProduct_handleFetchCategory();
  await cashierProduct_handleFetchProductCategory();

  // Initialize order summary based on route (cashier only)
  cashierOrderSummary_initializeRoute();

  // Initialize daily sales data
  if (cashierOrderSummary_isRetailBusinessType) {
    // Do Something for fetch table summary
  } else {
    dailySalesList_queryParams.createdAtFrom = new Date();
    dailySalesList_queryParams.createdAtTo = new Date();

    await dailySalesList_fetchListInvoices();
    await cashDrawerList_fetchTodayStatus();
  }

  // Fetch outlet store table data for cashier
  accountStoreDetail_fetchOutletStoreTable();
});
</script>

<template>
  <section id="cashier" class="grid grid-cols-12 bg-background h-full min-h-dvh default-wrapper-fullscreen">
    <CashierMainSection />
    <CashierOrderSummary />

    <CashierCashDrawerOverviewDialog />
    <CashierQueueOverviewDialog />
    <CashierTableOverviewDialog />
    <CashDrawerAddTransactionDialog />
    <CashDrawerCloseTransactionDialog />
  </section>
</template>

<style scoped></style>
