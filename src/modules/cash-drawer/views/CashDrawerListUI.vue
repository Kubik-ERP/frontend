<script setup lang="ts">
// Components
import CashDrawerListTable from '../components/CashDrawerListTable.vue';
import CashDrawerListOpenRegisterDialog from '../components/CashDrawerListOpenRegisterDialog.vue';

// Services
import { useCashDrawerListService } from '../services/cash-drawer-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashDrawerList_columns,
  // cashDrawerList_fetchListTransactions,
  cashDrawerList_formDataOfOpenRegister,
  cashDrawerList_formValidationsOfOpenRegister,
  cashDrawerList_getClassOfStatus,
  cashDrawerList_isLoading,
  cashDrawerList_onCloseOpenRegisterDialog,
  cashDrawerList_onShowOpenRegisterDialog,
  cashDrawerList_queryParams,
  cashDrawerList_suggestionRegisterBalance,
  cashDrawerList_values,
} = useCashDrawerListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('cashDrawerList', {
  cashDrawerList_columns,
  cashDrawerList_formDataOfOpenRegister,
  cashDrawerList_formValidationsOfOpenRegister,
  cashDrawerList_getClassOfStatus,
  cashDrawerList_isLoading,
  cashDrawerList_onCloseOpenRegisterDialog,
  cashDrawerList_onShowOpenRegisterDialog,
  cashDrawerList_queryParams,
  cashDrawerList_suggestionRegisterBalance,
  cashDrawerList_values,
});

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
// onMounted(async () => {
//   await cashDrawerList_fetchListTransactions();
// })
</script>

<template>
  <section id="sales-order-cash-drawer" class="flex flex-col relative inset-0 z-0">
    <CashDrawerListTable />
    <CashDrawerListOpenRegisterDialog />
    <AppBaseDialogConfirmation id="sales-order-cash-drawer-dialog-confirmation" />
  </section>
</template>
