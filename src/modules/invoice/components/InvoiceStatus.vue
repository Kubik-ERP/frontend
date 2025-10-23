<script setup lang="ts">
// emits
const emit = defineEmits(['print', 'download']);

// Constant
import { CASHIER_ORDER_TYPE } from '@/modules/cashier/constants';
import { DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS } from '@/modules/daily-sales/constants';
import { INVOICE_PAYMENT_STATUS } from '../constants/invoice.constant';

// Interface
import { IInvoiceProvided } from '../interfaces/index';

// Router
import { useRouter } from 'vue-router';

const router = useRouter();

// Services
import { useDailySalesListService } from '@/modules/daily-sales/services/daily-sales-list.service';

// Stores
import { useOutletStore } from '@/modules/outlet/store';

const { dailySalesList_getClassOfOrderStatus, dailySalesList_getClassOfOrderType } = useDailySalesListService();

/**
 * @description Injected variables
 */
const outletStore = useOutletStore();
const { outlet_currentOutlet } = storeToRefs(outletStore);

/**
 * @description Inject all the data and methods what we need
 */
const { invoice_invoiceData, invoice_otherOptions, invoice_modalPay, invoice_handleOtherOptions } =
  inject<IInvoiceProvided>('invoice')!;

const paymentStatusLabel = computed(() => {
  const status = INVOICE_PAYMENT_STATUS.find(f => f.id === invoice_invoiceData.value.data?.paymentStatus);
  return status?.name ?? '';
});

const orderTypeLabel = computed(() => {
  const type = CASHIER_ORDER_TYPE.find(f => f.code === invoice_invoiceData.value.data?.orderType);
  return type?.label ?? '';
});

const orderStatusLabel = computed(() => {
  const status = DAILY_SALES_LIST_TYPES_OF_ORDER_STATUS.find(
    f => f.value === invoice_invoiceData.value.data?.orderStatus,
  );
  return status?.label ?? '';
});

const rbac = useRbac();
const hasPermission = rbac.hasPermission('edit_invoice');
</script>

<template>
  <section
    v-if="!invoice_invoiceData.isLoading && invoice_invoiceData.data"
    id="invoice-status"
    class="overflow-y-auto hidden lg:flex col-span-4 relative inset-0 z-0 bg-white border-l border-solid border-grayscale-10 flex-col items-center px-4 py-5 gap-6"
  >
    <section id="invoice-id" class="flex flex-col items-center">
      <p id="label-invoice-id" class="font-normal text-text-disabled text-sm">Invoice ID</p>

      <p id="invoice-id" class="font-semibold text-black text-lg">{{ invoice_invoiceData.data?.invoiceNumber }}</p>
    </section>

    <!-- <section
      id="box-icon"
      class="absolute top-5 right-5 bg-transparent basic-smooth-animation flex items-center gap-1 hover:bg-grayscale-10 p-2 rounded-md cursor-pointer"
    >
      <AppBaseSvg name="more" class="h-4 w-4" />
      <span class="font-normal text-text-disabled text-xs">More</span>
    </section> -->

    <PrimeVueChip
      class="bg-primary-background px-4 py-2 rounded-full"
      :class="{
        'bg-primary-background': invoice_invoiceData.data.paymentStatus === 'paid',
        'bg-warning-background': invoice_invoiceData.data.paymentStatus === 'unpaid',
        'bg-error-background': invoice_invoiceData.data.paymentStatus === 'refund',
      }"
    >
      <AppBaseSvg :name="invoice_invoiceData.data.paymentStatus" class="!w-8 !h-8" />

      <span
        class="font-semibold text-primary text-lg"
        :class="{
          'text-primary': invoice_invoiceData.data.paymentStatus === 'paid',
          'text-warning-main': invoice_invoiceData.data.paymentStatus === 'unpaid',
          'text-error-main': invoice_invoiceData.data.paymentStatus === 'refund',
        }"
      >
        {{ paymentStatusLabel }}
      </span>
    </PrimeVueChip>

    <table id="invoice-information">
      <thead>
        <tr class="hidden">
          <th class="font-normal text-black text-sm text-left py-2">Label</th>
          <th class="font-normal text-black text-sm text-right py-2">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Created on</td>
          <td class="font-normal text-grayscale-70 text-sm">
            {{ useFormatDate(invoice_invoiceData.data.createdAt) }}
          </td>
        </tr>

        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Paid On</td>
          <td class="font-normal text-grayscale-70 text-sm">
            {{
              invoice_invoiceData.data.paymentStatus === 'paid'
                ? useFormatDate(invoice_invoiceData.data.paidAt!)
                : '-'
            }}
          </td>
        </tr>

        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Payment Method</td>
          <td class="font-normal text-grayscale-70 text-sm">
            {{ invoice_invoiceData?.data?.paymentMethods?.name || '-' }}
          </td>
        </tr>

        <tr>
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">By</td>
          <td class="font-normal text-grayscale-70 text-sm">
            {{
              invoice_invoiceData.data.paymentStatus === 'unpaid'
                ? invoice_invoiceData.currentUser?.fullname || '-'
                : invoice_invoiceData.data.users?.fullname
            }}
          </td>
        </tr>
        <tr class="mb-2">
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Order Type</td>
          <td class="font-normal text-grayscale-70 text-sm">
            <PrimeVueChip
              :class="[
                dailySalesList_getClassOfOrderType(invoice_invoiceData.data.orderType),
                'text-xs font-normal',
              ]"
              :label="orderTypeLabel"
            />
          </td>
        </tr>
        <tr class="pt-2">
          <td class="font-normal text-text-disabled text-sm pe-2 py-1">Order Status</td>
          <td class="font-normal text-grayscale-70 text-sm py-1">
            <PrimeVueChip
              :class="[
                dailySalesList_getClassOfOrderStatus(invoice_invoiceData.data.orderStatus),
                'text-xs font-normal',
              ]"
              :label="orderStatusLabel"
            />
          </td>
        </tr>
      </tbody>

      <tfoot
        v-if="
          hasPermission &&
          invoice_invoiceData.data.paymentStatus === 'unpaid' &&
          (invoice_invoiceData.data.orderStatus === 'in_progress' ||
            invoice_invoiceData.data.orderStatus === 'placed')
        "
      >
        <tr>
          <td colspan="2" class="pt-6">
            <PrimeVueButton
              class="w-full"
              severity="secondary"
              variant="outlined"
              @click="
                router.push({
                  name: 'cashier-order-edit',
                  params: { id: invoice_invoiceData.data.id },
                })
              "
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="edit" class="filter-primary-color h-4 w-4" />
                  <span class="font-semibold text-primary text-sm">Edit Order</span>
                </section>
              </template>
            </PrimeVueButton>
          </td>
        </tr>
      </tfoot>
    </table>

    <PrimeVueDivider class="border-grayscale-10 py-4" />

    <section id="btn-actions" class="flex flex-col items-center gap-4 w-full">
      <section id="primary-buttons" class="flex items-center gap-4 w-full">
        <PrimeVueButton
          v-if="invoice_invoiceData.data.paymentStatus !== 'unpaid'"
          class="w-full py-4"
          severity="secondary"
          variant="outlined"
          @click="emit('download')"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="download" class="!w-6 !h-6" />
              <span class="font-semibold text-primary text-sm">Download</span>
            </section>
          </template>
        </PrimeVueButton>
        <PrimeVueButton
          v-else
          class="w-full py-4 bg-primary"
          severity="primary"
          variant="outlined"
          @click="invoice_modalPay.show = true"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg
                :name="invoice_invoiceData.data.paymentStatus !== 'unpaid' ? 'cash' : 'cash-white'"
                class="w-6 h-6"
              />
              <span class="font-semibold text-white text-sm">Pay Now</span>
            </section>
          </template>
        </PrimeVueButton>

        <!-- change from print to download -->
        <PrimeVueButton
          class="w-full py-4"
          :class="{
            'bg-primary border-none': invoice_invoiceData.data.paymentStatus !== 'unpaid',
            'bg-white border-primary': invoice_invoiceData.data.paymentStatus === 'unpaid',
          }"
          severity="primary"
          @click="emit('print', 'invoice')"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg
                :name="invoice_invoiceData.data.paymentStatus !== 'unpaid' ? 'printer' : 'printer-primary'"
                class="filter-primary-color w-6 h-6"
                color="primary"
              />
              <span
                class="font-semibold text-sm"
                :class="{
                  'text-white': invoice_invoiceData.data.paymentStatus !== 'unpaid',
                  'text-primary': invoice_invoiceData.data.paymentStatus === 'unpaid',
                }"
                >Print Invoice</span
              >
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <!-- change from print to download -->

      <section id="print-buttons" class="flex flex-col items-center gap-4 w-full">
        <PrimeVueButton
          v-if="outlet_currentOutlet?.businessType !== 'Retail'"
          class="w-full py-4 bg-white border-primary"
          severity="primary"
          @click="emit('print', 'kitchen')"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="printer-primary" class="!w-6 !h-6" color="primary" />
              <span class="font-semibold text-sm text-primary">Print Kitchen Ticket</span>
            </section>
          </template>
        </PrimeVueButton>

        <PrimeVueButton
          v-if="outlet_currentOutlet?.businessType !== 'Retail'"
          class="w-full py-4 bg-white border-primary"
          severity="primary"
          @click="emit('print', 'table')"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="printer-primary" class="!w-6 !h-6" color="primary" />
              <span class="font-semibold text-sm text-primary">Print Table Ticket</span>
            </section>
          </template>
        </PrimeVueButton>
      </section>

      <span class="font-normal text-text-disabled text-sm">other option</span>

      <section id="share-invoice" class="flex items-center gap-6">
        <PrimeVueButton
          id="copy-link"
          class="flex flex-col items-center gap-1 cursor-pointer bg-white border-none"
          @click="invoice_handleOtherOptions('copy')"
        >
          <section
            id="box-icon"
            class="bg-primary flex items-center justify-center p-2 rounded-full w-10 h-10 opacity-80"
          >
            <AppBaseSvg name="link" class="filter-white-color w-6 h-6" />
          </section>

          <span class="font-normal text-grayscale-70 text-sm"> Copy Link </span>
        </PrimeVueButton>

        <PrimeVueButton
          id="email"
          :loading="invoice_otherOptions.isLoadingSendEmail"
          class="flex flex-col items-center gap-1 cursor-pointer bg-white border-none"
          @click="invoice_handleOtherOptions('email')"
        >
          <section
            id="box-icon"
            class="bg-primary opacity-80 flex items-center justify-center p-2 rounded-full w-10 h-10"
          >
            <AppBaseSvg name="mail" class="filter-white-color w-6 h-6" />
          </section>

          <span class="font-normal text-grayscale-70 text-sm"> Email </span>
        </PrimeVueButton>

        <PrimeVueButton
          id="whatsapp"
          class="flex flex-col items-center gap-1 cursor-pointer bg-white border-none"
          @click="invoice_handleOtherOptions('whatsapp')"
        >
          <section
            id="box-icon"
            class="bg-primary opacity-80 flex items-center justify-center p-2 rounded-full w-10 h-10"
          >
            <AppBaseSvg name="whatsapp" class="filter-white-color w-6 h-6" />
          </section>

          <span class="font-normal text-grayscale-70 text-sm"> Whatsapp </span>
        </PrimeVueButton>
      </section>
    </section>
  </section>
  <section v-else></section>
</template>
