<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

/**
 * @description Reactive data binding
 */
const popover = ref();

/**
 * @description Inject all the data and methods what we need
 */
const { accountStoreDetail_listColumnsOfAssignedStaff, accountStoreDetail_listValuesOfAssignedStaff } =
  inject<IAccountStoreDetailProvided>('accountStoreDetail')!;
</script>

<template>
  <section id="account-assigned-staff" class="flex flex-col gap-4 w-full">
    <h6 class="font-semibold text-black text-lg">Assigned Staffs</h6>

    <AppBaseDataTable
      btn-cta-create-title="Assign Staff"
      :columns="accountStoreDetail_listColumnsOfAssignedStaff"
      :data="accountStoreDetail_listValuesOfAssignedStaff"
      is-using-custom-body
      is-using-custom-header
      :is-using-search-on-header="false"
    >
      <template #header>
        <header
          class="flex flex-col lg:flex-row items-start lg:items-center justify-between border border-solid border-grayscale-20 px-6 py-7"
        >
          <PrimeVueChip
            class="text-xs font-normal bg-secondary-background text-green-primary"
            label="50 Assigned Staffs"
          />

          <section
            id="right-content"
            class="flex flex-col lg:flex-row items-start lg:items-center gap-4 mt-4 lg:mt-0 w-full"
          >
            <PrimeVueIconField class="w-full lg:w-fit">
              <PrimeVueInputIcon>
                <template #default>
                  <AppBaseSvg name="search" />
                </template>
              </PrimeVueInputIcon>

              <PrimeVueInputText placeholder="Search Staff Name or Position" class="text-sm w-full lg:min-w-80" />
            </PrimeVueIconField>

            <PrimeVueButton class="bg-primary border-none w-full lg:w-fit px-5" severity="secondary">
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="plus-line-white" />

                  <span class="font-semibold text-sm lg:text-base text-white"> Add Assign Staff </span>
                </section>
              </template>
            </PrimeVueButton>
          </section>
        </header>
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
              <PrimeVueButton class="w-full px-4 py-3" variant="text">
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="staff-danger" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Unassign Staff</span>
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
  </section>
</template>
