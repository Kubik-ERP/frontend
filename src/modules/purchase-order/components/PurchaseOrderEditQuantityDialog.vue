<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderCreateEdit_formDataOfEditQuantity,
  purchaseOrderCreateEdit_onCloseDialogEditQuantity,
  purchaseOrderCreateEdit_onDecrementQuantity,
  purchaseOrderCreateEdit_onIncrementQuantity,
  purchaseOrderCreateEdit_onSubmitEditQuantity,
} = inject('purchaseOrderCreateEdit') as IPurchaseOrderCreateEditProvided;

/**
 * @description Computed properties for UI states
 */
const isDecrementDisabled = computed(() => purchaseOrderCreateEdit_formDataOfEditQuantity.value.quantity <= 1);
</script>

<template>
  <AppBaseDialog id="purchase-order-create-edit-edit-quantity">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Edit Order Quantity</h5>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-6">
        <section id="product-item-information" class="grid grid-rows-2 grid-cols-12 gap-4">
          <section id="sku" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> SKU </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ purchaseOrderCreateEdit_formDataOfEditQuantity.sku }}
            </p>
          </section>

          <section id="name" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Item Name </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ purchaseOrderCreateEdit_formDataOfEditQuantity.name }}
            </p>
          </section>

          <section id="brand" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Brand </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ purchaseOrderCreateEdit_formDataOfEditQuantity.brandName }}
            </p>
          </section>

          <section id="unit" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Unit </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ purchaseOrderCreateEdit_formDataOfEditQuantity.unit }}
            </p>
          </section>

          <section id="unit" class="col-span-6 lg:col-span-4 flex flex-col gap-1">
            <span class="font-normal text-grayscale-70 text-sm"> Unit Price </span>

            <p class="font-normal text-base text-grayscale-70">
              {{ purchaseOrderCreateEdit_formDataOfEditQuantity.unitPrice }}
            </p>
          </section>
        </section>

        <section id="form-quantity" class="flex items-center px-1 gap-2">
          <section
            id="button-min"
            class="basic-smooth-animation bg-white border border-solid border-primary flex items-center justify-center font-medium text-sm text-primary w-9 h-9 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95"
            :class="{
              'cursor-not-allowed hover:bg-primary hover:text-white hover:scale-100': isDecrementDisabled,
            }"
            @click="purchaseOrderCreateEdit_onDecrementQuantity"
          >
            -
          </section>

          <PrimeVueInputNumber
            id="quantity"
            v-model="purchaseOrderCreateEdit_formDataOfEditQuantity.quantity"
            placeholder="0"
            :min="1"
            class="text-sm max-h-9"
            style="width: 80px"
            :pt="{
              pcInputText: {
                root: 'w-20',
              },
            }"
          />

          <section
            id="plus-min"
            class="basic-smooth-animation bg-blue-secondary-background flex items-center justify-center font-medium text-sm text-primary w-9 h-9 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95"
            @click="purchaseOrderCreateEdit_onIncrementQuantity"
          >
            +
          </section>
        </section>

        <section id="total-price-display" class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span class="font-medium text-base text-gray-700">Total Price:</span>
          <span class="font-semibold text-lg text-primary">
            {{
              useCurrencyFormat({
                data: purchaseOrderCreateEdit_formDataOfEditQuantity.totalPrice,
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
          @click="purchaseOrderCreateEdit_onCloseDialogEditQuantity"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Update"
          type="button"
          @click="purchaseOrderCreateEdit_onSubmitEditQuantity"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
