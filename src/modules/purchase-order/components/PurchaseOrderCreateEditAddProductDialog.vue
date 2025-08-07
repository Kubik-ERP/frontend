<script setup lang="ts">
// Interfaces
import type { IPurchaseOrderCreateEditProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  purchaseOrderCreateEdit_formData,
  purchaseOrderCreateEdit_listColumns,
  purchaseOrderCreateEdit_listProductItems,
  purchaseOrderCreateEdit_onCloseDialogAddProductItem,
  purchaseOrderCreateEdit_onSubmitAddProductItem,
  purchaseOrderCreateEdit_selectedProductItem,
} = inject('purchaseOrderCreateEdit') as IPurchaseOrderCreateEditProvided;
</script>

<template>
  <AppBaseDialog id="purchase-order-create-edit-add-product-item">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Add Item Order</h5>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-4">
        <section id="product-items" class="flex flex-col gap-1 w-full">
          <span class="font-semibold text-base text-black"> Product Items </span>

          <PrimeVueSelect
            id="supplier"
            v-model="purchaseOrderCreateEdit_selectedProductItem"
            filter
            :options="purchaseOrderCreateEdit_listProductItems"
            option-label="label"
            option-value="value"
            placeholder="Search by SKU, Item Name, or Brand"
            class="text-base text-text-primary w-full"
            @change="
              event => {
                if (event.value) {
                  // Add to staging area (formData) only, not to selectedProductItems yet
                  const existingIndex = purchaseOrderCreateEdit_formData.productItems.findIndex(
                    item => item.id === event.value.id,
                  );
                  if (existingIndex === -1) {
                    purchaseOrderCreateEdit_formData.productItems.push(event.value);
                  }
                  purchaseOrderCreateEdit_selectedProductItem = null; // Reset dropdown
                }
              }
            "
          />
        </section>

        <AppBaseDataTable
          :columns="purchaseOrderCreateEdit_listColumns"
          :data="purchaseOrderCreateEdit_formData.productItems"
          is-using-custom-body
          :is-using-pagination="false"
          :is-using-header="false"
          :max-visible-rows="5"
        >
          <template #body="{ column, data, index }">
            <template v-if="column.value === 'unitPrice' || column.value === 'totalPrice'">
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

            <template v-else-if="column.value === 'quantity'">
              <section id="form-quantity" class="flex items-center px-1 gap-2">
                <section
                  id="button-min"
                  class="basic-smooth-animation bg-white border border-solid border-primary flex items-center justify-center font-medium text-sm text-primary w-9 h-9 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-primary hover:text-white transform hover:scale-105 active:scale-95"
                  :class="{
                    'cursor-not-allowed hover:bg-primary hover:text-white hover:scale-100':
                      purchaseOrderCreateEdit_formData.productItems[index].quantity === 0,
                  }"
                  @click="
                    () => {
                      if (purchaseOrderCreateEdit_formData.productItems[index].quantity > 1) {
                        purchaseOrderCreateEdit_formData.productItems[index].quantity =
                          purchaseOrderCreateEdit_formData.productItems[index].quantity - 1;
                      }
                    }
                  "
                >
                  -
                </section>

                <PrimeVueInputNumber
                  id="quantity"
                  v-model="purchaseOrderCreateEdit_formData.productItems[index].quantity"
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
                  @click="
                    purchaseOrderCreateEdit_formData.productItems[index].quantity =
                      purchaseOrderCreateEdit_formData.productItems[index].quantity + 1
                  "
                >
                  +
                </section>
              </section>
            </template>

            <template v-else-if="column.value === 'action'">
              <PrimeVueButton
                class="w-fit border-none bg-transparent basic-smooth-animation hover:bg-grayscale-10 p-2 rounded-sm"
                severity="secondary"
                @click="
                  purchaseOrderCreateEdit_formData.productItems =
                    purchaseOrderCreateEdit_formData.productItems.filter(item => item.id !== data.id)
                "
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2">
                    <AppBaseSvg name="delete" class="w-4 h-4 cursor-pointer" />
                  </section>
                </template>
              </PrimeVueButton>
            </template>

            <template v-else>
              <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
            </template>
          </template>
        </AppBaseDataTable>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="purchaseOrderCreateEdit_onCloseDialogAddProductItem"
        />

        <PrimeVueButton
          class="bg-blue-primary border-none text-base py-[10px] w-full max-w-40"
          label="Add"
          type="button"
          @click="purchaseOrderCreateEdit_onSubmitAddProductItem"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
