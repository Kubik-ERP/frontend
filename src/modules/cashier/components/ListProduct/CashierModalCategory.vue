<script setup lang="ts">
// Interfaces
import { ICashierProductProvided } from '../../interfaces/cashier-product-service';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_modalCategory, cashierProduct_productState, cashierProduct_handleSelectCategory } =
  inject<ICashierProductProvided>('cashierProduct')!;
</script>
<template>
  <section id="cashier-modal-category">
    <PrimeVueDialog
      v-model:visible="cashierProduct_modalCategory.show"
      position="bottom"
      modal
      :dismissable-mask="true"
      class="w-full p-0 m-0 rounded-t-4xl"
    >
      <template #container="{ closeCallback }">
        <section id="cashier-summary-modal-order-type" class="flex flex-col px-4 py-6 gap-4">
          <span class="font-semibold">Category</span>

          <div class="overflow-y-auto h-72">
            <section
              v-for="category in cashierProduct_productState.listCategory"
              id="cashier-modal-category-item"
              :key="category.id"
              class="flex gap-4 py-2"
              @click="
                () => {
                  cashierProduct_handleSelectCategory(category.category);
                  closeCallback();
                }
              "
            >
              <AppBaseImage
                :src="category.image"
                :alt="category.category"
                class="h-9 w-9 rounded-full object-cover pointer-events-none"
              />

              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold">{{ category.category }}</span>
                <span class="text-xs text-text-disabled">{{ category.categoriesHasProducts.length }} Items</span>
              </div>
            </section>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
