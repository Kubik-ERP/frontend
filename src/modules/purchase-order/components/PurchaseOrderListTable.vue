<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
// Use unknown type to avoid any, but allow method access
const popovers = ref<Record<string, unknown>>({});

// Helper function to toggle popover
const togglePopover = (id: string, event: Event) => {
  const popover = popovers.value[`popover-${id}`] as { toggle?: (event: Event) => void } | null;
  popover?.toggle?.(event);
};
const searchValue = ref('');

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderList_columns,
  purchaseOrderList_getClassOfStatus,
  purchaseOrderList_handleOnSortChange,
  purchaseOrderList_isLoading,
  purchaseOrderList_onChangePage,
  purchaseOrderList_onShowButtonCancelPO,
  purchaseOrderList_onShowButtonDeliveryOrderDocument,
  purchaseOrderList_onShowDialogCancel,
  purchaseOrderList_queryParams,
  purchaseOrderList_values,
} = inject('purchaseOrderList') as IPurchaseOrderListProvided;

/**
 * @description Watch search value changes
 */
watch(searchValue, newValue => {
  console.log('Search value changed:', newValue);
  // Here you can implement your search logic
  // For example, filter data, call API, etc.
});
</script>

<template>
  <AppBaseDataTable
    v-model:search-value="searchValue"
    btn-cta-create-title="Create New PO"
    :columns="purchaseOrderList_columns"
    :data="purchaseOrderList_values?.items || []"
    header-title="Purchase Order List"
    :is-using-btn-cta-create="true"
    is-using-custom-body
    :is-using-filter="false"
    is-using-search-on-header
    is-using-server-side-pagination
    is-using-pagination
    :is-loading="purchaseOrderList_isLoading"
    :rows-per-page="purchaseOrderList_values?.meta.pageSize || 10"
    :total-records="purchaseOrderList_values?.meta.total || 0"
    :first="
      purchaseOrderList_values?.meta
        ? (purchaseOrderList_values.meta.currentPage - 1) * purchaseOrderList_values.meta.pageSize
        : 0
    "
    search-placeholder="Search by Member PO Number"
    :sort-field="purchaseOrderList_queryParams.orderBy"
    :sort-order="
      purchaseOrderList_queryParams.orderDirection === 'asc'
        ? 1
        : purchaseOrderList_queryParams.orderDirection === 'desc'
          ? -1
          : 0
    "
    @click-btn-cta-create="$router.push({ name: 'purchase-order.create' })"
    @update:currentPage="purchaseOrderList_onChangePage"
    @update:sort="purchaseOrderList_handleOnSortChange"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'supplierName'">
        <span class="font-normal text-sm text-text-primary">
          {{ data.supplierInfo[column.value] }}
        </span>
      </template>

      <template v-else-if="column.value === 'orderStatus'">
        <PrimeVueChip
          :class="[purchaseOrderList_getClassOfStatus(data[column.value]), 'text-xs font-normal']"
          :label="
            data[column.value] ? data[column.value].charAt(0).toUpperCase() + data[column.value].slice(1) : ''
          "
        />
      </template>

      <template v-else-if="column.value === 'totalPrice'">
        <span class="font-normal text-sm text-text-primary">
          {{
            useCurrencyFormat({
              data: data[column.value],
            })
          }}
        </span>
      </template>

      <template v-else-if="column.value === 'orderDate' || column.value === 'deliveryDate'">
        <template v-if="data[column.value]">
          <span class="font-normal text-sm text-text-primary">
            {{ useFormatDate(data[column.value], 'dd/mm/yyyy') }}
          </span>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-grayscale-70">-</span>
        </template>
      </template>

      <template v-else-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="(event: Event) => togglePopover(data.orderNumber, event)"
        >
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          :ref="
            (el: unknown) => {
              if (el) popovers[`popover-${data.orderNumber}`] = el;
            }
          "
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="$router.push({ name: 'purchase-order.detail', params: { id: data.id } })"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">PO Details</span>
                </section>
              </template>
            </PrimeVueButton>

            <router-link
              v-if="purchaseOrderList_onShowButtonDeliveryOrderDocument(data.orderStatus)"
              :to="{ name: 'purchase-order.delivery-order-document', params: { id: data.id } }"
              target="_blank"
            >
              <PrimeVueButton
                v-if="purchaseOrderList_onShowButtonDeliveryOrderDocument(data.orderStatus)"
                class="w-full px-4 py-3"
                variant="text"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="document" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Delivery Order Document</span>
                  </section>
                </template>
              </PrimeVueButton>
            </router-link>

            <PrimeVueButton
              v-if="purchaseOrderList_onShowButtonCancelPO(data.orderStatus)"
              class="w-full px-4 py-3"
              variant="text"
              @click="purchaseOrderList_onShowDialogCancel(data.id)"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="close-red" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Cancel PO</span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </PrimeVuePopover>
      </template>

      <template v-else>
        <span class="font-normal text-sm text-grayscale-70">{{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
