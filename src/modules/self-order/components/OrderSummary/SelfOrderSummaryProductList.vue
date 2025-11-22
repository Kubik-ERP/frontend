<script setup lang="ts">
// Components
import SelfOrderSummaryModalAddEditNotes from './Modal/SelfOrderSummaryModalAddEditNotes.vue';

// Interfaces
import { ISelfOrderProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_selectedProduct, selfOrder_modalAddEditNotes, selfOrder_calculateEstimation } =
  inject<ISelfOrderProvided>('selfOrder')!;

const showImageUrl = (picture: string | null) => {
  return APP_BASE_BUCKET_URL + picture;
};
</script>

<template>
  <section
    id="self-order-summary-product-list"
    class="flex flex-col overflow-y-scroll flex-grow border-b-grayscale-10 border-b-2 border-t-grayscale-10 p-4"
    :class="selfOrder_selectedProduct.length === 0 ? 'justify-center items-center' : ''"
  >
    <!-- Empty State -->
    <div v-if="selfOrder_selectedProduct.length === 0" class="text-center">
      <span class="text-grayscale-20">{{ useLocalization('cashier.orderSummary.noItemSelected') }}</span>
    </div>

    <!-- Product List -->
    <div v-else class="flex flex-col w-full gap-4">
      <template v-for="(item, key) in selfOrder_selectedProduct">
        <div v-if="item.type !== 'redeem'" :key="key" class="flex flex-col gap-4">
          <!-- Product Header: Delete Button + Product Info + Quantity Controls -->
          <div class="flex items-start gap-3">
            <!-- Delete Button -->
            <button
              class="flex-shrink-0 w-8 h-8 p-2 rounded-full bg-error-background hover:opacity-80 transition-opacity"
              :disabled="selfOrder_calculateEstimation.isLoading"
              @click="selfOrder_selectedProduct.splice(key, 1)"
            >
              <AppBaseSvg name="trash" class="!h-4 !w-4" />
            </button>

            <!-- Product Info -->
            <div class="flex-1 flex gap-3">
              <AppBaseImage
                :src="item.product?.pictureUrl == null ? null : showImageUrl(item.product?.pictureUrl)"
                alt="product"
                class="w-10 h-10 object-cover rounded flex-shrink-0"
              />

              <div class="flex-1 flex flex-col gap-1">
                <span class="text-sm font-semibold line-clamp-2">{{ item.product?.name }}</span>
                <div class="flex flex-col gap-0.5">
                  <span class="text-xs font-medium">{{
                    useCurrencyFormat({
                      data: item.product?.discountPrice ?? item.product?.price ?? 0,
                    })
                  }}</span>
                  <span
                    v-if="item.product?.discountPrice && item.product?.discountPrice < item.product?.price"
                    class="text-text-disabled text-[10px] line-through"
                    >{{
                      useCurrencyFormat({
                        data: item.product?.price,
                      })
                    }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Quantity Controls -->
            <div class="flex-shrink-0 flex items-center gap-2">
              <PrimeVueButton
                type="button"
                class="border border-primary text-primary px-3 h-8"
                variant="outlined"
                label="-"
                :disabled="selfOrder_calculateEstimation.isLoading"
                @click="item.quantity > 1 ? (item.quantity -= 1) : (item.quantity = 1)"
              />
              <PrimeVueInputNumber
                v-model="item.quantity"
                class="!w-12"
                input-class="!w-12 !text-center text-sm"
                :min="1"
                :disabled="selfOrder_calculateEstimation.isLoading"
              />
              <PrimeVueButton
                type="button"
                class="border border-primary text-primary px-3 h-8"
                variant="outlined"
                label="+"
                :disabled="selfOrder_calculateEstimation.isLoading"
                @click="item.quantity += 1"
              />
            </div>
          </div>

          <!-- Product Details Section -->
          <div class="flex flex-col gap-3 ml-11 border-l border-grayscale-10 pl-3">
            <!-- Variant Info -->
            <div v-if="item.variant.id" class="flex flex-col gap-1">
              <p class="font-semibold text-xs text-text-disabled">
                {{ useLocalization('cashier.mainSection.variant') }}
              </p>
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

            <!-- Bundled Products -->
            <section v-if="(item?.bundling?.products?.length || 0) > 0" class="flex flex-col gap-2">
              <span class="font-semibold text-sm">{{ useLocalization('cashier.mainSection.products') }}</span>

              <div class="border rounded-md border-grayscale-10 overflow-hidden">
                <div
                  v-for="product in item.bundling?.products"
                  :key="product.product_id"
                  class="flex justify-between items-center w-full p-2 hover:bg-grayscale-5 transition-colors"
                >
                  <label :for="product.product_id" class="text-sm cursor-pointer flex-1">
                    {{ product.name }}
                  </label>

                  <span class="text-sm text-text-disabled ml-2 flex-shrink-0">{{
                    product.price == 0 ? 'Free' : `Rp ${product.price}`
                  }}</span>
                </div>
              </div>
            </section>

            <!-- Notes Section -->
            <div v-if="item.notes" class="flex flex-col gap-1">
              <p class="font-semibold text-xs text-text-disabled">
                {{ useLocalization('cashier.mainSection.notes') }}
              </p>
              <p class="text-sm bg-grayscale-5 p-2 rounded">{{ item.notes }}</p>
            </div>

            <!-- Add/Edit Notes Button -->
            <PrimeVueButton
              type="button"
              variant="text"
              class="w-fit px-0 hover:opacity-80"
              @click="
                selfOrder_modalAddEditNotes.show = true;
                selfOrder_modalAddEditNotes.item = key;
                selfOrder_modalAddEditNotes.tempValue = item.notes;
              "
            >
              <div class="flex items-center gap-2">
                <AppBaseSvg name="add-notes" class="h-4 w-4 filter-primary-color" />
                <span class="font-semibold text-primary text-sm">{{
                  item.notes ? useLocalization('cashier.edit') : useLocalization('cashier.mainSection.addNotes')
                }}</span>
              </div>
            </PrimeVueButton>
          </div>

          <!-- Divider between items -->
          <div
            v-if="key !== selfOrder_selectedProduct.length - 1"
            class="border-b border-dashed border-grayscale-10 mt-2"
          ></div>
        </div>
      </template>
    </div>
  </section>

  <SelfOrderSummaryModalAddEditNotes />
</template>
