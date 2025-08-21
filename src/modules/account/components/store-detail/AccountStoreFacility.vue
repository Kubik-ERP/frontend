<script setup lang="ts">
// Interfaces
import type { IAccountStoreDetailProvided } from '../../interfaces';

// components
import CreateEditDialog from '../store-detail/store-facility/CreateEditDialog.vue';
/**
 * @description Inject all the data and methods what we need
 */
const {
  accountStoreDetail_listColumnsOfStoreFacilities,

  account_storeFacilities,

  accountStoreDetail_onChangePage,
  account_storeFacilities_isLoading,
  accountStoreDetail_onShowDialogCreateEdit,
  accountStoreDetail_onDeleteDialogConfirmation,
} = inject<IAccountStoreDetailProvided>('accountStoreDetail')!;

// Use unknown type to avoid any, but allow method access
const popovers = ref<Record<string, unknown>>({});

// Helper function to toggle popover
const togglePopover = (id: string, event: Event) => {
  const popover = popovers.value[`popover-${id}`] as { toggle?: (event: Event) => void } | null;
  popover?.toggle?.(event);
};
</script>

<template>
  <AppBaseDataTable
    :columns="accountStoreDetail_listColumnsOfStoreFacilities"
    :data="account_storeFacilities.data"
    :rows-per-page="account_storeFacilities.meta.pageSize"
    :total-records="account_storeFacilities.meta.total"
    :first="(account_storeFacilities.meta.page - 1) * account_storeFacilities.meta.pageSize"
    :is-loading="account_storeFacilities_isLoading"
    is-using-custom-body
    is-using-custom-header
    :is-using-border-on-header="false"
    is-using-pagination
    @update:change-page="accountStoreDetail_onChangePage"
  >
    <template #header>
      <header class="flex items-center justify-between py-5">
        <h6 class="font-semibold text-black text-lg">
          {{ useLocalization('account.facilities') }}
        </h6>

        <PrimeVueButton
          class="bg-primary border-none w-fit px-5"
          severity="secondary"
          @click="accountStoreDetail_onShowDialogCreateEdit(null)"
        >
          <template #default>
            <section id="content" class="flex items-center gap-2">
              <AppBaseSvg name="plus-line-white" />

              <span class="font-semibold text-base text-white"> Add Store Facility </span>
            </section>
          </template>
        </PrimeVueButton>
      </header>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'action'">
        <PrimeVueButton
          variant="text"
          rounded
          aria-label="detail"
          @click="(event: Event) => togglePopover(data.id, event)"
        >
          <template #icon>
            <AppBaseSvg name="three-dots" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>

        <PrimeVuePopover
          :ref="
            (el: unknown) => {
              if (el) popovers[`popover-${data.id}`] = el;
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
              @click="accountStoreDetail_onShowDialogCreateEdit(data)"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2 w-full">
                  <AppBaseSvg name="edit" class="!w-4 !h-4" />
                  <span class="font-normal text-sm text-text-primary">Edit</span>
                </section>
              </template>
            </PrimeVueButton>
            <PrimeVueButton
              class="w-full px-4 py-3"
              variant="text"
              @click="accountStoreDetail_onDeleteDialogConfirmation(data.id)"
            >
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

  <CreateEditDialog />
  <AppBaseDialogConfirmation id="account-store-facility-delete-dialog-confirmation" />
</template>
