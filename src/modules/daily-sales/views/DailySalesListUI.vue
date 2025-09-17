<script setup lang="ts">
// Services
import { useDailySalesListService } from '../services/daily-sales-list.service';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

/**
 * @description Injected variables
 */
const outletStore = useOutletStore();
const { outlet_currentOutlet } = storeToRefs(outletStore);

/**
 * @description Destructure all the data and methods what we need
 */
const {
  dailySalesList_columns,
  dailySalesList_getClassOfOrderStatus,
  dailySalesList_getClassOfOrderType,
  dailySalesList_getClassOfPaymentStatus,
  dailySalesList_isLoading,
  dailySalesList_onChangePage,
  dailySales_handleOnSortChange,
  dailySalesList_queryParams,
  dailySalesList_typesOfOrderStatus,
  dailySalesList_typesOfOrderType,
  dailySalesList_typesOfPaymentStatus,
  dailySalesList_values,
} = useDailySalesListService(outlet_currentOutlet.value?.businessType);
</script>

<template>
  <section id="daily-sales" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      :columns="dailySalesList_columns"
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
              <AppBaseSvg name="search" class="w-4 h-4" />
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
        <div class="flex flex-col gap-1 w-full mt-1">
          <span class="hidden lg:inline-block font-semibold text-gray-900 text-base w-48">Filter by</span>

          <section id="filter" class="grid grid-rows-1 grid-cols-10 gap-4">
            <section id="createdAt" class="col-span-2 lg:col-span-auto">
              <PrimeVueDatePicker
                v-model="dailySalesList_queryParams.createdAtFrom"
                class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-full lg:max-w-80"
                placeholder="Purchase Date From"
                show-on-focus
                show-icon
                fluid
                show-time
                show-button-bar
                hour-format="24"
                @clear-click="dailySalesList_queryParams.createdAtFrom = null"
              />
            </section>

            <section id="createdTo" class="col-span-2 lg:col-span-auto">
              <PrimeVueDatePicker
                v-model="dailySalesList_queryParams.createdAtTo"
                class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-full lg:max-w-80"
                placeholder="Purchase Date To"
                show-on-focus
                show-icon
                fluid
                show-time
                show-button-bar
                hour-format="24"
                @clear-click="dailySalesList_queryParams.createdAtTo = null"
              />
            </section>

            <section
              v-if="outlet_currentOutlet?.businessType !== 'Retail'"
              id="order-type"
              class="col-span-2 lg:col-span-auto"
            >
              <PrimeVueMultiSelect
                v-model="dailySalesList_queryParams.orderType"
                display="chip"
                :options="dailySalesList_typesOfOrderType"
                option-label="label"
                option-value="value"
                filter
                placeholder="Order Type"
                class="text-sm text-text-disabled w-full"
              />
            </section>

            <section id="payment-status" class="col-span-2 lg:col-span-auto">
              <PrimeVueMultiSelect
                v-model="dailySalesList_queryParams.paymentStatus"
                display="chip"
                :options="dailySalesList_typesOfPaymentStatus"
                option-label="label"
                option-value="value"
                filter
                show-clear
                placeholder="Payment Status"
                class="text-sm text-text-disabled w-full"
              />
            </section>

            <section id="payment-status" class="col-span-2 lg:col-span-auto">
              <PrimeVueMultiSelect
                v-model="dailySalesList_queryParams.orderStatus"
                display="chip"
                :options="dailySalesList_typesOfOrderStatus"
                option-label="label"
                option-value="value"
                filter
                placeholder="Order Status"
                class="text-sm text-text-disabled w-full"
              />
            </section>
          </section>
        </div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'createdAt'">
          <span class="font-normal text-sm text-text-primary">{{
            useFormatDate(new Date(data[column.value]))
          }}</span>
        </template>

        <template v-else-if="column.value === 'invoiceNumber'">
          <router-link :to="`/invoice/${data.id}`">
            <span class="font-normal text-sm text-sky-600 cursor-pointer"> #{{ data[column.value] }} </span>
          </router-link>
        </template>

        <template v-else-if="column.value === 'customer'">
          <span class="font-normal text-sm text-text-primary">{{ data[column.value].name }}</span>
        </template>

        <template v-else-if="column.value === 'grandTotal'">
          <span v-if="data[column.value]" class="font-normal text-sm text-text-primary">{{
            useCurrencyFormat({
              data: data[column.value],
            })
          }}</span>
          <span v-else class="font-normal text-sm text-text-primary">{{
            useCurrencyFormat({
              data:
                data['subtotal'] -
                (data['discountAmount'] || 0) +
                (data['serviceChargeAmount'] || 0) +
                (data['taxAmount'] || 0) -
                (data['voucherAmount'] || 0),
            })
          }}</span>
        </template>

        <template v-else-if="column.value === 'orderType'">
          <PrimeVueChip
            :class="[dailySalesList_getClassOfOrderType(data[column.value]), 'text-xs font-normal']"
            :label="
              dailySalesList_typesOfOrderType.find((f: IDropdownItem) => f.value === data[column.value])?.label ||
              ''
            "
          />
        </template>

        <template v-else-if="column.value === 'paymentStatus'">
          <PrimeVueChip
            :class="[dailySalesList_getClassOfPaymentStatus(data[column.value]), 'text-xs font-normal']"
            :label="
              dailySalesList_typesOfPaymentStatus.find((f: IDropdownItem) => f.value === data[column.value])
                ?.label || ''
            "
          />
        </template>

        <template v-else-if="column.value === 'orderStatus'">
          <template v-if="data[column.value]">
            <PrimeVueChip
              :class="[dailySalesList_getClassOfOrderStatus(data[column.value]), 'text-xs font-normal']"
              :label="
                dailySalesList_typesOfOrderStatus.find((f: IDropdownItem) => f.value === data[column.value])
                  ?.label || ''
              "
            />
          </template>

          <template v-else>
            <span class="font-normal text-sm text-text-primary">N/A</span>
          </template>
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
