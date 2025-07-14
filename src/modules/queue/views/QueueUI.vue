<script setup lang="ts">
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';
import { useQueueService } from '../services/queue.service';
// const {
//   dailySalesList_getClassOfOrderType,
//   dailySalesList_getClassOfPaymentStatus,
//   dailySalesList_isLoading,
//   dailySalesList_onChangePage,
//   dailySales_handleOnSortChange,
//   dailySalesList_queryParams,
//   dailySalesList_typesOfOrderType,
//   dailySalesList_typesOfPaymentStatus,
//   dailySalesList_values,
//   dailySalesList_fetchListInvoices,
// } = useDailySalesListService();

const {
  queueColumns,
  orderStatusList,
  orderTypeList,
  orderStatusClass,
  orderTypeClass,
  calculateDeltaHHMMSS,
  changeOrderStatus,

  dailySalesList_isLoading,
  dailySalesList_onChangePage,
  dailySales_handleOnSortChange,
  dailySalesList_queryParams,

  dailySalesList_values,

  dailySalesList_fetchListInvoices,
} = useQueueService();

const onOrderStatusChange = async (id: string, orderStatus: string) => {
  await changeOrderStatus(id, orderStatus);
};

onMounted(async () => {
  await dailySalesList_fetchListInvoices();
});
</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-2 items-center">
      <router-link :to="{ name: 'customer-waiting-list' }">
        <PrimeVueButton class="w-fit" label="Customer Waiting List System">
          <template #icon>
            <AppBaseSvg name="display" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </router-link>
      <router-link to="/kds">
        <PrimeVueButton class="w-fit" label="Kitchen Display System">
          <template #icon>
            <AppBaseSvg name="display" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </router-link>
    </div>

    <section id="daily-sales" class="flex flex-col relative inset-0 z-0">
      <!-- {{ dailySalesList_values }} -->
      <AppBaseDataTable
        btn-cta-create-title="Add Cash In/Out"
        :columns="queueColumns"
        :data="dailySalesList_values.data.items"
        header-title="Daily Sales"
        :rows-per-page="dailySalesList_values.data.meta.pageSize"
        :total-records="dailySalesList_values.data.meta.total"
        :first="(dailySalesList_values.data.meta.page - 1) * dailySalesList_values.data.meta.pageSize"
        :is-loading="dailySalesList_isLoading"
        :sort-field="dailySalesList_queryParams.orderBy"
        :sort-order="dailySalesList_queryParams.orderDirection"
        is-using-server-side-pagination
        is-using-custom-body
        is-using-custom-filter
        is-using-custom-header-prefix
        is-using-custom-header-suffix
        is-using-header
        @update:currentPage="dailySalesList_onChangePage"
        @update:sort="dailySales_handleOnSortChange"
      >
        <template #header-prefix>
          <div class="flex items-center gap-2">
            <h6 class="font-semibold text-gray-900 text-xl">Daily Sales</h6>

            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-green-primary"
              :label="`${dailySalesList_values.data.meta.total} Invoices`"
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
              v-model="dailySalesList_queryParams.invoiceNumber"
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
                v-model="dailySalesList_queryParams.createdAtFrom"
                class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
                placeholder="Purchase Date From"
                show-on-focus
                show-icon
                fluid
                show-time
                show-button-bar
                hour-format="24"
                @clear-click="dailySalesList_queryParams.createdAtFrom = null"
              />

              <PrimeVueDatePicker
                v-model="dailySalesList_queryParams.createdAtTo"
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
                :disabled="!dailySalesList_queryParams.createdAtFrom"
                @clear-click="dailySalesList_queryParams.createdAtTo = null"
              />

              <PrimeVueMultiSelect
                v-model="dailySalesList_queryParams.orderType"
                display="chip"
                :options="orderTypeList"
                option-label="label"
                option-value="value"
                filter
                placeholder="Order Type"
                class="text-sm text-text-disabled w-full"
              />

              <PrimeVueMultiSelect
                v-model="dailySalesList_queryParams.orderStatus"
                display="chip"
                :options="orderStatusList"
                option-label="label"
                option-value="value"
                filter
                placeholder="Order Status"
                class="text-sm text-text-disabled w-full"
              >
              </PrimeVueMultiSelect>
            </div>
          </div>
        </template>

        <template #body="{ column, data, index }">
          <template v-if="column.value === 'index'">
            <span class="font-normal text-sm text-text-primary">{{
              (dailySalesList_values.data.meta.page - 1) * dailySalesList_values.data.meta.pageSize + index + 1
            }}</span>
          </template>
          <template v-if="column.value === 'orderNumber'">
            <router-link :to="`/invoice/${data.id}`">
              <span class="font-normal text-sm text-primary">#{{ data[column.value] }}</span>
            </router-link>
          </template>

          <template v-else-if="column.value === 'createdAt'">
            <span class="font-normal text-sm text-text-primary">{{
              useFormatDate(new Date(data[column.value]))
            }}</span>
          </template>

          <template v-else-if="column.value === 'customer'">
            <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
          </template>

          <template v-else-if="column.value === 'grandTotal'">
            <span class="font-normal text-sm text-text-primary">{{ useCurrencyFormat(data[column.value]) }}</span>
          </template>

          <template v-else-if="column.value === 'orderType'">
            <PrimeVueChip
              :class="[orderTypeClass(data[column.value]), 'text-xs font-normal']"
              :label="useTitleCaseWithSpaces(data[column.value])"
            />
          </template>

          <template v-else-if="column.value === 'paymentStatus'">
            <PrimeVueChip
              :class="[orderStatusClass(data[column.value]), 'text-xs font-normal']"
              :label="useTitleCaseWithSpaces(data[column.value])"
            />
          </template>

          <template v-else-if="column.value === 'orderStatus'">
            <PrimeVueSelect
              v-model="data[column.value]"
              :options="orderStatusList"
              option-label="label"
              option-value="value"
              class="w-full"
              @change="onOrderStatusChange(data.id, data[column.value])"
            >
              <template #option="{ option }">
                <PrimeVueChip
                  :class="[orderStatusClass(option.value), 'text-xs font-semibold px-1.5 py-1']"
                  :label="useTitleCaseWithSpaces(option.value)"
                />
              </template>
              <template #value="{ value }">
                <PrimeVueChip
                  :class="[orderStatusClass(value), 'text-xs font-normal px-1.5 py-1']"
                  :label="useTitleCaseWithSpaces(value)"
                />
              </template>
              <template #dropdownicon>
                <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
              </template>
            </PrimeVueSelect>
          </template>

          <template v-else-if="column.value === 'duration'">
            <span v-if="data[column.value] !== null" class="font-normal text-sm text-text-primary">
              {{ calculateDeltaHHMMSS(data.createdAt, data.duration) }}
            </span>
            <span v-else class="font-normal text-sm text-text-disabled">N/A</span>
          </template>

          <template v-else>
            <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
          </template>
        </template>
      </AppBaseDataTable>
    </section>
  </div>
</template>
