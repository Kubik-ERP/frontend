<script setup lang="ts">
// Interfaces
import type { ICashierProduct } from '../../interfaces';
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';

const props = defineProps({
  product: {
    type: Object as PropType<ICashierProduct>,
    required: true,
  },
});

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_handleOpenModalAddProduct, isProductActive } =
  inject<ICashierProductProvided>('cashierProduct')!;
</script>

<template>
  <section id="cashier-product-card">
    <PrimeVueCard
      :unstyled="true"
      :pt="{
        body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2 cursor-pointer hover:border-grayscale-20 active:bg-grayscale-10/5',
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
          <img :src="props.product.image" class="h-[98px] w-full object-cover" />

          <div
            v-if="isProductActive(props.product)"
            class="absolute py-1 px-1.5 border border-primary-border bg-blue-primary left-0 ml-1 mt-1 rounded-full flex gap-2"
          >
            <AppBaseSvg name="check" class="h-w-2.5" />
            <span class="text-xs text-white font-semibold"> Selected </span>
          </div>

          <p class="font-semibold text-sm h-10 line-clamp-2">
            {{ props.product.name }}
          </p>

          <div class="flex w-full mt-2 justify-between items-end">
            <div class="bg-primary-background p-1 h-fit rounded-full">
              <span class="text-xs text-text-disabled">{{ props.product.category }}</span>
            </div>
            <div class="flex flex-col">
              <span
                v-if="props.product.discountedPrice"
                class="h-4 text-disabled line-through text-[10px] text-right"
                >Rp{{ props.product.price }}</span
              >
              <span v-else class="h-4"></span>

              <span class="font-semibold text-right"
                >Rp{{ props.product.discountedPrice ?? props.product.price }}</span
              >
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
  </section>
</template>
