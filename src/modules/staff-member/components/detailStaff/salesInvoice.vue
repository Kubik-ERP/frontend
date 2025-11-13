<script setup lang="ts">
// Services
import { useStaffMemberDetailService } from '../../services/staff-member-detail.service';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

const {
  salesInvoice_columns,
  salesInvoice_paymentStatus,
  salesInvoice_orderType,
  staffMemberDetails_isLoading,
  staffMemberDetails_queryParams,
  staffMemberDetails_onChangePage,
  staffMemberDetails,
<<<<<<< HEAD
=======
  orderStatusClass,
  orderTypeClass,
>>>>>>> 886f121ce2c49cc924e369fbf97bde7174f18d98
} = useStaffMemberDetailService();

/**
 * @description Injected variables
 */
const outletStore = useOutletStore();
const { outlet_currentOutlet } = storeToRefs(outletStore);
</script>

<template>
  <section id="staff-daily-sales" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="salesInvoice_columns"
      :data="staffMemberDetails.invoices?.data"
      :rows-per-page="staffMemberDetails.invoices?.meta.pageSize"
      :total-records="staffMemberDetails.invoices?.meta.totalData"
      :first="(staffMemberDetails_queryParams.page - 1) * (staffMemberDetails.invoices?.meta.pageSize ?? 0)"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-filter
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-header
      :is-loading="staffMemberDetails_isLoading"
      @update:currentPage="staffMemberDetails_onChangePage"
    >
      <template #header>
        <section class="border border-solid border-grayscale-20 rounded-t-md">
          <section class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h6 class="font-semibold text-black text-xl">Daily Sales</h6>
              <PrimeVueChip
                class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-1"
                :label="`${staffMemberDetails.invoices?.meta.totalData || 0} Invoices`"
              />
            </div>
            <form>
              <PrimeVueIconField>
                <PrimeVueInputIcon>
                  <template #default>
                    <AppBaseSvg name="search" class="!w-4 !h-4" />
                  </template>
                </PrimeVueInputIcon>

                <PrimeVueInputText
                  v-model="staffMemberDetails_queryParams.search"
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
                      <p class="font-bold">{{ staffMemberDetails.invoices?.meta.totalData || 0 }}</p>
                      <p class="font-semibold">Sales</p>
                    </span>
                  </PrimeVueChip>
                </div>
                <div class="flex items-center justify-end">
                  <span class="font-bold text-primary text-2xl">{{
                    useCurrencyFormat({ data: staffMemberDetails.paid ?? 0 })
                  }}</span>
                </div>
              </div>
            </div>
            <div class="w-full bg-error-background border border-error-main rounded-lg p-4">
              <div class="flex flex-col justify-between w-full gap-4">
                <div class="flex items-center gap-2 min-h-8">
                  <h6 class="font-semibold text-black text-sm">Unpaid Amount</h6>
                </div>
                <div class="flex items-center justify-end">
                  <span class="font-bold text-error-main text-2xl">{{
                    useCurrencyFormat({ data: staffMemberDetails.unpaid ?? 0 })
                  }}</span>
                </div>
              </div>
            </div>
          </section>
          <section class="flex items-center gap-4 p-4">
            <div class="flex flex-col gap-1 w-full">
              <span class="font-semibold inline-block text-gray-900 text-base w-48">Filter by</span>
              <div class="flex items-center gap-4 w-full">
                <PrimeVueDatePicker
                  v-model="staffMemberDetails_queryParams.start_date"
                  class="text-sm text-text-disabled placeholder:text-sm placeholder:text-text-disabled w-full max-w-80"
                  placeholder="Purchase Date From"
                  show-on-focus
                  show-icon
                  fluid
                  show-time
                  show-button-bar
                  hour-format="24"
                  @clear-click="staffMemberDetails_queryParams.start_date = null"
                />

                <PrimeVueDatePicker
                  v-model="staffMemberDetails_queryParams.end_date"
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
                  :disabled="!staffMemberDetails_queryParams.start_date"
                  @clear-click="staffMemberDetails_queryParams.end_date = null"
                />
                <PrimeVueMultiSelect
                  v-model="staffMemberDetails_queryParams.order_type"
                  display="chip"
                  :options="salesInvoice_paymentStatus"
                  option-label="label"
                  option-value="value"
                  filter
                  placeholder="Payment Status"
                  class="text-sm text-text-disabled w-full"
                />

                <PrimeVueMultiSelect
                  v-if="outlet_currentOutlet?.businessType !== 'Retail'"
                  v-model="staffMemberDetails_queryParams.payment_status"
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
        </section>
      </template>

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
          <span>{{
            useCurrencyFormat({
              data: data.grandTotal,
            })
          }}</span>
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
          <router-link :to="`/invoice/${data.id}`">
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
