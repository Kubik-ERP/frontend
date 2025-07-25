<script setup lang="ts">
// Interfaces
import { ICashierProductProvided } from '../../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_modalCategory } = inject<ICashierProductProvided>('cashierProduct')!;
</script>
<template>
  <section
    id="cashier-main-section-background-category"
    class="lg:hidden absolute z-10 inset-x-0 bottom-20 flex items-center justify-center"
  >
    <PrimeVueButton
      variant="outlined"
      severity="primary"
      class="bg-white rounded-full"
      @click="cashierProduct_modalCategory.show = true"
    >
      <div class="flex gap-2 items-center">
        <AppBaseSvg name="catalog" class="!h-4 !w-5" />

        <span class="font-semibold text-sm text-primary">{{ useLocalization('cashier.category') }}</span>
      </div>
    </PrimeVueButton>
  </section>
</template>
