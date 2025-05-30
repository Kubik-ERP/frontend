<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
    <!-- {{ products }} -->
    <div>
      <PrimeVueDataTable
        v-model:selection="selectedProducts"
        :value="products"
        :rows="10"
        :filters="filters"
        data-key="ID"
        paginator
        :loading="loading"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold">Products</h1>
            </div>
            <div class="flex gap-4 justify-end">
              <PrimeVueIconField>
                <PrimeVueInputIcon>
                  <i class="pi pi-search" />
                </PrimeVueInputIcon>
                <PrimeVueInputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </PrimeVueIconField>

              <router-link to="products/add-product">
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
        <PrimeVueColumn sortable field="id" header="Product ID" style="width: 10%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="name" header="Name" style="width: 30%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="categories" header="Category" style="width: 14%">
          <template #body="{ data }">
            <CategoryPill :categories="data.categories" />
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="variants" header="Variants" style="width: 20%">
          <template #body="{ data }">
            <ProductVariantPill :variants="data.variants" />
          </template>
        </PrimeVueColumn>

        <PrimeVueColumn sortable field="price" header="Price" style="width: 30%">
          <template #body="{ data }">
            {{ formatCurrency(data.price) }}
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="discount_price" header="Discount Price" style="width: 30%">
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

        <template #paginatorcontainer="{ page, pageCount, prevPageCallback, nextPageCallback }">
          <div class="flex items-center gap-2 justify-between w-full py-2">
            <!-- Previous Page Button -->
            <PrimeVueButton
              icon="pi pi-angle-left"
              variant="text"
              label="Previous"
              class="border border-primary text-primary hover:bg-transparent"
              @click="prevPageCallback"
            />

            <div>
              <PrimeVueButton
                v-for="p in pageCount"
                :key="p"
                :label="p.toString()"
                class="border-none aspect-square p-4"
                :class="
                  page === p - 1 ? 'bg-blue-secondary-background text-primary' : 'bg-transparent text-grayscale-20'
                "
              />
            </div>
            <!-- Page Numbers -->

            <!-- Next Page Button -->
            <PrimeVueButton
              icon="pi pi-angle-right"
              variant="text"
              label="Next"
              class="border border-primary text-primary hover:bg-transparent flex-row-reverse"
              @click="nextPageCallback"
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
                  >Cancel</PrimeVueButton
                >
              </div>
            </div>
          </div>
        </template>
      </PrimeVueDialog>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';
import ProductVariantPill from '../../components/ProductVariantPill.vue';

import { useProductService } from '@/modules/catalog/services/Product/ProductServices';
import CategoryPill from '@/modules/catalog/components/Category/CategoryPill.vue';

const router = useRouter();

const { getAllProducts, deleteProduct } = useProductService();

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
    .format(value)
    .replace('Rp', 'Rp ')
    .replace(',00', '');
}

const selectedProduct = ref(null);

const EditProducts = () => {
  router.push({ name: 'edit-product', params: { id: selectedProduct.value.id } });
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
    products.value = await getAllProducts();
    // console.log('products', products.value);
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

const handleDelete = async () => {
  try {
    // console.log('product id', selectedProduct.value.id);
    await deleteProduct(selectedProduct.value.id);
    isDeleteOpen.value = false;
    await loadProducts();
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
};

onMounted(() => {
  loadProducts();
});
</script>
