<script setup lang="ts">
// Interfaces
import type { IMenuRecipeCreateEditProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  menuRecipeCreateEdit_totalCostPortion,
  menuRecipeCreateEdit_calculatedMarginRp,
  menuRecipeCreateEdit_calculatedMarginPercent,
} = inject('menuRecipeCreateEdit') as IMenuRecipeCreateEditProvided;
</script>

<template>
  <section id="menu-recipe-production-cost" class="flex flex-col gap-3 p-6">
    <h5 class="font-semibold text-primary text-lg">Production Cost</h5>

    <table class="min-w-full table-auto text-left text-sm text-text-primary">
      <tbody>
        <tr>
          <td class="p-1 text-text-disabled">Cost/Portion</td>
          <td class="p-1">
            {{ useCurrencyFormat({ data: menuRecipeCreateEdit_totalCostPortion }) }}
          </td>
        </tr>

        <tr>
          <td class="p-1 text-text-disabled">Margin per Selling Price</td>
          <td class="p-1">
            {{ useCurrencyFormat({ data: menuRecipeCreateEdit_calculatedMarginRp }) }}
            (<span class="font-semibold text-primary text-sm">
              {{
                menuRecipeCreateEdit_calculatedMarginPercent
                  ? menuRecipeCreateEdit_calculatedMarginPercent.toFixed(2)
                  : 0
              }}%</span
            >)
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
