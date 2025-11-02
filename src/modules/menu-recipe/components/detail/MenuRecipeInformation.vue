<script setup lang="ts">
// Interfaces
import type { IMenuRecipeDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { 
  menuRecipeDetail_data, 
  menuRecipeDetail_selectedVersionId, 
  menuRecipeDetail_versions 
} = inject('menuRecipeDetail') as IMenuRecipeDetailProvided;

/**
 * @description Get selected version info
 */
const selectedVersionInfo = computed(() => {
  if (!menuRecipeDetail_selectedVersionId.value || !menuRecipeDetail_versions.value) {
    return null;
  }
  
  return menuRecipeDetail_versions.value.versions.find(
    version => version.versionId === menuRecipeDetail_selectedVersionId.value
  );
});
</script>

<template>
  <section id="menu-recipe-information" class="default-wrapper gap-2">
    <div class="flex items-center justify-between">
      <h6 class="font-semibold text-lg text-primary">Recipe</h6>
      
      <!-- Version Indicator -->
      <PrimeVueChip 
        v-if="selectedVersionInfo"
        class="text-xs font-medium bg-blue-100 text-blue-700"
        :label="`Viewing ${selectedVersionInfo.versionNumber}`"
      />
    </div>

    <section id="informations" class="grid grid-rows-3 grid-cols-12 gap-4">
      <section id="recipe-name" class="col-span-6 flex flex-col gap-1">
        <h6 class="font-medium text-sm text-gray-700">Recipe Name</h6>

        <p class="text-sm text-text-primary">
          {{ menuRecipeDetail_data?.recipe_name || '-' }}
        </p>
      </section>

      <section id="output-unit" class="col-span-6 flex flex-col gap-1">
        <h6 class="font-medium text-sm text-gray-700">Output Unit</h6>

        <p class="text-sm text-text-primary">
          {{ menuRecipeDetail_data?.output_unit || '-' }}
        </p>
      </section>

      <section id="link-product" class="col-span-6 flex flex-col gap-1">
        <h6 class="font-medium text-sm text-gray-700">Link to Product</h6>

        <p class="text-sm text-text-primary">
          {{ menuRecipeDetail_data?.products?.name || '-' }}
        </p>
      </section>

      <section id="product-details" class="col-span-6 flex flex-col gap-1">
        <section id="product-details" class="col-span-full lg:col-span-6 flex flex-col gap-2">
          <h6 class="font-medium text-sm text-black">Product Details</h6>

          <table class="min-w-full table-auto text-left text-sm">
            <tbody>
              <tr>
                <td class="px-0 pb-1 text-text-disabled max-w-8">Product Name</td>
                <td class="px-0 pb-1 text-text-disabled">:</td>
                <td class="px-0 pb-1">
                  {{ menuRecipeDetail_data?.products.name || '-' }}
                </td>
              </tr>

              <tr>
                <td class="px-0 pb-1 text-text-disabled max-w-8">Price</td>
                <td class="px-0 pb-1 text-text-disabled">:</td>
                <td class="px-0 pb-1">
                  {{
                    useCurrencyFormat({
                      data: menuRecipeDetail_data?.products.price || 0,
                    })
                  }}
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>

      <section id="target-yield" class="col-span-6 flex flex-col gap-1">
        <h6 class="font-medium text-sm text-gray-700">Target Yield</h6>

        <p class="text-sm text-text-primary">
          {{ menuRecipeDetail_data?.target_yield || 0 }} {{ menuRecipeDetail_data?.output_unit || 'Portion' }}
        </p>
      </section>

      <section id="cost-portion" class="col-span-6 flex flex-col gap-1">
        <h6 class="font-medium text-sm text-gray-700">Cost Per Portion</h6>

        <p class="text-sm text-text-primary">
          {{ useCurrencyFormat({ data: menuRecipeDetail_data?.cost_portion || 0 }) }}
        </p>
      </section>
    </section>
  </section>
</template>
