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

const rbac = useRbac();
const hasPermission = rbac.hasPermission('voucher');
</script>

<template>
  <div class="voucher-list-ui">
    <section v-if="hasPermission" id="voucherList" class="flex flex-col relative inset-0 z-0">
      <VoucherListTable />
      <AppBaseDialogConfirmation id="voucher-list-dialog-confirmation" />
    </section>
      <section v-else class="flex flex-col items-center justify-center min-h-[60vh]">
    <div class="flex flex-col items-center text-center rounded-xl p-10 max-w-lg">
      <h1 class="text-7xl font-bold text-primary-500">403</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mt-4">Access Forbidden</h2>
      <p class="text-gray-500 mt-2">Kamu tidak memiliki izin untuk mengakses halaman ini.</p>
    </div>
  </section>
  </div>
</template>
