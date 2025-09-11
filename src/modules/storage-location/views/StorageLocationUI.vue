<script setup lang="ts">
import { ref } from 'vue';
import { IStorageLocation } from '../interfaces';
import { useStorageLocationService } from '../services/storage-location.service';
// import StorageModalForm from '../components/StorageLocationModalForm.vue';
import StorageLocationModalForm from '../components/StorageLocationModalForm.vue';
import StorageLocationImportModal from '../components/StorageLocationImportModal.vue';

const popover = ref();
const selectedData = ref<IStorageLocation | null>(null);

const openActionsMenu = (event: Event, data: IStorageLocation) => {
  selectedData.value = data;
  popover.value?.toggle(event);
};

const {
  storageLocation_columns,
  storageLocation_values,
  storageLocation_isLoading,
  storageLocation_onCreate,
  storageLocation_onChangePage,
  storageLocation_handleOnSortChange,
  storageLocation_queryParams,
  storageLocation_onEdit,
  storageLocation_onDelete,
  storageLocation_onImport,
} = useStorageLocationService();

const rbac = useRbac();
const hasPermission = rbac.hasPermission('manage_storage_location');
</script>

<template>
  <section v-if="hasPermission" id="storage-location-list-ui" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="storageLocation_columns"
      :data="storageLocation_values.data.items"
      header-title="Storage Locations"
      :rows-per-page="storageLocation_values.data.meta.pageSize"
      :total-records="storageLocation_values.data.meta.total"
      :first="(storageLocation_values.data.meta.page - 1) * storageLocation_values.data.meta.pageSize"
      :is-loading="storageLocation_isLoading"
      :sort-field="storageLocation_queryParams.orderBy"
      :sort-order="storageLocation_queryParams.orderDirection === 'asc' ? 1 : -1"
      is-using-server-side-pagination
      is-using-custom-header-suffix
      is-using-header
      is-using-custom-body
      :is-using-custom-filter="true"
      @update:currentPage="storageLocation_onChangePage"
      @update:sort="storageLocation_handleOnSortChange"
    >
      <!-- Header Suffix -->
      <template #header-suffix>
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <PrimeVueIconField>
            <PrimeVueInputIcon>
              <i class="pi pi-search text-gray-400"></i>
            </PrimeVueInputIcon>
            <PrimeVueInputText
              v-model="storageLocation_queryParams.search"
              :placeholder="$t('storageLocation.searchPlaceholder')"
              class="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-md"
            />
          </PrimeVueIconField>
          <PrimeVueButton
            class="bg-white hover:bg-gray-100 border border-primary text-primary px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="storageLocation_onImport"
          >
            <i class="pi pi-upload text-sm"></i>
            {{ useLocalization('storageLocation.import') }}
          </PrimeVueButton>
          <PrimeVueButton
            class="bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="storageLocation_onCreate"
          >
            <i class="pi pi-plus text-sm"></i>
            {{ $t('storageLocation.createButton') }}
          </PrimeVueButton>
        </div>
      </template>

      <!-- Filter -->
      <template #filter>
        <!-- Optional custom filter -->
      </template>

      <!-- Body Table -->
      <template #body="{ column, data }">
        <template v-if="column.value === 'code'">
          <span class="text-gray-700">{{ data.code }}</span>
        </template>
        <template v-if="column.value === 'name'">
          <span class="text-gray-700">{{ data.name }}</span>
        </template>
        <template v-else-if="column.value === 'notes'">
          <span class="text-gray-500">{{ data.notes }}</span>
        </template>
        <template v-else-if="column.value === 'created_at'">
          <span class="text-gray-700">
            {{
              new Date(data.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            }}
          </span>
        </template>

        <!-- Actions -->
        <template v-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="Actions" @click="openActionsMenu($event, data)">
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover ref="popover" :pt="{ root: { class: 'z-[9999]' }, content: 'p-0' }">
            <section v-if="selectedData" class="flex flex-col">
              <!-- Edit -->
              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="storageLocation_onEdit(selectedData.id)"
              >
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">
                    {{ useLocalization('storageLocation.editButton') }}
                  </span>
                </section>
              </PrimeVueButton>

              <!-- Delete -->
              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="storageLocation_onDelete(selectedData.id)"
              >
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">
                    {{ useLocalization('storageLocation.deleteButton') }}
                  </span>
                </section>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
  <section v-else class="flex flex-col items-center justify-center min-h-[60vh]">
    <div class="flex flex-col items-center text-center rounded-xl p-10 max-w-lg">
      <h1 class="text-7xl font-bold text-primary-500">403</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mt-4">Access Forbidden</h2>
      <p class="text-gray-500 mt-2">Kamu tidak memiliki izin untuk mengakses halaman ini.</p>
    </div>
  </section>

  <StorageLocationModalForm />
  <StorageLocationImportModal />
  <AppBaseDialogConfirmation id="storage-location-dialog-confirmation" />
</template>
