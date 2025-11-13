<script setup lang="ts">
// Interfaces
import type { IMenuRecipeCreateEditProvided } from '../../interfaces';

/**
 * @description Reactive data binding
 */
const popovers = ref<Record<string, unknown>>({});

// Helper function to toggle popover
const togglePopover = (id: string, event: Event) => {
  const popover = popovers.value[`popover-${id}`] as { toggle?: (event: Event) => void } | null;
  popover?.toggle?.(event);
};

/**
 * @description Inject all the data and methods what we need
 */
const {
  menuRecipeCreateEdit_formDataOfIngredientItem,
  menuRecipeCreateEdit_formValidationsOfIngredientItem,
  menuRecipeCreateEdit_isLoadingInventoryItems,
  menuRecipeCreateEdit_listColumns,
  menuRecipeCreateEdit_listIngredientItemsOnDialog,
  menuRecipeCreateEdit_listInventoryItems,
  menuRecipeCreateEdit_availableUomOptions,
  menuRecipeCreateEdit_onShowDialogCancelAddIngredient,
  menuRecipeCreateEdit_onAddIngredientItem,
  menuRecipeCreateEdit_onEditIngredientItem,
  menuRecipeCreateEdit_onDeleteIngredientItem,
  menuRecipeCreateEdit_onCancelEditIngredientItem,
  menuRecipeCreateEdit_onShowDialogSaveIngredients,
  menuRecipeCreateEdit_isEditingIngredientItem,
} = inject('menuRecipeCreateEdit') as IMenuRecipeCreateEditProvided;
</script>

<template>
  <AppBaseDialog id="menu-recipe-add-ingredients-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Add Ingredients</h5>
    </template>

    <template #content>
      <section id="content" class="grid grid-rows-1 grid-cols-12 gap-6">
        <form action="" class="col-span-full lg:col-span-5 flex flex-col w-full">
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
                  mode="decimal"
                  :min-fraction-digits="0"
                  :max-fraction-digits="2"
                  placeholder="0"
                  class="text-sm w-full"
                  :class="{ ...classes }"
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
                  filter
                  :options="menuRecipeCreateEdit_availableUomOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Unit"
                  :disabled="!menuRecipeCreateEdit_formDataOfIngredientItem.itemId"
                  class="[&>span]:text-sm text-black w-full"
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
                  data: menuRecipeCreateEdit_listIngredientItemsOnDialog.reduce(
                    (total, item) => total + (item.cost ?? 0),
                    0,
                  ),
                })
              }}
            </span>
          </section>

          <div class="flex items-center gap-2 mt-10">
            <PrimeVueButton
              class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10 bg-transparent"
              severity="secondary"
              variant="outlined"
              @click="menuRecipeCreateEdit_onAddIngredientItem"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg
                    :name="menuRecipeCreateEdit_isEditingIngredientItem ? 'edit' : 'plus-line-white'"
                    class="w-4 h-4 filter-primary-color"
                  />
                  <span class="font-semibold text-base text-primary">
                    {{ menuRecipeCreateEdit_isEditingIngredientItem ? 'Update Item' : 'Add Item' }}
                  </span>
                </section>
              </template>
            </PrimeVueButton>

            <!-- Cancel Edit Button -->
            <PrimeVueButton
              v-if="menuRecipeCreateEdit_isEditingIngredientItem"
              class="font-semibold text-base text-gray-600 w-full max-w-40 border border-solid border-gray-300 basic-smooth-animation hover:bg-gray-50 bg-transparent"
              severity="secondary"
              variant="outlined"
              @click="menuRecipeCreateEdit_onCancelEditIngredientItem"
            >
              <template #default>
                <section id="content" class="flex items-center gap-2">
                  <AppBaseSvg name="close" class="w-4 h-4" />
                  <span class="font-semibold text-base text-gray-600">Cancel</span>
                </section>
              </template>
            </PrimeVueButton>
          </div>
        </form>

        <section id="datatable-ingredients" class="col-span-full lg:col-span-7">
          <AppBaseDataTable
            :columns="menuRecipeCreateEdit_listColumns"
            :data="menuRecipeCreateEdit_listIngredientItemsOnDialog"
            is-using-custom-body
            is-using-custom-header
            is-using-custom-footer
            :is-using-border-on-header="false"
            :is-using-pagination="false"
            :max-visible-rows="5"
          >
            <template #header>
              <header class="flex items-center justify-between pb-3">
                <h6 class="font-semibold text-lg text-primary">Ingredients</h6>
              </header>
            </template>

            <template #body="{ column, data }">
              <template v-if="column.value === 'item'">
                <div class="flex flex-col gap-1">
                  <span class="font-normal text-black text-sm">
                    {{ data.itemId?.itemName ?? '-' }}
                  </span>
                </div>
              </template>

              <template v-else-if="column.value === 'cost'">
                <span class="font-normal text-black text-sm">
                  {{
                    useCurrencyFormat({
                      data: data.cost || 0,
                    })
                  }}
                </span>
              </template>

              <template v-else-if="column.value === 'action'">
                <PrimeVueButton
                  variant="text"
                  rounded
                  aria-label="detail"
                  @click="(event: Event) => togglePopover(data.id, event)"
                >
                  <template #icon>
                    <AppBaseSvg name="three-dots" class="w-5 h-5" />
                  </template>
                </PrimeVueButton>

                <PrimeVuePopover
                  :ref="
                    (el: unknown) => {
                      if (el) popovers[`popover-${data.id}`] = el;
                    }
                  "
                  :pt="{
                    content: 'p-0',
                  }"
                >
                  <section id="popover-content" class="flex flex-col">
                    <PrimeVueButton
                      class="w-full px-4 py-3"
                      variant="text"
                      @click="
                        () => {
                          const index = menuRecipeCreateEdit_listIngredientItemsOnDialog.indexOf(data);
                          menuRecipeCreateEdit_onEditIngredientItem(index);
                        }
                      "
                    >
                      <template #default>
                        <section id="content" class="flex items-center gap-2 w-full">
                          <AppBaseSvg name="edit" class="w-4 h-4" />
                          <span class="font-normal text-sm text-text-primary">Edit</span>
                        </section>
                      </template>
                    </PrimeVueButton>

                    <PrimeVueButton
                      class="w-full px-4 py-3"
                      variant="text"
                      @click="
                        () => {
                          const index = menuRecipeCreateEdit_listIngredientItemsOnDialog.indexOf(data);
                          menuRecipeCreateEdit_onDeleteIngredientItem(index);
                        }
                      "
                    >
                      <template #default>
                        <section id="content" class="flex items-center gap-2 w-full">
                          <AppBaseSvg name="delete" class="w-4 h-4" />
                          <span class="font-normal text-sm text-text-primary">Delete</span>
                        </section>
                      </template>
                    </PrimeVueButton>
                  </section>
                </PrimeVuePopover>
              </template>

              <template v-else>
                <span class="font-normal text-sm text-text-primary">{{ data[column.value] ?? '-' }}</span>
              </template>
            </template>

            <template #empty-data>
              <td
                :colspan="menuRecipeCreateEdit_listIngredientItemsOnDialog.length"
                class="flex flex-col items-center justify-center gap-1"
              >
                <span class="font-semibold text-sm text-primary">No Data Available</span>
                <span class="font-normal text-sm text-text-disabled"
                  >There’s currently no data to display in this table. Please add new entries.</span
                >
              </td>
            </template>
          </AppBaseDataTable>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="menuRecipeCreateEdit_onShowDialogCancelAddIngredient"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Add"
          type="button"
          :disabled="menuRecipeCreateEdit_listIngredientItemsOnDialog.length === 0"
          @click="menuRecipeCreateEdit_onShowDialogSaveIngredients"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
