<script setup lang="ts">
// Interfaces
import type { IMenuRecipeDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { menuRecipeDetail_data, menuRecipeDetail_listColumns } = inject(
  'menuRecipeDetail',
) as IMenuRecipeDetailProvided;
</script>

<template>
  <AppBaseDataTable
    :columns="menuRecipeDetail_listColumns.filter(column => column.value !== 'action')"
    :data="menuRecipeDetail_data?.ingredients || []"
    is-using-custom-body
    is-using-custom-empty-data
    is-using-custom-header
    :is-using-border-on-header="false"
    :is-using-pagination="false"
    :max-visible-rows="5"
  >
    <template #header>
      <header class="flex items-center justify-between py-5">
        <h6 class="font-semibold text-lg text-primary">Ingredients</h6>
      </header>
    </template>

    <template #body="{ column, data }">
      <template v-if="column.value === 'item'">
        <div class="flex flex-col gap-1">
          <span class="font-normal text-black text-sm">
            {{ data?.inventory_item?.itemName || data?.item_id || '-' }}
          </span>
        </div>
      </template>

      <template v-else-if="column.value === 'quantity'">
        <span class="font-normal text-black text-sm">
          {{ data?.qty || 0 }}
        </span>
      </template>

      <template v-else-if="column.value === 'uom'">
        <span class="font-normal text-black text-sm">
          {{ data?.uom || '-' }}
        </span>
      </template>

      <template v-else-if="column.value === 'cost'">
        <span class="font-normal text-black text-sm">
          {{ useCurrencyFormat({ data: data?.cost || 0 }) }}
        </span>
      </template>

      <template v-else-if="column.value === 'notes'">
        <span class="font-normal text-black text-sm">
          {{ data?.notes || '-' }}
        </span>
      </template>

      <template v-else>
        <span class="font-normal text-sm text-black">{{ data[column.value] ?? '-' }}</span>
      </template>
    </template>

    <template #empty-data>
      <td :colspan="menuRecipeDetail_listColumns.length" class="flex flex-col items-center justify-center gap-1">
        <span class="font-semibold text-sm text-primary">No Ingredients Available</span>
        <span class="font-normal text-sm text-text-disabled">This recipe doesn't have any ingredients yet.</span>
      </td>
    </template>
  </AppBaseDataTable>
</template>
