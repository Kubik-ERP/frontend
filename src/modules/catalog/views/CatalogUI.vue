<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
    <div>
      <PrimeVueDataTable
        v-model:selection="selectedCategories"
        :value="categories"
        paginator
        :rows="10"
        table-style="min-width: 50rem"
        :filters="filters"
        data-key="ID"
        :loading="loading"
      >
        <template #header>
          <div class="flex justify-between">
            <div class="flex items-center">
              <h1 class="text-2xl font-bold">Categories</h1>
            </div>
            <div class="flex gap-4 justify-end">
              <PrimeVueIconField>
                <PrimeVueInputIcon>
                  <i class="pi pi-search" />
                </PrimeVueInputIcon>
                <PrimeVueInputText v-model="filters['global'].value" placeholder="Keyword Search" />
              </PrimeVueIconField>

              <PrimeVueButton
                type="button"
                severity="info"
                label="Add Category"
                icon="pi pi-plus"
                @click="isAddOpen = true"
              />
            </div>
          </div>
        </template>
        <template #empty> No categories found. </template>
        <template #loading> Loading categories data. Please wait. </template>

        <PrimeVueColumn selection-mode="multiple" header-style="width: 3rem"> </PrimeVueColumn>
        <PrimeVueColumn sortable field="ID" header="Name" style="width: 25%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="Category" header="Category" style="width: 25%"></PrimeVueColumn>
        <PrimeVueColumn sortable field="Description" header="Notes" style="width: 25%"></PrimeVueColumn>
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

      <PrimeVueDialog v-model:visible="isAddOpen" modal header="Add Category" class="w-[45rem]">
        <!-- <span class="text-surface-500 dark:text-surface-400 block mb-8">Update your information.</span> -->
        <form @submit.prevent>
          <div class="flex flex-col gap-1 mb-4">
            <div>
              <label for="name">Category Name <sup class="text-red-500">*</sup></label>
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
              class="w-48 text-[#18618B] border-[#18618B]"
              @click="isAddOpen = false"
            ></PrimeVueButton>
            <PrimeVueButton
              type="submit"
              label="Add"
              class="w-48 bg-[#18618B] border-[#18618B]"
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
              <h1 class="text-2xl font-semibold">Are you sure you want to delete this product category?</h1>
              <p>This will affect the categorization of products that have already been created</p>
              <div class="flex items-center justify-between gap-4">
                <PrimeVueButton
                  class="text-lg w-56"
                  variant="outlined"
                  severity="danger"
                  @click="isDeleteOpen = false"
                  >Delete Category</PrimeVueButton
                >
                <PrimeVueButton class="w-56 text-lg bg-[#18618B] border-[#18618B]" @click="isDeleteOpen = false"
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


const isAddOpen = ref(false);
const selectedCategory = ref(null);

const name = ref('');
const notes = ref('');

const op = ref();

const isDeleteOpen = ref(false);

const displayEdit = () => {
  isAddOpen.value = true;
  // console.log('category', selectedCategory.value);
  const data = selectedCategory.value;
  name.value = data.Category;
  notes.value = data.Description;
  op.value.hide();
};

const displayPopover = (event, category) => {
  selectedCategory.value = category;
  op.value.show(event);
  // console.log('category', category);
};

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const selectedCategories = ref([]);
const loading = ref(false);

const categories = ref([
  { ID: '001', Category: 'Breakfast', Description: 'Scrambled eggs with toast' },
  { ID: '002', Category: 'Lunch', Description: 'Grilled chicken with rice' },
  { ID: '003', Category: 'Dinner', Description: 'Spaghetti bolognese' },
  { ID: '004', Category: 'Snack', Description: 'Chocolate chip cookies' },
  { ID: '005', Category: 'Drink', Description: 'Strawberry smoothie' },
  { ID: '006', Category: 'Breakfast', Description: 'Pancakes with syrup' },
  { ID: '007', Category: 'Lunch', Description: 'Beef burger with fries' },
  { ID: '008', Category: 'Dinner', Description: 'Grilled salmon with vegetables' },
  { ID: '009', Category: 'Snack', Description: 'Popcorn' },
  { ID: '010', Category: 'Drink', Description: 'Iced coffee' },
  { ID: '011', Category: 'Breakfast', Description: 'Oatmeal with honey' },
  { ID: '012', Category: 'Lunch', Description: 'Vegetable stir-fry with tofu' },
  { ID: '013', Category: 'Dinner', Description: 'Chicken curry with rice' },
  { ID: '014', Category: 'Snack', Description: 'Peanut butter crackers' },
  { ID: '015', Category: 'Drink', Description: 'Green tea' },
  { ID: '016', Category: 'Breakfast', Description: 'French toast with maple syrup' },
  { ID: '017', Category: 'Lunch', Description: 'Tuna sandwich' },
  { ID: '018', Category: 'Dinner', Description: 'BBQ ribs with coleslaw' },
  { ID: '019', Category: 'Snack', Description: 'Cheese nachos' },
  { ID: '020', Category: 'Drink', Description: 'Lemonade' },
]);
</script>
