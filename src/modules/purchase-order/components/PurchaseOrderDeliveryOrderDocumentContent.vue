<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderDeliveryOrderDocumentProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { purchaseOrderDeliveryOrderDocument_data, purchaseOrderDeliveryOrderDocument_listColumns } =
  inject<IPurchaseOrderDeliveryOrderDocumentProvided>('purchaseOrderDeliveryOrderDocument')!;
</script>

<template>
  <section id="purchase-order-delivery-order-document-content" class="default-wrapper gap-10">
    <header class="flex flex-col gap-2">
      <h1 class="font-bold text-4xl text-black">Delivery Order</h1>

      <h5 class="font-semibold text-base text-black">
        {{ purchaseOrderDeliveryOrderDocument_data?.orderNumber }}
      </h5>
    </header>

    <section id="delivery-order-information" class="grid grid-rows-2 grid-cols-12 gap-4">
      <section id="supplier" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Supplier</h6>

        <span class="font-normal text-base text-text-primary">
          {{ purchaseOrderDeliveryOrderDocument_data?.supplierInfo.supplierName }}
        </span>
      </section>

      <section id="order-date" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Order Date</h6>

        <span class="font-normal text-base text-text-primary">
          <template v-if="purchaseOrderDeliveryOrderDocument_data?.orderDate">
            {{
              useFormatDate((purchaseOrderDeliveryOrderDocument_data?.orderDate ?? '').toString(), 'dd/mm/yyyy')
            }}
          </template>
        </span>
      </section>

      <section id="delivery-date" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Delivery Date</h6>

        <span class="font-normal text-base text-text-primary">
          <template v-if="purchaseOrderDeliveryOrderDocument_data?.deliveryDate">
            {{
              useFormatDate((purchaseOrderDeliveryOrderDocument_data?.deliveryDate ?? '').toString(), 'dd/mm/yyyy')
            }}
          </template>
        </span>
      </section>

      <section id="receiver" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Receiver</h6>

        <span class="font-normal text-base text-text-primary"> - </span>
      </section>

      <section id="delivery-address" class="col-span-6 lg:col-span-4 xl:col-span-3">
        <h6 class="font-normal text-sm text-grayscale-70">Delivery Address</h6>

        <span class="font-normal text-base text-text-primary"> - </span>
      </section>
    </section>

    <AppBaseDataTable
      :columns="purchaseOrderDeliveryOrderDocument_listColumns"
      :data="purchaseOrderDeliveryOrderDocument_data?.purchaseOrderItems"
      is-using-custom-body
      is-using-custom-header
      is-using-custom-footer
      :is-using-border-on-header="false"
      :is-using-pagination="false"
      :max-visible-rows="5"
    >
      <template #header>
        <header class="flex items-center justify-between">
          <h6 class="font-semibold text-lg text-primary">Items</h6>
        </header>
      </template>

      <template #body="{ column, data }">
        <template v-if="purchaseOrderDeliveryOrderDocument_data?.purchaseOrderItems.length === 0">
          <td :colspan="purchaseOrderDeliveryOrderDocument_listColumns.length" class="text-center py-8">
            <span class="font-normal text-sm text-gray-500">No order items</span>
          </td>
        </template>

        <template v-else>
          <template v-if="column.value === 'sku'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.itemInfo.sku }}
            </span>
          </template>

          <template v-else-if="column.value === 'name'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.itemInfo.name }}
            </span>
          </template>

          <template v-else-if="column.value === 'brandName'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.itemInfo.brandName }}
            </span>
          </template>

          <template v-else-if="column.value === 'unit'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.itemInfo.unit }}
            </span>
          </template>

          <template v-else-if="column.value === 'unitPrice' || column.value === 'totalPrice'">
            <span class="font-normal text-sm text-text-primary">
              {{
                useCurrencyFormat({
                  data: data[column.value],
                  hidePrefix: false,
                  addSuffix: false,
                })
              }}
            </span>
          </template>

          <template v-else>
            <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
          </template>
        </template>
      </template>

      <template #footer>
        <div class="flex items-center justify-end pe-44 pt-2">
          <div class="flex items-center gap-4">
            <span class="font-semibold text-base text-primary">Total Price</span>
            <span class="font-semibold text-base text-primary">
              {{
                useCurrencyFormat({
                  data: purchaseOrderDeliveryOrderDocument_data?.totalPrice ?? 0,
                  hidePrefix: false,
                  addSuffix: false,
                })
              }}
            </span>
          </div>
        </div>
      </template>
    </AppBaseDataTable>
  </section>
</template>
