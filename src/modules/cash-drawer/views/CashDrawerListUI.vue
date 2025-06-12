<script setup lang="ts">
// Services
import { useCashDrawerListService } from '../services/cash-drawer-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashDrawerList_columns,
  cashDrawerList_fetchListTransactions,
  // cashDrawerList_formDataOfOpenRegister,
  cashDrawerList_getClassOfStatus,
  cashDrawerList_isLoading,
  cashDrawerList_onOpenDialogOpenRegister,
  // cashDrawerList_queryParams,
  cashDrawerList_values,
} = useCashDrawerListService();

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await cashDrawerList_fetchListTransactions();
});
</script>

<template>
  <section id="sales-order-cash-drawer" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Open Register"
      :columns="cashDrawerList_columns"
      :data="cashDrawerList_values"
      header-title="Cash Drawer"
      is-using-btn-cta-create
      is-using-custom-body
      :is-loading="cashDrawerList_isLoading"
      @click-btn-cta-create="cashDrawerList_onOpenDialogOpenRegister"
    >
      <template #body="{ column, data }">
        <template v-if="column.value === 'expectedBalance' || column.value === 'actualBalance'">
          <span class="font-normal text-sm text-text-primary">
            {{ useCurrencyFormat(data[column.value]) }}
          </span>
        </template>

        <template v-else-if="column.value === 'status'">
          <PrimeVueChip
            :class="[cashDrawerList_getClassOfStatus(data[column.value]), 'text-xs font-normal']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="detail">
            <template #icon>
              <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>

    <AppBaseDialogConfirmation id="sales-order-cash-drawer-dialog-confirmation" />
  </section>
</template>
