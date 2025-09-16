<script setup lang="ts">
import { useRbac } from '@/app/composables/useRbac';
const rbac = useRbac();
const hasPermission = rbac.hasPermission('product_management');
// service
import { useDiscountService } from '../services/item-discount.service';

const selectedProducts = ref<{ id: number; name: string }>();
const selectedCategories = ref([]);
const categories = ref([]);

const {
  productList_isLoading,
  productList_values,

  fetchProductList,
} = useDiscountService();
const op = ref();

const displayPopover = (event: Event, product: { id: number; name: string }) => {
  selectedProducts.value = product;
  op.value.show(event);
  // console.log('product', product);
};

const router = useRouter();

const page = ref(1);
const limit = ref(10);
const search = ref('');
const lastPage = ref(0);

const visiblePages = computed(() => {
  const range = 5;
  const start = Math.max(1, Math.min(page.value - 2, lastPage.value - range + 1));
  const end = Math.min(lastPage.value, start + range - 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});



const onPageChange = (event: { page: number; rows: number }) => {
  page.value = event.page + 1; // event.page is 0-based
  fetchProductList();
};

function goToPage(p: number) {
  router.push({ query: { page: p.toString() } });
  page.value = p;
  fetchProductList();
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value = page.value + 1;
    router.push({ query: { page: page.value.toString() } });
    fetchProductList();
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value = page.value - 1;
    router.push({ query: { page: page.value.toString() } });
    fetchProductList();
  }
};

const handleSearch = () => {
  router.push({ query: { page: '1' } });
  page.value = 1;
  fetchProductList();
};

onMounted(async () => {
  await fetchProductList();
  console.log('productList_isLoading', productList_isLoading.value);
  console.log('productList_values', productList_values.value);
});
</script>
<template>
  <div>
    <PrimeVueDataTable
      v-model:selection="selectedProducts"
      :value="productList_values"
      :rows="limit"
      data-key="ID"
      paginator
      :pt="{
        root: 'rounded-sm border border-solid border-grayscale-20',
      }"
      @page="onPageChange"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold">{{ useLocalization('main.table.title') }}</h1>
          </div>
          <div class="flex flex-wrap gap-4 justify-end">
            <div class="flex flex-col w-64 max-w-64">
              <PrimeVueMultiSelect
                v-model="selectedCategories"
                name="category"
                display="chip"
                :options="categories"
                option-label="category"
                filter
                :placeholder="useLocalization('main.table.filter')"
                class="w-full text-primary"
              >
                <template #dropdownicon>
                  <AppBaseSvg name="chevron-down" class="!w-4 !h-4" />
                </template>
                <template #option="{ option }">
                  {{ option.category }}
                </template>
              </PrimeVueMultiSelect>
            </div>
            <form @submit.prevent="handleSearch">
              <PrimeVueIconField>
                <PrimeVueInputIcon>
                  <AppBaseSvg name="search" class="!w-4 !h-4" />
                </PrimeVueInputIcon>
                <PrimeVueInputText v-model="search" :placeholder="useLocalization('main.table.search')" />
              </PrimeVueIconField>
            </form>

            

            
          </div>
        </div>
      </template>

      <template #empty> No products found. </template>

      <PrimeVueColumn sortable field="name" header="Name" class="w-1/5">
        <template #body="{ data }">
          <template v-if="productList_isLoading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            {{ data.name }}
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn sortable field="categories" header="Category" class="w-1/5">
        <template #body="{ data }">
          <template v-if="productList_isLoading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            <CategoryPill :categories="data.categoriesHasProducts" />
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn sortable field="variants" header="Variants" class="w-1/5">
        <template #body="{ data }">
          <template v-if="productList_isLoading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            <ProductVariantPill :variants="data.variantHasProducts" />
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn sortable field="price" header="Price" class="w-1/5">
        <template #body="{ data }">
          <template v-if="productList_isLoading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            {{ useCurrencyFormat({ data: data.price }) }}
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn sortable field="discount_price" header="Discount Price" class="w-1/5">
        <template #body="{ data }">
          <template v-if="productList_isLoading">
            <PrimeVueSkeleton height="1.5rem" />
          </template>
          <template v-else>
            {{ useCurrencyFormat({ data: data.discountPrice }) }}
          </template>
        </template>
      </PrimeVueColumn>

      <PrimeVueColumn v-if="hasPermission">
        <template #body="slotProps">
          <PrimeVueButton
            variant="text"
            class="bg-transparent text-gray-500 border-none float-end"
            @click="displayPopover($event, slotProps.data)"
          >
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </template>
      </PrimeVueColumn>

      <template #paginatorcontainer="{}">
        <div class="flex items-center gap-2 justify-between w-full py-2">
          <!-- Previous Page Button -->
          <PrimeVueButton
            variant="text"
            :label="useLocalization('main.table.previous-page')"
            class="border border-primary text-primary hover:bg-transparent"
            @click="prevPage()"
          >
            <template #icon>
              <AppBaseSvg name="chevron-left" class="!w-4 !h-4" />
            </template>
          </PrimeVueButton>

          <div class="flex gap-1">
            <PrimeVueButton
              v-for="p in visiblePages"
              :key="p"
              :label="p.toString()"
              class="border-none aspect-square p-4"
              :class="
                page === p ? 'bg-blue-secondary-background text-primary' : 'bg-transparent text-grayscale-20'
              "
              @click="goToPage(p)"
            />
          </div>
          <!-- Page Numbers -->

          <!-- Next Page Button -->
          <PrimeVueButton
            variant="text"
            :label="useLocalization('main.table.next-page')"
            class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
            @click="nextPage()"
          >
            <template #icon>
              <AppBaseSvg name="chevron-right" class="!w-4 !h-4" />
            </template>
          </PrimeVueButton>
        </div>
      </template>
    </PrimeVueDataTable>
  </div>
</template>
