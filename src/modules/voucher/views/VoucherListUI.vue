<script setup lang="ts">
// Components
import VoucherListTable from '../components/VoucherListTable.vue'

// Services
import { useVoucherListService } from '../services/voucher-list.service'

// Ambil semua data & methods dari service
const {
  voucherList_columns,
  voucherList_isLoading,
  voucherList_values,
  voucherList_queryParams,
  voucherList_onChangePage,
  voucher_handleOnSortChange
} = useVoucherListService()

// Provide ke seluruh child component
provide('voucher', {
  voucherList_columns,
  voucherList_isLoading,
  voucherList_values,
  voucherList_queryParams,
  voucherList_onChangePage,
  voucher_handleOnSortChange,
})

</script>

<template>
  <div class="voucher-list-ui">
    <section id="voucherList" class="flex flex-col relative inset-0 z-0">
      <VoucherListTable />
      <AppBaseDialogConfirmation id="voucher-list-dialog-confirmation" />
    </section>
  </div>
</template>
