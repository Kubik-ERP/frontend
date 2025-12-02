<script setup lang="ts">
// Interfaces
import type { IMenuRecipeCreateEditProvided } from '../../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  menuRecipeCreateEdit_formDataOfIngredientItem,
  menuRecipeCreateEdit_formValidationsOfIngredientItem,
  menuRecipeCreateEdit_isLoadingInventoryItems,
  menuRecipeCreateEdit_listInventoryItems,
  menuRecipeCreateEdit_availableUomOptions,
  menuRecipeCreateEdit_onShowDialogCancelEditIngredient,
  menuRecipeCreateEdit_onShowDialogSaveEditIngredient,
} = inject('menuRecipeCreateEdit') as IMenuRecipeCreateEditProvided;
</script>

<template>
  <AppBaseDialog id="menu-recipe-edit-ingredient-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Edit Ingredient</h5>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-6">
        <form action="" class="flex flex-col w-full">
          <section id="product-item" class="w-full">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="itemId"
              name="Item"
              :validators="menuRecipeCreateEdit_formValidationsOfIngredientItem.itemId"
            >
              <PrimeVueSelect
                id="itemId"
                v-model="menuRecipeCreateEdit_formDataOfIngredientItem.itemId"
                filter
                :loading="menuRecipeCreateEdit_isLoadingInventoryItems"
                :options="menuRecipeCreateEdit_listInventoryItems"
                option-label="itemName"
                :option-value="(option: any) => option"
                placeholder="Select Item"
                class="[&>span]:text-sm text-black w-full"
                :class="{ ...classes }"
                :pt="{
                  optionLabel: 'text-sm',
                }"
                v-on="useListenerForm(menuRecipeCreateEdit_formValidationsOfIngredientItem, 'itemId')"
              />
            </AppBaseFormGroup>
          </section>

          <div class="flex items-center gap-4">
            <section id="quantity" class="w-full">
              <AppBaseFormGroup
                v-slot="{ classes }"
                class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                is-name-as-label
                label-for="quantity"
                name="Quantity"
                :validators="menuRecipeCreateEdit_formValidationsOfIngredientItem.quantity"
              >
                <PrimeVueInputNumber
                  id="quantity"
                  v-model="menuRecipeCreateEdit_formDataOfIngredientItem.quantity"
                  placeholder="Input quantity"
                  class="text-sm w-full [&>input]:text-sm [&>input]:w-full"
                  :class="{ ...classes }"
                  :min="0"
                  :max-fraction-digits="2"
                  v-on="useListenerForm(menuRecipeCreateEdit_formValidationsOfIngredientItem, 'quantity')"
                />
              </AppBaseFormGroup>
            </section>

            <section id="unit-of-measurement" class="w-full">
              <AppBaseFormGroup
                v-slot="{ classes }"
                class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                is-name-as-label
                label-for="unit"
                name="Unit of Measurement"
                :validators="menuRecipeCreateEdit_formValidationsOfIngredientItem.uom"
              >
                <PrimeVueSelect
                  id="unit"
                  v-model="menuRecipeCreateEdit_formDataOfIngredientItem.uom"
                  :disabled="!menuRecipeCreateEdit_formDataOfIngredientItem.itemId"
                  :options="menuRecipeCreateEdit_availableUomOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Unit"
                  class="text-sm text-black w-full"
                  :class="{ ...classes }"
                  :pt="{
                    optionLabel: 'text-sm',
                  }"
                  v-on="useListenerForm(menuRecipeCreateEdit_formValidationsOfIngredientItem, 'uom')"
                />
              </AppBaseFormGroup>
            </section>
          </div>

          <section id="notes" class="w-full flex flex-col mb-4">
            <label for="notes" class="font-normal text-sm text-gray-900"> Notes </label>

            <PrimeVueIconField>
              <PrimeVueTextarea
                id="notes"
                v-model="menuRecipeCreateEdit_formDataOfIngredientItem.notes"
                placeholder="Describe any notes here..."
                class="text-sm w-full"
                rows="5"
              />
            </PrimeVueIconField>
          </section>

          <section id="cost" class="w-full flex flex-col">
            <span class="font-normal text-gray-900 text-sm"> Total Cost </span>
            <span class="font-normal text-black text-sm">
              {{
                useCurrencyFormat({
                  data: menuRecipeCreateEdit_formDataOfIngredientItem.cost,
                })
              }}
            </span>
          </section>
        </form>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="menuRecipeCreateEdit_onShowDialogCancelEditIngredient"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save Changes"
          type="button"
          @click="menuRecipeCreateEdit_onShowDialogSaveEditIngredient"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
