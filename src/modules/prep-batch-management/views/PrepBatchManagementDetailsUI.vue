<script setup lang="ts">
// services
import { useBatchService } from '../services/prep-batch-management.service';

const { batchList_getClassOfBatchStatus, batchDetailsIngridient_columns, batchDetails_values } = useBatchService();
</script>
<template>
  <section class="flex flex-col gap-4">
    <h1 class="font-semibold text-2xl text-text-primary">Recipe</h1>

    <section id="batch-name" class="flex flex-col">
      <label for="batch-name" class="text-sm font-semibold">Batch Name</label>
      <span>{{ batchDetails_values.recipe.batchName }}</span>
    </section>

    <section id="recipe-details" class="grid grid-cols-4 gap-4">
      <!-- Recipe -->
      <div id="recipe-name" class="flex flex-col col-span-2">
        <label for="recipe-name" class="text-sm font-semibold">Recipe Name</label>
        <span>{{ batchDetails_values.recipe.recipeName }}</span>
      </div>
      <!-- Date -->
      <div id="recipe-date" class="flex flex-col">
        <label for="recipe-date" class="text-sm font-semibold">Date</label>
        <span>{{ useFormatDate(batchDetails_values.recipe.batchDate, 'dd/mm/yyyy') }}</span>
      </div>
      <!-- Status -->
      <div id="recipe-status" class="flex flex-col">
        <label for="recipe-status" class="text-sm font-semibold">Status</label>
        <span>
          <PrimeVueChip
            :class="[
              batchList_getClassOfBatchStatus(batchDetails_values.recipe.batchStatus),
              'text-xs font-normal py-1 px-1.5 w-fit',
            ]"
            :label="useTitleCaseWithSpaces(batchDetails_values.recipe.batchStatus)"
          />
        </span>
      </div>
      <!-- Product Linked -->
      <div id="recipe-product-linked" class="flex flex-col col-span-2">
        <label for="recipe-product-linked" class="text-sm font-semibold">Product Linked</label>
        <span>{{ batchDetails_values.recipe.productLinked }}</span>
      </div>
      <!-- Product Price -->
      <div id="recipe-product-price" class="flex flex-col col-span-2">
        <label for="recipe-product-price" class="text-sm font-semibold">Product Price</label>
        <span>{{ useCurrencyFormat({ data: batchDetails_values.recipe.productPrice }) }}</span>
      </div>
      <!-- Batch Target Yield -->
      <div id="recipe-batch-target-yield" class="flex flex-col col-span-4">
        <label for="recipe-batch-target-yield" class="text-sm font-semibold">Batch Target Yield</label>
        <span class="flex gap-1"
          >{{ useCurrencyFormat({ data: batchDetails_values.recipe.targetYield, hidePrefix: true }) }}
          <p class="text-disabled">Portion</p></span
        >
      </div>
      <!-- Batch Waste/Evaporation -->
      <div id="recipe-batch-waste-evaporation" class="flex flex-col col-span-4">
        <label for="recipe-batch-waste-evaporation" class="text-sm font-semibold">Batch Waste/Evaporation</label>
        <span class="flex gap-1">
          {{ useCurrencyFormat({ data: batchDetails_values.recipe.batchWaste, hidePrefix: true }) }}
          <p class="text-disabled">%</p></span
        >
      </div>
    </section>

    <section id="production-cost" class="grid grid-cols-2 gap-4">
      <h1 class="font-semibold text-2xl text-text-primary col-span-2">Production Cost</h1>
      <!-- Cost/Batch -->
      <div id="cost-batch" class="flex flex-col">
        <label for="cost-batch" class="text-sm font-semibold">Cost/Batch</label>
        <span>{{ useCurrencyFormat({ data: batchDetails_values.productionCost.costBatch }) }}</span>
      </div>
      <!-- Cost/Portion -->
      <div id="cost-portion" class="flex flex-col">
        <label for="cost-portion" class="text-sm font-semibold">Cost/Portion</label>
        <span>{{ useCurrencyFormat({ data: batchDetails_values.productionCost.costPortion }) }}</span>
      </div>
      <!-- Margin per Selling Price -->
      <div id="margin-per-selling-price" class="flex flex-col">
        <label for="margin-per-selling-price" class="text-sm font-semibold">Margin per Selling Price</label>
        <span class="flex gap-1"
          >{{ useCurrencyFormat({ data: batchDetails_values.productionCost.marginPerSellingPrice }) }}
          <p class="text-primary-500">
            ({{ batchDetails_values.productionCost.marginPerSellingPercentage }}%)
          </p></span
        >
      </div>
    </section>

    <section id="ingridient-table" class="flex flex-col gap-4">
      <h1 class="font-semibold text-2xl text-text-primary">Ingridients</h1>
      <AppBaseDataTable
        :columns="batchDetailsIngridient_columns"
        :data="batchDetails_values.ingridients"
        :is-using-header="false"
        :is-using-border-on-header="false"
        :is-using-pagination="false"
      />
    </section>

    <footer class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <PrimeVueButton variant="outlined" label="Edit Batch">
          <template #icon>
            <AppBaseSvg name="edit" class="!w-4 !h-4" />
          </template>
        </PrimeVueButton>

        <PrimeVueButton label="Complete Batch" />
      </div>

      <PrimeVueButton
        variant="text"
        class="text-error-main hover:bg-error-background"
        label="Cancel Batch Cooking"
      >
        <template #icon>
          <AppBaseSvg name="close-circle-red" color="text-error-main" class="!w-4 !h-4" />
        </template>
      </PrimeVueButton>
    </footer>
  </section>
</template>
