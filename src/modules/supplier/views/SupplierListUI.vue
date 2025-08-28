<script setup lang="ts">
// Services
import SupplierImportModal from '../components/SupplierImportModal.vue';
import { ISupplierItem } from '../interfaces';
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
  supplierList_onPreviewSupplier,
  supplierList_onImport,
} = useSupplierListService();

// Initialize data fetch
onMounted(async () => {
  try {
    await supplierList_fetchSuppliers();
  } catch (error) {
    console.error('Failed to load supplier list:', error);
  }
});

// Action menu state
const selectedData = ref<ISupplierItem | null>(null);
const popover = ref();

// Open actions menu
const openActionsMenu = (event: Event, data: ISupplierItem) => {
  selectedData.value = data;
  popover.value?.toggle(event);
};

// Handle preview
const handlePreview = (supplierId: string) => {
  supplierList_onPreviewSupplier(supplierId);
};

// Handle edit
const handleEdit = (supplierId: string) => {
  supplierList_onEditSupplier(supplierId);
};

// Handle delete
const handleDelete = (supplierId: string) => {
  supplierList_onDeleteSupplier(supplierId);
};

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', () => {});
});

const rbac = useRbac();
console.log('rbac', rbac.getCurrentUserPermissions());
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
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <!-- Search -->
          <div class="w-full sm:w-auto">
            <PrimeVueIconField class="w-full">
              <PrimeVueInputIcon>
                <i class="pi pi-search text-gray-400"></i>
              </PrimeVueInputIcon>
              <PrimeVueInputText
                v-model="supplierList_queryParams.search"
                placeholder="Search ID or Supplier Name"
                class="w-full sm:w-64 md:w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md"
              />
            </PrimeVueIconField>
          </div>
          <PrimeVueButton
            class="bg-white hover:bg-gray-100 border border-primary text-primary px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="supplierList_onImport"
          >
            <i class="pi pi-upload text-sm"></i>
            Import Supplier
          </PrimeVueButton>
          <!-- Button -->
          <PrimeVueButton
            class="w-full sm:w-auto bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center justify-center gap-2"
            @click="supplierList_onCreateSupplier"
          >
            <i class="pi pi-plus text-sm"></i>
            Add New Supplier
          </PrimeVueButton>
        </div>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'code'">
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
          <PrimeVueButton variant="text" rounded aria-label="Actions" @click="openActionsMenu($event, data)">
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <!-- Popover -->
          <PrimeVuePopover
            ref="popover"
            :pt="{
              root: { class: 'z-[9999]' },
              content: 'p-0',
            }"
          >
            <section v-if="selectedData" class="flex flex-col">
              <!-- View -->
              <PrimeVueButton
                v-if="rbac.hasPermission('view_supplier_details')"
                class="w-full px-4 py-3"
                variant="text"
                @click="handlePreview(selectedData.id)"
              >
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">
                    {{ useLocalization('voucher.main.popover.view') }}
                  </span>
                </section>
              </PrimeVueButton>

              <!-- Edit -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleEdit(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">
                    {{ useLocalization('voucher.main.popover.edit') }}
                  </span>
                </section>
              </PrimeVueButton>

              <!-- Delete -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="handleDelete(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">
                    {{ useLocalization('voucher.main.popover.delete') }}
                  </span>
                </section>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
  <SupplierImportModal />
  <AppBaseDialogConfirmation id="supplier-list-dialog-confirmation" />
</template>
