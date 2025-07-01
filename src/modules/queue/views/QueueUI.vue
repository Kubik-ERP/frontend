<script setup lang="ts">
import { useQueueService } from '../services/queue.service';
const { queueColumns, OrderStatusList, OrderTypeList,queue_handleOnSortChange,queueList_onChangePage,queueValues, queueList_queryParams, queue_isLoading } = useQueueService();


const orderTypeClass = (orderType: string) => {
  switch (orderType) {
    case 'Dine In':
      return 'bg-primary-background text-primary';
    case 'Takeaway':
      return 'bg-secondary-background text-green-primary';
    case 'Self Order':
      return 'bg-error-background text-error-main';
    default:
      return '';
  }
};

const orderStatusClass = (orderStatus: string) => {
  switch (orderStatus) {
    case 'In Progress':
      return 'bg-primary-background text-primary';
    case 'Served':
      return 'bg-secondary-background text-green-primary';
    case 'Complete':
      return 'bg-secondary-background text-secondary';
    case 'Cancelled':
      return 'bg-error-background text-error-main';
    default:
      return '';
  }
};

</script>
<template>
  <div class="flex flex-col gap-8">
    <div class="flex gap-2 items-center">
      <router-link to="/customer-waiting-list">
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
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      :columns="queueColumns"
      :data="queueValues.data.items"
      header-title="Daily Sales"
      :rows-per-page="queueValues.data.meta.pageSize"
      :total-records="queueValues.data.meta.total"
      :first="(queueValues.data.meta.page - 1) * queueValues.data.meta.pageSize"
      :is-loading="queue_isLoading"
      :sort-field="queueList_queryParams.orderBy"
      :sort-order="queueList_queryParams.orderDirection"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-header
      @update:currentPage="queueList_onChangePage"
      @update:sort="queue_handleOnSortChange"
    >
      <template #header-prefix>
        <div class="flex items-center gap-2">
          <h6 class="font-semibold text-gray-900 text-xl">Daily Sales</h6>

          <PrimeVueChip
            class="text-xs font-normal bg-secondary-background text-green-primary"
            :label="`${queueValues.data.meta.total} Invoices`"
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
            v-model="queueList_queryParams.invoiceNumber"
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
              v-model="queueList_queryParams.createdAtFrom"
              class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
              placeholder="Purchase Date From"
              show-on-focus
              show-icon
              fluid
              show-time
              show-button-bar
              hour-format="24"
              @clear-click="queueList_queryParams.createdAtFrom = null"
            />

            <PrimeVueDatePicker
              v-model="queueList_queryParams.createdAtTo"
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
              :disabled="!queueList_queryParams.createdAtFrom"
              @clear-click="queueList_queryParams.createdAtTo = null"
            />

            <PrimeVueMultiSelect
              v-model="queueList_queryParams.orderType"
              display="chip"
              :options="OrderTypeList"
              option-label="label"
              option-value="value"
              filter
              placeholder="Order Type"
              class="text-sm text-text-disabled w-full"
            />

            <PrimeVueMultiSelect
              v-model="queueList_queryParams.orderStatus"
              display="chip"
              :options="OrderStatusList"
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
            :class="[orderTypeClass(data[column.value]), 'text-xs font-normal px-1.5 py-1']"
            :label="data[column.value]"
          />
        </template>

        <!-- <template v-else-if="column.value === 'paymentStatus'">
          <PrimeVueChip
            :class="[dailySalesList_getClassOfPaymentStatus(data[column.value]), 'text-xs font-normal']"
            :label="dailySalesList_typesOfPaymentStatus.find(f => f.value === data[column.value])?.label || ''"
          />
        </template> -->

        <template v-else-if="column.value === 'orderStatus'">
          <PrimeVueSelect
            v-model="data[column.value]"
            :options="OrderStatusList"
            option-label="label"
            option-value="value"
            class="w-full"
          >
            <template #option="{ option }">
              <PrimeVueChip
                :class="[orderStatusClass(option.label), 'text-xs font-semibold px-1.5 py-1']"
                :label="option.label"
              />
            </template>
            <template #value="{ value }">
              <PrimeVueChip :class="[orderStatusClass(value), 'text-xs font-normal px-1.5 py-1']" :label="value" />
            </template>
            <template #dropdownicon>
              <AppBaseSvg name="chevron-down" class="!w-5 !h-5" />
            </template>
          </PrimeVueSelect>
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
  </div>
</template>
