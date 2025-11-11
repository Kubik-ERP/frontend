<script setup lang="ts">
// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { 
  transferStockDetail_data, 
  handleExportShippingDocumentToPdf 
} = inject<ITransferStockDetailProvided>('transferStockDetail')!;

/**
 * @description Helper functions
 */
const formatCurrency = (value: unknown): string => {
  if (!value) return useCurrencyFormat({ data: 0 });
  
  // Handle Decimal.js format
  if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
    const decimalValue = value as { s: number; e: number; d: number[] };
    const sign = decimalValue.s || 1;
    const digits = decimalValue.d || [0];
    const exponent = decimalValue.e || 0;
    
    let numValue = 0;
    for (let i = 0; i < digits.length; i++) {
      numValue = numValue * 10 + digits[i];
    }
    numValue = numValue * sign * Math.pow(10, exponent - digits.length + 1);
    
    return useCurrencyFormat({ data: numValue });
  }
  
  return useCurrencyFormat({ data: typeof value === 'number' ? value : 0 });
};

const getStatusClass = (status: string): string => {
  const statusClasses = {
    draft: 'text-gray-600 bg-gray-100',
    drafted: 'text-gray-600 bg-gray-100',
    pending: 'text-yellow-600 bg-yellow-100',
    approved: 'text-blue-600 bg-blue-100',
    shipped: 'text-orange-600 bg-orange-100',
    received: 'text-green-600 bg-green-100',
    received_with_issue: 'text-yellow-700 bg-yellow-200',
    closed: 'text-purple-600 bg-purple-100',
    rejected: 'text-red-600 bg-red-100',
    canceled: 'text-red-600 bg-red-100',
    cancelled: 'text-red-600 bg-red-100',
  };
  
  return statusClasses[status as keyof typeof statusClasses] || 'text-gray-600 bg-gray-100';
};

const getTotalValue = (): string => {
  if (!transferStockDetail_data.value?.transferStockItems) return formatCurrency(0);
  
  const total = transferStockDetail_data.value.transferStockItems.reduce((sum: number, item: { subtotal: unknown }) => {
    const subtotal = item.subtotal;
    if (typeof subtotal === 'object' && subtotal !== null && 's' in subtotal && 'e' in subtotal && 'd' in subtotal) {
      const decimalValue = subtotal as { s: number; e: number; d: number[] };
      const sign = decimalValue.s || 1;
      const digits = decimalValue.d || [0];
      const exponent = decimalValue.e || 0;
      
      let numValue = 0;
      for (let i = 0; i < digits.length; i++) {
        numValue = numValue * 10 + digits[i];
      }
      numValue = numValue * sign * Math.pow(10, exponent - digits.length + 1);
      
      return sum + numValue;
    }
    
    return sum + (typeof subtotal === 'number' ? subtotal : 0);
  }, 0);
  
  return formatCurrency(total);
};

// Define columns specifically for transfer items table
const transferStockListColumns = [
  {
    label: 'SKU',
    sortable: false,
    value: 'masterInventoryItems.sku',
  },
  {
    label: 'Item Name',
    sortable: false,
    value: 'masterInventoryItems.name',
  },
  {
    label: 'Unit',
    sortable: false,
    value: 'masterInventoryItems.unit',
  },
  {
    label: 'Qty Reserved',
    sortable: false,
    value: 'qtyReserved',
  },
  {
    label: 'Qty Received',
    sortable: false,
    value: 'qtyReceived',
  },
  {
    label: 'Unit Price',
    sortable: false,
    value: 'unitPrice',
  },
  {
    label: 'Subtotal',
    sortable: false,
    value: 'subtotal',
  },
];
</script>

<template>
  <section id="transfer-stock-detail-form" class="default-wrapper gap-10">
    <header class="border border-solid border-primary-border flex flex-col gap-5 p-6 rounded-lg">
      <div class="flex items-center justify-between h-fit">
        <h6 class="font-semibold text-text-primary text-lg">
          {{ transferStockDetail_data?.transactionCode }}
        </h6>

        <router-link
          v-if="transferStockDetail_data?.status?.toLowerCase() !== 'cancelled' && transferStockDetail_data?.status?.toLowerCase() !== 'closed'"
          id="edit-transfer-stock"
          :to="{ name: 'transfer-stock.edit', params: { id: transferStockDetail_data?.id } }"
          class="inline-flex items-center gap-2 basic-smooth-animation hover:bg-grayscale-10 max-h-10 p-4 rounded-lg"
        >
          <AppBaseSvg name="edit" class="w-4 h-4 filter-primary-color" />

          <span class="font-semibold text-primary text-sm">
            Edit Transfer Detail
          </span>
        </router-link>
      </div>

      <section id="content" class="flex flex-col gap-2">
        <span class="font-semibold text-primary text-sm"> Transfer Details </span>

        <div class="grid grid-rows-1 grid-cols-12 gap-4">
          <section id="store-from" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> From Store </span>

            <span class="font-normal text-text-primary text-base">
              {{ transferStockDetail_data?.storeFrom?.name || '-' }}
            </span>
          </section>

          <section id="store-to" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> To Store </span>

            <span class="font-normal text-text-primary text-base">
              {{ transferStockDetail_data?.storeTo?.name || '-' }}
            </span>
          </section>

          <section id="status" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> Status </span>

            <span
              class="font-normal text-xs px-2 py-1 rounded-full w-fit"
              :class="[getStatusClass(transferStockDetail_data?.status ?? '')]"
            >
              {{
                (transferStockDetail_data?.status?.charAt(0)?.toUpperCase() ?? '') +
                (transferStockDetail_data?.status?.slice(1) ?? '')
              }}
            </span>
          </section>

          <section id="drafted-by" class="col-span-4 lg:col-span-3 flex flex-col gap-1">
            <span class="font-normal text-text-primary text-sm"> Drafted By </span>

            <span class="font-normal text-text-primary text-base">
              {{ transferStockDetail_data?.draftedUser?.fullname || '-' }}
            </span>
          </section>
        </div>
      </section>
    </header>

    <section
      v-if="
        transferStockDetail_data?.status?.toLowerCase() !== 'cancelled' &&
        transferStockDetail_data?.status?.toLowerCase() !== 'draft' &&
        transferStockDetail_data?.status?.toLowerCase() !== 'pending'
      "
      id="delivery-document"
      class="border border-solid border-primary-border flex flex-col gap-5 p-6 rounded-lg"
    >
      <section id="content" class="flex items-center justify-between w-full">
        <section id="left-content" class="flex items-center gap-4">
          <AppBaseSvg name="document-solid-circle" class="w-10 h-10" />

          <h6 class="font-semibold text-lg text-text-primary">Transfer Shipping Document</h6>
        </section>

        <section id="right-content" class="flex items-center gap-4">
          <PrimeVueButton
            class="bg-primary border-none w-fit py-3 px-5 rounded-lg"
            @click="handleExportShippingDocumentToPdf()"
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
            label="View Shipping Document"
            severity="secondary"
            variant="outlined"
            @click="
              $router.push({
                name: 'transfer-stock.shipping-document',
                params: { id: transferStockDetail_data?.id },
              })
            "
          />
        </section>
      </section>
    </section>

    <AppBaseDataTable
      :columns="transferStockListColumns"
      :data="transferStockDetail_data?.transferStockItems"
      is-using-custom-body
      is-using-custom-header
      is-using-custom-footer
      :is-using-border-on-header="false"
      :is-using-pagination="false"
      :max-visible-rows="5"
    >
      <template #header>
        <header class="flex items-center justify-between">
          <h6 class="font-semibold text-lg text-primary">Transfer Items</h6>
        </header>
      </template>

      <template #body="{ column, data }">
        <template v-if="transferStockDetail_data?.transferStockItems?.length === 0">
          <td :colspan="transferStockListColumns.length" class="text-center py-8">
            <span class="font-normal text-sm text-gray-500">No transfer items</span>
          </td>
        </template>

        <template v-else>
          <template v-if="column.value === 'masterInventoryItems.sku'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.masterInventoryItems?.sku || '-' }}
            </span>
          </template>

          <template v-else-if="column.value === 'masterInventoryItems.name'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.masterInventoryItems?.name || '-' }}
            </span>
          </template>

          <template v-else-if="column.value === 'masterInventoryItems.unit'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.masterInventoryItems?.unit || '-' }}
            </span>
          </template>

          <template v-else-if="column.value === 'qtyReserved'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.qtyReserved || 0 }}
            </span>
          </template>

          <template v-else-if="column.value === 'qtyReceived'">
            <span class="font-normal text-sm text-text-primary">
              {{ data.qtyReceived || 0 }}
            </span>
          </template>

          <template v-else-if="column.value === 'unitPrice' || column.value === 'subtotal'">
            <span class="font-normal text-sm text-text-primary">
              {{ formatCurrency(data[column.value]) }}
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
            <span class="font-semibold text-base text-primary">Total Value</span>
            <span class="font-semibold text-base text-primary">
              {{ getTotalValue() }}
            </span>
          </div>
        </div>
      </template>
    </AppBaseDataTable>
  </section>
</template>