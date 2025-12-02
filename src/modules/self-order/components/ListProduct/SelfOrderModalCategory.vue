<script setup lang="ts">
// Interfaces
import { ISelfOrderProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods we need
 */
const { selfOrder_modalCategory, selfOrder_productState, selfOrder_handleSelectCategory } =
  inject<ISelfOrderProvided>('selfOrder')!;

const imageUrl = (image: string) => {
  return APP_BASE_BUCKET_URL + image;
};
</script>

<template>
  <section id="self-order-modal-category">
    <PrimeVueDialog
      v-model:visible="selfOrder_modalCategory.show"
      position="bottom"
      modal
      :dismissable-mask="true"
      class="w-full p-0 m-0 rounded-t-4xl"
    >
      <template #container="{ closeCallback }">
        <section id="self-order-summary-modal-order-type" class="flex flex-col px-4 py-6 gap-4">
          <span class="font-semibold">{{ useLocalization('cashier.categoryOrShowBundles') }} or show bundles</span>

          <div class="overflow-y-auto h-72">
            <!-- 🧩 Existing categories -->
            <section
              v-for="category in selfOrder_productState.listCategory"
              id="self-order-modal-category-item"
              :key="category.id"
              class="flex gap-4 p-2 cursor-pointer"
              :class="{
                'border-primary-border border bg-primary-background rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]':
                  selfOrder_productState.selectedCategory === category.id,
              }"
              @click="
                () => {
                  selfOrder_handleSelectCategory(category.id);
                  closeCallback();
                }
              "
            >
              <AppBaseImage
                :src="imageUrl(category.pictureUrl)"
                :alt="category.category"
                class="h-9 w-9 rounded-full object-cover pointer-events-none"
              />

              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold">{{ category.category }}</span>
                <span class="text-xs text-text-disabled">
                  {{ category.totalItems }} {{ useLocalization('cashier.items') }}
                </span>
              </div>
            </section>

            <!-- 🆕 Product Bundles Button -->
            <section
              id="self-order-modal-category-bundle"
              class="flex gap-4 p-2 cursor-pointer"
              :class="{
                'border-primary-border border bg-primary-background rounded-sm shadow-[0px_0px_10px_2px_rgba(24,97,139,0.1)]':
                  selfOrder_productState.selectedCategory === 'bundle',
              }"
              @click="
                () => {
                  selfOrder_handleSelectCategory('bundle');
                  closeCallback();
                }
              "
            >
              <AppBaseImage
                src="/images/icons/package.svg"
                alt="Product Bundles"
                class="h-9 w-9 rounded-full object-cover pointer-events-none"
              />

              <div class="flex flex-col gap-1">
                <span class="text-xs font-semibold">Product Bundles</span>
                <!-- <span class="text-xs text-text-disabled">
                  {{ productBundling_list?.data?.length || 0 }} {{ useLocalization('cashier.items') }}
                </span> -->
              </div>
            </section>
          </div>
        </section>
      </template>
    </PrimeVueDialog>
  </section>
</template>
