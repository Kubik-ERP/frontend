<script setup lang="ts">
// Composables
import { useRbac } from '@/app/composables/useRbac';

// Interfaces
import type { IPurchaseOrderListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const popovers = ref<Record<string, any>>({});
const searchValue = ref('');

/**
 * @description RBAC permissions
 */
const rbac = useRbac();
const canCreatePurchaseOrder = rbac.canCreate('purchaseOrder');
const canUpdatePurchaseOrder = rbac.canUpdate('purchaseOrder');

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderList_columns,
  purchaseOrderList_getClassOfStatus,
  purchaseOrderList_onShowButtonCancelPO,
  purchaseOrderList_onShowButtonDeliveryOrderDocument,
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
    :data="purchaseOrderList_values"
    header-title="Purhcase Order List"
    :is-using-btn-cta-create="canCreatePurchaseOrder"
    is-using-custom-body
    :is-using-filter="false"
    is-using-search-on-header
    is-using-server-side-pagination
    search-placeholder="Search by Member PO Number"
    @click-btn-cta-create="$router.push({ name: 'purchase-order.create' })"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'orderStatus'">
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

      <template v-else-if="column.value === 'staffName'">
        <span class="font-normal text-sm text-text-primary">
          {{ data.employees.name }}
        </span>
      </template>

      <template v-else-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="(event: Event) => popovers[`popover-${data.poNumber}`]?.toggle(event)"
        >
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          :ref="
            (el: any) => {
              if (el) popovers[`popover-${data.poNumber}`] = el;
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
              @click="$router.push({ name: 'purchase-order.detail', params: { id: data.poNumber } })"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">PO Details</span>
                </section>
              </template>
            </PrimeVueButton>

            <PrimeVueButton
              v-if="
                canUpdatePurchaseOrder && purchaseOrderList_onShowButtonDeliveryOrderDocument(data.orderStatus)
              "
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

            <PrimeVueButton
              v-if="canUpdatePurchaseOrder && purchaseOrderList_onShowButtonCancelPO(data.orderStatus)"
              class="w-full px-4 py-3"
              variant="text"
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
