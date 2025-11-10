<script setup lang="ts">
// components
import ProductVariantPill from '../components/ProductVariantPill.vue';
import ProductVariant from '../components/ProductDetails/ProductVariant.vue';
import PortionStock from '../components/ProductDetails/PortionStock.vue';

// service
import { useProductDetailsService } from '../services/product-details.service';
const {
  productDetails_portionStock_columns,
  productDetails_productVariants_columns,
  productDetails,
  productDetails_isLoading,
  productDetails_fetchProductDetails,
} = useProductDetailsService();

provide('productDetails', {
  productDetails_portionStock_columns,
  productDetails_productVariants_columns,
  productDetails,
  productDetails_isLoading,
});

const salesReport_activeTab = ref<string>('product-variant');
const salesReport_listTabs = ref<ITabs[]>([
  {
    component: markRaw(ProductVariant),
    label: 'Product Variant',
    value: 'product-variant',
  },
  {
    component: markRaw(PortionStock),
    label: 'Portion Stock',
    value: 'portion-stock',
  },
]);

watch(
  salesReport_activeTab,
  async newTab => {
    switch (newTab.toUpperCase()) {
      case 'PRODUCT-VARIANT': {
        break;
      }
      case 'PORTION-STOCK': {
        break;
      }
      default: {
        console.warn(`Unknown tab: ${newTab}`);
      }
    }
  },
  {
    immediate: true,
  },
);

// const route = useRoute();
const photoUrl = (image: string) => {
  return APP_BASE_BUCKET_URL + image;
};
const route = useRoute();
onMounted(async () => {
  // await productDetails_fetchProductDetails(route.params.id as string);
  await productDetails_fetchProductDetails(route.params.id as string);
});
</script>
<template>
  <header class="flex items-center justify-between">
    <h1 class="text-xl font-semibold">Product information</h1>
    <router-link :to="{ name: 'catalog.products.edit', params: { id: (productDetails?.id as string) || '12' } }">
      <PrimeVueButton variant="outlined" label="Edit Product Details" class="border border-primary text-primary">
        <template #icon>
          <AppBaseSvg name="edit" class="!w-5 !h-5 filter-primary-color" />
        </template>
      </PrimeVueButton>
    </router-link>
  </header>

  <main class="grid grid-cols-2 gap-4 py-8">
    <section class="col-span-2 flex flex-col">
      <label for="photo">Photo</label>
      <AppBaseImage
        :src="photoUrl(productDetails?.photoUrl)"
        alt="Photo"
        class="w-32 h-32 object-cover rounded-xl"
      />
    </section>

    <section>
      <label for="name" class="block text-sm font-medium leading-6 text-gray-900">Product Name</label>
      <p>{{ productDetails?.name }}</p>
    </section>

    <section>
      <label for="category" class="block text-sm font-medium leading-6 text-gray-900">Category</label>
      <ProductVariantPill :variants="productDetails?.categories || []" />
    </section>

    <section v-if="productDetails?.menuRecipes?.length > 0" class="">
      <label for="link-to-recipe" class="block text-sm font-medium leading-6 text-gray-900">Link to Recipe</label>
      <router-link :to="{ name: 'menu-recipe.detail', params: { id: productDetails?.menuRecipes[0].recipeId } }">
        <p class="text-blue-500">{{ productDetails?.menuRecipes[0].recipeName }}</p>
      </router-link>
    </section>
    <section class="">
      <label for="stock-quantity" class="block text-sm font-medium leading-6 text-gray-900">Stock Quantity</label>
      <p>{{ productDetails?.stockQuantity }}</p>
    </section>

    <h2 class="col-span-2 text-xl font-semibold">Product Price</h2>

    <section>
      <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Product Price</label>
      <p>{{ useCurrencyFormat({ data: productDetails?.price }) }}</p>
    </section>
    <section>
      <label for="price" class="block text-sm font-medium leading-6 text-gray-900">Product Discount</label>
      <p>{{ useCurrencyFormat({ data: productDetails?.discountPrice }) }}</p>
    </section>

    <section class="col-span-2">
      <AppBaseTabs v-model:value="salesReport_activeTab" :items="salesReport_listTabs" />
    </section>
  </main>
</template>
