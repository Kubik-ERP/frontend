<script setup lang="ts">
// Services
import { useCustomerListService } from '../services/customer-list.service';

/**
 * @description Reactive data binding
 */
const popover = ref();

/**
 * @description Destructure all the data and methods what we need
 */
const {
  customerList_columns,
  customerList_fetchListCustomers,
  customerList_isLoading,
  // customerList_queryParams,
  customerList_onDelete,
  customerList_values,
} = useCustomerListService();

/**
 * @description Lifecycle hook that is called after data-bound properties of a directive are initialized.
 */
onMounted(async () => {
  await customerList_fetchListCustomers();
});
</script>

<template>
  <section id="customer-list" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      btn-cta-create-title="Add Customer"
      :columns="customerList_columns"
      :data="customerList_values"
      :is-loading="customerList_isLoading"
      header-title="Customer"
      is-using-btn-cta-create
      is-using-custom-body
      :is-using-filter="false"
      is-using-search-on-header
      @click-btn-cta-create="$router.push({ name: 'customer.create' })"
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
                @click="$router.push({ name: 'customer.detail', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="eye-visible" class="!w-4 !h-4" />
                    <span class="font-normal text-sm text-text-primary">Preview</span>
                  </section>
                </template>
              </PrimeVueButton>

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

              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="customerList_onDelete(data.id)">
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
          <span class="font-normal text-sm text-text-secondary">{{ data[column.value ?? '-'] }}</span>
        </template>
      </template>
    </AppBaseDataTable>

    <AppBaseDialogConfirmation id="catalog-customer-delete-dialog-confirmation" />
  </section>
</template>
