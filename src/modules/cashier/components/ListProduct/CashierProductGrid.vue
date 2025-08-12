<script setup lang="ts">
// Interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';
import { ICashierProduct } from '../../interfaces/cashier-response';

const props = defineProps({
  product: {
    type: Object as PropType<ICashierProduct>,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_productState, cashierProduct_handleOpenModalAddProduct, isProductActive } =
  inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <section id="cashier-product-card">
    <PrimeVueCard v-if="!cashierProduct_productState.isLoadingProduct" :unstyled="true" :pt="{
      body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2 cursor-pointer hover:border-grayscale-20 active:bg-grayscale-10/5',
    }" :class="{
        'border-primary-border border rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]': isProductActive(
          props.product,
        ),
      }" @click="cashierProduct_handleOpenModalAddProduct(props.product)">
      <template #content>
        <section id="cashier-card-content" class="flex flex-col gap-2 relative">
          <div class="flex justify-between">
            <p class="font-semibold text-sm h-10 line-clamp-2">
              {{ props.product.name }}
            </p>

            <PrimeVueCheckbox :model-value="isProductActive(props.product)" binary />
          </div>

          <div class="flex w-full mt-2 justify-between items-end">
            <div class="bg-primary-background p-1 h-fit rounded-full">
              <span class="text-xs text-text-disabled">{{ props.category }}</span>
            </div>
            <div class="flex flex-col">
              <span v-if="props.product.discountPrice != null && props.product.discountPrice < props.product.price"
                class="h-4 text-disabled line-through text-[10px] text-right">
                Rp{{ props.product.price }}
              </span>
              <span v-else class="h-4"></span>

              <span class="font-semibold text-right">
                Rp{{ props.product.discountPrice != null && props.product.discountPrice < props.product.price ?
                  props.product.discountPrice : props.product.price }} </span>
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
    <PrimeVueCard v-else :unstyled="true" :pt="{
      body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2',
    }">
      <template #content>
        <section class="flex flex-col gap-2 relative">
          <div class="flex justify-between items-start">
            <PrimeVueSkeleton height="40px" width="70%" class="rounded-sm" />
            <PrimeVueSkeleton shape="circle" width="20px" height="20px" />
          </div>

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
