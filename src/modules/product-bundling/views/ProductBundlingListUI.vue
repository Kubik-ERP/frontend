<script setup lang="ts">
// services
import { useProductBundlingService } from '../services/product-bundling.service';
const { productBinding_columns, productBundling_list } = useProductBundlingService();

// Use unknown type to avoid any, but allow method access
const popovers = ref<Record<string, unknown>>({});

// Helper function to toggle popover
const togglePopover = (id: string, event: Event) => {
  const popover = popovers.value[`popover-${id}`] as { toggle?: (event: Event) => void } | null;
  popover?.toggle?.(event);
};
</script>
<template>
  <div>
    <AppBaseDataTable
      :columns="productBinding_columns"
      :data="productBundling_list.data"
      is-using-header
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-body
      :is-using-filter="false"
      is-using-server-side-pagination
      :rows-per-page="productBundling_list.meta.pageSize"
      :total-records="productBundling_list.meta.total"
      :first="(productBundling_list.meta.page - 1) * productBundling_list.meta.pageSize"
    >
      <template #header-prefix>
        <div class="flex items-center">
          <h6 class="font-semibold text-black text-lg">Product Bundling</h6>
        </div>
      </template>

      <template #header-suffix>
        <div class="flex items-center gap-2">
          <PrimeVueButton
            class="bg-primary border-none w-fit px-5"
            severity="secondary"
            @click="$router.push({ name: 'product-bundling.add' })"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="plus-line-white" />
                <span class="font-semibold text-base text-white">Add Product Bundling</span>
              </section>
            </template>
          </PrimeVueButton>
        </div>
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
              <PrimeVueButton class="w-full px-4 py-3" variant="text">
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
        <template v-else-if="column.value === 'price'">
          <span class="font-normal text-sm text-text-primary">{{ useCurrencyFormat({ data: data.price }) }}</span>
        </template>
        <template v-else>
          <span class="font-normal text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </div>
</template>
