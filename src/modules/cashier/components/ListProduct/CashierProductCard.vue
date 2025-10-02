<script setup lang="ts">
// Interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';
import { IProductItem } from '../../interfaces/cashier-response';

const props = defineProps({
  product: {
    type: Object as PropType<IProductItem>,
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
const { cashierProduct_productState, cashierProduct_handleOpenModalAddProduct, isProductActive } =
  inject<ICashierProductProvided>('cashierProduct')!;

const imageUrl = computed(() => {
  return APP_BASE_BUCKET_URL + props.product.pictureUrl;
});
</script>

<template>
  <section id="cashier-product-card">
    <PrimeVueCard
      v-if="!cashierProduct_productState.isLoadingProduct"
      :unstyled="true"
      :pt="{
        body: 'rounded-2x bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2 cursor-pointer hover:border-grayscale-20 active:bg-grayscale-10/5',
      }"
      :class="{
        'border-primary-border border rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]': isProductActive(
          props.product,
        ),
      }"
      @click="cashierProduct_handleOpenModalAddProduct(props.product)"
    >
      <template #content>
        <section id="cashier-card-content" class="flex flex-col gap-2 relative">
          <AppBaseImage :src="imageUrl" :alt="props.product.name" class="h-40 w-full object-cover rounded-sm" />

          <div
            v-if="isProductActive(props.product)"
            class="absolute py-1 px-1.5 border border-primary-border bg-blue-primary left-0 ml-1 mt-1 rounded-full flex gap-2"
          >
            <AppBaseSvg name="check" class="h-w-2.5 h-4 w-4" />
            <span class="text-xs text-white font-semibold"> {{ useLocalization('cashier.selected') }} </span>
          </div>

          <div class="flex flex-col gap-1">
            <p class="font-semibold text-sm h-fit line-clamp-2">
              {{ props.product.name }}
            </p>

            <p class="font-normal text-xs text-text-disabled">Stock: {{ props.stock }}</p>
          </div>

          <div class="flex w-full mt-2 justify-between items-end">
            <PrimeVueChip
              class="bg-primary-background font-normal text-xs px-2 py-[6px] text-text-disabled"
              :label="props.category"
            />

            <!-- <div class="bg-primary-background py-1 px-2 h-fit rounded-full">
              <span class="text-xs text-text-disabled">{{ props.category }}</span>
            </div> -->

            <div class="flex flex-col">
              <!-- Harga coret (asli) -->
              <span
                v-if="props.product.discountPrice != null && props.product.discountPrice < props.product.price"
                class="h-4 text-disabled line-through text-[10px] text-right"
              >
                {{
                  useCurrencyFormat({
                    data: props.product.price,
                  })
                }}
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
        <section class="flex flex-col gap-2 relative">
          <PrimeVueSkeleton height="98px" class="w-full rounded-sm" />

          <div
            class="absolute py-1 px-1.5 border border-primary-border bg-blue-primary left-0 ml-1 mt-1 rounded-full flex gap-2"
          >
            <PrimeVueSkeleton shape="circle" width="12px" height="12px" />
            <PrimeVueSkeleton width="40px" height="12px" />
          </div>

          <PrimeVueSkeleton height="32px" class="rounded-sm" />

          <div class="flex w-full mt-2 justify-between items-end">
            <PrimeVueSkeleton width="60px" height="20px" border-radius="9999px" />

            <div class="flex flex-col items-end">
              <PrimeVueSkeleton width="40px" height="12px" />
              <PrimeVueSkeleton width="60px" height="16px" />
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
  </section>
</template>
