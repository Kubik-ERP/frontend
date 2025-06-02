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
  dailySales_listColumns,
  dailySales_listTypesOfOrderStatus,
  dailySales_listTypesOfOrderType,
  dailySales_listTypesOfPaymentStatus,
  dailySales_listValues,
} = useDailySalesService();
</script>

<template>
  <section id="sales-order-daily-sales" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      :columns="dailySales_listColumns"
      :data="dailySales_listValues"
      header-title="Daily Sales"
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-header
    >
      <template #header-prefix>
        <div class="flex items-center gap-2">
          <h6 class="font-semibold text-gray-900 text-xl">Daily Sales</h6>

          <PrimeVueChip
            class="text-xs font-normal bg-secondary-background text-green-primary"
            label="100 Invoices"
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

          <PrimeVueInputText cll placeholder="Search Invoice ID" class="text-sm w-full min-w-80" />
        </PrimeVueIconField>
      </template>

      <template #filter>
        <div class="flex items-center gap-4 w-full">
          <span class="font-semibold inline-block text-gray-900 text-base w-48">Filter by</span>

          <PrimeVueDatePicker
            class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
            placeholder="Real Time "
            show-on-focus
            show-icon
            fluid
          />

          <PrimeVueMultiSelect
            display="chip"
            :options="dailySales_listTypesOfOrderType"
            option-label="label"
            option-value="value"
            filter
            placeholder="Order Type"
            class="text-sm text-text-disabled w-full"
          />

          <PrimeVueMultiSelect
            display="chip"
            :options="dailySales_listTypesOfPaymentStatus"
            option-label="label"
            option-value="value"
            filter
            placeholder="Payment Status"
            class="text-sm text-text-disabled w-full"
          />

          <PrimeVueMultiSelect
            display="chip"
            :options="dailySales_listTypesOfOrderStatus"
            option-label="label"
            option-value="value"
            filter
            placeholder="Order Status"
            class="text-sm text-text-disabled w-full"
          />
        </div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'orderType'">
          <PrimeVueChip
            :class="[dailySales_getClassOfOrderType(data[column.value]), 'text-xs font-normal']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'paymentStatus'">
          <PrimeVueChip
            :class="[dailySales_getClassOfPaymentStatus(data[column.value]), 'text-xs font-normal']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'orderStatus'">
          <PrimeVueChip
            :class="[dailySales_getClassOfOrderStatus(data[column.value]), 'text-xs font-normal']"
            :label="data[column.value]"
          />
        </template>

        <template v-else-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="Filter">
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
  </section>
</template>
