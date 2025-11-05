<script setup lang="ts">
// Interfaces
import type { ITransferStockCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  transferStockCreateEdit_formDataOfEditQuantity,
  transferStockCreateEdit_onCloseDialogEditQuantity,
  transferStockCreateEdit_onDecrementQuantity,
  transferStockCreateEdit_onIncrementQuantity,
  transferStockCreateEdit_onSubmitEditQuantity,
  transferStockCreateEdit_isDecrementDisabled,
  transferStockCreateEdit_isIncrementDisabled,
} = inject('transferStockCreateEdit') as ITransferStockCreateEditProvided;
</script>

<template>
  <AppBaseDialog id="transfer-stock-create-edit-edit-quantity">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Edit Transfer Quantity</h5>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-6">
        <section id="product-item-information" class="grid grid-rows-2 grid-cols-12 gap-4">
          <section id="sku" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> SKU </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ transferStockCreateEdit_formDataOfEditQuantity.sku }}
            </p>
          </section>

          <section id="name" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Item Name </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ transferStockCreateEdit_formDataOfEditQuantity.name }}
            </p>
          </section>

          <section id="brand" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Brand </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ transferStockCreateEdit_formDataOfEditQuantity.brandName }}
            </p>
          </section>

          <section id="unit" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Unit </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ transferStockCreateEdit_formDataOfEditQuantity.unit }}
            </p>
          </section>

          <section id="unit-price" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Unit Price </span>

            <p class="font-normal text-base text-grayscale-70">
              <span v-if="transferStockCreateEdit_formDataOfEditQuantity.unitPrice">
                {{
                  useCurrencyFormat({
                    data: transferStockCreateEdit_formDataOfEditQuantity.unitPrice,
                    hidePrefix: false,
                    addSuffix: false,
                  })
                }}
              </span>
              <span v-else class="text-gray-400">-</span>
            </p>
          </section>

          <section id="stock-quantity" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Available Stock </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ transferStockCreateEdit_formDataOfEditQuantity.stockQuantity || 0 }}
            </p>
          </section>
        </section>

        <section id="form-quantity" class="flex items-center px-1 gap-2">
          <section
            id="button-min"
            class="basic-smooth-animation bg-white border border-solid border-primary flex items-center justify-center font-medium text-sm text-primary w-9 h-9 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95"
            :class="{
              'cursor-not-allowed hover:bg-primary hover:text-white hover:scale-100':
                transferStockCreateEdit_isDecrementDisabled,
            }"
            @click="transferStockCreateEdit_onDecrementQuantity"
          >
            -
          </section>

          <PrimeVueInputNumber
            id="quantity"
            v-model="transferStockCreateEdit_formDataOfEditQuantity.quantity"
            placeholder="0"
            :min="1"
            :max="transferStockCreateEdit_formDataOfEditQuantity.stockQuantity || 999"
            class="text-sm max-h-9"
            style="width: 80px"
            :pt="{
              pcInputText: {
                root: 'w-20 text-center',
              },
            }"
          />

          <section
            id="plus-min"
            class="basic-smooth-animation bg-white border border-solid border-primary flex items-center justify-center font-medium text-sm text-primary w-9 h-9 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95"
            :class="{
              'cursor-not-allowed hover:bg-primary hover:text-white hover:scale-100':
                transferStockCreateEdit_isIncrementDisabled,
            }"
            @click="transferStockCreateEdit_onIncrementQuantity"
          >
            +
          </section>
        </section>

        <!-- Stock Warning -->
        <div
          v-if="
            transferStockCreateEdit_formDataOfEditQuantity.quantity >
            (transferStockCreateEdit_formDataOfEditQuantity.stockQuantity || 0)
          "
          class="p-3 bg-red-50 border border-red-200 rounded-lg"
        >
          <div class="flex items-center gap-2">
            <PrimeVueIcon icon="pi pi-exclamation-triangle" class="text-red-600" size="16px" />
            <span class="text-red-700 text-sm font-medium">Insufficient Stock</span>
          </div>
          <p class="text-red-600 text-sm mt-1">
            Requested quantity ({{ transferStockCreateEdit_formDataOfEditQuantity.quantity }}) exceeds available
            stock ({{ transferStockCreateEdit_formDataOfEditQuantity.stockQuantity || 0 }})
          </p>
        </div>

        <section
          v-if="transferStockCreateEdit_formDataOfEditQuantity.unitPrice"
          id="total-price-display"
          class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
        >
          <span class="font-medium text-base text-gray-700">Total Price:</span>
          <span class="font-semibold text-lg text-primary">
            {{
              useCurrencyFormat({
                data: transferStockCreateEdit_formDataOfEditQuantity.totalPrice || 0,
                hidePrefix: false,
                addSuffix: false,
              })
            }}
          </span>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="transferStockCreateEdit_onCloseDialogEditQuantity"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Update"
          type="button"
          @click="transferStockCreateEdit_onSubmitEditQuantity"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
