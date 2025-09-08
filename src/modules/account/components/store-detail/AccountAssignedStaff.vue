<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

/**
 * @description Reactive data binding
 */
// const popover = ref();

/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreDetail_listColumnsOfAssignedStaff,
  accountStoreDetail_listValuesOfAssignedStaff,
  accountStoreDetail_onAddStaff,
  accountDetail_listAssignedQueryParams,
  accountDetail_listAssignedStaff,
} = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;

// console.log('🚀 ~ accountStoreDetail_listValuesOfAssignedStaff:', accountStoreDetail_listValuesOfAssignedStaff);
</script>

<template>
  <section id="account-assigned-staff" class="flex flex-col gap-4 w-full">
    <h6 class="font-semibold text-black text-lg">Assigned Staffs</h6>

    <AppBaseDataTable
      btn-cta-create-title="Assign Staff"
      :columns="accountStoreDetail_listColumnsOfAssignedStaff"
      :data="accountStoreDetail_listValuesOfAssignedStaff.data.employees"
      is-using-custom-body
      is-using-custom-header
      is-using-server-side-pagination
      :is-using-search-on-header="true"
    >
      <template #header>
        <header
          class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border border-solid border-grayscale-20 px-4 sm:px-6 py-4 sm:py-7"
        >
          <!-- Chip -->
          <PrimeVueChip
            class="text-xs font-normal bg-secondary-background text-green-primary w-fit"
            :label="`${accountDetail_listAssignedStaff.length} Staffs`"
          />

          <!-- Right Content -->
          <section
            id="right-content"
            class="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full lg:w-auto"
          >
            <!-- Search -->
            <PrimeVueIconField class="flex-1 sm:flex-none">
              <PrimeVueInputIcon>
                <i class="pi pi-search text-gray-400"></i>
              </PrimeVueInputIcon>
              <PrimeVueInputText
                v-model="accountDetail_listAssignedQueryParams.search"
                :placeholder="$t('brand.searchPlaceholder')"
                class="w-full sm:w-72 lg:w-80 h-10 pl-10 pr-4 border border-gray-300 rounded-md"
              />
            </PrimeVueIconField>

            <!-- Add Staff Button -->
            <PrimeVueButton
              class="bg-primary border-none w-full sm:w-fit px-4 sm:px-5 h-10"
              severity="secondary"
              @click="accountStoreDetail_onAddStaff"
            >
              <section id="content" class="flex items-center justify-center gap-2">
                <AppBaseSvg name="plus-line-white" class="w-4 h-4" />
                <span class="font-semibold text-sm lg:text-base text-white"> Add Assign Staff </span>
              </section>
            </PrimeVueButton>
          </section>
        </header>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'name'">
          <span class="font-base text-sm text-text-primary">{{ data.name ?? '-' }}</span>
        </template>

        <template v-else-if="column.value === 'title'">
          <span class="font-base text-sm text-text-primary">{{ data.title ?? '-' }}</span>
        </template>

        <template v-else-if="column.value === 'phone'">
          <span class="font-base text-sm text-text-primary">{{ data.phoneNumber ?? '-' }}</span>
        </template>
        <!-- <template v-if="column.value === 'action'">
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
        </template> -->
      </template>
    </AppBaseDataTable>
  </section>
</template>
