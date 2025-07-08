<script setup lang="ts">
// Services
import { useCustomerDetailService } from '../../services/customer-detail.service';

// Interfaces
import type { Iinvoice, ICustomerDetails } from '../../interfaces';

const {
  customerDetail_columns,
  salesInvoice_paymentStatus,
  salesInvoice_orderType,
  customerDetails_isLoading,
  customerDetails_fetchSalesInvoice,
  orderStatusClass,
  orderTypeClass,
  customerDetails_queryParams,
} = useCustomerDetailService();
/**
 * @description Destructure all the data and methods what we need
 */

const invoices = ref(inject('customerDetails').invoices as Iinvoice[]);
// console.log('🚀 ~ invoices:', invoices.value);

const customer = ref(inject('customerDetails').customer as ICustomerDetails);
// console.log('🚀 ~ customer:', customer);

const meta = ref(inject('customerDetails').meta);
// console.log('🚀 ~ meta:', meta);
const route = useRoute();
watch(
  () => customerDetails_queryParams,
  debounce(async () => {
    await customerDetails_fetchSalesInvoice(route.params.id as string);
  }, 500),
  {
    deep: true,
  },
);

</script>
<template>
  <section id="customer-daily-sales" class="flex flex-col relative inset-0 z-0">
    <!-- <AppBaseDataTable
      :columns="customerDetail_columns"
      :data="customerDetail_values"
      header-title="Daily Sales"
      :rows-per-page="dailySales_data.meta.pageSize"
      :total-records="dailySales_data.meta.total"
      :first="(dailySales_data.meta.page - 1) * dailySales_data.meta.pageSize"
      :is-loading="dailySales_data.isLoading"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-header
      @update:currentPage="dailySales_handleOnPageChange"
    > -->
    <!-- {{ meta }} -->
    <AppBaseDataTable
      :columns="customerDetail_columns"
      :data="invoices"
      :rows-per-page="meta.pageSize"
      :total-records="meta.totalData"
      :first="(meta.page - 1) * meta.pageSize"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-header
      :is-loading="customerDetails_isLoading"
    >
      <template #header>
        <section class="p-4 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h6 class="font-semibold text-black text-xl">Daily Sales</h6>
            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-1"
              :label="`${invoices.length} Invoices`"
            />
          </div>
          <form @submit.prevent="handleSearch">
            <PrimeVueIconField>
              <PrimeVueInputIcon>
                <template #default>
                  <AppBaseSvg name="search" />
                </template>
              </PrimeVueInputIcon>

              <PrimeVueInputText
                v-model="customerDetails_queryParams.search"
                placeholder="Search Invoice ID"
                class="text-sm w-full min-w-80"
              />
            </PrimeVueIconField>
          </form>
        </section>
        <section class="grid grid-cols-2 gap-4 p-4">
          <div class="w-full bg-primary-background border border-primary rounded-lg p-4">
            <div class="flex flex-col justify-between w-full gap-4">
              <div class="flex items-center gap-2 min-h-8">
                <h6 class="font-semibold text-black text-sm">Total Sales</h6>
                <PrimeVueChip
                  class="text-xs font-normal text-secondary-hover bg-secondary-background border border-secondary px-1.5 py-1"
                >
                  <span class="flex items-center gap-1">
                    <p class="font-bold">{{ invoices.length }}</p>
                    <p class="font-semibold">Sales</p>
                  </span>
                </PrimeVueChip>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-semibold text-disabled">Rp</span>
                <span class="font-bold text-primary text-2xl">{{ customer.paid }}</span>
              </div>
            </div>
          </div>
          <div class="w-full bg-error-background border border-error-main rounded-lg p-4">
            <div class="flex flex-col justify-between w-full gap-4">
              <div class="flex items-center gap-2 min-h-8">
                <h6 class="font-semibold text-black text-sm">Unpaid Amount</h6>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-semibold text-disabled">Rp</span>
                <span class="font-bold text-error-main text-2xl">{{ customer.unpaid }}</span>
              </div>
            </div>
          </div>
        </section>
        <section class="flex items-center gap-4 p-4">
          <div class="flex flex-col gap-1 w-full">
            <span class="font-semibold inline-block text-gray-900 text-base w-48">Filter by</span>
            {{ customerDetails_queryParams }}
            <div class="flex items-center gap-4 w-full">
              <PrimeVueDatePicker
                v-model="customerDetails_queryParams.date"
                class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
                placeholder="Real Time "
                show-on-focus
                show-icon
                fluid
              />
              <PrimeVueMultiSelect
                v-model="customerDetails_queryParams.orderType"
                display="chip"
                :options="salesInvoice_paymentStatus"
                option-label="label"
                option-value="value"
                filter
                placeholder="Payment Status"
                class="text-sm text-text-disabled w-full"
              />

              <PrimeVueMultiSelect
                v-model="customerDetails_queryParams.status"
                display="chip"
                :options="salesInvoice_orderType"
                option-label="label"
                option-value="value"
                filter
                placeholder="Order Status"
                class="text-sm text-text-disabled w-full"
              />
            </div>
          </div>
        </section>
      </template>

      <template #filter> </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'invoiceID'">
          <span class="font-semibold">{{ data.invoiceNumber }}</span>
        </template>

        <template v-if="column.value === 'purchaseDate'">
          <span>{{ useFormatDate(data.createdAt, 'dd/mm/yyyy') }}</span>
        </template>

        <template v-if="column.value === 'tableNumber'">
          <span>{{ data.tableCode }}</span>
        </template>

        <template v-if="column.value === 'totalPrice'">
          <span>{{ useCurrencyFormat(data.grandTotal) }}</span>
        </template>

        <template v-if="column.value === 'status'">
          <PrimeVueChip
            :class="[orderStatusClass(useCapitalize(data.paymentStatus)), 'text-xs font-normal px-1.5 py-1']"
            :label="useCapitalize(data.paymentStatus)"
          />
        </template>

        <template v-if="column.value === 'orderType'">
          <PrimeVueChip
            :class="[orderTypeClass(useTitleCaseWithSpaces(data.orderType)), 'text-xs font-normal px-1.5 py-1']"
            :label="useTitleCaseWithSpaces(data.orderType)"
          />
        </template>

        <template v-if="column.value === 'action'">
          <router-link :to="`/invoice/${data.invoiceNumber}`">
            <PrimeVueButton variant="text" rounded aria-label="Filter">
              <template #icon>
                <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
              </template>
            </PrimeVueButton>
          </router-link>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
