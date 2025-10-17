<script setup lang="ts">
// Components
import MenuRecipeButtonActions from './MenuRecipeButtonActions.vue';
import MenuRecipeInformation from './MenuRecipeInformation.vue';
import MenuRecipeIngredients from './MenuRecipeIngredients.vue';
import MenuRecipeProductionCost from './MenuRecipeProductionCost.vue';
import MenuRecipeVersions from './MenuRecipeVersions.vue';
</script>

<template>
  <section id="menu-recipe-content" class="grid grid-rows-1 grid-cols-12 gap-4">
    <section id="menu-recipe-form" class="col-span-8 flex flex-col gap-6">
      <MenuRecipeInformation />
      <MenuRecipeProductionCost />
      <MenuRecipeIngredients />
    </section>

    <section id="menu-production-cost" class="col-span-4">
      <MenuRecipeVersions />
    </section>

    <section id="button-action" class="col-span-full mt-6">
      <MenuRecipeButtonActions />
    </section>
  </section>
</template>
