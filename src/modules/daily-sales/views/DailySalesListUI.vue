<script setup lang="ts">
// Services
import { useDailySalesListService } from '../services/daily-sales-list.service';
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';

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
  dailySalesList_isUserHasPermissionForManageStaff,
  dailySalesList_onChangePage,
  dailySales_handleOnSortChange,
  dailySalesList_queryParams,
  dailySalesList_typesOfOrderStatus,
  dailySalesList_typesOfOrderType,
  dailySalesList_typesOfPaymentStatus,
  dailySalesList_values,
} = useDailySalesListService(outlet_currentOutlet.value?.businessType);

const { staffMemberList_dropdownItemStaffUsingUserId } = useStaffMemberListService();

/**
 * @description Use actual invoice data instead of mock data
 */
const dailySalesDataWithItems = computed(() => {
  return dailySalesList_values.data.items.map(invoice => ({
    ...invoice,
    items: invoice.invoiceDetails || [],
  }));
});
</script>

<template>
  <section id="daily-sales" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Cash In/Out"
      :columns="dailySalesList_columns"
      :data="dailySalesDataWithItems"
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
      is-using-custom-table
      is-using-expandable-rows
      expandable-rows-field="invoiceDetails"
      expandable-rows-id-field="id"
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
        <div class="flex flex-col gap-1 w-full mt-4">
          <span class="hidden lg:inline-block font-semibold text-gray-900 text-base w-48">Filter by</span>

          <section id="filter" class="grid grid-rows-1 grid-cols-12 gap-4">
            <section id="createdAt" class="col-span-4">
              <PrimeVueDatePicker
                v-model="dailySalesList_queryParams.createdAtFrom"
                class="[&>input]:!text-sm text-text-disabled [&>input]:placeholder:!text-sm placeholder:text-text-disabled w-full max-w-full"
                placeholder="Purchase Date From"
                show-on-focus
                show-icon
                fluid
                show-time
                show-button-bar
                hour-format="24"
                :pt="{
                  pcInputText: '!text-sm',
                  dayCell: '!text-sm',
                  title: '!text-sm',
                  tableHeaderCell: '!text-sm',
                }"
                @clear-click="dailySalesList_queryParams.createdAtFrom = null"
              />
            </section>

            <section id="createdTo" class="col-span-4">
              <PrimeVueDatePicker
                v-model="dailySalesList_queryParams.createdAtTo"
                class="[&>input]:!text-sm text-text-disabled [&>input]:placeholder:!text-sm placeholder:text-text-disabled w-full max-w-full"
                placeholder="Purchase Date To"
                show-on-focus
                show-icon
                fluid
                show-time
                show-button-bar
                hour-format="24"
                :pt="{
                  pcInputText: '!text-sm',
                  dayCell: '!text-sm',
                  title: '!text-sm',
                  tableHeaderCell: '!text-sm',
                }"
                @clear-click="dailySalesList_queryParams.createdAtTo = null"
              />
            </section>

            <section v-if="outlet_currentOutlet?.businessType !== 'Retail'" id="order-type" class="col-span-4">
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

            <section id="staff" class="col-span-4">
              <PrimeVueSelect
                v-if="dailySalesList_isUserHasPermissionForManageStaff"
                id="staff"
                v-model="dailySalesList_queryParams.staffId"
                filter
                :options="staffMemberList_dropdownItemStaffUsingUserId"
                option-label="label"
                option-value="value"
                placeholder="Select Staff"
                class="text-sm text-text-primary w-full"
              />
            </section>

            <section id="payment-status" class="col-span-4">
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

            <section id="payment-status" class="col-span-4">
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

      <template #body="{ column, data, isExpandable, isExpanded, toggleExpansion }">
        <template v-if="column.value === 'expand'">
          <div class="flex justify-center">
            <PrimeVueButton v-if="isExpandable" variant="text" size="small" @click="toggleExpansion">
              <template #icon>
                <AppBaseSvg :name="isExpanded ? 'chevron-up' : 'chevron-down'" class="!w-4 !h-4" />
              </template>
            </PrimeVueButton>
          </div>
        </template>

        <template v-else-if="column.value === 'createdAt'">
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
          <span class="font-normal text-sm text-text-primary">{{ data[column.value]?.name ?? '-' }}</span>
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

        <template v-else-if="column.value === 'paymentMethod'">
          <span class="font-normal text-sm text-text-primary">{{
            data.paymentMethods ? data.paymentMethods.name : '-'
          }}</span>
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

        <template v-else-if="column.value === 'servedBy'">
          <span class="font-normal text-sm text-text-primary">{{ data.users ? data.users.fullname : '-' }}</span>
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
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
        </template>
      </template>

      <!-- Expanded Rows for Item Details -->
      <template #expanded-body="{ data }">
        <td :colspan="dailySalesList_columns.length" class="px-0 py-0">
          <div class="bg-gray-50 border-l-4 border-blue-200 p-4">
            <h4 class="font-semibold text-sm text-gray-800 mb-3">Order Items</h4>
            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-100">
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Product</th>
                    <th class="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase">Qty</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">Product Price</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">Variant Price</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">
                      Product Discount
                    </th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Variant</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase">Notes</th>
                    <th class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="invoiceDetail in data.invoiceDetails"
                    :key="invoiceDetail.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-3 py-2">
                      <div class="flex flex-col">
                        <span class="font-normal text-sm text-gray-700">{{ invoiceDetail.products.name }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2 text-center">
                      <span class="font-normal text-sm text-gray-700">{{ invoiceDetail.qty }}</span>
                    </td>
                    <td class="px-3 py-2 text-right">
                      <span class="font-normal text-sm text-gray-700">{{
                        useCurrencyFormat({ data: invoiceDetail.productPrice })
                      }}</span>
                    </td>
                    <td class="px-3 py-2 text-right">
                      <span class="font-normal text-sm text-gray-700">{{
                        useCurrencyFormat({ data: invoiceDetail?.variant?.price ?? 0 })
                      }}</span>
                    </td>
                    <td class="px-3 py-2 text-right">
                      <span
                        class="font-normal text-sm text-gray-700"
                        :class="(invoiceDetail.products.discountPrice || 0) > 0 ? 'text-red-600' : ''"
                      >
                        {{ (invoiceDetail.products.discountPrice || 0) > 0 ? '-' : ''
                        }}{{ useCurrencyFormat({ data: invoiceDetail.products.discountPrice || 0 }) }}
                      </span>
                    </td>
                    <td class="px-3 py-2">
                      <div class="flex flex-col">
                        <span class="font-normal text-sm text-gray-700">{{ invoiceDetail?.variant?.name }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2">
                      <span class="font-normal text-sm text-gray-700">{{ invoiceDetail.notes || '-' }}</span>
                    </td>
                    <td class="px-3 py-2 text-right">
                      <span class="font-semibold text-sm text-gray-900">{{
                        useCurrencyFormat({
                          data:
                            (invoiceDetail.productPrice + (invoiceDetail?.variant?.price ?? 0)) *
                              invoiceDetail.qty -
                            (invoiceDetail.products.discountPrice || 0),
                        })
                      }}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </template>
    </AppBaseDataTable>
  </section>
</template>
