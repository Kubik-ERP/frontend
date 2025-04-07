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
  cashierProduct_isLoading,
  cashierProduct_searchData,
  cashierProduct_listCategory,

  cashierProduct_modalAddEditItem,

  cashierProduct_listDrink,
  cashierProduct_listFeaturedProduct,
  cashierProduct_listFood,

  cashierProduct_selectedCategory,
  cashierProduct_selectedProduct,
  cashierProduct_selectedView,

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
  cashierOrderSummary_calculation,
  cashierOrderSummary_summary,

  cashierOrderSummary_modalAddEditNotes,
  cashierOrderSummary_modalCancelOrder,
  cashierOrderSummary_modalInvoiceDetail,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_modalVoucher,

  cashierOrderSummary_getListActiveFloor,

  cashierOrderSummary_handleOrderType,
  cashierOrderSummary_handleInvoiceDetail,
  cashierOrderSummary_handleCancelOrder,
  cashierOrderSummary_handlePaymentMethod,
  cashierOrderSummary_handlePlaceOrderConfirmation,
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleVoucher,
  cashierOrderSummary_handleToggleSelectTable,
} = useCashierOrderSummaryService();

/**
 * @description Provide all the data and methods what we need
 */
provide<ICashierProductProvided>('cashierProduct', {
  cashierProduct_isLoading,
  cashierProduct_searchData,
  cashierProduct_listCategory,

  cashierProduct_modalAddEditItem,

  cashierProduct_listDrink,
  cashierProduct_listFeaturedProduct,
  cashierProduct_listFood,

  cashierProduct_selectedCategory,
  cashierProduct_selectedProduct,
  cashierProduct_selectedView,

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
  cashierOrderSummary_calculation,
  cashierOrderSummary_summary,

  cashierOrderSummary_modalAddEditNotes,
  cashierOrderSummary_modalCancelOrder,
  cashierOrderSummary_modalInvoiceDetail,
  cashierOrderSummary_modalOrderType,
  cashierOrderSummary_modalPaymentMethod,
  cashierOrderSummary_modalPlaceOrderConfirmation,
  cashierOrderSummary_modalPlaceOrderDetail,
  cashierOrderSummary_modalSelectTable,
  cashierOrderSummary_modalVoucher,
  cashierOrderSummary_getListActiveFloor,

  cashierOrderSummary_handleOrderType,
  cashierOrderSummary_handleInvoiceDetail,
  cashierOrderSummary_handleCancelOrder,
  cashierOrderSummary_handlePaymentMethod,
  cashierOrderSummary_handlePlaceOrderConfirmation,
  cashierOrderSummary_handlePlaceOrderDetail,
  cashierOrderSummary_handleSelectTable,
  cashierOrderSummary_handleVoucher,
  cashierOrderSummary_handleToggleSelectTable,
});
</script>

<template>
  <section
    id="cashier"
    class="grid-wrapper-fullscreen bg-background min-h-screen h-screen default-wrapper-fullscreen"
  >
    <CashierMainSection />

    <CashierOrderSummary />
  </section>
</template>

<style scoped></style>
