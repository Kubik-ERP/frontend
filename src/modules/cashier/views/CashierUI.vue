<script setup lang="ts">
// Components
import CashierMainSection from '../components/CashierMainSection.vue';

// interfaces
import type { ICashierProductProvided } from '../interfaces/cashier-product-service';

// Services
import { useCashierProductService } from '../services/useCashierProduct.service';
import CashierOrderSummary from '../components/CashierOrderSummary.vue';

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
</script>

<template>
  <section
    id="cashier"
    class="grid-wrapper-fullscreen bg-background min-h-screen h-full default-wrapper-fullscreen"
  >
    <CashierMainSection />

    <CashierOrderSummary />
  </section>
</template>

<style scoped></style>
