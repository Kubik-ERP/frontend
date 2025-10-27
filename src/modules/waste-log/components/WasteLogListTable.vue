<script setup lang="ts">
// Interfaces
import type { IWasteLogListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
const popovers = ref<Record<string, unknown>>({});

// Helper function to toggle popover
const togglePopover = (id: string, event: Event) => {
  const popover = popovers.value[`popover-${id}`] as { toggle?: (event: Event) => void } | null;
  popover?.toggle?.(event);
};

/**
 * @description Inject all the data and methods what we need
 */
const {
  wasteLogList_columns,
  wasteLogList_handleOnSortChange,
  wasteLogList_isLoading,
  wasteLogList_onChangePage,
  wasteLogList_onShowDialogAddOrEditWasteLog,
  wasteLogList_onShowDialogDelete,
  wasteLogList_queryParams,
  wasteLogList_values,
} = inject('wasteLogList') as IWasteLogListProvided;
</script>

<template>
  <AppBaseDataTable
    btn-cta-create-title="Add Waste Record"
    :columns="wasteLogList_columns"
    :data="wasteLogList_values.items"
    header-title="Waste List"
    :is-using-btn-cta-create="true"
    is-using-custom-body
    :is-using-filter="false"
    is-using-pagination
    :is-loading="wasteLogList_isLoading"
    :rows-per-page="wasteLogList_values?.meta.pageSize"
    :total-records="wasteLogList_values?.meta.total"
    :first="
      wasteLogList_values?.meta ? (wasteLogList_values.meta.page - 1) * wasteLogList_values.meta.pageSize : 0
    "
    :sort-field="wasteLogList_queryParams.orderBy"
    :sort-order="
      wasteLogList_queryParams.orderDirection === 'asc'
        ? 1
        : wasteLogList_queryParams.orderDirection === 'desc'
          ? -1
          : 0
    "
    @click-btn-cta-create="wasteLogList_onShowDialogAddOrEditWasteLog"
    @sort="wasteLogList_handleOnSortChange"
    @page="wasteLogList_onChangePage"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="(event: Event) => togglePopover(data.wasteLogId, event)"
        >
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          :ref="
            (el: unknown) => {
              if (el) popovers[`popover-${data.wasteLogId}`] = el;
            }
          "
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="() => wasteLogList_onShowDialogAddOrEditWasteLog(data.wasteLogId)"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="w-4 h-4" />
                  <span class="font-normal text-sm text-text-primary">Edit</span>
                </section>
              </template>
            </PrimeVueButton>

            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="wasteLogList_onShowDialogDelete(data.wasteLogId)"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="w-4 h-4" />
                  <span class="font-normal text-sm text-text-primary">Delete</span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </PrimeVuePopover>
      </template>

      <template v-else-if="column.value === 'itemsCount'">
        <span class="font-normal text-sm text-grayscale-70">
          {{ data.wasteLogItems?.length || 0 }} items
        </span>
      </template>

      <template v-else-if="column.value === 'createdAt' || column.value === 'updatedAt'">
        <span class="font-normal text-sm text-grayscale-70">
          {{ data[column.value] ? new Date(data[column.value]).toLocaleDateString() : '-' }}
        </span>
      </template>

      <template v-else>
        <span class="font-normal text-sm text-grayscale-70">{{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
