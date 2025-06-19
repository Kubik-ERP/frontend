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
const { staffMemberList_columns, staffMemberList_isLoading, staffMemberList_values } = inject(
  'staffMemberList',
) as IStaffMemberListProvided;
</script>

<template>
  <AppBaseDataTable
    btn-cta-create-title="Add Staff Member"
    :columns="staffMemberList_columns"
    :data="staffMemberList_values"
    header-title="Staff"
    is-using-btn-cta-create
    is-using-custom-body
    :is-loading="staffMemberList_isLoading"
  >
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
        <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>
