<script lang="ts" setup>
import InventoryCategoryModalForm from '../components/InventoryCategoryModalForm.vue';
import InventoryCategoryModalImport from '../components/InventoryCategoryModalImport.vue';
import { IInventoryCategory } from '../interfaces';
import { useInventoryCategoryService } from '../services/inventory-category.service';
import { ref } from 'vue';

const selectedData = ref<IInventoryCategory | null>(null);
const popover = ref();

const openActionsMenu = (event: Event, data: IInventoryCategory) => {
  selectedData.value = data;
  popover.value?.toggle(event);
};

const {
  inventoryCategoryList_columns,
  inventoryCategoryList_values,
  inventoryCategoryList_onCreateCategory,
  inventoryCategoryList_isLoading,
  inventoryCategoryList_onChangePage,
  inventoryCategoryList_handleOnSortChange,
  inventoryCategoryList_queryParams,
  inventoryCategoryList_onEditCategory,
  inventoryCategoryList_onDeleteCategory,
  inventoryCategoryList_onImport
} = useInventoryCategoryService();

</script>

<template>
  <section id="inventory-category" class="flex flex-col gap-6 w-full">
    <AppBaseDataTable :columns="inventoryCategoryList_columns" :data="inventoryCategoryList_values.data.items"
      header-title="Inventory Categories" :rows-per-page="inventoryCategoryList_values.data.meta.pageSize"
      :total-records="inventoryCategoryList_values.data.meta.total"
      :first="(inventoryCategoryList_values.data.meta.page - 1) * inventoryCategoryList_values.data.meta.pageSize"
      :is-loading="inventoryCategoryList_isLoading" :sort-field="inventoryCategoryList_queryParams.orderBy"
      :sort-order="inventoryCategoryList_queryParams.orderDirection === 'asc' ? 1 : -1" is-using-server-side-pagination
      is-using-custom-header-suffix is-using-header is-using-custom-body :is-using-custom-filter="true"
      @update:currentPage="inventoryCategoryList_onChangePage" @update:sort="inventoryCategoryList_handleOnSortChange">
      <!-- Header Prefix -->
      <template #header-suffix>
      <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <div class="relative">
            <PrimeVueIconField>
              <PrimeVueInputIcon>
                <i class="pi pi-search text-gray-400"></i>
              </PrimeVueInputIcon>
              <PrimeVueInputText v-model="inventoryCategoryList_queryParams.search"
                :placeholder="useLocalization('inventoryCategory.searchPlaceholder')"
                class="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md" />
            </PrimeVueIconField>
          </div>
           <PrimeVueButton
            class="bg-white hover:bg-gray-100 border border-primary text-primary px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="inventoryCategoryList_onImport"
          >
            <i class="pi pi-upload text-sm"></i>
            Import File
          </PrimeVueButton>
          <PrimeVueButton
            class="bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="inventoryCategoryList_onCreateCategory">
            <i class="pi pi-plus text-sm"></i>
            {{ useLocalization('inventoryCategory.createButton') }}
          </PrimeVueButton>
        </div>
      </template>


      <!-- Body Table -->
      <template #body="{ column, data }">
        <template v-if="column.value === 'name'">
          <span class="text-gray-700">{{ data.name }}</span>
        </template>
        <template v-else-if="column.value === 'notes'">
          <span class="text-gray-500">{{ data.notes }}</span>
        </template>
        <template v-else-if="column.value === 'createdAt'">
          <span class="text-gray-700">
            {{ new Date(data.createdAt).toLocaleDateString('id-ID', {
              day: '2-digit', month: '2-digit', year: 'numeric'
            }) }}
          </span>
        </template>


        <template v-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="Actions" @click="openActionsMenu($event, data)">
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover ref="popover" :pt="{
            root: { class: 'z-[9999]' },
            content: 'p-0',
          }">
            <section v-if="selectedData" class="flex flex-col">
              <!-- Edit -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text"
                @click="inventoryCategoryList_onEditCategory(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{ useLocalization('inventoryCategory.editButton')
                  }}</span>
                </section>
              </PrimeVueButton>

              <!-- Delete -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text"
                @click="inventoryCategoryList_onDeleteCategory(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{
                    useLocalization('inventoryCategory.deleteButton')
                  }}</span>
                </section>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

      </template>
    </AppBaseDataTable>
  </section>
  <InventoryCategoryModalForm />
  <InventoryCategoryModalImport />
  <AppBaseDialogConfirmation id="inventory-category-dialog-confirmation" />
</template>
