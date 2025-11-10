<script setup lang="ts">
// Components
import InvoicePaperCashierInvoice from '@/modules/invoice/components/paper/InvoicePaperCashierInvoice.vue';

// Interfaces
import type { IDailySalesListProvided } from '@/modules/daily-sales/interfaces/daily-sales-list.interface';
import type { ICashierOrderSummaryProvided } from '@/modules/cashier/interfaces/cashier-order-summary';
import type { IInvoiceProvided } from '@/modules/invoice/interfaces';
import type { IDailySales } from '@/modules/daily-sales/interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierOrderSummary_onCloseDialogQueueOverview } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;
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
} = inject<IDailySalesListProvided>('dailySalesList')!;

const { invoice_handleFetchInvoiceById } = inject<IInvoiceProvided>('invoice')!;

/**
 * @description Reactive data binding
 */
const isOpenOrderDetails = ref(false);
const selectedDataQueue = ref<IDailySales | null>(null);
</script>

<template>
  <section id="cashier-queue-overview-dialog">
    <AppBaseDialog id="cashier-queue-overview-dialog">
      <template #header>
        <header class="flex items-center gap-2">
          <AppBaseSvg name="customer-queue" class="w-5 h-5" />
          <h5 class="font-semibold text-black text-lg">Customer Queue</h5>
        </header>
      </template>

      <template #content>
        <AppBaseDataTable
          :columns="dailySalesList_columns"
          :data="dailySalesList_values.data.items"
          :rows-per-page="dailySalesList_values.data.meta.pageSize"
          :total-records="dailySalesList_values.data.meta.total"
          :first="(dailySalesList_values.data.meta.page - 1) * dailySalesList_values.data.meta.pageSize"
          :is-loading="dailySalesList_isLoading"
          :sort-field="dailySalesList_queryParams.orderBy"
          :sort-order="dailySalesList_queryParams.orderDirection"
          is-using-server-side-pagination
          is-using-custom-body
          :is-using-header="false"
          :is-using-border-on-header="false"
          @update:currentPage="dailySalesList_onChangePage"
          @update:sort="dailySales_handleOnSortChange"
        >
          <template #body="{ column, data, index }">
            <template v-if="column.value === 'index'">
              <span class="font-normal text-sm text-text-primary">{{
                (dailySalesList_values.data.meta.page - 1) * dailySalesList_values.data.meta.pageSize + index + 1
              }}</span>
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
                  dailySalesList_typesOfOrderType.find((f: IDropdownItem) => f.value === data[column.value])
                    ?.label || ''
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
              <PrimeVueButton
                variant="text"
                rounded
                aria-label="Filter"
                @click="
                  async () => {
                    isOpenOrderDetails = !isOpenOrderDetails;
                    selectedDataQueue = data;

                    await invoice_handleFetchInvoiceById(data.id);
                  }
                "
              >
                <template #icon>
                  <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
                </template>
              </PrimeVueButton>
            </template>

            <template v-else>
              <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
            </template>
          </template>
        </AppBaseDataTable>
      </template>

      <template #footer>
        <footer class="flex items-center justify-end w-full gap-4">
          <PrimeVueButton
            class="font-semibold text-base text-primary rounded-lg w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
            label="Close"
            severity="secondary"
            variant="outlined"
            @click="cashierOrderSummary_onCloseDialogQueueOverview"
          />
        </footer>
      </template>
    </AppBaseDialog>

    <PrimeVueDrawer
      v-model:visible="isOpenOrderDetails"
      header="Order Details"
      position="right"
      :pt="{
        content: 'p-0',
        root: 'w-[25rem]',
        title: 'font-semibold text-black text-lg',
      }"
    >
      <section id="invoice-detail" class="grid grid-rows-2 grid-cols-12 gap-2 border-b border-grayscale-10 p-4">
        <section id="invoice-id" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Invoice ID</h6>

          <div class="flex items-center gap-2">
            <p class="font-normal text-sm text-grayscale-70">
              {{ selectedDataQueue?.invoiceNumber }}
            </p>

            <PrimeVueChip class="bg-primary-background px-2 py-1">
              <template #default>
                <div class="flex items-center gap-2">
                  <AppBaseSvg name="check-primary" class="w-3 h-3" />
                  <span class="font-normal text-primary text-xs"> Paid </span>
                </div>
              </template>
            </PrimeVueChip>
          </div>
        </section>

        <section id="created-on" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Created On</h6>
          <p class="font-normal text-sm text-grayscale-70">
            {{ useFormatDate(new Date(selectedDataQueue?.createdAt || '')) }}
          </p>
        </section>

        <section id="created-by" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">By</h6>
          <p class="font-normal text-sm text-grayscale-70">Samantha</p>
        </section>

        <section id="paid-on" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Paid On</h6>

          <p class="font-normal text-sm text-grayscale-70">
            <template v-if="selectedDataQueue?.paidAt">
              {{ useFormatDate(new Date(selectedDataQueue?.paidAt || '')) }}
            </template>

            <template v-else>N/A</template>
          </p>
        </section>
      </section>

      <section id="queue-detail" class="grid grid-rows-2 grid-cols-12 gap-2 border-b border-grayscale-10 p-4">
        <section id="queue-number" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Queue Number</h6>

          <p class="font-normal text-sm text-grayscale-70">
            {{ selectedDataQueue?.queue ?? '-' }}
          </p>
        </section>

        <section id="table-number" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Table Number</h6>
          <p class="font-normal text-sm text-grayscale-70">
            {{ selectedDataQueue?.tableCode ?? '-' }}
          </p>
        </section>

        <section id="order-type" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Order Type</h6>

          <PrimeVueChip
            class="font-normal text-xs px-2 py-1 w-fit"
            :class="dailySalesList_getClassOfOrderType(selectedDataQueue?.orderType || '')"
            :label="
              dailySalesList_typesOfOrderType.find((f: IDropdownItem) => f.value === selectedDataQueue?.orderType)
                ?.label || ''
            "
          />
        </section>

        <section id="order-status" class="col-span-6 flex flex-col gap-2">
          <h6 class="font-normal text-text-disabled text-sm">Order Status</h6>
          <PrimeVueChip
            class="font-normal text-xs px-2 py-1 w-fit"
            :class="dailySalesList_getClassOfOrderStatus(selectedDataQueue?.orderStatus || '')"
            :label="
              dailySalesList_typesOfOrderStatus.find(
                (f: IDropdownItem) => f.value === selectedDataQueue?.orderStatus,
              )?.label || ''
            "
          />
        </section>
      </section>

      <section id="invoice" class="bg-background p-4">
        <InvoicePaperCashierInvoice />
      </section>
    </PrimeVueDrawer>
  </section>
</template>
