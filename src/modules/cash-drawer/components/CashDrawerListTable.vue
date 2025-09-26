<script setup lang="ts">
// Interfaces
import type { ICashDrawerListProvided } from '../interfaces/cash-drawer-list.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  cashDrawerList_columns,
  cashDrawerList_isLoading,
  cashDrawerList_getClassOfStatus,
  cashDrawerList_onChangePage,
  cashDrawerList_values,
  cashDrawerList_getButtonTitle,
  cashDrawerList_onClickMainButton,
  cashDrawerList_hasOpenCashDrawerToday,
} = inject('cashDrawerList') as ICashDrawerListProvided;
</script>

<template>
  <AppBaseDataTable
    :btn-cta-create-title="cashDrawerList_getButtonTitle"
    :btn-cta-create-variant="cashDrawerList_hasOpenCashDrawerToday ? 'danger' : 'default'"
    :btn-cta-create-icon="cashDrawerList_hasOpenCashDrawerToday ? 'close-circle' : 'plus-line-white'"
    :columns="cashDrawerList_columns"
    :data="cashDrawerList_values?.items"
    header-title="Cash Drawer"
    is-using-btn-cta-create
    is-using-custom-body
    :is-loading="cashDrawerList_isLoading"
    :rows-per-page="cashDrawerList_values?.meta?.perPage"
    :total-records="cashDrawerList_values?.meta?.total"
    :first="
      (Number(cashDrawerList_values?.meta?.currentPage ?? 1) - 1) *
      Number(cashDrawerList_values?.meta?.perPage ?? 0)
    "
    is-using-server-side-pagination
    @click-btn-cta-create="cashDrawerList_onClickMainButton"
    @update:currentPage="cashDrawerList_onChangePage"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'expectedBalance' || column.value === 'actualBalance'">
        <span class="font-normal text-sm text-text-primary">
          {{
            useCurrencyFormat({
              data: data[column.value],
              hidePrefix: true,
              addSuffix: true,
            })
          }}
        </span>
      </template>

      <template v-else-if="column.value === 'staffName'">
        <span class="font-normal text-sm text-text-primary">
          {{ data.employees.name }}
        </span>
      </template>

      <template v-else-if="column.value === 'status'">
        <PrimeVueChip
          :class="[cashDrawerList_getClassOfStatus(data[column.value]), 'text-xs font-normal']"
          :label="
            data[column.value] ? data[column.value].charAt(0).toUpperCase() + data[column.value].slice(1) : ''
          "
        />
      </template>

      <template v-else-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="$router.push({ name: 'cash-drawer.cash-register', params: { id: data.id } })"
        >
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
</template>
