<script setup lang="ts">
// Components
import CashDrawerListTable from '../components/CashDrawerListTable.vue';
import CashDrawerListOpenRegisterDialog from '../components/CashDrawerListOpenRegisterDialog.vue';

// Services
import { useCashDrawerListService } from '../services/cash-drawer-list.service';
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashDrawerList_columns,
  cashDrawerList_formDataOfOpenRegister,
  cashDrawerList_formValidationsOfOpenRegister,
  cashDrawerList_getClassOfStatus,
  cashDrawerList_isLoading,
  cashDrawerList_onChangePage,
  cashDrawerList_onCloseOpenRegisterDialog,
  cashDrawerList_onShowOpenRegisterDialog,
  cashDrawerList_queryParams,
  cashDrawerList_suggestionRegisterBalance,
  cashDrawerList_onSubmitOpenRegisterForm,
  cashDrawerList_values,
} = useCashDrawerListService();
const { staffMemberList_dropdownItemStaff } = useStaffMemberListService();

/**
 * @description Provide all the data and methods what we need
 */
provide('cashDrawerList', {
  cashDrawerList_columns,
  cashDrawerList_formDataOfOpenRegister,
  cashDrawerList_formValidationsOfOpenRegister,
  cashDrawerList_getClassOfStatus,
  cashDrawerList_isLoading,
  cashDrawerList_onChangePage,
  cashDrawerList_onCloseOpenRegisterDialog,
  cashDrawerList_onShowOpenRegisterDialog,
  cashDrawerList_queryParams,
  cashDrawerList_suggestionRegisterBalance,
  cashDrawerList_onSubmitOpenRegisterForm,
  cashDrawerList_values,
});

provide('staffMemberList', {
  staffMemberList_dropdownItemStaff,
});
</script>

<template>
  <section id="sales-order-cash-drawer" class="flex flex-col relative inset-0 z-0">
    <CashDrawerListTable />
    <CashDrawerListOpenRegisterDialog />
    <AppBaseDialogConfirmation id="sales-order-cash-drawer-dialog-confirmation" />
  </section>
</template>
