<script setup lang="ts">
// Interfaces
import type { ICashierProduct } from '../../interfaces';
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service';

// Vue
import { computed } from 'vue';

const props = defineProps({
  product: {
    type: Object as PropType<ICashierProduct>,
    required: true,
  },
});

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_modalAddEditItem, isProductActive } = inject<ICashierProductProvided>('cashierProduct')!;
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
      @click="
        cashierProduct_modalAddEditItem.show = true;
        cashierProduct_modalAddEditItem.product = props.product;
      "
    >
      <template #content>
        <section id="cashier-card-content" class="flex justify-between w-full gap-2 relative">
          <div class="flex gap-2">
            <PrimeVueCheckbox :model-value="isProductActive(props.product)" binary />

            <div class="flex flex-col gap-1">
              <p class="font-semibold text-sm">
                {{ props.product.name }}
              </p>

              <div class="bg-primary-background p-1 h-fit rounded-full w-max">
                <span class="text-xs text-text-disabled">{{ props.product.category }}</span>
              </div>
            </div>
          </div>

          <div class="flex mt-2 justify-between">
            <div class="flex flex-col">
              <span class="font-semibold text-sm text-primary-hover"
                >Rp.{{ props.product.discountedPrice ?? props.product.price }}</span
              >

              <span v-if="props.product.discountedPrice" class="text-disabled line-through text-[10px] text-right"
                >Rp.{{ props.product.price }}</span
              >
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
  </section>
</template>
