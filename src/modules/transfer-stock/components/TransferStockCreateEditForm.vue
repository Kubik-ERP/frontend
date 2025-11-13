<script setup lang="ts">
// Interfaces
import type { ITransferStockCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockCreateEdit_formData,
  transferStockCreateEdit_formValidations,
  transferStockCreateEdit_listColumns,
  transferStockCreateEdit_listFromStores,
  transferStockCreateEdit_listToStores,
  transferStockCreateEdit_onDeleteProductItem,
  transferStockCreateEdit_onShowDialogAddProductItem,
  transferStockCreateEdit_onShowDialogEditQuantity,
  transferStockCreateEdit_onSubmitForm,
  transferStockCreateEdit_selectedProductItems,
  transferStockCreateEdit_totalItems,
  transferStockCreateEdit_totalQuantity,
  transferStockCreateEdit_totalValue,
} = inject('transferStockCreateEdit') as ITransferStockCreateEditProvided;

/**
 * @description Helper function to format currency from Decimal.js or number
 */
const formatCurrency = (value: unknown): string => {
  if (!value) return useCurrencyFormat({ data: 0, hidePrefix: false, addSuffix: false });

  // Handle Decimal.js format from backend
  if (typeof value === 'object' && value !== null && 's' in value && 'e' in value && 'd' in value) {
    const decimalValue = value as { s: number; e: number; d: number[] };
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

    return useCurrencyFormat({ data: numValue, hidePrefix: false, addSuffix: false });
  }

  return useCurrencyFormat({ data: typeof value === 'number' ? value : 0, hidePrefix: false, addSuffix: false });
};
</script>

<template>
  <form class="default-wrapper gap-6" @submit.prevent="transferStockCreateEdit_onSubmitForm">
    <section id="transfer-details" class="flex flex-col gap-2 w-full">
      <h6 class="font-semibold text-lg text-primary">Transfer Details</h6>

      <section id="form-groups" class="grid grid-rows-1 grid-cols-12 gap-4">
        <section id="from-store" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="from-store"
            name="From Store"
            spacing-bottom="mb-0"
            :validators="transferStockCreateEdit_formValidations.fromStoreId"
          >
            <PrimeVueSelect
              id="from-store"
              v-model="transferStockCreateEdit_formData.fromStoreId"
              filter
              :options="transferStockCreateEdit_listFromStores"
              option-label="label"
              option-value="value"
              class="text-base text-text-primary w-full"
              :class="classes"
              placeholder="Select source store"
            />
          </AppBaseFormGroup>
        </section>

        <section id="to-store" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="to-store"
            name="To Store"
            spacing-bottom="mb-0"
            :validators="transferStockCreateEdit_formValidations.toStoreId"
          >
            <PrimeVueSelect
              id="to-store"
              v-model="transferStockCreateEdit_formData.toStoreId"
              filter
              :options="transferStockCreateEdit_listToStores"
              option-label="label"
              option-value="value"
              class="text-base text-text-primary w-full"
              :class="classes"
              placeholder="Select destination store"
            />
          </AppBaseFormGroup>
        </section>

        <section id="transfer-date" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="transfer-date"
            name="Transfer Date"
            spacing-bottom="mb-0"
            :validators="transferStockCreateEdit_formValidations.transferDate"
          >
            <PrimeVueDatePicker
              id="transfer-date"
              v-model="transferStockCreateEdit_formData.transferDate"
              class="text-base text-text-primary w-full"
              :class="classes"
              date-format="dd/mm/yy"
              placeholder="Select transfer date"
              show-icon
            />
          </AppBaseFormGroup>
        </section>

        <section id="notes" class="col-span-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="notes"
            name="Notes (Optional)"
            spacing-bottom="mb-0"
          >
            <PrimeVueTextarea
              id="notes"
              v-model="transferStockCreateEdit_formData.notes"
              class="text-base text-text-primary w-full"
              :class="classes"
              placeholder="Add notes for this transfer"
              rows="3"
            />
          </AppBaseFormGroup>
        </section>
      </section>
    </section>

    <section id="product-items" class="flex flex-col gap-2 w-full">
      <div class="flex items-center justify-between">
        <h6 class="font-semibold text-lg text-primary">Product Items</h6>

        <PrimeVueButton
          class="bg-primary border-none text-sm"
          severity="secondary"
          variant="outlined"
          type="button"
          @click="transferStockCreateEdit_onShowDialogAddProductItem"
        >
          <AppBaseSvg name="plus-line-white" class="w-4 h-4" />
          <span class="text-white text-base">Add Product</span>
        </PrimeVueButton>
      </div>

      <section id="product-items-table" class="w-full">
        <PrimeVueDataTable
          v-if="transferStockCreateEdit_selectedProductItems.length > 0"
          :value="transferStockCreateEdit_selectedProductItems"
          :loading="false"
          class="w-full"
          responsive-layout="scroll"
          show-gridlines
          striped-rows
        >
          <PrimeVueColumn
            v-for="column in transferStockCreateEdit_listColumns"
            :key="column.value"
            :field="column.value"
            :header="column.label"
            :sortable="column.sortable"
            :style="column.value === 'action' ? { width: '80px' } : {}"
          >
            <template #body="{ data, field }">
              <template v-if="field === 'sku'">
                <span class="font-medium text-primary">{{ data.sku }}</span>
              </template>

              <template v-else-if="field === 'name'">
                <div class="flex flex-col">
                  <span class="font-medium">{{ data.name }}</span>
                </div>
              </template>

              <template v-else-if="field === 'brandName'">
                <span class="text-gray-600">{{ data.brandName }}</span>
              </template>

              <template v-else-if="field === 'quantity'">
                <span class="font-medium">{{ data.quantity }}</span>
              </template>

              <template v-else-if="field === 'unit'">
                <span>{{ data.unit }}</span>
              </template>

              <template v-else-if="field === 'unitPrice'">
                <span v-if="data.unitPrice" class="font-medium">
                  {{ formatCurrency(data.unitPrice) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template v-else-if="field === 'totalPrice'">
                <span v-if="data.totalPrice" class="font-medium">
                  {{ formatCurrency(data.totalPrice) }}
                </span>
                <span v-else class="text-gray-400">-</span>
              </template>

              <template v-else-if="field === 'stockQuantity'">
                <div class="flex items-center gap-2">
                  <span class="text-base">{{ data.stockQuantity || 0 }}</span>
                  <span
                    v-if="data.quantity > (data.stockQuantity || 0)"
                    class="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                  >
                    Insufficient
                  </span>
                </div>
              </template>

              <template v-else-if="field === 'action'">
                <div class="flex items-center gap-2">
                  <PrimeVueButton
                    class="border border-solid border-primary p-2"
                    severity="info"
                    variant="text"
                    size="small"
                    type="button"
                    @click="transferStockCreateEdit_onShowDialogEditQuantity(data)"
                  >
                    <AppBaseSvg name="edit" class="w-3 h-3" />
                  </PrimeVueButton>

                  <PrimeVueButton
                    class="border border-solid border-primary p-2"
                    severity="danger"
                    variant="text"
                    size="small"
                    type="button"
                    @click="transferStockCreateEdit_onDeleteProductItem(data)"
                  >
                    <AppBaseSvg name="delete" class="w-3 h-3" />
                  </PrimeVueButton>
                </div>
              </template>

              <template v-else>
                <span>{{ data[field as string] }}</span>
              </template>
            </template>
          </PrimeVueColumn>
        </PrimeVueDataTable>

        <div
          v-else
          class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-gray-300 rounded-lg"
        >
          <PrimeVueIcon icon="pi pi-box" size="48px" class="text-gray-400 mb-4" />
          <p class="text-gray-500 text-center mb-4">No product items added yet</p>

          <PrimeVueButton
            class="border-primary bg-transparent font-semibold text-sm text-primary w-fit basic-smooth-animation hover:bg-grayscale-10 px-4 py-2"
            label="Add First Product"
            severity="secondary"
            variant="outlined"
            @click="transferStockCreateEdit_onShowDialogAddProductItem"
          />
        </div>
      </section>

      <!-- Summary Section -->
      <section
        v-if="transferStockCreateEdit_selectedProductItems.length > 0"
        id="transfer-summary"
        class="mt-4 p-4 bg-gray-50 rounded-lg"
      >
        <h6 class="font-semibold text-base text-gray-800 mb-3">Transfer Summary</h6>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">Total Items</span>
            <span class="text-lg font-semibold text-primary">{{ transferStockCreateEdit_totalItems }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">Total Quantity</span>
            <span class="text-lg font-semibold text-primary">{{ transferStockCreateEdit_totalQuantity }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-sm text-gray-600">Total Value</span>
            <span class="text-lg font-semibold text-primary">
              {{
                useCurrencyFormat({
                  data: transferStockCreateEdit_totalValue,
                  hidePrefix: false,
                  addSuffix: false,
                })
              }}
            </span>
          </div>
        </div>
      </section>
    </section>
  </form>
</template>
