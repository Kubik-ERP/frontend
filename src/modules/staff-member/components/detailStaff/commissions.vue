<script setup lang="ts">
import { useStaffMemberDetailService } from '../../services/staff-member-detail.service';

const {
  commission_columns,
  commission_types,
  staffMemberDetails_isLoading,
  commission_queryParams,
  commission_onChangePage,
  commissionTypeClass,
  staffMember_commissions,
} = useStaffMemberDetailService();

const formatToDDMMYYYY = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const onDateRangeChange = (value: Date | Date[] | (Date | null)[] | null | undefined) => {
  if (Array.isArray(value) && value.length === 2 && value[0] && value[1]) {
    commission_queryParams.startDate = formatToDDMMYYYY(value[0]);
    commission_queryParams.endDate = formatToDDMMYYYY(value[1]);
  } else {
    commission_queryParams.startDate = null;
    commission_queryParams.endDate = null;
  }
};

// Optional: otomatis refetch ketika date berubah
watch(
  () => [commission_queryParams.startDate, commission_queryParams.endDate],
  () => {
    commission_onChangePage(1); // refresh data ke page 1
  }
);
</script>
<template>
  <section id="staff-member-commissions" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="commission_columns"
      :data="staffMember_commissions.data.items"
      :rows-per-page="staffMember_commissions.data.meta.pageSize"
      :total-records="staffMember_commissions.data.meta.total"
      :first="(commission_queryParams?.page - 1) * commission_queryParams?.pageSize"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-header
      is-using-custom-filter
      :is-loading="staffMemberDetails_isLoading"
      @update:currentPage="commission_onChangePage"
    >
      <template #header>
        <section class="flex flex-col items-center gap-2 py-4">
          <span class="font-semibold text-xl">Commissions</span>
        </section>

        <section class="p-4 border border-solid border-grayscale-10">
          <div class="flex flex-wrap items-center gap-4 w-full">
            <span class="font-semibold inline-block text-gray-900 text-base">Filter by</span>

            <!-- Filter by Date Range -->
            <PrimeVueDatePicker
              v-model="commission_queryParams.dateRange"
              selection-mode="range"
              show-icon
              show-clear
              date-format="dd/mm/yy"
              placeholder="Select date range"
              class="w-72 text-sm"
              @clear-click="commission_queryParams.startDate = null"
              @update:model-value="onDateRangeChange"
            />

            <!-- Filter by Commission Type -->
            <PrimeVueSelect
              v-model="commission_queryParams.sourceType"
              display="chip"
              :options="commission_types"
              option-label="label"
              option-value="value"
              filter
              placeholder="Commission Type"
              class="text-sm text-text-disabled w-64"
              show-clear
            />
          </div>
        </section>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'invoiceNumber'">
          <span class="font-normal text-sm text-text-primary">{{ data.invoiceNumber ?? '-' }}</span>
        </template>

        <template v-else-if="column.value === 'paidAt'">
          <span class="font-normal text-sm text-text-primary">{{
            data.paidAt ? useFormatDate(data.paidAt, 'dd/mm/yyyy') : '-'
          }}</span>
        </template>

        <template v-else-if="column.value === 'name'">
          <span class="font-normal text-sm text-text-primary">{{ data.name ?? '-' }}</span>
        </template>

        <template v-else-if="column.value === 'sourceType'">
          <PrimeVueChip
            :class="[commissionTypeClass(data[column.value]), 'text-xs px-1.5 py-1']"
            :label="useTitleCaseWithSpaces(data[column.value])"
          />
        </template>

        <template v-else-if="column.value === 'commissionAmount'">
          <span>{{ useCurrencyFormat({ data: data.commissionAmount }) }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
