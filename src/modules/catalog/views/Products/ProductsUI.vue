<script setup>
import { ref } from 'vue';
import ProductVariantPill from '../../components/ProductVariantPill.vue';
import { useCategoryService } from '../../services/Category/CategoryService';
import { useProductService } from '@/modules/catalog/services/Product/ProductServices';
import CategoryPill from '@/modules/catalog/components/Category/CategoryPill.vue';
import deletePolygonSVG from '@/app/assets/icons/delete-polygon.svg';
import deleteSVG from '@/app/assets/icons/delete.svg';
import editSVG from '@/app/assets/icons/edit.svg';
import plusLineWhiteSVG from '@/app/assets/icons/plus-line-white.svg';
import threeDotsSVG from '@/app/assets/icons/three-dots.svg';
import searchSVG from '@/app/assets/icons/search.svg';
import chevronDownSVG from '@/app/assets/icons/chevron-down.svg';
import chevronLeftSVG from '@/app/assets/icons/chevron-left.svg';
import chevronRightSVG from '@/app/assets/icons/chevron-right.svg';

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
    // console.log("🚀 ~ loadProductByCategories ~ response:", response)
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
    // console.log('🚀 ~ loadCategories ~ categories.value:', categories.value);
    lastPage.value = response.lastPage;
    // console.log('🚀 ~ loadCategories ~ lastPage.value:', lastPage.value);
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
  // console.log('product id :' + selectedProduct.value.id);
};

const op = ref();

const isDeleteOpen = ref(false);

const displayPopover = (event, product) => {
  selectedProduct.value = product;
  op.value.show(event);
  // console.log('product', product);
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
    // console.log('🚀 ~ loadProducts ~ lastPage.value:', lastPage.value);
    // console.log('products', products.value);
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  try {
    loading.value = true;
    // console.log('product id', selectedProduct.value.id);
    await deleteProduct(selectedProduct.value.id);
    isDeleteOpen.value = false;
    if (selectedCategories.value.length > 0) {
      // console.log('multiple');
      loadProductByCategories();
    } else {
      // console.log('get all');
      loadProducts();
    }
  } catch (error) {
    console.error('Failed to delete product:', error);
  } finally {
    loading.value = false;
  }
};

const onPageChange = event => {
  page.value = event.page + 1; // event.page is 0-based
  if (selectedCategories.value.length > 0) {
    // console.log('multiple');
    loadProductByCategories();
  } else {
    console.log('get all');
    loadProducts();
  }
};

const handleSearch = () => {
  router.push({ query: { page: '1' } });
  page.value = 1;
  if (selectedCategories.value.length > 0) {
    // console.log('multiple');
    loadProductByCategories();
  } else {
    // console.log('get all');
    loadProducts();
  }
};

function goToPage(p) {
  router.push({ query: { page: p.toString() } });
  page.value = p;
  if (selectedCategories.value.length > 0) {
    // console.log('multiple');
    loadProductByCategories();
  } else {
    // console.log('get all');
    loadProducts();
  }
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value = page.value + 1;
    router.push({ query: { page: page.value.toString() } });
    if (selectedCategories.value.length > 0) {
      // console.log('multiple');
      loadProductByCategories();
    } else {
      // console.log('get all');
      loadProducts();
    }
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value = page.value - 1;
    router.push({ query: { page: page.value.toString() } });
    if (selectedCategories.value.length > 0) {
      // console.log('multiple');
      loadProductByCategories();
    } else {
      // console.log('get all');
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
});
</script>

<template>
  <div class="p-1 border border-gray rounded-lg shadow-2xl">
    <div>
      <PrimeVueDataTable
        v-model:selection="selectedProducts"
        :value="products"
        :rows="limit"
        data-key="ID"
        paginator
        @page="onPageChange"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold">Products</h1>
            </div>
            <div class="flex gap-4 justify-end">
              <div class="flex flex-col w-64 max-w-64">
                <PrimeVueMultiSelect
                  v-model="selectedCategories"
                  name="category"
                  display="chip"
                  :options="categories"
                  option-label="category"
                  filter
                  placeholder="Filter By Categories"
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
                  <PrimeVueInputText v-model="search" placeholder="Keyword Search" />
                </PrimeVueIconField>
              </form>

              <router-link to="/catalog/products/add-product">
                <PrimeVueButton
                  type="button"
                  severity="info"
                  label="Add Product"
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

        <PrimeVueColumn sortable field="name" header="Name">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton width="150px" height="1.5rem" />
            </template>
            <template v-else>
              {{ data.name }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="categories" header="Category">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton width="200px" height="1.5rem" />
            </template>
            <template v-else>
              <CategoryPill :categories="data.categoriesHasProducts" />
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="variants" header="Variants">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton width="180px" height="1.5rem" />
            </template>
            <template v-else>
              <ProductVariantPill :variants="data.variantHasProducts" />
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="price" header="Price">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton width="80px" height="1.5rem" />
            </template>
            <template v-else>
              {{ formatCurrency(data.price) }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="discount_price" header="Discount Price">
          <template #body="{ data }">
            <template v-if="loading">
              <PrimeVueSkeleton width="100px" height="1.5rem" />
            </template>
            <template v-else>
              {{ formatCurrency(data.discount_price) }}
            </template>
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn>
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
              label="Previous"
              class="border border-primary text-primary hover:bg-transparent"
              @click="prevPage()"
            >
              <template #icon>
                <img :src="chevronLeftSVG" alt="" />
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
              label="Next"
              class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
              @click="nextPage()"
            >
              <template #icon>
                <img :src="chevronRightSVG" alt="" />
              </template>
          </PrimeVueButton>
          </div>
        </template>
      </PrimeVueDataTable>

      <PrimeVuePopover ref="op">
        <div class="flex flex-col items-start">
          <PrimeVueButton variant="text" label="Edit" class="text-black" @click="EditProducts">
            <template #icon>
              <img :src="editSVG" alt="" />
            </template>
          </PrimeVueButton>
          <PrimeVueButton variant="text" label="Delete" class="text-black" @click="isDeleteOpen = true">
            <template #icon>
              <img :src="deleteSVG" alt="" />
            </template>
          </PrimeVueButton>
        </div>
      </PrimeVuePopover>

      <PrimeVueDialog v-model:visible="isDeleteOpen" modal header="">
        <template #container>
          <div class="w-[35rem] p-8">
            <div class="flex flex-col items-center gap-4 text-center">
              <img :src="deletePolygonSVG" alt="Delete icon" class="mx-auto" />
              <h1 class="text-2xl font-semibold">Are you sure you want to delete this product?</h1>
              <p>This action cannot be undone, and the product will be removed from catalog</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton
                  class="text-lg w-56 text-red-500 bg-transparent border-none"
                  variant="outlined"
                  label="Delete Product"
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
                  >Cancel
                </PrimeVueButton>
              </div>
            </div>
          </div>
        </template>
      </PrimeVueDialog>
    </div>
  </div>
</template>
