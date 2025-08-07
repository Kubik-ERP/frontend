<script setup lang="ts">
// Services
import { useSupplierListService } from '../services/supplier-list.service';

/**
 * @description Destructure all the data and methods what we need
 */
const {
  supplierList_columns,
  supplierList_isLoading,
  supplierList_onChangePage,
  supplierList_handleOnSortChange,
  supplierList_queryParams,
  supplierList_values,
  supplierList_fetchSuppliers,
  supplierList_onCreateSupplier,
  supplierList_onEditSupplier,
  supplierList_onDeleteSupplier,
} = useSupplierListService();

// Initialize data fetch
onMounted(async () => {
  try {
    await supplierList_fetchSuppliers();
    console.log('Supplier list loaded successfully with columns:', supplierList_columns.length);
    console.log('Supplier data:', supplierList_values.value);
    console.log('Items array:', supplierList_values.value.data.items);
    console.log('Items count:', supplierList_values.value.data.items.length);
  } catch (error) {
    console.error('Failed to load supplier list:', error);
  }
});

// Action menu state
const showActionMenu = ref<string | null>(null);

// Toggle action menu
const toggleActionMenu = (supplierId: string, event: Event) => {
  event.stopPropagation();
  showActionMenu.value = showActionMenu.value === supplierId ? null : supplierId;
};

// Handle preview
const handlePreview = (supplierId: string) => {
  console.log('Preview supplier:', supplierId);
  showActionMenu.value = null;
  // Add preview logic here
};

// Handle edit
const handleEdit = (supplierId: string) => {
  supplierList_onEditSupplier(supplierId);
  showActionMenu.value = null;
};

// Handle delete
const handleDelete = (supplierId: string) => {
  supplierList_onDeleteSupplier(supplierId);
  showActionMenu.value = null;
};

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', () => {
    showActionMenu.value = null;
  });
});
</script>

<template>
  <section id="supplier-list" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title=""
      :columns="supplierList_columns"
      :data="supplierList_values.data.items"
      header-title=""
      :rows-per-page="supplierList_values.data.meta.pageSize"
      :total-records="supplierList_values.data.meta.total"
      :first="(supplierList_values.data.meta.page - 1) * supplierList_values.data.meta.pageSize"
      :is-loading="supplierList_isLoading"
      :sort-field="supplierList_queryParams.orderBy"
      :sort-order="supplierList_queryParams.orderDirection"
      is-using-server-side-pagination
      is-using-custom-body
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-header
      :is-using-filter="false"
      @update:currentPage="supplierList_onChangePage"
      @update:sort="supplierList_handleOnSortChange"
      @create="supplierList_onCreateSupplier"
    >
      <template #header-prefix>
        <div class="flex items-center">
          <h2 class="text-xl font-semibold text-gray-900">Supplier List</h2>
        </div>
      </template>

      <template #header-suffix>
        <div class="flex items-center gap-3">
          <div class="relative">
            <PrimeVueIconField>
              <PrimeVueInputIcon>
                <i class="pi pi-search text-gray-400"></i>
              </PrimeVueInputIcon>
              <PrimeVueInputText
                v-model="supplierList_queryParams.search"
                placeholder="Search ID or Supplier Name"
                class="w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md"
              />
            </PrimeVueIconField>
          </div>
          <PrimeVueButton
            class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="supplierList_onCreateSupplier"
          >
            <i class="pi pi-plus text-sm"></i>
            Add New Supplier
          </PrimeVueButton>
        </div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'id'">
          <span class="font-normal text-sm text-gray-900">{{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'supplierName'">
          <span class="font-semibold text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'contactPerson'">
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'phoneNumber'">
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'email'">
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'address'">
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>

        <template v-else-if="column.value === 'action'">
          <div class="relative">
            <PrimeVueButton
              size="small"
              variant="text"
              rounded
              aria-label="Actions"
              class="!p-2"
              @click="toggleActionMenu(data.id, $event)"
            >
              <template #icon>
                <i class="pi pi-ellipsis-v text-gray-500"></i>
              </template>
            </PrimeVueButton>

            <div
              v-if="showActionMenu === data.id"
              class="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-32 z-50"
            >
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                @click="handlePreview(data.id)"
              >
                <i class="pi pi-eye text-blue-500"></i>
                Preview
              </button>
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                @click="handleEdit(data.id)"
              >
                <i class="pi pi-pencil text-yellow-500"></i>
                Edit
              </button>
              <button
                class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm text-red-600"
                @click="handleDelete(data.id)"
              >
                <i class="pi pi-trash text-red-500"></i>
                Delete
              </button>
            </div>
          </div>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
