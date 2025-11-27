<script setup lang="ts">
// interfaces
import type { ICashierProductProvided } from '../../interfaces/cashier-product-service.interface';
import { useProductBundlingService } from '@/modules/product-bundling/services/product-bundling.service';

// Component
import CashierProductCard from './CashierProductCard.vue';
import CashierProductGrid from './CashierProductGrid.vue';
import CashierProductInline from './CashierProductInline.vue';
import CashierListProductNotFound from './CashierListProductNotFound.vue';
import CashierListBundleNotFound from './CashierListBundleNotFound.vue';

// Vue
import { computed, onMounted } from 'vue';
import CashierCategoryNotFound from './CashierCategoryNotFound.vue';

/**
 * @description Inject all the data and methods what we need
 */
const { cashierProduct_productState, cashierProduct_selectedView } =
  inject<ICashierProductProvided>('cashierProduct')!;

/**
 * @description Setup product bundling service
 */
const { productBundling_fetchProductBundlingList, productBundling_list } = useProductBundlingService();

// Update query params to show all bundles
// productBundling_queryParams.limit = 100;

/**
 * @description Load product bundles on mount
 */
onMounted(() => {
  productBundling_fetchProductBundlingList();
});

/**
 * @description Computed properties to determine which component to use
 */
const selectedComponent = computed(() => {
  const components = {
    image: CashierProductCard,
    grid: CashierProductGrid,
    inline: CashierProductInline,
  };

  return components[cashierProduct_selectedView.value] || null;
});

/**
 * @description Wrapper class for the list of products
 */
const wrapperClass = computed(() => {
  return {
    'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4':
      cashierProduct_selectedView.value === 'image' || cashierProduct_selectedView.value === 'grid',
    'flex flex-col gap-4': cashierProduct_selectedView.value === 'inline',
  };
});
</script>

<template>
  <template v-if="!cashierProduct_productState.isLoadingProduct">
    <template
      v-if="
        cashierProduct_productState.listProductCategory.length > 0 &&
        cashierProduct_productState.selectedCategory !== 'bundle'
      "
    >
      <section
        v-for="(item, index) in cashierProduct_productState.listProductCategory"
        id="cashier-list-featured-product"
        :key="index"
        class="flex flex-col gap-4"
      >
        <template v-if="item.items.length > 0">
          <h2 class="font-normal text-xs text-text-disabled">{{ item.category }}</h2>

          <section id="cashier-list-wrapper-class" :class="wrapperClass">
            <component
              :is="selectedComponent"
              v-for="product in item.items"
              :key="product.id"
              :product="product"
              :category="item.category"
              :stock="product.stockQuantity"
            />
          </section>
        </template>
        <template v-else-if="item.items.length === 0 && cashierProduct_productState.selectedCategory === item.id">
          <CashierCategoryNotFound />
        </template>
      </section>
    </template>
    <template
      v-if="
        cashierProduct_productState.listProductCategory.length == 0 &&
        cashierProduct_productState.selectedCategory !== 'bundle'
      "
    >
      <CashierListProductNotFound />
    </template>

    <!-- Product Bundles Section -->
    <template
      v-if="
        (cashierProduct_productState.selectedCategory === '' ||
          cashierProduct_productState.selectedCategory === 'bundle') &&
        Array.isArray(productBundling_list?.data) &&
        productBundling_list.data.length > 0
      "
    >
      <section id="cashier-list-product-bundles" class="flex flex-col gap-4">
        <h2 class="font-normal text-xs text-text-disabled">Product Bundles</h2>
        <section id="cashier-list-wrapper-class" :class="wrapperClass">
          <component
            :is="selectedComponent"
            v-for="bundle in productBundling_list.data"
            :key="bundle.id"
            :product="{
              id: bundle.id,
              name: bundle.name,
              price: bundle.price,
              discountPrice: bundle.price,
              pictureUrl: bundle.picture_url ?? '',
              isPercent: false,
              discount: bundle.discount,
              type: 'bundling',
              products:
                bundle.products?.map(p => ({
                  product_id: p.product_id ?? 0,
                  quantity: p.quantity ?? 0,
                  name: p.product_name ?? '',
                  price: p.product_price ?? 0,
                })) ?? [],
              description: bundle.description,
              bundlingType: bundle.type,
              barcode: `BUNDLE-${bundle.id}`,
              variant: [],
            }"
            :category="'Bundle'"
          />
        </section>
      </section>
    </template>

    <template
      v-if="productBundling_list.data.length == 0 && cashierProduct_productState.selectedCategory === 'bundle'"
    >
      <CashierListBundleNotFound />
    </template>
  </template>
  <template v-else>
    <div class="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      <PrimeVueCard
        v-for="i in 5"
        :key="i"
        :unstyled="true"
        :pt="{
          body: 'rounded-sm bg-white border border-grayscale-10 shadow-none drop-shadow-none p-2',
        }"
      >
        <template #content>
          <section class="flex flex-col gap-2 relative">
            <PrimeVueSkeleton height="98px" class="w-full rounded-sm" />

            <div
              class="absolute py-1 px-1.5 border border-primary-border bg-primary left-0 ml-1 mt-1 rounded-full flex gap-2"
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
    </div>
  </template>
</template>

<style scoped></style>
