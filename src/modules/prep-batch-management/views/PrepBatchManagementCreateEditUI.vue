<script setup lang="ts">
// import { AutoCompleteEmitsOptions } from 'primevue';

// Interfaces
import type { IMenuRecipe } from '../interfaces';
// services;
import { useBatchService } from '../services/prep-batch-management.service';

const route = useRoute();
const isEdit = ref(false);
const status = ref('');

const {
  batch_formData,
  batch_formValidation,
  batchDetailsIngridient_columns,
  menuRecipeList_queryParams,
  menuRecipeList_fetchList,
  batch_fetchDetails,
  batchDetail_values,
  batchList_getClassOfBatchStatus,
  menuRecipe_lists,
  menuRecipeList_isLoading,
  menuRecipe_ingredients,
  menuRecipe_fetchIngridients,
  // dialog confirmation
  batchCreateEdit_onShowDialogStart,
  batchCreateEdit_onShowDialogSave,
  batchCreateEdit_onShowDialogUpdate,
} = useBatchService();

const menuRecipeList_onSelectedRecipe = (recipe: IMenuRecipe) => {
  batch_formData.recipeId = recipe.id;
  batch_formData.recipe = recipe;

  menuRecipe_fetchIngridients(recipe.id);
  // batch_formData.ingredients = menuRecipe_ingredients.value;
};

const batchFormData_onClearRecipe = () => {
  batch_formData.recipe = { recipeName: '' } as IMenuRecipe;
  menuRecipeList_queryParams.search = '';

  menuRecipe_ingredients.value = [];
};

const batch_editMode = async () => {
  batchFormData_onClearRecipe();

  await batch_fetchDetails(route.params.id as string);

  isEdit.value = route.params.id ? true : false;

  status.value = batchDetail_values?.value?.status;

  menuRecipeList_queryParams.search = batchDetail_values?.value?.menu_recipes?.recipe_name;

  batch_formData.recipe.id = batchDetail_values?.value?.recipe_id;
  batch_formData.recipe.recipeName = batchDetail_values?.value?.menu_recipes?.recipe_name;
  batch_formData.recipe.yieldTarget = batchDetail_values?.value?.menu_recipes?.target_yield;
  // batch_formData.recipe.costPerPortion = batchDetail_values?.value?.menu_recipes?.cost_per_portion || 0;
  batch_formData.recipe.output = batchDetail_values?.value?.menu_recipes?.output_unit;
  //   "isBaseRecipe": false,

  //   "costPerPortion": 10000,
  //   "marginRp": 15000,
  //   "marginPercent": 60,
  //   "updatedAt": "20/10/2025"
  batch_formData.recipeId = batchDetail_values?.value?.recipe_id;
  batch_formData.recipeName = batchDetail_values?.value?.menu_recipes?.recipe_name;
  batch_formData.notes = batchDetail_values?.value?.notes;
  batch_formData.targetYield = batchDetail_values?.value?.batch_target_yield;
  batch_formData.waste = batchDetail_values?.value?.batch_waste;
  batch_formData.batchDate = new Date(useFormatDate(batchDetail_values?.value?.date, 'dd/mm/yyyy'));

  menuRecipeList_onSelectedRecipe(batch_formData.recipe);
};

// 1. Create a ref for the AutoComplete component
// const autoCompleteRef = ref<AutoCompleteEmitsOptions>();

// ... your other code (menuRecipeList_fetchList, etc.) ...

onMounted(async () => {
  await menuRecipeList_fetchList();
  if (route.name === 'prep-batch-management.edit') {
    await batch_editMode();
    // console.log('🚀 ~ onMounted ~ route.params.id:', route.params.id);
  }
});
</script>
<template>
  <div class="flex justify-between gap-4 w-full">
    <section class="w-full flex flex-col gap-4">
      <section v-if="isEdit" class="flex flex-col gap-4">
        <div class="w-full">
          <div class="flex items-center justify-between">
            <h1 class="font-semibold text-2xl text-text-primary py-4">Recipe</h1>
            <span class="flex gap-2">
              <p class="text-disabled">Status</p>
              <PrimeVueChip
                :class="[batchList_getClassOfBatchStatus(status), 'text-xs font-normal py-1 px-1.5 w-fit']"
                :label="useTitleCaseWithSpaces(status.toLowerCase())"
              />
            </span>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label for="batch-name">Batch Name</label>
          <p>
            {{ batchDetail_values?.menu_recipes?.recipe_name }}/Batch-{{
              useFormatDate(batchDetail_values?.date, 'ddmmyyyy')
            }}
          </p>
        </div>
      </section>

      <section v-else class="flex flex-col gap-4">
        <div class="w-full">
          <h1 class="font-semibold text-2xl text-text-primary py-4">Recipe</h1>
        </div>
      </section>

      <section id="form" class="grid grid-cols-2 gap-4 w-full">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="recipe"
          name="Recipe"
          spacing-bottom="mb-0"
          :validators="batch_formValidation.recipeId"
        >
          <PrimeVueSelect
            v-model="menuRecipeList_queryParams.search"
            :options="menuRecipe_lists.items"
            :loading="menuRecipeList_isLoading"
            option-label="recipeName"
            placeholder="Select a recipe"
            class="text-sm w-full"
            :class="{ ...classes }"
            filter
            @filter="(e: any) => menuRecipeList_fetchList(e.value)"
            @change="(e: any) => menuRecipeList_onSelectedRecipe(e.value)"
          >
            <template #option="{ option }">
              <div class="flex items-center justify-between gap-3 p-2 w-full">
                <div class="flex flex-col flex-1">
                  <span class="font-medium text-sm text-black">{{ option.recipeName }}</span>
                </div>
              </div>
            </template>

            <template #dropdownicon>
              <AppBaseSvg name="search" class="w-4 h-4" />
            </template>
          </PrimeVueSelect>

          <PrimeVueButton
            v-if="batch_formData.recipeId !== null"
            class="mt-2 text-xs"
            label="Clear"
            severity="secondary"
            @click="batchFormData_onClearRecipe"
          >
            <template #icon>
              <AppBaseSvg name="delete" class="!w-4 !h-4" />
            </template>
          </PrimeVueButton>
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="batchDate"
          name="Date"
          spacing-bottom="mb-0"
          :validators="batch_formValidation.batchDate"
        >
          <PrimeVueDatePicker
            v-model="batch_formData.batchDate"
            class="w-full"
            :class="{ ...classes }"
            show-icon
            fluid
            icon-display="input"
            date-format="dd/mm/yy"
          />
        </AppBaseFormGroup>

        <table class="border-none w-fit col-span-2">
          <thead>
            <tr>
              <th class="" scope="col">Recipe Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="w-fit">
                <span class="text-disabled w-fit">Product Linked</span>
              </td>
              <td class="px-2">
                <span class="text-disabled">:</span>
              </td>
              <td class="">
                <span class="text-disabled">{{ batch_formData.recipe.recipeName || '-' }}</span>
              </td>
            </tr>
            <tr>
              <td class="">
                <span class="text-disabled">Price</span>
              </td>
              <td class="px-2">
                <span class="text-disabled">:</span>
              </td>
              <td class="">
                <span class="text-disabled">{{
                  useCurrencyFormat({ data: batch_formData.recipe.costPerPortion || 0 }) || '-'
                }}</span>
              </td>
            </tr>
          </tbody>
        </table>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="targetYield"
          name="Batch Target Yield"
          spacing-bottom="mb-0"
          :validators="batch_formValidation.targetYield"
        >
          <PrimeVueIconField>
            <PrimeVueInputNumber
              v-model="batch_formData.targetYield"
              class="w-full"
              :class="{ ...classes }"
              :min="1"
              :disabled="batch_formData.recipe.recipeName === ''"
            />
            <PrimeVueInputIcon>
              <template #default>
                <span>Portion</span>
              </template>
            </PrimeVueInputIcon>
          </PrimeVueIconField>
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="waste"
          name="Batch Waste/Evaporation"
          spacing-bottom="mb-0"
          :validators="batch_formValidation.waste"
        >
          <PrimeVueIconField>
            <PrimeVueInputNumber
              v-model="batch_formData.waste"
              class="w-full"
              :class="{ ...classes }"
              :disabled="batch_formData.recipe.recipeName === ''"
            />
            <PrimeVueInputIcon>
              <template #default>
                <span>%</span>
              </template>
            </PrimeVueInputIcon>
          </PrimeVueIconField>
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
          :validators="batch_formValidation.notes"
        >
          <PrimeVueTextarea v-model="batch_formData.notes" class="w-full" :class="{ ...classes }" />
        </AppBaseFormGroup>

        <section id="ingredients" class="col-span-2">
          <h3 class="text-xl font-medium leading-6 text-gray-900">Ingredients</h3>
          <AppBaseDataTable
            :columns="batchDetailsIngridient_columns"
            :data="menuRecipe_ingredients"
            :is-using-header="false"
            :is-using-filter="false"
            :is-using-border-on-header="false"
            :is-using-pagination="false"
            :is-using-custom-empty-data="true"
            :is-using-custom-body="true"
          >
            <template #empty-data>
              <section class="flex items-center justify-center">
                <span class="">Select recipe to show ingridients</span>
              </section>
            </template>
            <template #body="{ column, data }">
              <template v-if="column.value === 'item'">
                <span class="font-semibold text-sm text-text-primary">
                  {{ data.inventory_item.name }}
                </span>
              </template>
              <template v-else-if="column.value === 'qty'">
                <span class="flex flex-col text-sm">
                  <p class="text-text-primary">{{ data.qty * batch_formData.targetYield }}</p>
                  <p class="text-text-disabled">Base : {{ data.qty }}</p>
                </span>
              </template>
              <template v-else-if="column.value === 'UOM'">
                <span class="text-sm text-text-primary">
                  {{ data.uom }}
                </span>
              </template>
              <template v-else-if="column.value === 'notes'">
                <span class="text-sm text-text-primary">
                  {{ data.notes || '-' }}
                </span>
              </template>
              <template v-else-if="column.value === 'cost'">
                <span class="flex flex-col text-sm">
                  <p class="text-text-primary">
                    {{ useCurrencyFormat({ data: data.cost * batch_formData.targetYield }) }}
                  </p>
                  <p class="text-text-disabled">Base : {{ useCurrencyFormat({ data: data.cost }) }}</p>
                </span>
              </template>
              <template v-else>
                <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
              </template>
            </template>
          </AppBaseDataTable>
        </section>

        <section id="action-button" class="col-span-2 py-8 flex gap-4 items-center justify-between">
          <section id="submit" class="flex gap-4">
            <PrimeVueButton
              class="min-w-40 border-primary-border text-primary"
              variant="outlined"
              :label="isEdit ? 'Update' : 'Save Draft'"
              @click="
                isEdit
                  ? batchCreateEdit_onShowDialogUpdate(route.params.id as string)
                  : batchCreateEdit_onShowDialogSave()
              "
            />
            <PrimeVueButton
              class="min-w-40 border-primary-border text-white bg-primary"
              label="Start Cooking"
              @click="batchCreateEdit_onShowDialogStart('batch1')"
            />
          </section>
          <router-link :to="{ name: 'prep-batch-management.index' }">
            <PrimeVueButton class="min-w-40 text-primary" label="Cancel" variant="text" />
          </router-link>
        </section>
      </section>
    </section>

    <section id="vetical-divider">
      <div class="h-full w-0.5 bg-grayscale-20"></div>
    </section>

    <section id="production-cost" class="w-4/12">
      <table class="border-none">
        <thead>
          <tr>
            <th class="text-left" scope="col">Production Cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="">
              <span class="text-disabled mr-4">Cost/Batch</span>
            </td>
            <td class="">
              <span class="">{{
                useCurrencyFormat({
                  data: batch_formData.recipe.costPerPortion * batch_formData.targetYield || 0,
                }) || '-'
              }}</span>
            </td>
          </tr>
          <tr>
            <td class="">
              <span class="text-disabled mr-4">Cost/Portion</span>
            </td>
            <td class="">
              <span class="">{{
                useCurrencyFormat({
                  data: batch_formData.recipe.costPerPortion || 0,
                }) || '-'
              }}</span>
            </td>
          </tr>
          <tr>
            <td class="">
              <span class="text-disabled mr-4">Margin per Selling Price</span>
            </td>
            <td class="">
              <span class="flex gap-2"
                >{{ useCurrencyFormat({ data: batch_formData.recipe.marginRp || 0 }) || '-' }}
                <p class="font-medium text-primary">({{ batch_formData.recipe.marginPercent || 0 }}%)</p>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
  <AppBaseDialogConfirmation id="batch-create-edit-cancel-dialog-confirmation" />
  <AppBaseDialogConfirmation id="batch-create-edit-start-dialog-confirmation" />
  <AppBaseDialogConfirmation id="batch-create-edit-save-dialog-confirmation" />
  <AppBaseDialogConfirmation id="batch-create-edit-update-dialog-confirmation" />
</template>
