<script setup lang="ts">
// Services
import { useDailySalesListService } from '../services/daily-sales-list.service';
import { useStaffMemberListService } from '@/modules/staff-member/services/staff-member-list.service';

// Interfaces
import type { IDailySalesInvoiceDetail } from '../interfaces';

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
    hasBundles: hasBundlingItems(invoice.invoiceDetails || []),
    bundleCount: getBundlingCount(invoice.invoiceDetails || []),
  }));
});

/**
 * @description Check if invoice has bundling items
 */
const hasBundlingItems = (invoiceDetails: IDailySalesInvoiceDetail[]): boolean => {
  return (
    invoiceDetails?.some(detail => detail.catalogBundling && detail.invoiceBundlingItems?.length > 0) || false
  );
};

/**
 * @description Get bundling count for display
 */
const getBundlingCount = (invoiceDetails: IDailySalesInvoiceDetail[]): number => {
  return (
    invoiceDetails?.reduce(
      (count, detail) => (detail.catalogBundling && detail.invoiceBundlingItems?.length > 0 ? count + 1 : count),
      0,
    ) ?? 0
  );
};
</script>

<template>
  <section id="daily-sales" class="flex flex-col relative inset-0 z-0 overflow-x-auto">
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

          <PrimeVueChip
            v-if="dailySalesDataWithItems.filter(invoice => invoice.hasBundles).length > 0"
            class="text-xs font-normal bg-blue-100 text-blue-700"
            :label="`${dailySalesDataWithItems.filter(invoice => invoice.hasBundles).length} with Bundles`"
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
            <div class="flex items-center gap-2">
              <span class="font-normal text-sm text-sky-600 cursor-pointer"> #{{ data[column.value] }} </span>
              <PrimeVueChip
                v-if="data.hasBundles"
                class="text-xs font-normal bg-blue-100 text-blue-700"
                label="Bundle"
              />
            </div>
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
              <table class="w-full" style="min-width: 600px">
                <thead>
                  <tr class="bg-gray-100">
                    <th
                      class="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-32"
                    >
                      Product
                    </th>
                    <th
                      class="px-3 py-2 text-center text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-16"
                    >
                      Qty
                    </th>
                    <th
                      class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-24"
                    >
                      Product Price
                    </th>
                    <th
                      class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-24"
                    >
                      Variant Price
                    </th>
                    <th
                      class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-28"
                    >
                      Product Discount
                    </th>
                    <th
                      class="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-24"
                    >
                      Variant
                    </th>
                    <th
                      class="px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-20"
                    >
                      Notes
                    </th>
                    <th
                      class="px-3 py-2 text-right text-xs font-medium text-gray-700 uppercase whitespace-nowrap min-w-24"
                    >
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr
                    v-for="invoiceDetail in data.invoiceDetails"
                    :key="invoiceDetail.id"
                    class="hover:bg-gray-50"
                  >
                    <td class="px-3 py-2 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="font-normal text-sm text-gray-700">
                          {{ invoiceDetail.products?.name ?? invoiceDetail.catalogBundling?.name }}
                        </span>
                        <span v-if="invoiceDetail.catalogBundling" class="text-xs text-blue-600 italic">
                          (Bundle)
                        </span>
                      </div>
                    </td>
                    <td class="px-3 py-2 text-center whitespace-nowrap">
                      <span class="font-normal text-sm text-gray-700">{{ invoiceDetail.qty }}</span>
                    </td>
                    <td class="px-3 py-2 text-right whitespace-nowrap">
                      <span class="font-normal text-sm text-gray-700">{{
                        useCurrencyFormat({ data: invoiceDetail.productPrice })
                      }}</span>
                    </td>
                    <td class="px-3 py-2 text-right whitespace-nowrap">
                      <span class="font-normal text-sm text-gray-700">{{
                        useCurrencyFormat({ data: invoiceDetail?.variant?.price ?? 0 })
                      }}</span>
                    </td>
                    <td class="px-3 py-2 text-right whitespace-nowrap">
                      <span
                        class="font-normal text-sm text-gray-700"
                        :class="(invoiceDetail.products?.discountPrice || 0) > 0 ? 'text-red-600' : ''"
                      >
                        {{ (invoiceDetail.products?.discountPrice || 0) > 0 ? '-' : ''
                        }}{{ useCurrencyFormat({ data: invoiceDetail.products?.discountPrice || 0 }) }}
                      </span>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap">
                      <div class="flex flex-col">
                        <span class="font-normal text-sm text-gray-700">{{ invoiceDetail?.variant?.name }}</span>
                      </div>
                    </td>
                    <td class="px-3 py-2 whitespace-nowrap">
                      <span class="font-normal text-sm text-gray-700">{{ invoiceDetail.notes || '-' }}</span>
                    </td>
                    <td class="px-3 py-2 text-right whitespace-nowrap">
                      <span class="font-semibold text-sm text-gray-900">{{
                        useCurrencyFormat({
                          data:
                            (invoiceDetail.productPrice + (invoiceDetail?.variant?.price ?? 0)) *
                              invoiceDetail.qty -
                            (invoiceDetail.products?.discountPrice || 0),
                        })
                      }}</span>
                    </td>
                  </tr>

                  <!-- Bundling Items Sub-rows -->
                  <template v-for="invoiceDetail in data.invoiceDetails" :key="`bundling-${invoiceDetail.id}`">
                    <template
                      v-if="invoiceDetail.catalogBundling && invoiceDetail.invoiceBundlingItems?.length > 0"
                    >
                      <tr class="bg-gradient-to-r from-blue-50 to-blue-25">
                        <td colspan="8" class="px-3 py-2">
                          <div class="flex items-center gap-2">
                            <span class="text-sm text-blue-600">📦</span>
                            <span class="text-xs font-semibold text-blue-700"
                              >Bundle Items ({{ invoiceDetail.invoiceBundlingItems.length }}):</span
                            >
                            <span class="text-xs text-blue-600 italic">{{
                              invoiceDetail.catalogBundling.name
                            }}</span>
                          </div>
                        </td>
                      </tr>
                      <tr
                        v-for="bundlingItem in invoiceDetail.invoiceBundlingItems"
                        :key="bundlingItem.id"
                        class="bg-blue-25 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <td class="px-6 py-2 whitespace-nowrap">
                          <div class="flex items-center gap-2">
                            <span class="text-sm text-blue-400">├─</span>
                            <span class="font-normal text-sm text-blue-800">
                              {{ bundlingItem.products?.name }}
                            </span>
                          </div>
                        </td>
                        <td class="px-3 py-2 text-center whitespace-nowrap">
                          <span class="font-medium text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded-full">{{
                            bundlingItem.qty
                          }}</span>
                        </td>
                        <td class="px-3 py-2 text-right whitespace-nowrap">
                          <span class="font-normal text-sm text-blue-700">{{
                            useCurrencyFormat({ data: bundlingItem.products?.price ?? 0 })
                          }}</span>
                        </td>
                        <td class="px-3 py-2 text-center whitespace-nowrap">
                          <span class="text-sm text-gray-400">-</span>
                        </td>
                        <td class="px-3 py-2 text-center whitespace-nowrap">
                          <span class="text-sm text-gray-400">-</span>
                        </td>
                        <td class="px-3 py-2 text-center whitespace-nowrap">
                          <span class="text-sm text-gray-400">-</span>
                        </td>
                        <td class="px-3 py-2 text-center whitespace-nowrap">
                          <span class="text-sm text-gray-400">-</span>
                        </td>
                        <td class="px-3 py-2 text-right whitespace-nowrap">
                          <span class="font-semibold text-sm text-blue-700 bg-blue-100 px-2 py-1 rounded">{{
                            useCurrencyFormat({
                              data: (bundlingItem.products?.price ?? 0) * bundlingItem.qty,
                            })
                          }}</span>
                        </td>
                      </tr>
                    </template>
                  </template>
                </tbody>
              </table>
            </div>
          </div>
        </td>
      </template>
    </AppBaseDataTable>
  </section>
</template>
