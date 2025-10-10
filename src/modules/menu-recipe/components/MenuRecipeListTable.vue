<script setup lang="ts">
// Interfaces
import type { IMenuRecipeListProvided } from '../interfaces';

/**
 * @description Reactive data binding
 */
// Use unknown type to avoid any, but allow method access
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
  menuRecipeList_columns,
  menuRecipeList_onShowDialogDelete,
  menuRecipeList_queryParams,
  menuRecipeList_values,
} = inject('menuRecipeList') as IMenuRecipeListProvided;
</script>

<template>
  <AppBaseDataTable
    v-model:search-value="menuRecipeList_queryParams.search"
    btn-cta-create-title="Add New Recipe"
    :columns="menuRecipeList_columns"
    :data="menuRecipeList_values"
    header-title="Menu Recipe List"
    :is-using-btn-cta-create="true"
    is-using-custom-body
    :is-using-filter="false"
    is-using-search-on-header
    is-using-server-side-pagination
    is-using-pagination
    :is-loading="false"
    :rows-per-page="10"
    :total-records="0"
    :first="
      0
    "
    search-placeholder="Search Recipe"
    :sort-field="menuRecipeList_queryParams.orderBy"
    :sort-order="
      menuRecipeList_queryParams.orderDirection === 'asc'
        ? 1
        : menuRecipeList_queryParams.orderDirection === 'desc'
          ? -1
          : 0
    "
    @click-btn-cta-create="$router.push({ name: 'menu-recipe.create' })"
  >
    <template #body="{ column, data }">
      <template v-if="column.value === 'recipeName'">
        <div class="flex flex-col gap-1">
          <span class="font-normal text-black text-sm">
            {{ data[column.value] ?? '-' }}
          </span>

          <PrimeVueChip v-if="data.isBaseRecipe" class="bg-primary-background p-2 rounded-full text-xs w-fit">
            Base Recipe
          </PrimeVueChip>
        </div>
      </template>

      <template v-else-if="column.value === 'yieldTarget'">
        <span class="font-normal text-black text-sm">
          {{ data[column.value] }} <span class="font-normal text-sm text-text-disabled">Portion</span>
        </span>
      </template>

      <template v-else-if="column.value === 'costPerPortion'">
        <span class="font-normal text-black text-sm">
          {{ useCurrencyFormat({
            data: data[column.value],
          }) }}
        </span>
      </template>

      <template v-else-if="column.value === 'marginPercent'">
        <span class="font-normal text-black text-sm">
          {{ useCurrencyFormat({
            data: data.costPerPortion * (data[column.value] / 100),
          }) }} <span class="font-normal text-primary text-sm">
            ({{ data[column.value] }}%)
          </span>
        </span>
      </template>

      <template v-else-if="column.value === 'action'">
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
            ref="popover"
            :pt="{
              content: 'p-0',
            }"
          >
            <section id="popover-content" class="flex flex-col">
              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="$router.push({ name: 'menu-recipe.detail', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="detail" class="w-4 h-4" />
                    <span class="font-normal text-sm text-text-primary">Detail</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="$router.push({ name: 'menu-recipe.edit', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="w-4 h-4" />
                    <span class="font-normal text-sm text-text-primary">Edit</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton class="w-full px-4 py-3" variant="text" @click="menuRecipeList_onShowDialogDelete(data.id)">
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

      <template v-else>
        <span class="font-normal text-sm text-grayscale-70">{{ data[column.value] ?? '-' }}</span>
      </template>
    </template>
  </AppBaseDataTable>
</template>