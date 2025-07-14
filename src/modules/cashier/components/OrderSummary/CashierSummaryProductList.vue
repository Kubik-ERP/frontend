<script setup lang="ts">
// Components
import CashierSummaryModalAddEditNotes from './Modal/CashierSummaryModalAddEditNotes.vue';

// Interfaces
import { ICashierProductProvided } from '../../interfaces/cashier-product-service';
import { ICashierOrderSummaryProvided } from '../../interfaces/cashier-order-summary';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_selectedProduct } = inject<ICashierProductProvided>('cashierProduct')!;
const { cashierOrderSummary_modalAddEditNotes, cashierOrderSummary_calculateEstimation } =
  inject<ICashierOrderSummaryProvided>('cashierOrderSummary')!;

const showImageUrl = (picture: string | null) => {
  return picture ? picture : 'assets/images/product-placeholder.png';
};
</script>

<template>
  <section
    id="cashier-summary-product-list"
    class="flex flex-col overflow-y-auto flex-grow border-b-grayscale-10 border-b-2 p-4 border-t-grayscale-10 justify-center items-center"
    :class="cashierProduct_selectedProduct.length === 0 ? 'justify-center' : 'justify-start'"
  >
    <div v-if="cashierProduct_selectedProduct.length === 0" class="">
      <span class="text-grayscale-20">No item selected</span>
    </div>
    <div v-else class="flex flex-col w-full justify-center items-center">
      <div
        v-for="(item, key) in cashierProduct_selectedProduct"
        :key="key"
        class="grid grid-cols-12 gap-4 w-full justify-items-center"
        :class="{ 'mb-4': key !== cashierProduct_selectedProduct.length - 1 }"
      >
        <button
          class="cursor-pointer w-min h-min p-2 rounded-full bg-error-background"
          :disabled="cashierOrderSummary_calculateEstimation.isLoading"
          @click="cashierProduct_selectedProduct.splice(key, 1)"
        >
          <AppBaseSvg name="trash" class="!h-4 !w-4" />
        </button>
        <div class="col-span-6 xl:col-span-7 flex flex-col gap-4">
          <div class="flex gap-4">
            <AppBaseImage
              :src="showImageUrl(item.product.pictureUrl)"
              alt="product"
              class="w-10 h-10 object-cover"
            />

            <div class="flex flex-col">
              <span class="text-sm font-semibold">{{ item.product.name }}</span>
              <div class="flex flex-col w-fit">
                <span class="text-xs">{{
                  useCurrencyFormat({
                    data: item.product.discountPrice ?? item.product.price,
                  })
                }}</span>
                <span
                  v-if="item.product.discountPrice"
                  class="text-text-disabled text-[10px] line-through text-right"
                  >{{
                    useCurrencyFormat({
                      data: item.product.price,
                    })
                  }}</span
                >
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <div v-if="item.variant.id">
              <p class="font-semibold text-xs text-text-disabled">Variant</p>
              <p class="text-sm">
                {{ item.variant.name }}
                <span v-if="item.variant.price > 0" class="text-xs text-text-disabled"
                  >(+{{
                    useCurrencyFormat({
                      data: item.variant.price,
                    })
                  }})</span
                >
              </p>
            </div>

            <div v-if="item.notes">
              <p class="font-semibold text-xs text-text-disabled">Notes</p>
              <p class="text-sm">{{ item.notes }}</p>
            </div>

            <PrimeVueButton
              variant="text"
              class="w-fit"
              @click="
                cashierOrderSummary_modalAddEditNotes.show = true;
                cashierOrderSummary_modalAddEditNotes.item = key;
                cashierOrderSummary_modalAddEditNotes.tempValue = item.notes;
              "
            >
              <AppBaseSvg name="add-notes" />

              <span class="font-semibold text-primary">{{ item.notes ? 'Edit' : 'Add Notes' }}</span>
            </PrimeVueButton>
          </div>
        </div>
        <div class="col-span-5 xl:col-span-4">
          <div class="flex items-center gap-2">
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="-"
              :disabled="cashierOrderSummary_calculateEstimation.isLoading"
              @click="item.quantity > 1 ? (item.quantity -= 1) : (item.quantity = 1)"
            />
            <PrimeVueInputNumber
              v-model="item.quantity"
              class="!w-14"
              input-class="!w-14 justify-items-center text-center"
              :min="1"
              :disabled="cashierOrderSummary_calculateEstimation.isLoading"
            />
            <PrimeVueButton
              type="button"
              class="border border-primary text-primary px-4"
              variant="outlined"
              label="+"
              :disabled="cashierOrderSummary_calculateEstimation.isLoading"
              @click="item.quantity == item.product.quantity ? item.quantity : (item.quantity += 1)"
            />
          </div>
        </div>

        <div
          v-if="key !== cashierProduct_selectedProduct.length - 1"
          class="border col-span-12 border-dashed border-b-2 border-grayscale-10 w-full"
        ></div>
      </div>
    </div>
  </section>

  <CashierSummaryModalAddEditNotes />
</template>
