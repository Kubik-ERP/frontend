<script setup lang="ts">
import { AutoCompleteCompleteEvent, AutoCompleteOptionSelectEvent } from 'primevue';
import type {
  ILoyaltyPointBenefitProvided,
  IProduct,
  IFreeItems,
} from '@/modules/point-configuration/interfaces/loyalty-point-benefit.interface';
const {
  freeItemsBenefit_formData,
  freeItemsBenefit_formValidations,
  loyaltyPointBenefit_onCloseDialogFreeItems,
  loyaltyPointBenefit_onSubmitDialogFreeItems,
  loyaltyPointBenefit_onSubmitEditDialogFreeItems,
  productList_isLoading,
  loyaltyPointBenefit_productList,
  isEdit,
} = inject<ILoyaltyPointBenefitProvided>('loyaltyPointBenefit')!;

// --- State for the AutoComplete component ---
const currentSelection = ref<IProduct | null>(null);
const suggestions = ref<IProduct[]>([]);
const masterProducts = computed(() => loyaltyPointBenefit_productList.value);

// ✅ REMOVED: const selectedProducts = ref<IProduct[]>([]);

// ✅ This now correctly checks against the central formData
const availableProducts = computed(() => {
  return masterProducts.value.filter(
    masterProd => !freeItemsBenefit_formData.freeItems.some(selectedProd => selectedProd.id === masterProd.id),
  );
});

const search = (event: AutoCompleteCompleteEvent) => {
  const query = event.query.toLowerCase();
  suggestions.value = availableProducts.value.filter(product => product.name.toLowerCase().includes(query));

  currentSelection.value = null;
};

/**
 * Adds the selected product to the central freeItems array.
 */
const onProductSelect = (event: AutoCompleteOptionSelectEvent) => {
  const selectedItem: IProduct = event.value;

  // Transform the selected product into the IFreeItems format
  const itemToAdd: IFreeItems = {
    id: selectedItem.id,
    name: selectedItem.name,
    categories: selectedItem.categories,
    quantity: 1, // Default to a quantity of 1
  };

  // ✅ Pushes directly to the reactive formData
  freeItemsBenefit_formData.freeItems.push(itemToAdd);

  // ✅ Use nextTick to clear the input after the current update cycle
  nextTick(() => {
    currentSelection.value = null;
  });
};

/**
 * Removes an item from the central freeItems array.
 */
const removeFromPool = (productToRemove: IFreeItems) => {
  // ✅ Filters the reactive formData directly
  freeItemsBenefit_formData.freeItems = freeItemsBenefit_formData.freeItems.filter(
    p => p.id !== productToRemove.id,
  );
};
</script>
<template>
  <AppBaseDialog id="loyalty-point-benefit-dialog-free-items">
    <template #header>
      <h1 class="font-bold text-2xl text-text-primary">Add Free Items Befenit</h1>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="'Name'"
          spacing-bottom="mb-0"
          :validators="freeItemsBenefit_formValidations.name"
        >
          <PrimeVueInputText
            v-model="freeItemsBenefit_formData.name"
            class="text-sm w-full"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(freeItemsBenefit_formValidations, 'name')"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="name"
          :name="'Point Needs'"
          spacing-bottom="mb-0"
          :validators="freeItemsBenefit_formValidations.pointNeeds"
        >
          <PrimeVueInputNumber
            v-model="freeItemsBenefit_formData.pointNeeds"
            class="text-sm text-center"
            show-buttons
            button-layout="horizontal"
            fluid
            :min="0"
            :step="1"
            :class="{
              ...classes,
            }"
            v-on="useListenerForm(freeItemsBenefit_formValidations, 'pointNeeds')"
          >
            <template #decrementicon>
              <span><AppBaseSvg name="minus" class="!w-5 !h-5" /></span>
            </template>
            <template #incrementicon>
              <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
            </template>
          </PrimeVueInputNumber>
        </AppBaseFormGroup>

        <div class="flex flex-col items-center gap-8">
          <div class="flex flex-col gap-2 w-full">
            <label for="product-picker" class="font-semibold">Free Product Item</label>
            <PrimeVueAutoComplete
              id="product-picker"
              v-model="currentSelection"
              :suggestions="suggestions"
              :loading="productList_isLoading"
              option-label="name"
              placeholder="Search by Product Name"
              :dropdown="true"
              @complete="search"
              @item-select="onProductSelect"
            />
          </div>

          <div v-if="freeItemsBenefit_formData.freeItems.length > 0" class="w-full">
            <ul class="flex flex-col gap-2">
              <li
                v-for="(product, index) in freeItemsBenefit_formData.freeItems"
                :key="product.id"
                class="flex items-center justify-between gap-2"
              >
                <div class="flex justify-between p-2 rounded-md border border-grayscale-10 w-full">
                  <div>
                    <h3 class="font-semibold">{{ product.name }}</h3>
                    <PrimeVueChip class="bg-primary-background text-text-disabled text-xs px-1.5 py-1">
                      {{ product.categories }}
                    </PrimeVueChip>
                  </div>
                  <div class="flex flex-col gap-1">
                    <AppBaseFormGroup
                      v-slot="{ classes }"
                      class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                      label-for="name"
                      :name="'Total Free Items'"
                      spacing-bottom="mb-0"
                      :validators="
                        useFormValidateEach({
                          validation: freeItemsBenefit_formValidations.freeItems,
                          fieldIndex: index,
                          field: 'quantity',
                        })
                      "
                    >
                      <label class="flex items-center">
                        <span class="block text-sm font-medium leading-6 text-gray-900">Total Free Items</span>
                        <span class="text-error-main">*</span>
                      </label>
                      <PrimeVueInputNumber
                        v-model="product.quantity"
                        class="text-center w-40"
                        show-buttons
                        button-layout="horizontal"
                        fluid
                        :min="1"
                        :step="1"
                        :class="{ ...classes }"
                      >
                        <template #decrementicon>
                          <AppBaseSvg name="minus" class="!w-5 !h-5" />
                        </template>
                        <template #incrementicon>
                          <AppBaseSvg name="plus-line" class="!w-5 !h-5" />
                        </template>
                      </PrimeVueInputNumber>
                    </AppBaseFormGroup>
                  </div>
                </div>

                <PrimeVueButton
                  icon="pi pi-times"
                  severity="danger"
                  text
                  rounded
                  aria-label="Remove"
                  @click="removeFromPool(product)"
                />
              </li>
            </ul>
          </div>
        </div>
      </section>
    </template>

    <template #footer>
      <section id="content" class="flex items-center justify-end gap-4">
        <PrimeVueButton
          class="bg-transparent border-primary min-w-44"
          @click="loyaltyPointBenefit_onCloseDialogFreeItems()"
        >
          <template #default>
            <span class="font-semibold text-base text-primary">Cancel</span>
          </template>
        </PrimeVueButton>
        <PrimeVueButton
          class="bg-primary border-none min-w-44 disabled:bg-grayscale-20"
          :disabled="freeItemsBenefit_formValidations.$invalid"
          :label="isEdit ? 'Edit' : 'Add'"
          @click="
            isEdit
              ? loyaltyPointBenefit_onSubmitEditDialogFreeItems()
              : loyaltyPointBenefit_onSubmitDialogFreeItems()
          "
        />
      </section>
    </template>
  </AppBaseDialog>
</template>
