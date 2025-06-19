<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import ProductVariantPill from '../../components/ProductVariantPill.vue';
import { useCategoryService } from '../../services/Category/CategoryService';
import { useProductService } from '@/modules/catalog/services/Product/ProductServices';
import CategoryPill from '@/modules/catalog/components/Category/CategoryPill.vue';

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

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedProducts = ref([]);
const loading = ref(false);
const products = ref([]);

const loadProducts = async () => {
  loading.value = true;
  try {
    const response = await getAllProducts(page.value, limit.value, search.value);
    products.value = response.products;
    lastPage.value = response.lastPage;
    // console.log('🚀 ~ loadProducts ~ lastPage.value:', lastPage.value);
    console.log('products', products.value);
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
    console.log('multiple');
    loadProductByCategories();
  } else {
    console.log('get all');
    loadProducts();
  }
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
  finally {
    loading.value = false;
  }
};

const onPageChange = event => {
  page.value = event.page + 1; // event.page is 0-based
  if (selectedCategories.value.length > 0) {
    console.log('multiple');
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
    console.log('multiple');
    loadProductByCategories();
  } else {
    console.log('get all');
    loadProducts();
  }
};

function goToPage(p) {
  router.push({ query: { page: p.toString() } });
  page.value = p;
  if (selectedCategories.value.length > 0) {
    console.log('multiple');
    loadProductByCategories();
  } else {
    console.log('get all');
    loadProducts();
  }
}

const nextPage = () => {
  if (page.value < lastPage.value) {
    page.value = page.value + 1;
    router.push({ query: { page: page.value.toString() } });
    if (selectedCategories.value.length > 0) {
    console.log('multiple');
    loadProductByCategories();
  } else {
    console.log('get all');
    loadProducts();
  }
  }
};

const prevPage = () => {
  if (page.value > 1) {
    page.value = page.value - 1;
    router.push({ query: { page: page.value.toString() } });
    if (selectedCategories.value.length > 0) {
    console.log('multiple');
    loadProductByCategories();
  } else {
    console.log('get all');
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
        :filters="filters"
        data-key="ID"
        paginator
        :loading="loading"
        @page="onPageChange"
      >
        <template #header>
          {{ selectedCategories }}
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
                  placeholder="Select"
                  class="w-full text-primary"
                  dropdown-icon="pi pi-circle"
                >
                  <template #option="{ option }">
                    {{ option.category }}
                  </template>
                </PrimeVueMultiSelect>
              </div>
              <form @submit.prevent="handleSearch">
                <PrimeVueIconField>
                  <PrimeVueInputIcon><i class="pi pi-search" /></PrimeVueInputIcon>
                  <PrimeVueInputText v-model="search" placeholder="Keyword Search" />
                </PrimeVueIconField>
              </form>

              <router-link to="/catalog/products/add-product">
                <PrimeVueButton
                  type="button"
                  severity="info"
                  label="Add Product"
                  icon="pi pi-plus"
                  class="bg-primary border-primary"
                />
              </router-link>
            </div>
          </div>
        </template>
        <template #empty> No products found. </template>
        <template #loading> Loading products data. Please wait. </template>

        <PrimeVueColumn selection-mode="multiple" header-style="width: 3rem"></PrimeVueColumn>
        <!-- <PrimeVueColumn sortable field="id" header="Product ID" style="width: 10%"></PrimeVueColumn> -->
        <PrimeVueColumn sortable field="name" header="Name" style="width: 30%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="categories" header="Category" style="width: 15%">
          <template #body="{ data }">
            <CategoryPill :categories="data.categoriesHasProducts" />
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="variants" header="Variants" style="width: 35%">
          <template #body="{ data }">
            <ProductVariantPill :variants="data.variantHasProducts" />
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="price" header="Price" style="width: 15%">
          <template #body="{ data }">
            {{ formatCurrency(data.price) }}
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="discount_price" header="Discount Price" style="width: 15%">
          <template #body="{ data }">
            {{ formatCurrency(data.discount_price) }}
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn>
          <template #body="slotProps">
            <PrimeVueButton
              type="text"
              icon="pi pi-ellipsis-v"
              class="bg-transparent text-gray-500 border-none float-end"
              @click="displayPopover($event, slotProps.data)"
            ></PrimeVueButton>
          </template>
        </PrimeVueColumn>

        <template #paginatorcontainer="{}">
          <div class="flex items-center gap-2 justify-between w-full py-2">
            <!-- Previous Page Button -->
            <PrimeVueButton
              icon="pi pi-angle-left"
              variant="text"
              label="Previous"
              class="border border-primary text-primary hover:bg-transparent"
              @click="prevPage()"
            />

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
              icon="pi pi-angle-right"
              variant="text"
              label="Next"
              class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
              @click="nextPage()"
            />
          </div>
        </template>
      </PrimeVueDataTable>

      <PrimeVuePopover ref="op">
        <div class="flex flex-col items-start">
          <PrimeVueButton
            variant="text"
            label="Edit"
            icon="pi pi-pen-to-square"
            class="text-black"
            @click="EditProducts"
          />
          <PrimeVueButton
            variant="text"
            label="Delete"
            icon="pi pi-trash"
            class="text-red-500"
            @click="isDeleteOpen = true"
          />
        </div>
      </PrimeVuePopover>

      <PrimeVueDialog v-model:visible="isDeleteOpen" modal header="">
        <template #container>
          <div class="w-[35rem] p-8">
            <div class="flex flex-col items-center gap-4 text-center">
              <span><i class="pi pi-trash" style="font-size: 2.5rem"></i></span>
              <h1 class="text-2xl font-semibold">Are you sure you want to delete this product?</h1>
              <p>This action cannot be undone, and the product will be removed from catalog</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton
                  class="text-lg w-56"
                  variant="outlined"
                  icon="pi pi-trash"
                  label="Delete Product"
                  severity="danger"
                  @click="
                    handleDelete(selectedProduct.id);
                    isDeleteOpen = false;
                  "
                />
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