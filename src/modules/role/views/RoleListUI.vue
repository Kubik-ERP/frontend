<script setup lang="ts">
import { ref } from 'vue';
import { useRoleListService } from '../services/role-list.service';
import { IRole } from '../interfaces/index.interface';
import RoleFormModal from '../components/RoleFormModal.vue';

const popover = ref();
const selectedData = ref<IRole | null>(null);

const openActionsMenu = (event: Event, data: IRole) => {
  selectedData.value = data;
  popover.value?.toggle(event);
};

const {
  roleList_columns,
  roleList_queryParams,
  roleList_isLoading,
  roleList_onChangePage,
  roleList_handleOnSortChange,
  roleList_onCreate,
  roleList_onEdit,
  roleList_onDelete,
  roleList_response,
  roleList_fetchData,
} = useRoleListService();

provide('role', {
  roleList_fetchData,
});

// onMounted(async () => {
//   await roleList_fetchData();
// })
const totalRoleSystem = computed(() => roleList_response.value.data.items.filter(role => role.isSystem).length);

const totalRoleNonSystem = computed(
  () => roleList_response.value.data.items.filter(role => !role.isSystem).length,
);
</script>

<template>
  <section id="role-list-ui" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="roleList_columns"
      :data="roleList_response.data.items"
      :header-title="useLocalization('role.title')"
      :rows-per-page="roleList_response.data.meta.pageSize"
      :total-records="roleList_response.data.meta.total"
      :first="(roleList_response.data.meta.page - 1) * roleList_response.data.meta.pageSize"
      :is-loading="roleList_isLoading"
      :sort-field="roleList_queryParams.orderBy"
      :sort-order="roleList_queryParams.orderDirection === 'asc' ? 1 : -1"
      is-using-server-side-pagination
      is-using-custom-header-prefix
      is-using-header
      is-using-custom-body
      :is-using-custom-filter="true"
      @update:currentPage="roleList_onChangePage"
      @update:sort="roleList_handleOnSortChange"
    >
      <!-- Header Suffix -->
      <template #header-prefix>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-3">
          <!-- Title + Chip -->
          <div class="flex items-center gap-2">
            <h6 class="font-semibold text-gray-900 text-lg sm:text-xl">Role</h6>
            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-0.5"
              :label="`${totalRoleSystem} Role System`"
            />

            <PrimeVueChip
              class="text-xs font-normal bg-secondary-background text-blue-500 px-1.5 py-0.5"
              :label="`${totalRoleNonSystem} Role Non-System`"
            />
          </div>

          <!-- Button selalu ada teks -->
          <PrimeVueButton
            class="bg-primary hover:bg-primary-600 text-white px-3 sm:px-4 py-2 h-10 rounded-md flex items-center justify-center gap-2 w-full sm:w-auto"
            @click="roleList_onCreate"
          >
            <i class="pi pi-plus text-sm"></i>
            <span>{{ $t('role.createButton') }}</span>
          </PrimeVueButton>
        </div>
      </template>

      <!-- Body Table -->
      <template #body="{ column, data }">
        <template v-if="column.value === 'name'">
          <span class="text-gray-700">{{ data.name }}</span>
        </template>
        <template v-else-if="column.value === 'updatedAt'">
          <span class="text-gray-700">
            {{
              new Date(data.updatedAt ?? data.createdAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            }}
          </span>
        </template>

        <template v-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="Actions" @click="openActionsMenu($event, data)">
            <template #icon>
              <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>

          <PrimeVuePopover
            ref="popover"
            :pt="{
              root: { class: 'z-[9999]' },
              content: 'p-0',
            }"
          >
            <section v-if="selectedData" class="flex flex-col">
              <!-- Edit -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="roleList_onEdit(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{
                    useLocalization('role.editButton')
                  }}</span>
                </section>
              </PrimeVueButton>

              <!-- Delete -->
              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="roleList_onDelete(selectedData.id)">
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">{{
                    useLocalization('role.deleteButton')
                  }}</span>
                </section>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
  <RoleFormModal />
  <AppBaseDialogConfirmation id="role-dialog-confirmation" />
</template>
