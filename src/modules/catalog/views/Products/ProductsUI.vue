<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
      {{ products }}
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
        <PrimeVueColumn sortable field="id" header="Product ID" style="width: 15%"></PrimeVueColumn>
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

        <PrimeVueColumn sortable field="price" header="Price" style="width: 25%">
          <template #body="{ data }">
            {{ formatCurrency(data.price) }}
          </template>
        </PrimeVueColumn>
        <PrimeVueColumn sortable field="discount_price" header="Discount Price" style="width: 25%">
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
              <template v-for="p in pageCount" :key="p">
                <PrimeVueButton
                  :label="p.toString()"
                  class="border-none aspect-square p-4"
                  :class="
                    page === p - 1
                      ? 'bg-blue-secondary-background text-primary'
                      : 'bg-transparent text-grayscale-20'
                  "
                />
              </template>
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
            @click="displayEdit()"
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

      <PrimeVueDialog v-model:visible="isAddOpen" modal header="Add Product" class="w-[45rem]">
        <!-- <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span> -->
        <form @submit.prevent>
          <div class="flex flex-col gap-1 mb-4">
            <div>
              <label for="name">Product Name <sup class="text-red-500">*</sup></label>
            </div>
            <PrimeVueInputText v-model="name" class="flex-auto" autocomplete="off" />
          </div>
          <div class="flex flex-col gap-1 mb-8">
            <div class="flex gap-1">
              <label for="notes">Notes</label>
              <label for="optional" class="text-gray-400">(Optional)</label>
            </div>
            <PrimeVueTextarea v-model="notes" auto-resize rows="5" cols="30" />
          </div>
          <div class="flex justify-end gap-2">
            <PrimeVueButton
              type="button"
              label="Cancel"
              severity="info"
              variant="outlined"
              class="w-48 text-primary border-primary"
              @click="isAddOpen = false"
            ></PrimeVueButton>
            <PrimeVueButton
              type="submit"
              label="Add"
              class="w-48 bg-primary border-primary"
              @click="isAddOpen = false"
            ></PrimeVueButton>
          </div>
        </form>
      </PrimeVueDialog>

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
                  label="Delete Category"
                  severity="danger"
                  @click="isDeleteOpen = false"
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

import { getAllProducts } from '@/modules/catalog/services/Product/ProductServices';
import CategoryPill from '@/modules/catalog/components/Category/CategoryPill.vue';

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
    .format(value)
    .replace('Rp', 'Rp ')
    .replace(',00', '');
}

const isAddOpen = ref(false);
const selectedProduct = ref(null);

const name = ref('');
const notes = ref('');

const op = ref();

const isDeleteOpen = ref(false);

const displayEdit = () => {
  isAddOpen.value = true;
  // console.log('product', selectedProduct.value);
  const data = selectedProduct.value;
  name.value = data.Product;
  notes.value = data.Description;
  op.value.hide();
};

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
    console.log('products', products.value);
  } catch (err) {
    console.error('Failed to fetch products:', err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadProducts();
});

// const products = ref([
//   {
//     product_id: '#001',
//     name: 'Spaghetti Aglio Olio',
//     category: 'Pasta',
//     variant: ['Spicy', 'Not Spicy', 'Vegie'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#002',
//     name: 'Beef Fettuccine',
//     category: 'Pasta',
//     variant: [],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#003',
//     name: 'Lasagna',
//     category: 'Pasta, Lunch, Dinner',
//     variant: ['Spicy', 'Not Spicy'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#004',
//     name: 'Bolognese Mac n Cheese',
//     category: 'Pasta, Dinner',
//     variant: ['Spicy', 'Not Spicy', 'Vegie', 'Extra Cheese'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#005',
//     name: 'Hummus',
//     category: 'Middle East Food',
//     variant: [],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#006',
//     name: 'Falafel',
//     category: 'Middle East Food',
//     variant: ['Extra Garlic'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#007',
//     name: 'Fried Rice',
//     category: 'Asian Food, Breakfast',
//     variant: ['Spicy', 'Not Spicy', 'Vegie'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#008',
//     name: 'Fried Noodle',
//     category: 'Asian Food, Breakfast',
//     variant: ['Spicy', 'Not Spicy', 'Vegie', 'Extra Egg', 'Extra Shrimp'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#009',
//     name: 'Lemon Tea Ice',
//     category: 'Drink',
//     variant: ['Hot', 'Ice'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#010',
//     name: 'Avocado Juice',
//     category: 'Drink',
//     variant: ['Ice', 'No Sugar', 'Extra Milk'],
//     price: 100000,
//     discount_price: 50000,
//   },
//   {
//     product_id: '#011',
//     name: 'Grilled Chicken',
//     category: 'Dinner',
//     variant: [],
//     price: 150000,
//     discount_price: 75000,
//   },
//   {
//     product_id: '#012',
//     name: 'Cheeseburger',
//     category: 'Fast Food',
//     variant: ['Extra Cheese', 'No Pickles', 'Double Patty'],
//     price: 80000,
//     discount_price: 40000,
//   },
//   {
//     product_id: '#013',
//     name: 'Mango Smoothie',
//     category: 'Drink',
//     variant: ['Ice', 'No Sugar', 'Extra Mango', 'Yogurt'],
//     price: 90000,
//     discount_price: 45000,
//   },
//   {
//     product_id: '#014',
//     name: 'Chicken Wings',
//     category: 'Appetizer',
//     variant: ['Spicy', 'Mild', 'BBQ', 'Honey Mustard'],
//     price: 120000,
//     discount_price: 60000,
//   },
//   {
//     product_id: '#015',
//     name: 'Vegetable Salad',
//     category: 'Healthy',
//     variant: ['No Dressing', 'With Chicken', 'Extra Avocado'],
//     price: 70000,
//     discount_price: 35000,
//   },
//   {
//     product_id: '#016',
//     name: 'Tom Yum Soup',
//     category: 'Thai Food',
//     variant: ['Spicy', 'Mild'],
//     price: 130000,
//     discount_price: 65000,
//   },
//   {
//     product_id: '#017',
//     name: 'Sushi Platter',
//     category: 'Japanese Food',
//     variant: ['Salmon', 'Tuna', 'Eel', 'Vegie', 'Shrimp', 'Crab'],
//     price: 250000,
//     discount_price: 125000,
//   },
//   {
//     product_id: '#018',
//     name: 'Steak',
//     category: 'Western Food',
//     variant: [
//       'Medium Rare',
//       'Well Done',
//       'Extra Sauce',
//       'Garlic Butter',
//       'Mushroom Sauce',
//       'Black Pepper Sauce',
//       'Cheese Topping',
//     ],
//     price: 300000,
//     discount_price: 150000,
//   },
//   {
//     product_id: '#019',
//     name: 'BBQ Ribs',
//     category: 'Western Food',
//     variant: ['BBQ Sauce', 'Honey Glazed', 'Spicy'],
//     price: 280000,
//     discount_price: 140000,
//   },
//   {
//     product_id: '#020',
//     name: 'Tuna Sandwich',
//     category: 'Snack',
//     variant: ['Whole Wheat', 'White Bread', 'No Mayo', 'Extra Tuna'],
//     price: 50000,
//     discount_price: 25000,
//   },
//   {
//     product_id: '#021',
//     name: 'French Fries',
//     category: 'Snack',
//     variant: ['Regular', 'Cheese', 'BBQ'],
//     price: 40000,
//     discount_price: 20000,
//   },
//   {
//     product_id: '#022',
//     name: 'Pepperoni Pizza',
//     category: 'Fast Food',
//     variant: ['Extra Cheese', 'Thin Crust', 'Thick Crust'],
//     price: 120000,
//     discount_price: 60000,
//   },
//   {
//     product_id: '#023',
//     name: 'Caesar Salad',
//     category: 'Healthy',
//     variant: ['Grilled Chicken', 'Extra Dressing'],
//     price: 75000,
//     discount_price: 37500,
//   },
//   {
//     product_id: '#024',
//     name: 'Chocolate Cake',
//     category: 'Dessert',
//     variant: ['Dark Chocolate', 'Milk Chocolate', 'With Nuts'],
//     price: 110000,
//     discount_price: 55000,
//   },
//   {
//     product_id: '#025',
//     name: 'Strawberry Milkshake',
//     category: 'Drink',
//     variant: ['No Sugar', 'With Ice Cream'],
//     price: 85000,
//     discount_price: 42500,
//   },
//   {
//     product_id: '#026',
//     name: 'Vanilla Ice Cream',
//     category: 'Dessert',
//     variant: [],
//     price: 60000,
//     discount_price: 30000,
//   },
//   {
//     product_id: '#027',
//     name: 'Grilled Salmon',
//     category: 'Dinner',
//     variant: ['With Lemon Butter', 'Spicy', 'Garlic Sauce'],
//     price: 220000,
//     discount_price: 110000,
//   },
//   {
//     product_id: '#028',
//     name: 'Pineapple Juice',
//     category: 'Drink',
//     variant: ['No Sugar', 'Ice', 'With Coconut'],
//     price: 70000,
//     discount_price: 35000,
//   },
//   {
//     product_id: '#029',
//     name: 'Tiramisu',
//     category: 'Dessert',
//     variant: [],
//     price: 90000,
//     discount_price: 45000,
//   },
//   {
//     product_id: '#030',
//     name: 'Shrimp Tempura',
//     category: 'Japanese Food',
//     variant: ['Extra Shrimp', 'No Sauce'],
//     price: 140000,
//     discount_price: 70000,
//   },
//   {
//     product_id: '#031',
//     name: 'Beef Steak',
//     category: 'Western Food',
//     variant: ['Medium Rare', 'Well Done', 'Extra Sauce'],
//     price: 250000,
//     discount_price: 125000,
//   },
//   {
//     product_id: '#032',
//     name: 'BBQ Ribs',
//     category: 'Western Food',
//     variant: ['BBQ Sauce', 'Honey Glazed', 'Spicy'],
//     price: 280000,
//     discount_price: 140000,
//   },
//   {
//     product_id: '#033',
//     name: 'Tom Yum Soup',
//     category: 'Thai Food',
//     variant: ['Spicy', 'Mild'],
//     price: 130000,
//     discount_price: 65000,
//   },
//   {
//     product_id: '#034',
//     name: 'Sushi Platter',
//     category: 'Japanese Food',
//     variant: ['Salmon', 'Tuna', 'Eel', 'Vegie', 'Shrimp', 'Crab'],
//     price: 250000,
//     discount_price: 125000,
//   },
//   {
//     product_id: '#035',
//     name: 'Steak',
//     category: 'Western Food',
//     variant: [
//       'Medium Rare',
//       'Well Done',
//       'Extra Sauce',
//       'Garlic Butter',
//       'Mushroom Sauce',
//       'Black Pepper Sauce',
//       'Cheese Topping',
//     ],
//     price: 300000,
//     discount_price: 150000,
//   },
// ]);
</script>
