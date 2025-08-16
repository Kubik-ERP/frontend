<script setup lang="ts">
import BrandFormModal from '../components/BrandFormModal.vue';
import { IBrand } from '../interfaces';
import { useBrandListService } from '../services/brand-list.service';
import { ref } from 'vue';

const popover = ref();
const selectedData = ref<IBrand | null>(null);

const openActionsMenu = (event: Event, data: IBrand) => {
  selectedData.value = data;
  popover.value?.toggle(event);
};

const {
  brand_columns,
  brand_values,
  brand_isLoading,
  brand_onCreate,
  brand_onChangePage,
  brand_handleOnSortChange,
  brand_queryParams,
  brand_onEdit,
  brand_onDelete,
} = useBrandListService();


</script>

<template>
  <section id="brand-list-ui" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable :columns="brand_columns" :data="brand_values.data.items" header-title="Brands"
      :rows-per-page="brand_values.data.meta.pageSize" :total-records="brand_values.data.meta.total"
      :first="(brand_values.data.meta.page - 1) * brand_values.data.meta.pageSize" :is-loading="brand_isLoading"
      :sort-field="brand_queryParams.orderBy" :sort-order="brand_queryParams.orderDirection === 'asc' ? 1 : -1"
      is-using-server-side-pagination is-using-custom-header-suffix is-using-header is-using-custom-body
      :is-using-custom-filter="true" @update:currentPage="brand_onChangePage" @update:sort="brand_handleOnSortChange">

      <!-- Header Suffix -->
      <template #header-suffix>
        <div class="flex items-center space-x-2">
          <PrimeVueIconField>
            <PrimeVueInputIcon>
              <i class="pi pi-search text-gray-400"></i>
            </PrimeVueInputIcon>
            <PrimeVueInputText v-model="brand_queryParams.search" :placeholder="$t('brand.searchPlaceholder')"
              class="w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md" />
          </PrimeVueIconField>
          <PrimeVueButton
            class="bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="brand_onCreate">
            <i class="pi pi-plus text-sm"></i>
            {{ $t('brand.createButton') }}
          </PrimeVueButton>
        </div>
      </template>

      <!-- Filter -->
      <template #filter>
        <!-- Custom filter content can be added here -->
      </template>

      <!-- Body Table -->
      <template #body="{ column, data }">
        <template v-if="column.value === 'brandName'">
          <span class="text-gray-700">{{ data.brandName }}</span>
        </template>
        <template v-else-if="column.value === 'notes'">
          <span class="text-gray-500">{{ data.notes }}</span>
        </template>
        <template v-else-if="column.value === 'created_at'">
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
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="brand_onEdit(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{ useLocalization('inventoryCategory.editButton')
                  }}</span>
                </section>
              </PrimeVueButton>

              <!-- Delete -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="brand_onDelete(selectedData.id)">
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
  <BrandFormModal />
  <AppBaseDialogConfirmation id="brand-dialog-confirmation" />
</template>
