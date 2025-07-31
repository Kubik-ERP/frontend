<script setup lang="ts">
// Interfaces
import type { IStaffMemberListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
const popover = ref();

// Ref to store the data of the currently selected row
const selectedData = ref<{ id: string | null } | null>(null);

/**
 * Sets the selected data and toggles the popover.
 * @param event - The browser click event.
 * @param rowData - The data object from the clicked row.
 */
const openActionsMenu = (event: MouseEvent, rowData: { id: string | null }) => {
  selectedData.value = rowData || null;
  popover.value.toggle(event);
};

/**
 * @description Inject all the data and methods what we need
 */
const {
  staffMemberList_columns,
  staffMemberList_isLoading,
  staffMemberList_values,
  // staffMemberList_queryParams,
  // staffMemberList_typesOfUserPermissions,
  // staffMemberList_dropdownItemTitles,
  // staffMemberList_deleteStaffMember,
  // staffMemberList_onChangePage,
} = inject('staffMemberList') as IStaffMemberListProvided;
</script>

<template>
  <AppBaseDataTable
    btn-cta-create-title="Add Staff Member"
    :columns="staffMemberList_columns"
    :data="staffMemberList_values.data"
    is-using-server-side-pagination
    :rows-per-page="staffMemberList_values.meta.limit"
    :total-records="staffMemberList_values.meta.total"
    :first="(staffMemberList_values.meta.page - 1) * staffMemberList_values.meta.limit"
    header-title="Staff"
    is-using-custom-body
    is-using-custom-filter
    is-using-custom-header-prefix
    is-using-custom-header-suffix
    is-using-header
    :is-loading="staffMemberList_isLoading"
    @update:currentPage="staffMemberList_onChangePage"
  >
    <template #header-prefix>
      <div class="flex items-center gap-2">
        <h6 class="font-semibold text-gray-900 text-xl">Staff</h6>

        <PrimeVueChip
          class="text-xs font-normal bg-secondary-background text-green-primary px-1.5 py-0.5"
          :label="`${staffMemberList_values.meta.total} Members`"
        />
      </div>
    </template>

    <template #header-suffix>
      <div class="flex items-center gap-4">
        <PrimeVueIconField>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="search" />
            </template>
          </PrimeVueInputIcon>

          <PrimeVueInputText
            v-model="staffMemberList_queryParams.search"
            placeholder="Search Staff Member"
            class="w-full min-w-80"
          />
        </PrimeVueIconField>

        <PrimeVueButton
          class="w-fit"
          label="Add Staff Member"
          @click="$router.push({ name: 'staff-member.create' })"
        >
          <template #icon>
            <AppBaseSvg name="plus-line-white" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
      </div>
    </template>

    <template #filter>
      <div class="flex items-center gap-4 w-full">
        <span class="font-semibold inline-block text-gray-900 text-base w-fit whitespace-nowrap">Filter by</span>

        <!-- <PrimeVueMultiSelect
          v-model="staffMemberList_queryParams.title"
          display="chip"
          :options="staffMemberList_dropdownItemTitles"
          option-label="label"
          option-value="value"
          filter
          placeholder="Title"
          class="text-sm text-text-disabled w-full"
        /> -->

        <PrimeVueMultiSelect
          v-model="staffMemberList_queryParams.permission"
          display="chip"
          :options="staffMemberList_typesOfUserPermissions"
          option-label="label"
          option-value="value"
          filter
          placeholder="Permission"
          class="text-sm text-text-disabled w-full max-w-64"
        />
      </div>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton variant="text" rounded aria-label="detail" @click="openActionsMenu($event, data)">
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          ref="popover"
          :pt="{
            root: { class: 'z-[9999]' }, // ✅ This forces the popover to the top layer
            content: 'p-0',
          }"
        >
          <section v-if="selectedData" id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="$router.push({ name: 'staff-member.edit', params: { id: selectedData.id } })"
            >
              <template #default>
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Edit</span>
                </section>
              </template>
            </PrimeVueButton>

            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="staffMemberList_deleteStaffMember(selectedData.id || '')"
            >
              <template #default>
                <section class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Delete</span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </PrimeVuePopover>
      </template>
      <template v-else-if="column.value === 'title'">
        <span class="font-normal text-sm text-text-primary">
          {{ data[column.value] ? useTitleCaseWithSpaces(data[column.value]) : '-' }}
        </span>
      </template>
      <template v-else-if="column.value === 'phoneNumber'">
        <span class="font-normal text-sm text-text-primary">
          {{ data ? (data.phoneCode ? `(${data.phoneCode}) ` : '') + (data.phoneNumber ?? '') || '-' : '-' }}
        </span>
      </template>
      <template v-else-if="column.value === 'permission'">
        <span class="font-normal text-sm text-text-primary">
          {{
            staffMemberList_typesOfUserPermissions.find((item: IDropdownItem) => item.value === data[column.value])
              ?.label || '-'
          }}
        </span>
      </template>
      <template v-else>
        <span class="font-normal text-text-primary"> {{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
