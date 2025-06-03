<script setup lang="ts">
// Services
import { useCashDrawerService } from '../services/cash-drawer.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  cashDrawer_formData,
  cashDrawer_formValidations,
  cashDrawer_getClassOfStatus,
  cashDrawer_listColumns,
  cashDrawer_listValues,
} = useCashDrawerService();

/**
 * @description Provide all the data and methods what we need
 */
provide('cashDrawer', {
  cashDrawer_formData,
  cashDrawer_formValidations,
  cashDrawer_listColumns,
  cashDrawer_listValues,
});
</script>

<template>
  <section id="sales-order-cash-drawer" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable btn-cta-create-title="Open Register" :columns="cashDrawer_listColumns"
      :data="cashDrawer_listValues" header-title="Cash Drawer" is-using-btn-cta-create is-using-custom-body>
      <template #body="{ column, data }">
        <template v-if="column.value === 'expectedBalance' || column.value === 'actualBalance'">
          <span class="font-normal text-sm text-text-primary">
            {{ useCurrencyFormat(data[column.value]) }}
          </span>
        </template>

        <template v-else-if="column.value === 'status'">
          <PrimeVueChip :class="[cashDrawer_getClassOfStatus(data[column.value]), 'text-xs font-normal']"
            :label="data[column.value]" />
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
