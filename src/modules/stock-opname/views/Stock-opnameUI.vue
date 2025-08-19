<script setup lang="ts">
import { useStockOpnameService } from '../services/stock-opname.service.ts';

const {
  // table
  stockOpnameRecordColumns,
  stockOpname_onChangePage,
  // store
  stockOpname_isLoading,
  // stockOpname_detail,
  stockOpname_lists,

  // params
  // stockOpname_queryParams,

  // API
  stockOpname_fetchList,
  statusClass,
  // stockOpname_fetchDetail,
} = useStockOpnameService();

onMounted(async () => {
  await stockOpname_fetchList();
});
</script>
<template>
  <!-- <pre>
    {{ stockOpname_lists }}
  </pre> -->
  <AppBaseDataTable
    :data="stockOpname_lists.items"
    :columns="stockOpnameRecordColumns"
    header-title="Stock Opname"
    :rows-per-page="10"
    :total-records="stockOpname_lists.meta.total"
    :first="(stockOpname_lists.meta.page - 1) * stockOpname_lists.meta.pageSize"
    is-using-server-side-pagination
    :is-using-filter="false"
    :is-loading="stockOpname_isLoading"
    is-using-custom-body
    is-using-custom-header-prefix
    is-using-custom-header-suffix
    @update:currentPage="stockOpname_onChangePage"
  >
    <template #header-prefix>
      <h1 class="font-bold text-2xl text-text-primary">Stock Opname Record</h1>
    </template>
    <template #header-suffix>
      <router-link :to="{ name: 'stock-opname.create', params: { id: 'new' } }">
        <PrimeVueButton class="w-fit" label="Issue Stock Opname">
          <template #icon>
            <AppBaseSvg name="plus-line-white" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </router-link>
    </template>
    <template #body="{ data, column, index }">
      <template v-if="column.value === 'index'">
        <span class="font-normal text-sm text-text-primary">{{ index + 1 }}</span>
      </template>
      <template v-else-if="column.value === 'issueDate'">
        <span class="font-normal text-sm text-text-primary">{{ useFormatDate(data.createdAt) }}</span>
      </template>
      <template v-else-if="column.value === 'lastUpdate'">
        <span class="font-normal text-sm text-text-primary">{{ useFormatDate(data.updatedAt) }}</span>
      </template>
      <template v-else-if="column.value === 'performedBy'">
        <span class="font-normal text-sm text-text-primary">{{ data.users.fullname }}</span>
      </template>
      <template v-else-if="column.value === 'status'">
        <PrimeVueChip
          :class="[statusClass(data.status), 'text-xs font-normal py-1 px-1.5 w-fit']"
          :label="useTitleCaseWithSpaces(data.status)"
        />
      </template>
      <template v-else-if="column.value === 'action'">
        <router-link :to="{ name: 'stock-opname.detail', params: { id: data.id } }">
          <PrimeVueButton variant="text" rounded aria-label="Actions">
            <template #icon>
              <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </router-link>
      </template>
      <template v-else>
        <span class="font-normal text-sm text-text-primary">
          {{ data[column.value] }}
        </span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
