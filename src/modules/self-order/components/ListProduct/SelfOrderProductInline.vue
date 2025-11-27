<script setup lang="ts">
// Interfaces
import type { ISelfOrderProvided, ISelfOrderProductItem } from '../../interfaces';

const props = defineProps({
  product: {
    type: Object as PropType<ISelfOrderProductItem>,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: false,
  },
});

/**
 * @description Inject all the data and methods what we need
 */
const { selfOrder_productState, selfOrder_handleOpenModalAddProduct, isProductActive } =
  inject<ISelfOrderProvided>('selfOrder')!;
</script>

<template>
  <section id="self-order-product-card">
    <PrimeVueCard
      v-if="!selfOrder_productState.isLoadingProduct"
      :unstyled="true"
      :pt="{
        body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2 cursor-pointer hover:border-grayscale-20 active:bg-grayscale-10/5',
      }"
      :class="{
        'border-primary-border border rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]': isProductActive(
          props.product,
        ),
      }"
      @click="selfOrder_handleOpenModalAddProduct(props.product)"
    >
      <template #content>
        <section id="self-order-card-content" class="flex justify-between w-full gap-2 relative">
          <div class="flex gap-2">
            <PrimeVueCheckbox :model-value="isProductActive(props.product)" binary />

            <div class="flex flex-col gap-1">
              <p class="font-semibold text-sm">
                {{ props.product.name }}
              </p>

              <div class="flex items-center gap-2">
                <PrimeVueChip
                  class="bg-primary text-white font-normal text-xs px-2 py-[6px]"
                  :label="`Stock: ${props.stock != null ? props.stock : 'N/A'}`"
                />
              </div>

              <div class="bg-primary px-2 py-[6px] h-fit rounded-full w-max">
                <span class="text-xs text-white">{{ props.category }}</span>
              </div>
            </div>
          </div>

          <div class="flex mt-2 justify-between">
            <div class="flex flex-col">
              <!-- Harga coret (asli) -->
              <span
                v-if="props.product.discountPrice != null && props.product.discountPrice < props.product.price"
                class="h-4 text-disabled line-through text-[10px] text-right"
              >
                {{ useCurrencyFormat({ data: props.product.price }) }}
              </span>
              <span v-else class="h-4"></span>

              <!-- Harga final -->
              <span class="font-semibold text-right">
                {{
                  useCurrencyFormat({
                    data:
                      props.product.discountPrice != null && props.product.discountPrice < props.product.price
                        ? props.product.discountPrice
                        : props.product.price,
                  })
                }}
              </span>
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
    <PrimeVueCard
      v-else
      :unstyled="true"
      :pt="{
        body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2',
      }"
    >
      <template #content>
        <section class="flex justify-between w-full gap-2 relative">
          <div class="flex gap-2">
            <PrimeVueSkeleton shape="circle" width="20px" height="20px" />

            <div class="flex flex-col gap-1">
              <PrimeVueSkeleton width="120px" height="16px" />
              <PrimeVueSkeleton width="60px" height="18px" border-radius="9999px" />
            </div>
          </div>

          <div class="flex mt-2 justify-between">
            <div class="flex flex-col items-end">
              <PrimeVueSkeleton width="80px" height="16px" />
              <PrimeVueSkeleton width="60px" height="12px" />
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
  </section>
</template>
