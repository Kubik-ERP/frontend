<template>
  <div class="m-4 p-1 border border-gray rounded-lg shadow-2xl">
    <PrimeVueDataTable
      :selection="selectedCategories"
      :value="categories"
      paginator
      :rows="10"
      table-style="min-width: 50rem"
      :filters="filters"
      data-key="id"
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
              label="Add Category"
              icon="pi pi-plus"
              class="bg-primary border-primary"
              @click="openAddDialog()"
            />
          </div>
        </div>
      </template>

      <template #empty>No categories found.</template>
      <template #loading>Loading categories data. Please wait.</template>

      <PrimeVueColumn selection-mode="multiple" header-style="width: 3rem" />
      <PrimeVueColumn sortable field="id" header="Category ID" style="width: 25%" />
      <PrimeVueColumn sortable field="category" header="Category" style="width: 25%" />
      <PrimeVueColumn sortable field="description" header="Description" style="width: 25%" />
      <PrimeVueColumn>
        <template #body="slotProps">
          <PrimeVueButton
            icon="pi pi-ellipsis-v"
            class="bg-transparent text-gray-500 border-none float-end"
            @click="displayPopover($event, slotProps.data)"
          />
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
    <PrimeVueDialog v-model:visible="isAddOpen" modal header="Add Category" class="w-[45rem]">
      <form @submit.prevent="handleAddCategory">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          name="Name"
          :validators="category_formValidations.name"
        >
          <label for="name">Category Name <sup class="text-red-500">*</sup></label>
          <PrimeVueInputText
            v-model="category_formData.name"
            name="name"
            type="text"
            class="w-full"
            :class="[classes ? 'border-red-600' : 'border-blue-600']"
            fluid
            v-on="useListenerForm(category_formValidations, 'name')"
          />
        </AppBaseFormGroup>
        <div class="mb-8">
          <label for="description">description (Optional)</label>
          <PrimeVueTextarea v-model="category_formData.description" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            label="Cancel"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="isAddOpen = false"
          />
          <PrimeVueButton label="Add" class="w-48 bg-primary border-primary" type="submit" />
        </div>
      </form>
    </PrimeVueDialog>

    <!-- Edit Dialog -->
    <PrimeVueDialog v-model:visible="isEditOpen" modal header="Edit Category" class="w-[45rem]">
      <form @submit.prevent="handleEditCategory">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          name="Name"
          :validators="category_formValidations.name"
        >
          <label for="name">Category Name <sup class="text-red-500">*</sup></label>
          <PrimeVueInputText
            v-model="category_formData.name"
            name="name"
            type="text"
            class="w-full"
            :class="[classes ? 'border-red-600' : 'border-blue-600']"
            fluid
            v-on="useListenerForm(category_formValidations, 'name')"
          />
        </AppBaseFormGroup>
        <div class="mb-8">
          <label for="description">description (Optional)</label>
          <PrimeVueTextarea v-model="category_formData.description" auto-resize rows="5" class="w-full" />
        </div>
        <div class="flex justify-end gap-2">
          <PrimeVueButton
            label="Cancel"
            severity="info"
            variant="outlined"
            class="w-48"
            @click="isEditOpen = false"
          />
          <PrimeVueButton label="Edit" class="w-48 bg-primary border-primary" type="submit" />
        </div>
      </form>
    </PrimeVueDialog>

    <!-- Delete Confirmation -->
    <PrimeVueDialog :visible="isDeleteOpen" modal header="">
      <template #container>
        <div class="w-[35rem] p-8 text-center">
          <i class="pi pi-trash text-4xl mb-4 text-red-500" />
          <h1 class="text-2xl font-semibold mb-2">Are you sure you want to delete this category?</h1>
          <p class="mb-6">This will affect products that use this category.</p>
          <div class="flex justify-center gap-4">
            <PrimeVueButton label="Delete" severity="danger" class="w-40" @click="handleDeleteCategory()" />
            <PrimeVueButton label="Cancel" class="w-40 bg-primary border-primary" @click="isDeleteOpen = false" />
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<script setup lang="ts">
import { FilterMatchMode } from '@primevue/core/api';

import { useCategoryService } from '../../services/Category/CategoryService';
import { ICategory } from '@/modules/catalog/interfaces/Category/CategoryInterface';

const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  category_formData,
  category_formValidations,
} = useCategoryService();

const isAddOpen = ref(false);
const isEditOpen = ref(false);
const isDeleteOpen = ref(false);
const selectedCategories = ref<ICategory[]>([]);
const categories = ref<ICategory[]>([]);
const selected = ref<ICategory | null>(null);
const loading = ref(false);

// const category = ref('');
// const description = ref('');
const op = ref();

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const handleAddCategory = async () => {
  if (!category_formData.name.trim()) {
    alert('ICategory name is required!');
    return;
  }

  try {
    const newCategory = await createCategory({
      name: category_formData.name,
      description: category_formData.description || '-',
    });

    categories.value.push(newCategory);
    isAddOpen.value = false;
    category_formData.name = '';
    category_formData.description = '';
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

const openAddDialog = () => {
  isAddOpen.value = true;
  category_formData.name = '';
  category_formData.description = '';
};

const displayPopover = (event: Event, category: ICategory) => {
  selected.value = category;
  op.value?.show(event);
};

const displayEdit = () => {
  if (selected.value) {
    category_formData.name = selected.value.category;
    category_formData.description = selected.value.description ?? '';
    isEditOpen.value = true;
    op.value?.hide();
  }
};

const handleEditCategory = async () => {
  if (selected.value) {
    try {
      const updatedCategory = await updateCategory(selected.value.id, {
        name: category_formData.name,
        description: category_formData.description || '-',
      });
      categories.value = categories.value.map(cat => (cat.id === updatedCategory.id ? updatedCategory : cat));
      isEditOpen.value = false;
    } catch (error) {
      console.error('Failed to update category:', error);
      alert('Something went wrong while updating the category.');
    }
  }
};

/**
 * @description Deletes the currently selected category.
 * If the category is successfully deleted, it removes the category from the list
 * and displays a success alert. Otherwise, it shows an error alert.
 * It also handles any errors encountered during the deletion process.
 */

const handleDeleteCategory = async () => {
  try {
    if (selected.value) {
      const deleteCat = await deleteCategory(selected.value.id);
      if (deleteCat === 200) {
        alert('Category deleted successfully.');
        categories.value = categories.value.filter(cat => cat.id !== selected.value?.id);
      } else {
        alert('Something went wrong while deleting the category.');
      }
    }
  } catch (error) {
    console.error('Failed to delete category:', error);
  }

  isDeleteOpen.value = false;
};

onMounted(() => {
  loadCategories();
});
</script>
