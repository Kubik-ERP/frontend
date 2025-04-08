<template>
  <div>
    <PrimeVueDataTable
      :value="categories"
      :loading="loading"
      paginator
      :rows="10"
      data-key="ID"
      table-style="min-width: 50rem"
    >
      <template #header>
        <div class="flex justify-between">
          <h1 class="text-2xl font-bold">Categories</h1>
          <PrimeVueInputText v-model="filters['global'].value" placeholder="Search..." />
        </div>
      </template>

      <PrimeVueColumn field="Category" header="Category Name" sortable />
      <PrimeVueColumn field="Description" header="Description" sortable />

      <template #empty> No categories found. </template>
      <template #loading> Loading categories... </template>
    </PrimeVueDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

import { FilterMatchMode } from '@primevue/core/api';
import { getAllCategories } from '@/modules/catalog/services/Category/categoryService.js';

const categories = ref([]);
const loading = ref(true);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(async () => {
  try {
    categories.value = await getAllCategories();
  } catch (err) {
    console.error('Failed to fetch categories:', err);
  } finally {
    loading.value = false;
  }
});
</script>
