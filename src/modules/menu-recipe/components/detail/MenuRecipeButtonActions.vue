<script setup lang="ts">
// Interfaces
import type { IMenuRecipeDetailProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { menuRecipeDetail_onEdit, menuRecipeDetail_onShowDialogDeleteConfirmation } = inject(
  'menuRecipeDetail',
) as IMenuRecipeDetailProvided;
</script>

<template>
  <section id="menu-recipe-button-actions" class="flex items-center justify-between">
    <PrimeVueButton
      class="border-primary bg-transparent font-semibold text-base text-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
      label="Edit Recipe"
      severity="secondary"
      variant="outlined"
      @click="menuRecipeDetail_onEdit"
    />

    <PrimeVueButton
      class="border border-solid border-error-hover w-fit px-4 py-3"
      variant="text"
      @click="menuRecipeDetail_onShowDialogDeleteConfirmation"
    >
      <template #default>
        <section id="content" class="flex items-center gap-2 w-full">
          <AppBaseSvg name="delete" class="!w-4 !h-4" />
          <span class="font-semibold text-sm text-error-main">Delete Recipe</span>
        </section>
      </template>
    </PrimeVueButton>
  </section>
</template>
