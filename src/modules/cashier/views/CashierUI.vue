<script setup lang="ts">
// Components
import CashDrawerAddTransactionDialog from '@/modules/cash-drawer/components/CashDrawerAddTransactionDialog.vue';
import CashDrawerCloseTransactionDialog from '@/modules/cash-drawer/components/CashDrawerCloseTransactionDialog.vue';
import CashDrawerListOpenRegisterDialog from '@/modules/cash-drawer/components/CashDrawerListOpenRegisterDialog.vue';
import CashierCashDrawerOverviewDialog from '../components/CashierCashDrawerOverviewDialog.vue';
import CashierMainSection from '../components/CashierMainSection.vue';
import CashierOrderSummary from '../components/CashierOrderSummary.vue';
import CashierQueueOverviewDialog from '../components/CashierQueueOverviewDialog.vue';
import CashierStockOverviewDialog from '../components/CashierStockOverviewDialog.vue';
import CashierTableOverviewDialog from '../components/CashierTableOverviewDialog.vue';

// Helpers
import { debounce } from '@/app/helpers/debounce.helper';

// Interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service.interface';
import type { ICashierOrderProvided } from '../interfaces/cashier-order.interface';
import type { ICashierPaymentProvided } from '../interfaces/cashier-payment.interface';
import type { ICashierCustomerProvided } from '../interfaces/cashier-customer.interface';
import type { ICashierInventoryItemsProvided } from '../interfaces/cashier-inventory-items';

// Services
import { useAccountStoreDetailsService } from '@/modules/account/services/account-store-detail.service';
import { useCashierProductService } from '../services/useCashierProduct.service';
import { useCashierOrderService } from '../services/useCashierOrder.service';
import { useCashierPaymentService } from '../services/useCashierPayment.service';
import { useCashierCustomerService } from '../services/useCashierCustomer.service';

import { useCashDrawerCashRegisterService } from '@/modules/cash-drawer/services/cash-drawer-cash-register.service';
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useInvoiceService } from '@/modules/invoice/services/useInvoice.service';
import { useInventoryItemsListService } from '@/modules/items/services/items-list.service';
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';
import { useCashierCashDrawerService } from '../services/useCashierCashDrawer.service';

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
  accountStoreDetail_fetchChangeTableStatus,
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

const {
  cashierCashDrawer_fetchTodayStatus,
  cashierCashDrawer_formDataOfOpenRegister,
  cashierCashDrawer_formValidationsOfOpenRegister,
  cashierCashDrawer_isLoading,
  cashierCashDrawer_onCloseOpenRegisterDialog,
  cashierCashDrawer_onShowOpenRegisterDialog,
  cashierCashDrawer_onSubmitOpenRegisterForm,
  cashierCashDrawer_suggestionRegisterBalance,
  cashierCashDrawer_todayStatus,
} = useCashierCashDrawerService();

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
  cashierOrder_calculateEstimation,
  cashierOrder_data,
  cashierOrder_getListActiveFloor,
  cashierOrder_handleCalculateEstimation,
  cashierOrder_handleCancelOrder,
  cashierOrder_handleEditOrder,
  cashierOrder_handleIsExpandedToggle,
  cashierOrder_handlePlaceOrderConfirmation,
  cashierOrder_handlePlaceOrderDetail,
  cashierOrder_handleSaveUnpaidOrder,
  cashierOrder_handleSelectTable,
  cashierOrder_handleToggleSelectTable,
  cashierOrder_initializeRoute,
  cashierOrder_isButtonPlaceOrderDisabled,
  cashierOrder_isLoadingUnpaidOrder,
  cashierOrder_isRetailBusinessType,
  cashierOrder_isShowQuickOverview,
  cashierOrder_menuOrder,
  cashierOrder_menuOrderItem,
  cashierOrder_modalAddEditNotes,
  cashierOrder_modalCancelOrder,
  cashierOrder_modalInvoiceDetail,
  cashierOrder_modalOrderSummary,
  cashierOrder_modalOrderType,
  cashierOrder_modalPlaceOrderConfirmation,
  cashierOrder_modalPlaceOrderDetail,
  cashierOrder_modalSelectTable,
  cashierOrder_selectedLoyaltyBenefit,
  cashierOrder_selectedLoyaltyBenefitId,
  cashierOrder_setSelectedLoyaltyBenefit,
  cashierOrder_summary,
} = useCashierOrderService();

/**
 * @description Create a debounced version of calculateEstimation for customer service
 */
const debouncedCalculateEstimation = debounce(() => {
  cashierOrder_handleCalculateEstimation();
}, 500);

const {
  cashierPayment_handleFetchPaymentMethod,
  cashierPayment_handlePaymentMethod,
  cashierPayment_handleSimulatePayment,
  cashierPayment_modalPaymentMethod,
  cashierPayment_paymentAmountFormValidation,
  cashierPayment_paymentForm,
  cashierPayment_subscribe,
  cashierPayment_unsubscribe,
} = useCashierPaymentService(cashierOrder_calculateEstimation, cashierOrder_modalPlaceOrderDetail);

const {
  cashierCustomer_customerState,
  cashierCustomer_fetchCustomerList,
  cashierCustomer_getVoucherActive,
  cashierCustomer_handleModalAddCustomer,
  cashierCustomer_handleVoucher,
  cashierCustomer_hasCustomerManagementPermission,
  cashierCustomer_menuOrderItem,
  cashierCustomer_modalAddCustomer,
  cashierCustomer_modalMenuOrderItem,
  cashierCustomer_modalVoucher,
  cashierCustomer_onCloseDialogCashDrawerOverview,
  cashierCustomer_onCloseDialogQueueOverview,
  cashierCustomer_onCloseDialogStockOverview,
  cashierCustomer_onCloseDialogTableOverview,
  cashierCustomer_onOpenDialogCashDrawerOverview,
  cashierCustomer_onOpenDialogQueueOverview,
  cashierCustomer_onOpenDialogStockOverview,
  cashierCustomer_onOpenDialogTableOverview,
  cashierCustomer_onScrollFetchMoreCustomers,
  cashierCustomer_onSearchCustomer,
  cashierCustomer_voucherData,
} = useCashierCustomerService(
  cashierProduct_selectedProduct,
  cashierOrder_calculateEstimation,
  debouncedCalculateEstimation,
);

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

const {
  inventoryItems_colums,
  inventoryItems_values,
  inventoryItems_isLoading,
  inventoryItems_queryParams,
  inventoryItems_fetchData,
} = useInventoryItemsListService();

const { invoice_invoiceData, invoice_handleFetchInvoiceById } = useInvoiceService();

const { staffMemberList_dropdownItemStaff } = useStaffMemberListService();

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
  accountStoreDetail_fetchChangeTableStatus,
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
  cashDrawerList_todayStatus: cashierCashDrawer_todayStatus,
  cashDrawerList_formDataOfOpenRegister: cashierCashDrawer_formDataOfOpenRegister,
  cashDrawerList_formValidationsOfOpenRegister: cashierCashDrawer_formValidationsOfOpenRegister,
  cashDrawerList_isLoading: cashierCashDrawer_isLoading,
  cashDrawerList_onCloseOpenRegisterDialog: cashierCashDrawer_onCloseOpenRegisterDialog,
  cashDrawerList_onShowOpenRegisterDialog: cashierCashDrawer_onShowOpenRegisterDialog,
  cashDrawerList_onSubmitOpenRegisterForm: cashierCashDrawer_onSubmitOpenRegisterForm,
  cashDrawerList_suggestionRegisterBalance: cashierCashDrawer_suggestionRegisterBalance,
});

provide('staffMemberList', {
  staffMemberList_dropdownItemStaff,
});

provide<ICashierProductProvided>('cashierProduct', {
  cashierProduct_productState,
  cashierProduct_customerState: cashierCustomer_customerState,

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
  cashierProduct_onScrollFetchMoreCustomers: cashierCustomer_onScrollFetchMoreCustomers,
  cashierProduct_onSearchCustomer: cashierCustomer_onSearchCustomer,

  isProductActive,
  cashierProduct_handleQuantity,
  cashierProduct_handleOpenModalAddProduct,

  isRetailBusinessType,
});

provide<ICashierOrderProvided>('cashierOrder', {
  cashierOrder_calculateEstimation,
  cashierOrder_data,
  cashierOrder_getListActiveFloor,
  cashierOrder_handleCalculateEstimation,
  cashierOrder_handleCancelOrder,
  cashierOrder_handleEditOrder,
  cashierOrder_handleIsExpandedToggle,
  cashierOrder_handlePlaceOrderConfirmation,
  cashierOrder_handlePlaceOrderDetail,
  cashierOrder_handleSaveUnpaidOrder,
  cashierOrder_handleSelectTable,
  cashierOrder_handleToggleSelectTable,
  cashierOrder_initializeRoute,
  cashierOrder_isButtonPlaceOrderDisabled,
  cashierOrder_isLoadingUnpaidOrder,
  cashierOrder_isRetailBusinessType,
  cashierOrder_isShowQuickOverview,
  cashierOrder_menuOrder,
  cashierOrder_menuOrderItem,
  cashierOrder_modalAddEditNotes,
  cashierOrder_modalCancelOrder,
  cashierOrder_modalInvoiceDetail,
  cashierOrder_modalMenuOrderItem: cashierCustomer_modalMenuOrderItem,
  cashierOrder_modalOrderSummary,
  cashierOrder_modalOrderType,
  cashierOrder_modalPlaceOrderConfirmation,
  cashierOrder_modalPlaceOrderDetail,
  cashierOrder_modalSelectTable,
  cashierOrder_selectedLoyaltyBenefit,
  cashierOrder_selectedLoyaltyBenefitId,
  cashierOrder_setSelectedLoyaltyBenefit,
  cashierOrder_summary,
});

provide<ICashierPaymentProvided>('cashierPayment', {
  cashierPayment_handleFetchPaymentMethod,
  cashierPayment_handlePaymentMethod,
  cashierPayment_handleSaveUnpaidOrder: () => 
    cashierOrder_handleSaveUnpaidOrder(
      cashierPayment_modalPaymentMethod,
      cashierCustomer_modalVoucher,
      cashierCustomer_customerState
    ),
  cashierPayment_handleSimulatePayment,
  cashierPayment_modalPaymentMethod,
  cashierPayment_paymentAmountFormValidation,
  cashierPayment_paymentForm,
  cashierPayment_subscribe,
  cashierPayment_unsubscribe,
});

provide<ICashierCustomerProvided>('cashierCustomer', {
  cashierCustomer_customerState,
  cashierCustomer_fetchCustomerList,
  cashierCustomer_getVoucherActive,
  cashierCustomer_handleInvoiceDetail: async (invoiceId: string) => {
    await invoice_handleFetchInvoiceById(invoiceId);
  },
  cashierCustomer_handleModalAddCustomer,
  cashierCustomer_handleVoucher,
  cashierCustomer_hasCustomerManagementPermission,
  cashierCustomer_hasManagementPermission: cashierCustomer_hasCustomerManagementPermission,
  cashierCustomer_menuOrder: cashierOrder_menuOrder,
  cashierCustomer_menuOrderItem,
  cashierCustomer_modalAddCustomer,
  cashierCustomer_modalInvoiceDetail: cashierOrder_modalInvoiceDetail,
  cashierCustomer_modalMenuOrderItem,
  cashierCustomer_modalVoucher,
  cashierCustomer_onCloseDialogCashDrawerOverview,
  cashierCustomer_onCloseDialogQueueOverview,
  cashierCustomer_onCloseDialogStockOverview,
  cashierCustomer_onCloseDialogTableOverview,
  cashierCustomer_onOpenDialogCashDrawerOverview,
  cashierCustomer_onOpenDialogQueueOverview,
  cashierCustomer_onOpenDialogStockOverview,
  cashierCustomer_onOpenDialogTableOverview,
  cashierCustomer_onScrollFetchMoreCustomers,
  cashierCustomer_onSearchCustomer,
  cashierCustomer_voucherData,
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

provide<ICashierInventoryItemsProvided>('cashierInventoryItems', {
  inventoryItems_colums,
  inventoryItems_values,
  inventoryItems_isLoading,
  inventoryItems_queryParams,
  inventoryItems_fetchData,
});

// Route is not needed in cashier since self-order is handled separately

/**
 * @description Watch for changes in selected products and trigger estimation calculation
 * This ensures the subtotal and total price are updated whenever items are added or modified
 */
watch(
  () => cashierProduct_selectedProduct.value,
  (newValue) => {
    // Only trigger calculation if there are products selected
    if (newValue && newValue.length > 0) {
      cashierOrder_handleCalculateEstimation(
        false,
        cashierCustomer_modalVoucher.value.form.voucherId,
        cashierCustomer_customerState.value.selectedCustomer?.id,
        async () => await cashierCustomer_getVoucherActive('', []),
        cashierCustomer_voucherData,
        cashierCustomer_modalVoucher,
      );
    }
  },
  { deep: true },
);

onMounted(async () => {
  // Initialize product data (only for cashier, not self-order)
  await cashierProduct_handleFetchCategory();
  await cashierProduct_handleFetchProductCategory();
  await cashierCashDrawer_fetchTodayStatus();

  // Initialize order summary based on route (cashier only)
  cashierOrder_initializeRoute(
    cashierCustomer_customerState,
    cashierPayment_modalPaymentMethod,
    cashierPayment_handleFetchPaymentMethod,
  );

  // Initialize daily sales data
  if (cashierOrder_isRetailBusinessType) {
    // Fetch inventory items data for retail business type
    await inventoryItems_fetchData();
  } else {
    //
    dailySalesList_queryParams.createdAtFrom = new Date();
    dailySalesList_queryParams.createdAtTo = new Date();

    await dailySalesList_fetchListInvoices();
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
    <CashierStockOverviewDialog />
    <CashierTableOverviewDialog />
    <CashDrawerAddTransactionDialog />
    <CashDrawerCloseTransactionDialog />
    <CashDrawerListOpenRegisterDialog />
  </section>
</template>

<style scoped></style>
