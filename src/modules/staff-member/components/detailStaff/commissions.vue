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

console.log('staffMember_commissions', staffMember_commissions.value);
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
          <div class="flex items-center gap-4 w-full">
            <span class="font-semibold inline-block text-gray-900 text-base">Filter by</span>
            <!-- <PrimeVueDatePicker
              v-model="commission_queryParams.startDate"
              class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
              placeholder="Start Date"
              show-on-focus
              show-icon
              fluid
              show-clear
              selection-mode="range"
              :hide-on-range-selection="true"
              @clear-click="commission_queryParams.startDate = null"
            /> -->
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
