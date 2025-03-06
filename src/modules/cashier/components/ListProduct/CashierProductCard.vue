<script setup lang="ts">
import type { ICashierProduct } from '../../interfaces';

const props = defineProps({
  product: {
    type: Object as PropType<ICashierProduct>,
    required: true,
  },
});
</script>

<template>
  <section id="cashier-product-card">
    <PrimeVueCard
      :unstyled="true"
      :pt="{
        body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2',
      }"
    >
      <template #content>
        <section id="cashier-card-content" class="flex flex-col gap-2">
          <img :src="props.product.image" class="h-[98px] w-full object-cover" />

          <p class="font-semibold text-sm h-9 line-clamp-2">
            {{ props.product.name }}
          </p>

          <div class="flex w-full mt-2 justify-between items-end">
            <div class="bg-primary-background p-1 h-fit rounded-full">
              <span class="text-xs text-text-disabled">{{ props.product.category }}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-disabled line-through text-[10px]">{{ props.product.price }}</span>
              <span class="font-semibold">{{ props.product.discountedPrice }}</span>
            </div>
          </div>
        </section>
      </template>
    </PrimeVueCard>
  </section>
</template>

<style scoped>
section#cashier-product-card .p-card-body {
  padding: 0;
}
</style>
