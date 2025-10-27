<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ProductVariantPill from '../components/ProductVariantPill.vue';
import { useCategoryService } from '@/modules/catalog/services/Category/CategoryService';
import { useProductService } from '../services/catalog-product.service';
import CategoryPill from '@/modules/catalog/components/Category/CategoryPill.vue';
import deletePolygonSVG from '@/app/assets/icons/delete-polygon.svg';
import deleteSVG from '@/app/assets/icons/delete.svg';
import plusLineWhiteSVG from '@/app/assets/icons/plus-line-white.svg';
import threeDotsSVG from '@/app/assets/icons/three-dots.svg';
import searchSVG from '@/app/assets/icons/search.svg';
import chevronDownSVG from '@/app/assets/icons/chevron-down.svg';
import eventBus from '@/plugins/mitt';

const { getAllProducts, deleteProduct, getProductByCategories } = useProductService();

const { getAllCategories } = useCategoryService();
const categories = ref([]);
const selectedCategories = ref([]);

watch(selectedCategories, () => {
  if (selectedCategories.value.length > 0) {
    loadProductByCategories();
  } else {
    loadProducts();
  }
});

const loadProductByCategories = async () => {
  loading.value = true;
  try {
    const response = await getProductByCategories(page.value, limit.value, search.value, selectedCategories.value);
    products.value = response.products;
    lastPage.value = response.lastPage;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

const loadCategories = async () => {
  loading.value = true;
  try {
    const response = await getAllCategories(page.value, limit.value, search.value);
    categories.value = response.categories;
    lastPage.value = response.lastPage;
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
};

const route = useRoute();
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

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
    .format(value)
    .replace('Rp', 'Rp ')
    .replace(',00', '');
}

const selectedProduct = ref(null);

const EditProducts = () => {
  router.push({ name: 'catalog.products.edit', params: { id: selectedProduct.value.id } });
};

const op = ref();

const isDeleteOpen = ref(false);

const displayPopover = (event, product) => {
  selectedProduct.value = product;
  op.value.show(event);
};

const selectedProducts = ref([]);
const loading = ref(true);
const products = ref([]);

const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getAllProducts(page.value, limit.value, search.value);
    products.value = response.products;
    lastPage.value = response.lastPage;
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  try {
    loading.value = true;
    await deleteProduct(selectedProduct.value.id);
    isDeleteOpen.value = false;
    if (selectedCategories.value.length > 0) {
      loadProductByCategories();
    } else {
      loadProducts();
    }
  } catch (error) {
    console.error('Failed to delete product:', error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = event => {
  page.value = event.page + 1;
  if (selectedCategories.value.length > 0) {
    loadProductByCategories();
  } else {
    loadProducts();
  }
};

const handleSearch = () => {
  router.push({ query: { page: '1' } });
  page.value = 1;
  if (selectedCategories.value.length > 0) {
    loadProductByCategories();
  } else {
    loadProducts();
  }
};

watch(search, () => {
  setTimeout(() => {
    handleSearch();
  }, 500);
});

function goToPage(p) {
  router.push({ query: { page: p.toString() } });
  page.value = p;
  if (selectedCategories.value.length > 0) {
    loadProductByCategories();
  } else {
    loadProducts();
  }
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value = page.value + 1;
    router.push({ query: { page: page.value.toString() } });
    if (selectedCategories.value.length > 0) {
      loadProductByCategories();
    } else {
      loadProducts();
    }
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value = page.value - 1;
    router.push({ query: { page: page.value.toString() } });
    if (selectedCategories.value.length > 0) {
      loadProductByCategories();
    } else {
      loadProducts();
    }
  }
};

onMounted(() => {
  loadCategories();
  loadProducts();
  page.value = parseInt(route.query.page) || 1;
  if (!route.query.page) {
    router.push({ query: { page: '1' } });
  }
  eventBus.on('product-imported', loadProducts);
});

onUnmounted(() => {
  eventBus.off('product-imported', loadProducts);
});

import { useRbac } from '@/app/composables/useRbac';
import ProductImportModal from '../components/ProductImportModal.vue';
const rbac = useRbac();
const hasPermission = rbac.hasPermission('product_management');
</script>

<template>
  <div>
    <div>
      <PrimeVueDataTable
        v-model:selection="selectedProducts"
        :value="products"
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
                    <img :src="chevronDownSVG" alt="" />
                  </template>
                  <template #option="{ option }">
                    {{ option.category }}
                  </template>
                </PrimeVueMultiSelect>
              </div>
              <form @submit.prevent="handleSearch">
                <PrimeVueIconField>
                  <PrimeVueInputIcon><img :src="searchSVG" alt="" /></PrimeVueInputIcon>
                  <PrimeVueInputText v-model="search" :placeholder="useLocalization('main.table.search')" />
                </PrimeVueIconField>
              </form>

              <PrimeVueButton
                v-if="hasPermission"
                class="bg-white hover:bg-gray-100 border border-primary text-primary px-4 py-2 h-10 rounded-md flex items-center gap-2"
                @click="
                  () => {
                    const argsEventEmitter = {
                      id: 'product-import-modal',
                      isUsingClosableButton: false,
                      isUsingBackdrop: true,
                      isOpen: true,
                      width: '600px',
                    };
                    eventBus.emit('AppBaseDialog', argsEventEmitter);
                  }
                "
              >
                <i class="pi pi-upload text-sm"></i>
                Import Product
              </PrimeVueButton>

              <router-link v-if="hasPermission" to="/catalog/products/add-product">
                <PrimeVueButton
                  type="button"
                  severity="info"
                  :label="useLocalization('main.table.add')"
                  class="bg-primary border-primary"
                >
                  <template #icon>
                    <img :src="plusLineWhiteSVG" alt="" />
                  </template>
                </PrimeVueButton>
              </router-link>
            </div>
          </div>
        </template>

        <template #empty> No products found. </template>

        <PrimeVueColumn sortable field="name" header="Name" class="w-1/5">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              {{ data.name }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="categories" header="Category" class="w-1/5">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              <CategoryPill :categories="data.categoriesHasProducts" />
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="variants" header="Variants" class="w-1/5">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              <ProductVariantPill :variants="data.variantHasProducts" />
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="price" header="Price" class="w-1/5">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              {{ formatCurrency(data.price) }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="discount_price" header="Discount Price" class="w-1/5">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton height="1.5rem" />
            </template>
            <template v-else>
              {{ formatCurrency(data.discount_price) }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn v-if="hasPermission">
          <template #body="slotProps">
            <PrimeVueButton
              type="text"
              class="bg-transparent text-gray-500 border-none float-end"
              @click="displayPopover($event, slotProps.data)"
            >
              <template #icon>
                <img :src="threeDotsSVG" alt="" />
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
                <AppBaseSvg name="arrow-left" class="!w-5 !h-5 filter-primary-color" />
              </template>
            </PrimeVueButton>

            <div class="flex gap-1">
              <PrimeVueButton
                v-for="p in visiblePages"
                :key="p"
                :label="p.toString()"
                class="border-none aspect-square p-4"
                :class="page === p ? 'bg-primary-border text-white' : 'bg-transparent text-grayscale-20'"
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
                <AppBaseSvg name="arrow-right" class="!w-5 !h-5 filter-primary-color" />
              </template>
            </PrimeVueButton>
          </div>
        </template>
      </PrimeVueDataTable>

      <PrimeVuePopover
        ref="op"
        :pt="{
          root: { class: 'z-[9999]' }, // ✅ This forces the popover to the top layer
          content: 'p-0',
        }"
      >
        <div class="flex flex-col items-start">
          <router-link :to="{ name: 'catalog.products.detail', params: { id: selectedProduct.id } }">
            <PrimeVueButton variant="text" :label="'Preview'" class="text-black w-full px-4 py-3">
              <template #default>
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-text-primary">{{ 'Preview' }}</span>
                </section>
              </template>
            </PrimeVueButton>
          </router-link>
          <PrimeVueButton
            variant="text"
            :label="useLocalization('main.popover.edit')"
            class="text-black w-full px-4 py-3"
            @click="EditProducts"
          >
            <template #default>
              <section class="flex items-center gap-2 w-full">
                <AppBaseSvg name="edit" class="!w-4 !h-4" />
                <span class="font-normal text-text-primary">{{ useLocalization('main.popover.edit') }}</span>
              </section>
            </template>
          </PrimeVueButton>
          <PrimeVueButton
            variant="text"
            :label="useLocalization('main.popover.delete')"
            class="text-red-500 w-full px-4 py-3"
            @click="isDeleteOpen = true"
          >
            <template #default>
              <section class="flex items-center gap-2 w-full">
                <AppBaseSvg name="delete" class="!w-4 !h-4" />
                <span class="font-normal text-red-500">{{ useLocalization('main.popover.delete') }}</span>
              </section>
            </template>
          </PrimeVueButton>
        </div>
      </PrimeVuePopover>

      <PrimeVueDialog v-model:visible="isDeleteOpen" modal header="">
        <template #container>
          <div class="w-[35rem] p-8">
            <div class="flex flex-col items-center gap-4 text-center">
              <img :src="deletePolygonSVG" alt="Delete icon" class="mx-auto" />
              <h1 class="text-2xl font-semibold">{{ useLocalization('main.modal.title') }}</h1>
              <p>{{ useLocalization('main.modal.description') }}</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton
                  class="text-lg w-56 text-red-500 bg-transparent border-none"
                  variant="outlined"
                  :label="useLocalization('main.modal.delete')"
                  severity="danger"
                  @click="
                    handleDelete(selectedProduct.id);
                    isDeleteOpen = false;
                  "
                >
                  <template #icon>
                    <img :src="deleteSVG" alt="" />
                  </template>
                </PrimeVueButton>
                <PrimeVueButton class="w-56 text-lg bg-primary border-primary" @click="isDeleteOpen = false"
                  >{{ useLocalization('main.modal.cancel') }}
                </PrimeVueButton>
              </div>
            </div>
          </div>
        </template>
      </PrimeVueDialog>
    </div>
  </div>
  <ProductImportModal />
</template>
