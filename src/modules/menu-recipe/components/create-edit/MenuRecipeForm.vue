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
  menuRecipeCreateEdit_formData,
  menuRecipeCreateEdit_formValidations,
  menuRecipeCreateEdit_isLoadingProducts,
  menuRecipeCreateEdit_listColumns,
  menuRecipeCreateEdit_listProducts,
  menuRecipeCreateEdit_listOutputUnitOptions,
  menuRecipeCreateEdit_onShowDialogAddIngredient,
  menuRecipeCreateEdit_onSave,
  menuRecipeCreateEdit_onSearchProduct,
  menuRecipeCreateEdit_onSelectProduct,
  menuRecipeCreateEdit_onResetProductSearch,
  menuRecipeCreateEdit_productSearchValue,
  menuRecipeCreateEdit_selectedProduct,
} = inject('menuRecipeCreateEdit') as IMenuRecipeCreateEditProvided;

/**
 * @description Debounced search to prevent too many API calls
 */
const debouncedSearch = debounce(() => menuRecipeCreateEdit_onSearchProduct(), 500);

/**
 * @description Watch search value changes and trigger debounced search
 */
watch(menuRecipeCreateEdit_productSearchValue, () => {
  debouncedSearch();
});
</script>

<template>
  <form class="default-wrapper gap-6" @submit.prevent="menuRecipeCreateEdit_onSave">
    <section id="recipe" class="flex flex-col gap-2 w-full">
      <h6 class="font-semibold text-lg text-primary">Recipe</h6>

      <section id="form-groups" class="grid grid-rows-3 grid-cols-12 gap-4">
        <section id="recipe-name" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="recipeName"
            name="Recipe Name"
            :validators="menuRecipeCreateEdit_formValidations.recipeName"
          >
            <PrimeVueInputText
              v-model="menuRecipeCreateEdit_formData.recipeName"
              placeholder="Input your store name"
              class="text-sm w-full"
              :class="{ ...classes }"
              v-on="useListenerForm(menuRecipeCreateEdit_formValidations, 'recipeName')"
            />
          </AppBaseFormGroup>
        </section>

        <section id="output-unit" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="outputUnit"
            name="Output Unit"
            spacing-bottom="mb-0"
            :validators="menuRecipeCreateEdit_formValidations.outputUnit"
          >
            <PrimeVueSelect
              id="outputUnit"
              v-model="menuRecipeCreateEdit_formData.outputUnit"
              filter
              :options="menuRecipeCreateEdit_listOutputUnitOptions"
              option-label="label"
              option-value="value"
              class="text-sm text-black w-full"
              :pt="{
                optionLabel: 'text-sm',
              }"
              :class="{ ...classes }"
              v-on="useListenerForm(menuRecipeCreateEdit_formValidations, 'outputUnit')"
            />
          </AppBaseFormGroup>
        </section>

        <section id="product" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="product"
            name="Link to Product"
            :validators="menuRecipeCreateEdit_formValidations.productId"
          >
            <PrimeVueAutoComplete
              v-model="menuRecipeCreateEdit_productSearchValue"
              :suggestions="menuRecipeCreateEdit_listProducts"
              :loading="menuRecipeCreateEdit_isLoadingProducts"
              option-label="name"
              placeholder="Search product by name or barcode"
              class="text-sm w-full [&>input]:text-sm [&>input]:w-full"
              :class="{ ...classes }"
              @option-select="event => menuRecipeCreateEdit_onSelectProduct(event.value)"
            >
              <template #option="{ option }">
                <div class="flex items-center justify-between gap-3 p-2 w-full">
                  <div class="flex flex-col flex-1">
                    <span class="font-medium text-sm text-black">{{ option.name }}</span>
                    <span v-if="option.barcode" class="text-xs text-gray-400">Barcode: {{ option.barcode }}</span>
                  </div>
                  <div class="text-right">
                    <div class="font-medium text-sm text-primary">
                      {{ useCurrencyFormat({ data: option.price || 0 }) }}
                    </div>
                  </div>
                </div>
              </template>
            </PrimeVueAutoComplete>

            <!-- Reset button if product is selected -->
            <div v-if="menuRecipeCreateEdit_selectedProduct" class="mt-2">
              <PrimeVueButton
                type="button"
                severity="secondary"
                size="small"
                @click="menuRecipeCreateEdit_onResetProductSearch"
              >
                <AppBaseSvg name="close" class="w-3 h-3 mr-2" />
                Clear Selection
              </PrimeVueButton>
            </div>
          </AppBaseFormGroup>
        </section>

        <section id="product-details" class="col-span-full lg:col-span-6 flex flex-col gap-2">
          <h6 class="font-medium text-base text-black">Product Details</h6>

          <table class="min-w-full table-auto text-left text-sm text-black">
            <tbody>
              <tr>
                <td class="px-0 pb-1">Product Name</td>
                <td class="px-0 pb-1">:</td>
                <td class="px-0 pb-1">{{ menuRecipeCreateEdit_selectedProduct?.name || '-' }}</td>
              </tr>

              <tr>
                <td class="px-0 pb-1">Price</td>
                <td class="px-0 pb-1">:</td>
                <td class="px-0 pb-1">
                  {{
                    menuRecipeCreateEdit_selectedProduct?.price
                      ? useCurrencyFormat({ data: menuRecipeCreateEdit_selectedProduct.price })
                      : '-'
                  }}
                </td>
              </tr>

              <tr v-if="menuRecipeCreateEdit_selectedProduct?.barcode">
                <td class="px-0 pb-1">Barcode</td>
                <td class="px-0 pb-1">:</td>
                <td class="px-0 pb-1">{{ menuRecipeCreateEdit_selectedProduct.barcode }}</td>
              </tr>

              <tr v-if="menuRecipeCreateEdit_selectedProduct?.description">
                <td class="px-0 pb-1">Description</td>
                <td class="px-0 pb-1">:</td>
                <td class="px-0 pb-1">{{ menuRecipeCreateEdit_selectedProduct.description }}</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section id="target-yield" class="col-span-full lg:col-span-6">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="target-yield"
            name="Target Yield"
            spacing-bottom="mb-0"
            :validators="menuRecipeCreateEdit_formValidations.targetYield"
          >
            <PrimeVueInputNumber
              v-model="menuRecipeCreateEdit_formData.targetYield"
              fluid
              class="[&>input]:text-sm"
              :class="{
                ...classes,
              }"
            />
          </AppBaseFormGroup>
        </section>
      </section>
    </section>

    <AppBaseDataTable
      :columns="menuRecipeCreateEdit_listColumns"
      :data="menuRecipeCreateEdit_formData.ingredients"
      is-using-custom-body
      is-using-custom-empty-data
      is-using-custom-header
      :is-using-border-on-header="false"
      :is-using-pagination="false"
      :max-visible-rows="5"
    >
      <template #header>
        <header class="flex items-center justify-between py-5">
          <h6 class="font-semibold text-lg text-primary">Ingredients</h6>

          <PrimeVueButton
            class="bg-primary border-none w-fit px-5"
            severity="secondary"
            @click="menuRecipeCreateEdit_onShowDialogAddIngredient"
          >
            <template #default>
              <section id="content" class="flex items-center gap-2">
                <AppBaseSvg name="plus-line-white" class="w-4 h-4" />

                <span class="font-semibold text-base text-white"> Add Ingredients </span>
              </section>
            </template>
          </PrimeVueButton>
        </header>
      </template>

      <template #body="{ column, data }">
        <template v-if="column.value === 'item'">
          <div class="flex flex-col gap-1">
            <span class="font-normal text-black text-sm">
              {{ data?.itemId?.itemName ?? '-' }}
            </span>
          </div>
        </template>

        <template v-else-if="column.value === 'cost'">
          <span class="font-normal text-black text-sm">
            {{
              useCurrencyFormat({
                data: data.itemId?.pricePerUnit * data.quantity || 0,
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
                @click="$router.push({ name: 'menu-recipe.detail', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="eye-visible" class="w-4 h-4" />
                    <span class="font-normal text-sm text-black">Detail</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton
                class="w-full px-4 py-3"
                variant="text"
                @click="$router.push({ name: 'menu-recipe.edit', params: { id: data.id } })"
              >
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="edit" class="w-4 h-4" />
                    <span class="font-normal text-sm text-black">Edit</span>
                  </section>
                </template>
              </PrimeVueButton>

              <PrimeVueButton class="w-full px-4 py-3">
                <template #default>
                  <section id="content" class="flex items-center gap-2 w-full">
                    <AppBaseSvg name="delete" class="w-4 h-4" />
                    <span class="font-normal text-sm text-black">Delete</span>
                  </section>
                </template>
              </PrimeVueButton>
            </section>
          </PrimeVuePopover>
        </template>

        <template v-else>
          <span class="font-normal text-sm text-black">{{ data[column.value] ?? '-' }}</span>
        </template>
      </template>

      <template #empty-data>
        <td
          :colspan="menuRecipeCreateEdit_listColumns.length"
          class="flex flex-col items-center justify-center gap-1"
        >
          <span class="font-semibold text-sm text-primary">No Data Available</span>
          <span class="font-normal text-sm text-text-disabled"
            >There’s currently no data to display in this table. Please add new entries.</span
          >
        </td>
      </template>
    </AppBaseDataTable>
  </form>
</template>
