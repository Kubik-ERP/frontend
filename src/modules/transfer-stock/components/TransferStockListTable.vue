<script setup lang="ts">
// Interfaces
import type { ITransferStockListProvided } from '../interfaces';

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
  transferStockList_columns,
  transferStockList_getClassOfStatus,
  transferStockList_getStoreName,
  transferStockList_getTotalItems,
  transferStockList_getTotalQty,
  transferStockList_getTotalValue,
  transferStockList_handleOnSortChange,
  transferStockList_isLoading,
  transferStockList_onChangePage,
  transferStockList_onShowButtonCancel,
  transferStockList_onShowButtonShippingDocument,
  transferStockList_onShowDialogCancel,
  transferStockList_queryParams,
  transferStockList_values,
} = inject('transferStockList') as ITransferStockListProvided;

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
    btn-cta-create-title="Create New Transfer"
    :columns="transferStockList_columns"
    :data="transferStockList_values?.items || []"
    header-title="Transfer Stock List"
    :is-using-btn-cta-create="true"
    is-using-custom-body
    :is-using-filter="false"
    is-using-search-on-header
    is-using-server-side-pagination
    is-using-pagination
    :is-loading="transferStockList_isLoading"
    :rows-per-page="transferStockList_values?.meta.pageSize || 10"
    :total-records="transferStockList_values?.meta.total || 0"
    :first="
      transferStockList_values?.meta
        ? (transferStockList_values.meta.page - 1) * transferStockList_values.meta.pageSize
        : 0
    "
    search-placeholder="Search by Transaction Code"
    :sort-field="transferStockList_queryParams.orderBy"
    :sort-order="
      transferStockList_queryParams.orderDirection === 'asc'
        ? 1
        : transferStockList_queryParams.orderDirection === 'desc'
          ? -1
          : 0
    "
    @click-btn-cta-create="$router.push({ name: 'transfer-stock.create' })"
    @update:currentPage="transferStockList_onChangePage"
    @update:sort="transferStockList_handleOnSortChange"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'storeFrom' || column.value === 'storeTo'">
        <span class="font-normal text-sm text-text-primary">
          {{ transferStockList_getStoreName(data[column.value]) }}
        </span>
      </template>

      <template v-else-if="column.value === 'status'">
        <PrimeVueChip
          :class="[transferStockList_getClassOfStatus(data[column.value]), 'text-xs font-normal']"
          :label="
            data[column.value]
              ? data[column.value]
                  .toLowerCase()
                  .split('_')
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')
              : ''
          "
        />
      </template>

      <template v-else-if="column.value === 'totalItems'">
        <span class="font-normal text-sm text-text-primary">
          {{ transferStockList_getTotalItems(data.transferStockItems || []) }}
        </span>
      </template>

      <template v-else-if="column.value === 'totalQty'">
        <span class="font-normal text-sm text-text-primary">
          {{ transferStockList_getTotalQty(data.transferStockItems || []) }}
        </span>
      </template>

      <template v-else-if="column.value === 'totalValue'">
        <span class="font-normal text-sm text-text-primary">
          {{
            useCurrencyFormat({
              data: transferStockList_getTotalValue(data.transferStockItems || []),
            })
          }}
        </span>
      </template>

      <template v-else-if="column.value === 'draftedAt' || column.value === 'shippedAt' || column.value === 'receivedAt'">
        <template v-if="data[column.value]">
          <span class="font-normal text-sm text-text-primary">
            {{ useFormatDate(data[column.value], 'dd/mm/yyyy') }}
          </span>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-grayscale-70">-</span>
        </template>
      </template>

      <template v-else-if="column.value === 'transactionCode'">
        <span class="font-medium text-sm text-text-primary">
          {{ data[column.value] || '-' }}
        </span>
      </template>

      <template v-else-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="(event: Event) => togglePopover(data.transactionCode, event)"
        >
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          :ref="
            (el: unknown) => {
              if (el) popovers[`popover-${data.transactionCode}`] = el;
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
              @click="$router.push({ name: 'transfer-stock.detail', params: { id: data.id } })"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Transfer Details</span>
                </section>
              </template>
            </PrimeVueButton>

            <!-- Edit Transfer (Only for draft/drafted status) -->
            <PrimeVueButton
              v-if="['draft', 'drafted'].includes(data.status?.toLowerCase())"
              class="w-full px-4 py-3"
              variant="text"
              @click="$router.push({ name: 'transfer-stock.edit', params: { id: data.id } })"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Edit Transfer</span>
                </section>
              </template>
            </PrimeVueButton>

            <!-- Shipping Document (Only for shipped/received/closed status) -->
            <router-link
              v-if="transferStockList_onShowButtonShippingDocument(data.status)"
              :to="{ name: 'transfer-stock.shipping-document', params: { id: data.id } }"
              target="_blank"
            >
              <PrimeVueButton
                v-if="transferStockList_onShowButtonShippingDocument(data.status)"
                class="w-full px-4 py-3"
                variant="text"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="document" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Shipping Document</span>
                  </section>
                </template>
              </PrimeVueButton>
            </router-link>

            <!-- Cancel Transfer (Only for draft/approved status) -->
            <PrimeVueButton
              v-if="transferStockList_onShowButtonCancel(data.status)"
              class="w-full px-4 py-3"
              variant="text"
              @click="transferStockList_onShowDialogCancel(data.id)"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="close-red" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Cancel Transfer</span>
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