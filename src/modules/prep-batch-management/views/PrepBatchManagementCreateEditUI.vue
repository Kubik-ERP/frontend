<script setup lang="ts">
// services;
import { useBatchService } from '../services/prep-batch-management.service';

const {
  batch_formData,
  batch_formValidation,
  batchDetailsIngridient_columns,
  menuRecipeList_queryParams,
  menuRecipeList_fetchList,
  menuRecipeList_onSelectedRecipe,
  menuRecipe_lists,
  menuRecipeList_isLoading,
} = useBatchService();

onMounted(async () => {
  await menuRecipeList_fetchList();
});
</script>
<template>
  <pre>
    {{ batch_formData }}
  </pre>
  <div class="flex justify-between gap-4 w-full">
    <section id="form" class="grid grid-cols-2 gap-4 w-full">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="recipe"
        name="Recipe"
        spacing-bottom="mb-0"
        :validators="batch_formValidation.recipe"
      >
        <PrimeVueIconField>
          <PrimeVueAutoComplete
            v-model="menuRecipeList_queryParams.search"
            :suggestions="menuRecipe_lists.items"
            :loading="menuRecipeList_isLoading"
            option-label="recipeName"
            field="recipeName"
            class="text-sm w-full [&>input]:text-sm [&>input]:w-full"
            :class="{ ...classes }"
            @option-select="(event: any) => menuRecipeList_onSelectedRecipe(event.value)"
          >
            <template #option="{ option }">
              <div class="flex items-center justify-between gap-3 p-2 w-full">
                <div class="flex flex-col flex-1">
                  <span class="font-medium text-sm text-black">{{ option.recipeName }}</span>
                </div>
              </div>
            </template>
          </PrimeVueAutoComplete>
          <PrimeVueInputIcon>
            <template #default>
              <AppBaseSvg name="search" class="w-4 h-4" />
            </template>
          </PrimeVueInputIcon>
        </PrimeVueIconField>
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
          <PrimeVueInputNumber v-model="batch_formData.targetYield" class="w-full" :class="{ ...classes }" />
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
          :is-using-header="false"
          :is-using-filter="false"
          :is-using-border-on-header="false"
          :is-using-pagination="false"
          :is-using-custom-empty-data="true"
        >
          <template #empty-data>
            <section class="flex items-center justify-center">
              <span class="">Select recipe to show ingridients</span>
            </section>
          </template>
        </AppBaseDataTable>
      </section>

      <section id="action-button" class="col-span-2 py-8 flex gap-4 items-center justify-between">
        <section id="submit" class="flex gap-4">
          <PrimeVueButton
            class="min-w-40 border-primary-border text-primary"
            label="Save Draft"
            variant="outlined"
          />
          <PrimeVueButton class="min-w-40 border-primary-border text-white bg-primary" label="Start Cooking" />
        </section>
        <PrimeVueButton class="min-w-40 text-primary" label="Cancel" variant="text" />
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
                useCurrencyFormat({ data: batch_formData.recipe.costPerPortion || 0 }) || '-'
              }}</span>
            </td>
          </tr>
          <tr>
            <td class="">
              <span class="text-disabled mr-4">Cost/Portion</span>
            </td>
            <td class="">
              <span class="">{{
                useCurrencyFormat({ data: batch_formData.recipe.costPerPortion || 0 }) || '-'
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
</template>
