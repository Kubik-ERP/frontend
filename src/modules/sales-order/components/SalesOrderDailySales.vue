<script setup lang="ts">
// Services
import { useDailySalesService } from '../services/daily-sales.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  dailySales_getClassOfOrderStatus,
  dailySales_getClassOfOrderType,
  dailySales_getClassOfPaymentStatus,
  dailySales_handleOnPageChange,
  dailySales_handleOnSortChange,

  dailySales_listColumns,
  dailySales_listTypesOfOrderStatus,
  dailySales_listTypesOfOrderType,
  dailySales_listTypesOfPaymentStatus,
  dailySales_data,
} = useDailySalesService();
</script>

<template>
  <section id="sales-order-daily-sales" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      header-title="Daily Sales"
      :columns="dailySales_listColumns"
      :data="dailySales_data.items"
      :rows-per-page="dailySales_data.meta.pageSize"
      :total-records="dailySales_data.meta.total"
      :first="(dailySales_data.meta.page - 1) * dailySales_data.meta.pageSize"
      :is-loading="dailySales_data.isLoading"
      :sort-field="dailySales_data.sorting.orderBy"
      :sort-order="dailySales_data.sorting.orderDirection"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-header
      @update:currentPage="dailySales_handleOnPageChange"
      @update:sort="dailySales_handleOnSortChange"
    >
      <template #header-prefix>
        <div class="flex items-center gap-2">
          <h6 class="font-semibold text-gray-900 text-xl">Daily Sales</h6>

          <PrimeVueChip
            class="text-xs font-normal bg-secondary-background text-green-primary"
            :label="`${dailySales_data.meta.total} Invoices`"
          />
        </div>
      </template>

      <template #header-suffix>
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="search" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="dailySales_data.filter.invoiceNumber"
            placeholder="Search Invoice ID"
            class="text-sm w-full min-w-80"
          />
        </PrimeVueIconField>
      </template>

      <template #filter>
        <div class="flex flex-col gap-1 w-full">
          <span class="font-semibold inline-block text-gray-900 text-base w-48">Filter by</span>

          <div class="flex items-center gap-4 w-full">
            <PrimeVueDatePicker
              v-model="dailySales_data.filter.createdAtFrom"
              :manual-input="false"
              class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
              placeholder="Purchase Date From"
              show-on-focus
              show-icon
              fluid
              show-time
              show-button-bar
              hour-format="24"
              @clear-click="dailySales_data.filter.createdAtFrom = null"
            />

            <PrimeVueDatePicker
              v-model="dailySales_data.filter.createdAtTo"
              :manual-input="false"
              class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
              placeholder="Purchase Date To"
              show-on-focus
              show-icon
              fluid
              show-time
              show-button-bar
              show-clear
              hour-format="24"
              :disabled="!dailySales_data.filter.createdAtFrom"
              @clear-click="dailySales_data.filter.createdAtTo = null"
            />

            <PrimeVueMultiSelect
              v-model="dailySales_data.filter.orderType"
              display="chip"
              :options="dailySales_listTypesOfOrderType"
              option-label="label"
              option-value="value"
              filter
              placeholder="Order Type"
              class="text-sm text-text-disabled w-full"
            />

            <PrimeVueMultiSelect
              v-model="dailySales_data.filter.paymentStatus"
              display="chip"
              :options="dailySales_listTypesOfPaymentStatus"
              option-label="label"
              option-value="value"
              filter
              show-clear
              placeholder="Payment Status"
              class="text-sm text-text-disabled w-full"
            />

            <PrimeVueMultiSelect
              v-model="dailySales_data.filter.orderStatus"
              display="chip"
              :options="dailySales_listTypesOfOrderStatus"
              option-label="label"
              option-value="value"
              filter
              placeholder="Order Status"
              class="text-sm text-text-disabled w-full"
            />
          </div>
        </div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'createdAt'">
          <span class="font-normal text-sm text-text-primary">{{
            useFormatDate(new Date(data[column.value]))
          }}</span>
        </template>

        <template v-else-if="column.value === 'customer'">
          <span class="font-normal text-sm text-text-primary">{{ data[column.value].name }}</span>
        </template>

        <template v-else-if="column.value === 'grandTotal'">
          <span class="font-normal text-sm text-text-primary">{{ useCurrencyFormat(data[column.value]) }}</span>
        </template>

        <template v-else-if="column.value === 'orderType'">
          <PrimeVueChip
            :class="[dailySales_getClassOfOrderType(data[column.value]), 'text-xs font-normal']"
            :label="dailySales_listTypesOfOrderType.find(f => f.value === data[column.value])?.label || ''"
          />
        </template>

        <template v-else-if="column.value === 'paymentStatus'">
          <PrimeVueChip
            :class="[dailySales_getClassOfPaymentStatus(data[column.value]), 'text-xs font-normal']"
            :label="dailySales_listTypesOfPaymentStatus.find(f => f.value === data[column.value])?.label || ''"
          />
        </template>

        <template v-else-if="column.value === 'orderStatus'">
          <PrimeVueChip
            :class="[dailySales_getClassOfOrderStatus(data[column.value]), 'text-xs font-normal']"
            :label="dailySales_listTypesOfOrderStatus.find(f => f.value === data[column.value])?.label || ''"
          />
        </template>

        <template v-else-if="column.value === 'action'">
          <router-link :to="`/invoice/${data.id}`">
            <PrimeVueButton variant="text" rounded aria-label="Filter">
              <template #icon>
                <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>
          </router-link>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>