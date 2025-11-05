<script setup lang="ts">
// component dialog
import { RouterLink } from 'vue-router';
import CompletePostBatchRecord from '../components/CompletePostBatchRecord.vue';
// services
import { useBatchService } from '../services/prep-batch-management.service';
const route = useRoute();
const {
  batchList_getClassOfBatchStatus,
  batchDetailsIngridient_columns,
  batchDetails_values,
  batchDetails_onShowDialogCompleteBatch,
  batchDetails_onCloseDialogCompleteBatch,
  menuRecipeList_onShowDialogCancel,
  batchDetails_formData,
  batchDetails_formValidation,
  batch_fetchDetails,
  batchDetail_values,
} = useBatchService();

provide('batchDetails', {
  batchList_getClassOfBatchStatus,
  batchDetailsIngridient_columns,
  batchDetails_values,
  batchDetails_onShowDialogCompleteBatch,
  batchDetails_onCloseDialogCompleteBatch,
  batchDetails_formData,
  batchDetails_formValidation,
  batch_fetchDetails,
  batchDetail_values,
});

onMounted(async () => {
  await batch_fetchDetails(route?.params?.id as string);
});
</script>
<template>
  <!-- <pre>
    {{ batchDetail_values }}
  </pre> -->
  <section class="flex flex-col gap-4">
    <h1 class="font-semibold text-2xl text-text-primary">Recipe</h1>

    <section id="batch-name" class="flex flex-col">
      <label for="batch-name" class="text-sm font-semibold">Batch Name</label>
      <span>
        {{ batchDetail_values?.menu_recipes?.recipe_name }}/Batch-{{
          useFormatDate(batchDetail_values?.date, 'ddmmyyyy')
        }}
      </span>
    </section>

    <section id="recipe-details" class="grid grid-cols-4 gap-4">
      <!-- Recipe -->
      <div id="recipe-name" class="flex flex-col col-span-2">
        <label for="recipe-name" class="text-sm font-semibold">Recipe Name</label>
        <span>{{ batchDetail_values?.menu_recipes?.recipe_name }}</span>
      </div>
      <!-- Date -->
      <div id="recipe-date" class="flex flex-col">
        <label for="recipe-date" class="text-sm font-semibold">Date</label>
        <span>{{ useFormatDate(batchDetail_values?.date, 'dd/mm/yyyy') }}</span>
      </div>
      <!-- Status -->
      <div id="recipe-status" class="flex flex-col">
        <label for="recipe-status" class="text-sm font-semibold">Status</label>
        <span>
          <PrimeVueChip
            :class="[
              batchList_getClassOfBatchStatus(batchDetail_values?.status),
              'text-xs font-normal py-1 px-1?.5 w-fit',
            ]"
            :label="useTitleCaseWithSpaces(batchDetail_values?.status?.toLowerCase())"
          />
        </span>
      </div>
      <!-- Product Linked -->
      <div id="recipe-product-linked" class="flex flex-col col-span-2">
        <label for="recipe-product-linked" class="text-sm font-semibold">Product Linked</label>
        <router-link
          :to="{ name: 'menu-recipe.detail', params: { id: batchDetail_values?.menu_recipes?.recipe_id } }"
        >
          <span>{{ batchDetail_values?.menu_recipes?.recipe_name }}</span>
        </router-link>
      </div>
      <!-- Product Price -->
      <div id="recipe-product-price" class="flex flex-col col-span-2">
        <label for="recipe-product-price" class="text-sm font-semibold">Product Price</label>
        <span>
          <!-- {{ useCurrencyFormat({ data: batchDetails_values?.recipe?.productPrice }) }} -->
          TIDAK ADA
        </span>
      </div>
      <!-- Batch Target Yield -->
      <div id="recipe-batch-target-yield" class="flex flex-col col-span-4">
        <label for="recipe-batch-target-yield" class="text-sm font-semibold">Batch Target Yield</label>
        <span class="flex gap-1"
          >{{ useCurrencyFormat({ data: batchDetail_values?.batch_target_yield, hidePrefix: true }) }}
          <p class="text-disabled">Portion</p></span
        >
      </div>
      <!-- Batch Waste/Evaporation -->
      <div id="recipe-batch-waste-evaporation" class="flex flex-col col-span-4">
        <label for="recipe-batch-waste-evaporation" class="text-sm font-semibold">Batch Waste/Evaporation</label>
        <span class="flex gap-1">
          {{ useCurrencyFormat({ data: batchDetail_values?.batch_waste, hidePrefix: true }) }}
          <p class="text-disabled">%</p></span
        >
      </div>
    </section>

    <section id="production-cost" class="grid grid-cols-2 gap-4">
      <h1 class="font-semibold text-2xl text-text-primary col-span-2">Production Cost</h1>
      <!-- Cost/Batch -->
      <div id="cost-batch" class="flex flex-col">
        <label for="cost-batch" class="text-sm font-semibold">Cost/Batch</label>
        <span>{{ useCurrencyFormat({ data: batchDetail_values?.cost_batch || 0 }) }}</span>
      </div>
      <!-- Cost/Portion -->
      <div id="cost-portion" class="flex flex-col">
        <label for="cost-portion" class="text-sm font-semibold">Cost/Portion</label>
        <span>{{ useCurrencyFormat({ data: batchDetail_values?.cost_portion || 0 }) }}</span>
      </div>
      <!-- Margin per Selling Price -->
      <div id="margin-per-selling-price" class="flex flex-col">
        <label for="margin-per-selling-price" class="text-sm font-semibold">Margin per Selling Price</label>
        <span class="flex gap-1"
          >{{ useCurrencyFormat({ data: batchDetail_values?.margin_selling_price || 0 }) }}
          <p class="text-primary-500">({{ batchDetail_values?.margin_selling_price || 0 }}%)</p></span
        >
      </div>
    </section>

    <section id="ingridient-table" class="flex flex-col gap-4">
      <h1 class="font-semibold text-2xl text-text-primary">Ingridients</h1>
      <AppBaseDataTable
        :columns="batchDetailsIngridient_columns"
        :data="batchDetail_values?.batch_cooking_recipe_ingredient"
        :is-using-header="false"
        :is-using-border-on-header="false"
        :is-using-pagination="false"
        :is-using-custom-body="true"
      >
        <template #body="{ column, data }">
          <template v-if="column.value === 'item'">
            <span class="font-base text-sm text-text-primary">{{
              data?.ingredients?.master_inventory_items?.name || '-'
            }}</span>
          </template>
          <template v-else-if="column.value === 'qty'">
            <span class="flex flex-col font-base text-sm text-text-primary">
              <span class="flex gap-1">
                {{
                  useCurrencyFormat({
                    data: data?.qty * batchDetail_values?.batch_target_yield || 0,
                    hidePrefix: true,
                  })
                }}
              </span>
              <span class="flex gap-1 text-text-disabled">
                <p class="">Base :</p>
                {{ useCurrencyFormat({ data: data?.qty || 0, hidePrefix: true }) }}
              </span>
            </span>
          </template>
          <template v-else-if="column.value === 'UOM'">
            <span class="font-base text-sm text-text-primary">{{
              data?.ingredients?.master_inventory_items?.unit || '-'
            }}</span>
          </template>
          <template v-else-if="column.value === 'notes'">
            <span class="font-base text-sm text-text-primary">{{ data?.notes || '-' }}</span>
          </template>
          <template v-else-if="column.value === 'cost'">
            <span class="flex flex-col font-base text-sm text-text-primary">
              <span class="flex gap-1">
                {{ useCurrencyFormat({ data: data?.cost || 0 }) }}
              </span>
              <span class="flex gap-1 text-text-disabled">
                <p class="">Base :</p>
                {{ useCurrencyFormat({ data: data?.base_price || 0 }) }}
              </span>
            </span>
          </template>
          <template v-else>
            <span class="font-base text-sm text-text-primary"> {{ data[column.value] }} </span>
          </template>
        </template>
      </AppBaseDataTable>
    </section>

    <footer
      v-if="batchDetail_values?.status?.toLowerCase() !== 'cancelled'"
      class="flex items-center justify-between pb-8 pt-4"
    >
      <div class="flex items-center gap-2">
        <router-link :to="{ name: 'prep-batch-management.edit', params: { id: batchDetail_values?.id } }">
          <PrimeVueButton variant="outlined" label="Edit Batch" class="border border-primary-border text-primary">
            <template #icon>
              <AppBaseSvg name="edit" class="!w-4 !h-4 filter-primary-color" />
            </template>
          </PrimeVueButton>
        </router-link>
        <PrimeVueButton
          v-if="batchDetail_values?.status?.toLowerCase() !== 'posted'"
          :label="
            batchDetail_values?.status?.toLowerCase() === 'planned'
              ? 'Start Cooking'
              : useTitleCaseWithSpaces(batchDetail_values?.status?.toLowerCase()) === 'In Progress'
                ? 'Complete Batch'
                : ''
          "
          class="bg-primary border-primary-border text-white"
          @click="
            batchDetail_values?.status?.toLowerCase() === 'planned'
              ? batchDetails_onShowDialogCompleteBatch()
              : useTitleCaseWithSpaces(batchDetail_values?.status?.toLowerCase()) === 'In Progress'
                ? batchDetails_onShowDialogCompleteBatch()
                : batchDetails_onShowDialogCompleteBatch()
          "
        />
      </div>

      <PrimeVueButton
        variant="text"
        class="text-error-main hover:bg-error-background"
        label="Cancel Batch Cooking"
        @click="menuRecipeList_onShowDialogCancel(route.params.id as string)"
      >
        <template #icon>
          <AppBaseSvg name="close-circle-red" color="text-error-main" class="!w-4 !h-4" />
        </template>
      </PrimeVueButton>
    </footer>
  </section>

  <CompletePostBatchRecord />
  <AppBaseDialogConfirmation id="batch-list-dialog-delete" />
</template>
