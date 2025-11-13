<script setup lang="ts">
// Components
import TransferStockShippingDocumentPdfTemplate from './TransferStockShippingDocumentPdfTemplate.vue';

// Html2Pdf
import html2pdf from 'html2pdf.js';

// Interfaces
import type { ITransferStockDetailProvided } from '../interfaces';

// Plugins
import eventBus from '@/plugins/mitt';

/**
 * @description Inject all the data and methods what we need
 */
const { transferStockDetail_data, transferStockDetail_getStatusClass, shippingDocumentData } =
  inject<ITransferStockDetailProvided>('transferStockDetail')!;

/**
 * @description Create ref for PDF template element
 */
const pdfTemplateRef = ref<InstanceType<typeof TransferStockShippingDocumentPdfTemplate> | null>(null);

/**
 * @description Loading state for PDF generation
 */
const isGeneratingPdf = ref(false);

/**
 * @description Handle export shipping document to PDF
 */
async function handleExportShippingDocumentToPdf() {
  // Check if data is ready
  if (!shippingDocumentData.value) {
    console.error('Shipping document data is not available');
    return;
  }

  if (!pdfTemplateRef.value?.$el) {
    console.error('PDF template element not found');
    return;
  }

  if (!transferStockDetail_data.value) {
    console.error('Transfer stock data is not available');
    return;
  }

  try {
    // Set loading state
    isGeneratingPdf.value = true;

    const transactionCode = transferStockDetail_data.value.transactionCode ?? 'shipping-document';
    const filename = `${transactionCode.replace(/[^a-zA-Z0-9]/g, '_')}_SHIPPING_DOCUMENT.pdf`;

    const options = {
      margin: 0,
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      },
    };

    // Use await to ensure PDF generation completes before clearing loading state
    await html2pdf().set(options).from(pdfTemplateRef.value.$el).save();

    // Success toast
    const argsEventEmitter: IPropsToast = {
      isOpen: true,
      type: EToastType.SUCCESS,
      message: 'Shipping document downloaded successfully',
      position: EToastPosition.TOP_RIGHT,
    };

    eventBus.emit('AppBaseToast', argsEventEmitter);
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    
    // Error toast
    const argsEventEmitter: IPropsToast = {
      isOpen: true,
      type: EToastType.DANGER,
      message: 'Failed to download shipping document',
      position: EToastPosition.TOP_RIGHT,
    };

    eventBus.emit('AppBaseToast', argsEventEmitter);
  } finally {
    // Always clear loading state
    isGeneratingPdf.value = false;
  }
}

/**
 * @description Helper functions
 */
const formatCurrency = (value: unknown): string => {
  if (!value) return useCurrencyFormat({ data: 0 });

  // Handle Decimal.js format from backend
  if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
    const decimalValue = value as { s: number; e: number; d: number[] };
    const sign = decimalValue.s || 1;
    const digits = decimalValue.d || [0];
    const exponent = decimalValue.e || 0;

    // Convert Decimal.js format to number
    // For example: {s: 1, e: 4, d: [17500]} means 17500 (where e is the exponent position)
    // {s: 1, e: 3, d: [3500]} means 3500
    let numValue = 0;
    
    // Combine all digits
    for (let i = 0; i < digits.length; i++) {
      const digitValue = digits[i];
      const digitLength = digitValue.toString().length;
      numValue = numValue * Math.pow(10, digitLength) + digitValue;
    }
    
    // Apply exponent adjustment
    const totalDigits = digits.reduce((acc, d) => acc + d.toString().length, 0);
    const adjustment = exponent - totalDigits + 1;
    numValue = numValue * Math.pow(10, adjustment) * sign;

    return useCurrencyFormat({ data: numValue });
  }

  return useCurrencyFormat({ data: typeof value === 'number' ? value : 0 });
};

const getTotalValue = (): string => {
  if (!transferStockDetail_data.value?.transferStockItems) return formatCurrency(0);

  const total = transferStockDetail_data.value.transferStockItems.reduce(
    (sum: number, item: { subtotal: unknown }) => {
      const subtotal = item.subtotal;
      if (
        typeof subtotal === 'object' &&
        subtotal !== null &&
        's' in subtotal &&
        'e' in subtotal &&
        'd' in subtotal
      ) {
        const decimalValue = subtotal as { s: number; e: number; d: number[] };
        const sign = decimalValue.s || 1;
        const digits = decimalValue.d || [0];
        const exponent = decimalValue.e || 0;

        // Convert Decimal.js format to number
        let numValue = 0;
        
        // Combine all digits
        for (let i = 0; i < digits.length; i++) {
          const digitValue = digits[i];
          const digitLength = digitValue.toString().length;
          numValue = numValue * Math.pow(10, digitLength) + digitValue;
        }
        
        // Apply exponent adjustment
        const totalDigits = digits.reduce((acc: number, d: number) => acc + d.toString().length, 0);
        const adjustment = exponent - totalDigits + 1;
        numValue = numValue * Math.pow(10, adjustment) * sign;

        return sum + numValue;
      }

      return sum + (typeof subtotal === 'number' ? subtotal : 0);
    },
    0,
  );

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
          v-if="
            transferStockDetail_data?.status?.toLowerCase() !== 'cancelled' &&
            transferStockDetail_data?.status?.toLowerCase() !== 'closed'
          "
          id="edit-transfer-stock"
          :to="{ name: 'transfer-stock.edit', params: { id: transferStockDetail_data?.id } }"
          class="inline-flex items-center gap-2 basic-smooth-animation hover:bg-grayscale-10 max-h-10 p-4 rounded-lg"
        >
          <AppBaseSvg name="edit" class="w-4 h-4 filter-primary-color" />

          <span class="font-semibold text-primary text-sm"> Edit Transfer Detail </span>
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
              :class="[transferStockDetail_getStatusClass(transferStockDetail_data?.status ?? '')]"
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
            :loading="isGeneratingPdf"
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
            :disabled="isGeneratingPdf"
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

    <!-- Hidden PDF Template for Export -->
    <div style="position: absolute; left: -9999px; top: -9999px">
      <TransferStockShippingDocumentPdfTemplate
        v-if="shippingDocumentData"
        ref="pdfTemplateRef"
        :shipping-document-data="shippingDocumentData"
      />
    </div>
  </section>
</template>
