<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderDetailProvided } from '../interfaces';

// Define extended interface for the component
interface IPurchaseOrderDetailExtended extends IPurchaseOrderDetailProvided {
  purchaseOrderDetail_onExportDeliveryOrderToPdf: () => void;
}

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderDetail_data,
  purchaseOrderDetail_listColumns,
  purchaseOrderDetail_getStatusClass,
  purchaseOrderDetail_onExportDeliveryOrderToPdf,
} = inject<IPurchaseOrderDetailExtended>('purchaseOrderDetail')!;
</script>

<template>
  <section id="purchase-order-detail-form" class="default-wrapper gap-10">
    <header class="border border-solid border-primary-border flex flex-col gap-5 p-6 rounded-lg">
      <div class="flex items-center justify-between h-fit">
        <h6 class="font-semibold text-text-primary text-lg">
          {{ purchaseOrderDetail_data?.orderNumber }}
        </h6>

        <router-link
          v-if="purchaseOrderDetail_data?.orderStatus.toUpperCase() !== 'CANCELLED'"
          id="edit-profile"
          :to="{ name: 'purchase-order.edit', params: { id: purchaseOrderDetail_data?.id } }"
          class="inline-flex items-center gap-2 basic-smooth-animation hover:bg-grayscale-10 max-h-10 p-4 rounded-lg"
        >
          <AppBaseSvg name="edit" class="w-4 h-4 filter-primary-color" />

          <span class="font-semibold text-primary text-sm">
            Edit PO Detail
          </span>
        </router-link>
      </div>

      <section id="content" class="flex flex-col gap-2">
        <span class="font-semibold text-primary text-sm"> Item Details </span>

        <div class="grid grid-rows-1 grid-cols-12 gap-4">
          <section id="supplier" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> Supplier </span>

            <span class="font-normal text-text-primary text-base">
              {{ purchaseOrderDetail_data?.supplierInfo?.supplierName || '-' }}
            </span>
          </section>

          <section id="order-date" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> Order Date </span>

            <span class="font-normal text-text-primary text-base">
              <template v-if="purchaseOrderDetail_data?.orderDate">
                {{ useFormatDate(purchaseOrderDetail_data?.orderDate, 'dd/mm/yyyy') }}
              </template>
            </span>
          </section>

          <section id="order-date" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> Order Status </span>

            <span
              class="font-normal text-xs px-2 py-1 rounded-full w-fit"
              :class="[purchaseOrderDetail_getStatusClass(purchaseOrderDetail_data?.orderStatus ?? '')]"
            >
              {{
                (purchaseOrderDetail_data?.orderStatus?.charAt(0)?.toUpperCase() ?? '') +
                (purchaseOrderDetail_data?.orderStatus?.slice(1) ?? '')
              }}
            </span>
          </section>

          <section id="order-date" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> Shiped By </span>

            <span class="font-normal text-text-primary text-base">
              <template v-if="purchaseOrderDetail_data?.receivedAt">
                {{  purchaseOrderDetail_data.receiver.fullname }}
              </template>
            </span>
          </section>

        </div>
      </section>
    </header>

    <section
      v-if="
        purchaseOrderDetail_data?.orderStatus.toUpperCase() !== 'CANCELLED' ||
        purchaseOrderDetail_data?.orderStatus.toUpperCase() !== 'PENDING'
      "
      id="delivery-order"
      class="border border-solid border-primary-border flex flex-col gap-5 p-6 rounded-lg"
    >
      <section id="content" class="flex items-center justify-between w-full">
        <section id="left-content" class="flex items-center gap-4">
          <AppBaseSvg name="document-solid-circle" class="w-10 h-10" />

          <h6 class="font-semibold text-lg text-text-primary">Delivery Order Document</h6>
        </section>

        <section id="right-content" class="flex items-center gap-4">
          <PrimeVueButton
            class="bg-primary border-none w-fit py-3 px-5 rounded-lg"
            @click="purchaseOrderDetail_onExportDeliveryOrderToPdf()"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="download-white" class="w-5 h-5" />
                <span class="font-semibold text-white text-sm">Download</span>
              </section>
            </template>
          </PrimeVueButton>

          <PrimeVueButton
            class="font-semibold text-sm text-primary w-fit border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 px-5 rounded-lg py-3 max-h-11"
            label="View Delivery Order Document"
            severity="secondary"
            variant="outlined"
            @click="
              $router.push({
                name: 'purchase-order.delivery-order-document',
                params: { id: purchaseOrderDetail_data?.id },
              })
            "
          />
        </section>
      </section>
    </section>

    <AppBaseDataTable
      :columns="purchaseOrderDetail_listColumns"
      :data="purchaseOrderDetail_data?.purchaseOrderItems"
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
        <template v-if="purchaseOrderDetail_data?.purchaseOrderItems.length === 0">
          <td :colspan="purchaseOrderDetail_listColumns.length" class="text-center py-8">
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
                  data: purchaseOrderDetail_data?.totalPrice ?? 0,
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

<style scoped>
.purchase-order-detail-form {
  width: 100%;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}
</style>
