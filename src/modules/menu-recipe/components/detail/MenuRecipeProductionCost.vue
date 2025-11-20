<script setup lang="ts">
// Interfaces
import type { IMenuRecipeDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  menuRecipeDetail_totalCostPortion,
  menuRecipeDetail_calculatedMarginRp,
  menuRecipeDetail_calculatedMarginPercent,
} = inject('menuRecipeDetail') as IMenuRecipeDetailProvided;
</script>

<template>
  <section id="menu-recipe-information" class="default-wrapper gap-2">
    <h6 class="font-semibold text-lg text-primary">Production Cost</h6>

    <section id="product-cost-information" class="grid grid-rows-1 grid-cols-12">
      <section id="cost-per-portion" class="col-span-6 flex flex-col">
        <span class="font-normal text-text-disabled text-sm"> Cost/Portion </span>

        <span class="font-normal text-black text-sm">
          {{
            useCurrencyFormat({
              data: menuRecipeDetail_totalCostPortion,
            })
          }}
        </span>
      </section>

      <section id="margin-per-selling-price" class="col-span-6 flex flex-col">
        <span class="font-normal text-text-disabled text-sm"> Margin per Selling Price </span>

        <span class="font-normal text-black text-sm">
          {{ useCurrencyFormat({ data: menuRecipeDetail_calculatedMarginRp }) }}
          (<span class="font-semibold text-primary text-sm">
            {{ menuRecipeDetail_calculatedMarginPercent.toFixed(2) }}% </span
          >)
        </span>
      </section>
    </section>
  </section>
</template>
