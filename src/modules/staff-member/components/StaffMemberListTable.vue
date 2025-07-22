<script setup lang="ts">
// Interfaces
import type { IStaffMemberListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
const popover = ref();

/**
 * @description Inject all the data and methods what we need
 */
const { staffMemberList_columns, staffMemberList_isLoading, staffMemberList_values, staffMemberList_queryParams } =
  inject('staffMemberList') as IStaffMemberListProvided;
</script>

<template>
  {{ staffMemberList_values }}

  <AppBaseDataTable
    btn-cta-create-title="Add Staff Member"
    :columns="staffMemberList_columns"
    :data="staffMemberList_values.data"
    is-using-server-side-pagination
    :rows-per-page="staffMemberList_values.meta.limit"
    :total-records="staffMemberList_values.meta.total"
    :first="(staffMemberList_values.meta.page - 1) * staffMemberList_values.meta.limit"
    header-title="Staff"
    is-using-btn-cta-create
    is-using-custom-body
    is-using-custom-filter
    is-using-custom-header-prefix
    is-using-custom-header-suffix
    is-using-header
    :is-loading="staffMemberList_isLoading"
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
      <div class="flex flex-col gap-1 w-full">
        <span class="font-semibold inline-block text-gray-900 text-base w-48">Filter by</span>

        <div class="flex items-center gap-4 w-full"></div>
      </div>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton variant="text" rounded aria-label="detail" @click="popover.toggle($event)">
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          ref="popover"
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="$router.push({ name: 'customer.edit', params: { id: data.id } })"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Edit</span>
                </section>
              </template>
            </PrimeVueButton>

            <PrimeVueButton class="w-full px-4 py-3" variant="text">
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="delete" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Delete</span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </PrimeVuePopover>
      </template>
      <template v-else>
        <span class="font-normaltext-text-primary"> {{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
