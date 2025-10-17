<script setup lang="ts">
// Components
import MenuRecipeButtonActions from './MenuRecipeButtonActions.vue';
import MenuRecipeForm from '../create-edit/MenuRecipeForm.vue';
import MenuRecipeProductionCost from '../create-edit/MenuRecipeProductionCost.vue';
</script>

<template>
  <section id="menu-recipe-content" class="grid grid-rows-1 grid-cols-12 gap-4">
    <section id="menu-recipe-form" class="col-span-8 flex flex-col gap-10">
      <MenuRecipeForm />
      <MenuRecipeButtonActions />
    </section>

    <section id="menu-production-cost" class="col-span-4">
      <MenuRecipeProductionCost />
    </section>
  </section>
</template>
