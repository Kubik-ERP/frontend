<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
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
          <h1 class="text-2xl font-bold">Categories</h1>
          <div class="flex gap-4">
            <PrimeVueIconField>
              <PrimeVueInputIcon><i class="pi pi-search" /></PrimeVueInputIcon>
              <PrimeVueInputText v-model="filters['global'].value" placeholder="Keyword Search" />
            </PrimeVueIconField>
            <PrimeVueButton
              type="button"
              severity="info"
              label="Add ICategory"
              icon="pi pi-plus"
              class="bg-primary border-primary"
              @click="isAddOpen = true"
            />
          </div>
        </div>
      </template>

      <template #empty>No categories found.</template>
      <template #loading>Loading categories data. Please wait.</template>

      <PrimeVueColumn selection-mode="multiple" header-style="width: 3rem" />
      <PrimeVueColumn sortable field="id" header="ICategory ID" style="width: 25%" />
      <PrimeVueColumn sortable field="category" header="ICategory" style="width: 25%" />
      <PrimeVueColumn sortable field="description" header="Description" style="width: 25%" />
      <PrimeVueColumn>
        <template #body="slotProps">
          <PrimeVueButton
            type="text"
            icon="pi pi-ellipsis-v"
            class="bg-transparent text-gray-500 border-none float-end"
            @click="displayPopover($event, slotProps.data)"
          />
        </template>
      </PrimeVueColumn>
    </PrimeVueDataTable>

    <!-- Popover -->
    <PrimeVuePopover ref="op">
      <div class="flex flex-col items-start">
        <PrimeVueButton
          variant="text"
          label="Edit"
          icon="pi pi-pen-to-square"
          class="text-black"
          @click="displayEdit"
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

    <!-- Add Dialog -->
    <PrimeVueDialog v-model:visible="isAddOpen" modal header="Add ICategory" class="w-[45rem]">
      <form @submit.prevent>
        <div class="mb-4">
          <label for="name">ICategory Name <sup class="text-red-500">*</sup></label>
          <PrimeVueInputText v-model="category" class="w-full" autocomplete="off" />
        </div>
        <div class="mb-8">
          <label for="description">description (Optional)</label>
          <PrimeVueTextarea v-model="description" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            label="Cancel"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="isAddOpen = false"
          />
          <PrimeVueButton label="Add" class="w-48 bg-primary border-primary" @click="handleAddCategory" />
        </div>
      </form>
    </PrimeVueDialog>

    <!-- Delete Confirmation -->
    <PrimeVueDialog v-model:visible="isDeleteOpen" modal header="">
      <template #container>
        <div class="w-[35rem] p-8 text-center">
          <i class="pi pi-trash text-4xl mb-4 text-red-500" />
          <h1 class="text-2xl font-semibold mb-2">Are you sure you want to delete this category?</h1>
          <p class="mb-6">This will affect products that use this category.</p>
          <div class="flex justify-center gap-4">
            <PrimeVueButton label="Delete" severity="danger" class="w-40" @click="isDeleteOpen = false" />
            <PrimeVueButton label="Cancel" class="w-40 bg-primary border-primary" @click="isDeleteOpen = false" />
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { FilterMatchMode } from '@primevue/core/api';

import { createCategory, getAllCategories } from '@/modules/catalog/services/Category/categoryService';
import { ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface';

const isAddOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedCategories = ref<ICategory[]>([]);
const categories = ref<ICategory[]>([]);
const selected = ref<ICategory | null>(null);
const loading = ref(false);

const category = ref('');
const description = ref('');
const op = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const handleAddCategory = async () => {
  if (!category.value.trim()) {
    alert('ICategory name is required!');
    return;
  }

  try {
    const newCategory = await createCategory({
      category: category.value,
      description: description.value || '',
    });

    categories.value.push(newCategory);
    isAddOpen.value = false;
    category.value = '';
    description.value = '';
  } catch (error) {
    console.error('Failed to create category:', error);
    alert('Something went wrong while creating the category.');
  }
};
const loadCategories = async () => {
  loading.value = true;
  try {
    categories.value = await getAllCategories();
    console.log(categories.value);
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
};

const displayPopover = (event: Event, category: ICategory) => {
  selected.value = category;
  op.value?.show(event);
};

const displayEdit = () => {
  if (selected.value) {
    category.value = selected.value.category;
    description.value = selected.value.description ?? '';
    isAddOpen.value = true;
    op.value?.hide();
  }
};

onMounted(() => {
  loadCategories();
});
</script>
