<script lang="ts" setup>
// Interfaces
import type { IMenuRecipeCreateEditProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { menuRecipeCreateEdit_isEditMode, menuRecipeCreateEdit_onCancel, menuRecipeCreateEdit_onSave } = inject(
  'menuRecipeCreateEdit',
) as IMenuRecipeCreateEditProvided;
</script>

<template>
  <section id="menu-recipe-button-actions" class="flex items-center justify-between">
    <section id="left-content" class="flex items-center gap-4">
      <PrimeVueButton
        class="border-primary bg-transparent font-semibold text-base text-primary w-36 basic-smooth-animation hover:bg-grayscale-10"
        label="Cancel"
        severity="secondary"
        variant="outlined"
        @click="menuRecipeCreateEdit_onCancel"
      />

      <PrimeVueButton
        class="bg-primary border-none text-sm py-[10px] w-36"
        :label="menuRecipeCreateEdit_isEditMode ? 'Update' : 'Save'"
        type="submit"
        @click="menuRecipeCreateEdit_onSave"
      />
    </section>
  </section>
</template>
