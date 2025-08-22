<script setup lang="ts">
// interfaces
import type { IProductList, IProduct } from '../interfaces';
import type { AutoCompleteCompleteEvent, AutoCompleteOptionSelectEvent } from 'primevue';

// services
import { useProductBundlingService } from '../services/product-bundling.service';
const route = useRoute();
const {
  price_type_option,
  productBundling_grandTotal,
  productBundling_formData,
  productBundling_formValidations,
  productBundling_productList,
  productBundling_fetchProductList,
  productBundling_fetchCreateProductBundlingList,
  productBundling_fetchProductBundlingDetails,
  productBundling_fetchUpdateProductBundlingList,
  productList_isLoading,
  // function
  setPricingType,
  calculateTotalPrice,
} = useProductBundlingService();

// --- State for the AutoComplete component ---
const currentSelection = ref<IProduct | null>(null);
const suggestions = ref<IProductList>([]);
const masterProducts = computed(() => productBundling_productList.value);

// ✅ REMOVED: const selectedProducts = ref<IProduct[]>([]);

// ✅ This now correctly checks against the central formData
const availableProducts = computed(() => {
  return masterProducts.value.filter(
    masterProd => !productBundling_formData.products.some(selectedProd => selectedProd.id === masterProd.id),
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
  const itemToAdd: IProduct = {
    id: selectedItem.id,
    name: selectedItem.name,
    categories: selectedItem.categories,
    price: selectedItem.price,
    discountPrice: selectedItem.discountPrice,
    quantity: 1, // Default to a quantity of 1
  };

  // ✅ Pushes directly to the reactive formData
  productBundling_formData.products.push(itemToAdd);

  // ✅ Use nextTick to clear the input after the current update cycle
  nextTick(() => {
    currentSelection.value = null;
  });
};

/**
 * Removes an item from the central freeItems array.
 */
const removeFromPool = (productToRemove: IProduct) => {
  // ✅ Filters the reactive formData directly
  productBundling_formData.products = productBundling_formData.products.filter(p => p.id !== productToRemove.id);
};

onMounted(async () => {
  if (route.name === 'product-bundling.edit') {
    await productBundling_fetchProductBundlingDetails(route.params.id as string);
  }
  await productBundling_fetchProductList();
});
</script>
<template>
  <section class="grid grid-cols-2 gap-8">
    <section class="flex flex-col gap-4">
      <!-- <pre>{{ productBundling_formData }}</pre> -->
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="name"
        name="Product Bundling Name"
        spacing-bottom="mb-0"
        :validators="productBundling_formValidations.name"
      >
        <PrimeVueInputText
          v-model="productBundling_formData.name"
          placeholder="Product Bundling Name"
          class="w-full"
          :class="{ ...classes }"
        />
      </AppBaseFormGroup>

      <!-- description -->
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="description"
        name="Description"
        spacing-bottom="mb-0"
      >
        <PrimeVueTextarea
          v-model="productBundling_formData.description"
          placeholder="Description"
          class="w-full"
          rows="5"
          cols="30"
          :class="{ ...classes }"
        />
      </AppBaseFormGroup>

      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="price"
        name="Price"
        spacing-bottom="mb-0"
        :validators="productBundling_formValidations.price"
      >
        <div class="flex flex-col gap-2">
          <PrimeVueSelectButton
            v-model="productBundling_formData.type"
            option-label="label"
            option-value="value"
            :disabled="productBundling_formData.products.length === 0"
            :options="price_type_option"
            :pt="{ root: 'w-full', pcToggleButton: { root: 'flex-1' } }"
            :allow-empty="false"
            @change="
              setPricingType();
              calculateTotalPrice();
            "
          />
          <PrimeVueInputNumber
            v-model="productBundling_formData.price"
            :disabled="
              productBundling_formData.type === 'TOTAL_ITEMS' || productBundling_formData.products.length === 0
            "
            placeholder="Rp. 0,00"
            :prefix="productBundling_formData.type !== 'DISCOUNT' ? 'Rp ' : ''"
            :suffix="productBundling_formData.type === 'DISCOUNT' ? '%' : ''"
            fluid
            name="price"
            :min="0"
            :max="productBundling_formData.type === 'DISCOUNT' ? 100 : undefined"
            class="w-full"
            :class="{ ...classes }"
            @value-change="calculateTotalPrice()"
          />
        </div>
      </AppBaseFormGroup>
    </section>
    <section id="card" class="">
      <PrimeVueCard class="h-fit">
        <template #content>
          <div class="flex flex-col gap-4 w-full">
            <label for="product-picker" class="font-semibold">Select Product</label>
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
            <div v-if="productBundling_formData.products.length > 0" class="w-full">
              <ul class="flex flex-col gap-2">
                <li
                  v-for="product in productBundling_formData.products"
                  :key="product.id"
                  class="flex items-center justify-between gap-2"
                >
                  <div class="flex flex-col justify-between p-2 rounded-md border border-grayscale-10 w-full">
                    <div class="flex items-end justify-between">
                      <div>
                        <h3 class="font-semibold">{{ product.name }}</h3>
                        <span class="flex gap-2">
                          <PrimeVueChip
                            v-for="(item, index) in product.categories"
                            :key="index"
                            class="bg-primary-background text-text-disabled text-xs px-1.5 py-1"
                          >
                            {{ item }}
                          </PrimeVueChip>
                        </span>
                      </div>
                      <span class="font-semibold"> @ {{ useCurrencyFormat({ data: product.price }) }} </span>
                    </div>

                    <div class="flex flex-col gap-1">
                      <AppBaseFormGroup
                        v-slot="{ classes }"
                        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                        label-for="name"
                        :name="'Total Free Items'"
                        spacing-bottom="mb-0"
                      >
                        <label class="flex items-center">
                          <span class="block text-sm font-medium leading-6 text-gray-900">Total Items</span>
                          <span class="text-error-main">*</span>
                        </label>
                        <PrimeVueInputNumber
                          v-model="product.quantity"
                          class="text-center w-full"
                          show-buttons
                          button-layout="horizontal"
                          fluid
                          :min="1"
                          :step="1"
                          :class="{ ...classes }"
                          @value-change="
                            setPricingType();
                            calculateTotalPrice();
                          "
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

                    <span class="font-semibold text-right mt-4">
                      Total : {{ useCurrencyFormat({ data: product.price * product.quantity }) }}
                    </span>
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
          <PrimeVueCard class="h-fit mt-4">
            <template #content>
              <section class="flex flex-col gap-1 justify-end">
                <div class="flex flex-col">
                  <span class="text-right">Actual Price</span>
                  <span class="text-right font-semibold">{{
                    useCurrencyFormat({
                      data: productBundling_formData.products.reduce(
                        (total, item) => total + item.price * item.quantity,
                        0,
                      ),
                    })
                  }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-right">Bundling Price</span>
                  <span class="text-right font-semibold">{{
                    useCurrencyFormat({
                      data: productBundling_grandTotal,
                    })
                  }}</span>
                </div>
              </section>
            </template>
          </PrimeVueCard>
        </template>
      </PrimeVueCard>
    </section>
    <footer class="col-span-2">
      <section class="flex items-center justify-start gap-4">
        <router-link :to="{ name: 'product-bundling.index' }">
          <PrimeVueButton class="bg-transparent border-primary min-w-44">
            <template #default>
              <span class="font-semibold text-base text-primary">Cancel</span>
            </template>
          </PrimeVueButton>
        </router-link>
        <PrimeVueButton
          class="bg-primary border-none min-w-44 disabled:bg-grayscale-20"
          :disabled="productBundling_formValidations.$invalid"
          :label="route.name === 'product-bundling.edit' ? 'Edit' : 'Add'"
          @click="
            route.name === 'product-bundling.edit'
              ? productBundling_fetchUpdateProductBundlingList()
              : productBundling_fetchCreateProductBundlingList()
          "
        />
      </section>
    </footer>
  </section>
</template>
