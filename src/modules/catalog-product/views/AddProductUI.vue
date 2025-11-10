<script setup>
import { useProductService } from '../services/catalog-product.service';
import { useCategoryService } from '@/modules/catalog/services/Category/CategoryService';
import excludeSVG from '@/app/assets/icons/exclude.svg';
import closeRedSVG from '@/app/assets/icons/close-red.svg';

const { getAllCategories } = useCategoryService();
const {
  createProduct,
  product_formData,
  product_formValidations,
  recipeList_values,
  catalogProduct_fetchRecipeList,
  recipeList_params,
} = useProductService();
const discount_unit = ref('Rp');
const loading = ref(false);
function clearForm() {
  product_formData.name = '';
  product_formData.price = 0;
  product_formData.isDiscount = false;
  product_formData.discount_value = 0;
  product_formData.discount_price = 0;
  product_formData.variants = [];
  product_formData.categories = [];
  product_formData.imagePreview = '';
  // product_formData.stock_quantity = 0;
  product_formData.recipeId = null;

  product_formValidations.value.$reset();
}

const handleSelectRecipe = value => {
  product_formData.recipeId = value.id;
};

const fileInput = ref(null);
const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleImageUpload = event => {
  const file = event.target.files?.[0];
  if (file) {
    product_formData.imageFile = file; // ✅ Save the file

    const reader = new FileReader();
    reader.onload = () => {
      product_formData.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleCreateProduct = async () => {
  product_formValidations.value.$touch();
  if (product_formValidations.value.$invalid) return;

  if (!product_formData.isDiscount) {
    // console.log('no discount');
    product_formData.discount_price = product_formData.price;
  }

  try {
    loading.value = true;
    await createProduct(product_formData);
    clearForm();
    product_formValidations.value.$reset();
    hasConfirmedLeave = true;
    router.push({ name: 'catalog.products.index' });
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const categories = ref([]);

const toggleVariant = ref(false);

const addVariant = () => {
  product_formData.variants.push({
    name: '',
    price: 0,
  });
};

const removeVariant = index => {
  product_formData.variants.splice(index, 1);
};

const calculateDiscount = () => {
  if (!product_formData.isDiscount) {
    product_formData.discount_price = 0;
  }

  if (product_formData.isDiscount) {
    if (discount_unit.value === 'Rp') {
      product_formData.is_percent = false;
      product_formData.discount_price = product_formData.price - product_formData.discount_value;
    } else {
      product_formData.discount_price =
        product_formData.price - (product_formData.price * product_formData.discount_value) / 100;
      product_formData.is_percent = true;
    }
  }
};

const nextRoute = ref(null);
const isLeavingModal = ref(false);

const router = useRouter();

const loadCategories = async () => {
  try {
    loading.value = true;
    const response = await getAllCategories(1, 100, '');
    categories.value = response.categories;
  } catch (error) {
    console.error('Failed to load categories:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  Promise.all([loadCategories(), catalogProduct_fetchRecipeList()]).catch(error =>
    console.error('Failed to load categories and fetch recipes:', error),
  );
  
});

let hasConfirmedLeave = false;

const confirmLeave = () => {
  isLeavingModal.value = false;
  hasConfirmedLeave = true;

  if (nextRoute.value) {
    const targetRoute = nextRoute.value;
    nextRoute.value = null;
    router.push(targetRoute);
  }
};

const cancelLeave = () => {
  isLeavingModal.value = false;
  nextRoute.value = null;
  hasConfirmedLeave = false;
};

onBeforeRouteLeave((to, from, next) => {
  // console.log('onBeforeRouteLeave triggered', isLeavingModal.value, hasConfirmedLeave);

  if (hasConfirmedLeave) {
    hasConfirmedLeave = false;
    return next();
  }

  if (!isLeavingModal.value) {
    isLeavingModal.value = true;
    nextRoute.value = to.fullPath;
    next(false);
  }
});

const removePhoto = () => {
  product_formData.imagePreview = '';
  product_formData.imageFile = null;
};

watch(product_formData, () => {
  calculateDiscount();
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">{{ useLocalization('productDetail.title') }}</h1>
      <h2 class="text-xl font-semibold">{{ useLocalization('productDetail.header') }}</h2>
      <form class="flex flex-col items-center justify-center" @submit.prevent="handleCreateProduct">
        <p>{{ useLocalization('productDetail.photo.label') }}</p>
        <AppBaseImage :src="product_formData.imagePreview" alt="Photo" class="w-64 h-64 object-cover" />

        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

        <div class="flex items-center justify-center gap-2 mt-4">
          <PrimeVueButton
            :label="useLocalization('productDetail.photo.button')"
            class="shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
            variant="outlined"
            @click="triggerFileInput"
          >
            <template #icon>
              <AppBaseSvg name="image" class="!w-5 !h-5 filter-primary-color" />
            </template>
          </PrimeVueButton>
          <PrimeVueButton
            v-if="product_formData.imagePreview"
            variant="text"
            severity="danger"
            label="Delete Image"
            @click="removePhoto"
          >
            <template #icon>
              <AppBaseSvg name="delete" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </div>

        <div class="grid grid-cols-2 w-full gap-8 mt-8">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="name"
            :name="useLocalization('productDetail.form.productName.label')"
            :validators="product_formValidations.name"
          >
            <PrimeVueInputText
              v-model="product_formData.name"
              name="name"
              type="text"
              :class="{ ...classes }"
              fluid
              class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
              v-on="useListenerForm(product_formValidations, 'name')"
            />
          </AppBaseFormGroup>

          <div class="flex flex-col">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="catergory"
              :name="useLocalization('productDetail.form.category.label')"
              :validators="product_formValidations.categories"
            >
              <PrimeVueMultiSelect
                v-model="product_formData.categories"
                name="category"
                display="chip"
                :options="categories"
                option-label="category"
                filter
                placeholder="Select"
                class="w-full text-primary"
                :class="{ ...classes }"
                v-on="useListenerForm(product_formValidations, 'categories')"
              >
                <template #dropdownicon>
                  <AppBaseSvg name="chevron-down" class="!w-5 !h-5 filter-primary-color" />
                </template>
                <template #option="{ option }">
                  {{ option.category }}
                </template>
              </PrimeVueMultiSelect>
            </AppBaseFormGroup>
          </div>

          <div class="flex flex-col col-span-2 w-1/2 pr-4">
            <label for="recipeId" class="flex gap-1 text-sm font-medium leading-6 text-gray-900 w-full">
              Link to Recipe
              <p class="text-text-disabled">(optional)</p>
            </label>
            <PrimeVueAutoComplete
              v-model="recipeList_params.search"
              :suggestions="recipeList_values"
              :loading="false"
              option-label="recipeName"
              placeholder="Search Recipe"
              class="text-sm w-full [&>input]:text-sm [&>input]:w-full"
              @option-select="event => handleSelectRecipe(event.value)"
            >
              <template #option="{ option }">
                <div class="flex items-center justify-between gap-3 p-2 w-full">
                  <div class="flex flex-col flex-1">
                    <span class="font-medium text-sm text-black">{{ option.recipeName }}</span>
                  </div>
                </div>
              </template>
            </PrimeVueAutoComplete>
          </div>

          <div class="flex flex-col">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="price"
              :name="useLocalization('productDetail.form.price.label')"
              :validators="product_formValidations.price"
            >
              <PrimeVueInputNumber
                v-model="product_formData.price"
                prefix="Rp "
                name="price"
                fluid
                class="border shadow-xs border-grayscale-30 rounded-lg"
                :class="{ ...classes }"
                v-on="useListenerForm(product_formValidations, 'price')"
                @change="calculateDiscount"
              />
            </AppBaseFormGroup>
          </div>

          <!-- <div>
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="stock"
              :name="useLocalization('productDetail.form.stock.label')"
              :validators="product_formValidations.stock_quantity"
            >
              <PrimeVueInputNumber
                v-model="product_formData.stock_quantity"
                name="stock"
                fluid
                class="border shadow-xs border-grayscale-30 rounded-lg"
                :class="{ ...classes }"
                v-on="useListenerForm(product_formValidations, 'stock_quantity')"
              />
            </AppBaseFormGroup>
          </div> -->
        </div>
        <div class="grid grid-cols-2 h-fit w-full gap-x-8 mt-8">
          <div class="flex items-center gap-2 col-span-2">
            <PrimeVueCheckbox v-model="product_formData.isDiscount" binary @change="calculateDiscount" />
            <label for="product_formData.isDiscount" class="font-bold">
              {{ useLocalization('productDetail.form.discount.checkbox') }}
            </label>
          </div>
          <div class="flex flex-col mt-4" :class="product_formData.isDiscount ? 'block' : 'hidden'">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="discount_value"
              :name="useLocalization('productDetail.form.discount.valueLabel')"
              :validators="product_formValidations.discount_value"
            >
              <div class="relative w-full">
                <div
                  class="flex items-center border shadow-xs border-grayscale-30 rounded-lg overflow-hidden w-full"
                >
                  <PrimeVueInputNumber
                    v-model="product_formData.discount_value"
                    class="w-full"
                    name="discount_value"
                    :prefix="product_formData.is_percent === false ? 'Rp ' : ''"
                    :suffix="product_formData.is_percent === true ? ' %' : ''"
                    :class="classes ? '' : ''"
                    @change="calculateDiscount"
                    v-on="useListenerForm(product_formValidations, 'discount_value')"
                  />
                  <div class="absolute right-0 flex items-center rounded-lg border-none ring-0">
                    <PrimeVueSelect
                      v-model="discount_unit"
                      :options="['Rp', '%']"
                      class="border-none bg-transparent"
                      @update:modelValue="calculateDiscount"
                    >
                      <template #dropdownicon>
                        <AppBaseSvg name="chevron-down" class="!w-5 !h-5 filter-primary-color" />
                      </template>
                      <template #option="{ option }">
                        {{ option }}
                      </template>
                    </PrimeVueSelect>
                  </div>
                </div>
                <span
                  >{{ useLocalization('productDetail.form.discount.total') }} :
                  <b> Rp {{ product_formData.discount_price }}</b></span
                >
              </div>
            </AppBaseFormGroup>
          </div>
          <span></span>
        </div>

        <div class="flex flex-col w-full gap-8 mt-8">
          <div class="flex gap-4">
            <label for="variant"
              ><b>{{ useLocalization('productDetail.form.variant.label') }}</b></label
            >
            <PrimeVueToggleSwitch v-model="toggleVariant" />
          </div>

          <div v-if="toggleVariant" class="flex flex-col">
            <div class="flex flex-col gap-4">
              <div
                v-for="(variant, index) in product_formData.variants"
                :key="index"
                class="grid grid-cols-2 gap-x-8"
              >
                <div class="flex flex-col">
                  <AppBaseFormGroup
                    v-slot="{ classes }"
                    class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                    is-name-as-label
                    label-for="variant-name"
                    :name="useLocalization('productDetail.form.variant.nameLabel')"
                    class="w-full"
                    :validators="
                      useFormValidateEach({
                        validation: product_formValidations.variants,
                        fieldIndex: index,
                        field: 'name',
                      })
                    "
                  >
                    <PrimeVueInputText
                      :id="`variant-name-${index}`"
                      v-model="product_formData.variants[index].name"
                      :name="useLocalization('productDetail.form.variant.additionalPriceLabel')"
                      class="border shadow-xs border-grayscale-30 rounded-lg w-full"
                      :class="{ ...classes }"
                    />
                  </AppBaseFormGroup>
                </div>

                <div class="flex gap-2">
                  <div class="flex flex-col w-full">
                    <label
                      for="variant-price"
                      class="flex gap-2 text-sm font-medium leading-6 text-gray-900 w-full"
                    >
                      {{ useLocalization('productDetail.form.variant.additionalPriceLabel') }}
                      <p class="text-gray-400">
                        {{ useLocalization('productDetail.form.variant.optionalLabel') }}
                      </p>
                    </label>
                    <PrimeVueInputNumber
                      :id="`variant-price-${index}`"
                      v-model="product_formData.variants[index].price"
                      prefix="Rp "
                      fluid
                      :name="`variants.${index}.price`"
                      class="border shadow-xs border-grayscale-30 rounded-lg w-full"
                      :class="classes"
                    />
                  </div>
                  <PrimeVueButton variant="text" severity="danger" @click="removeVariant(index)">
                    <img :src="closeRedSVG" alt="" />
                  </PrimeVueButton>
                </div>
              </div>
            </div>

            <PrimeVueButton
              :label="useLocalization('productDetail.form.variant.addButton')"
              class="mt-4 col-span-2 w-fit text-xl px-8 py-2 text-primary pl-4 bg-transparent border-none font-semibold flex items-center justify-center gap-2"
              @click="addVariant"
            >
              <template #icon>
                <AppBaseSvg name="plus-line" class="!w-5 !h-5 filter-primary-color" />
              </template>
            </PrimeVueButton>
          </div>
          <div class="flex gap-4 mb-8">
            <router-link to="/catalog/products">
              <PrimeVueButton
                :label="useLocalization('productDetail.form.button.cancel')"
                class="text-xl min-w-48 px-3 py-2 border-2 border-primary cursor-pointer rounded-lg text-primary bg-transparent font-semibold"
                unstyled
              />
            </router-link>
            <PrimeVueButton
              :label="useLocalization('productDetail.form.button.save')"
              :loading="loading"
              class="text-xl min-w-48 px-3 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              :disabled="product_formValidations.$invalid"
              type="submit"
            />
          </div>
        </div>
      </form>
    </div>
    <PrimeVueDialog :visible="isLeavingModal" modal header="">
      <template #container>
        <div class="w-[35rem] p-8">
          <div class="flex flex-col items-center gap-4 text-center">
            <img :src="excludeSVG" alt="Delete icon" class="mx-auto" />
            <h1 class="text-2xl font-semibold">{{ useLocalization('productDetail.leavePageModal.title') }}</h1>
            <p>{{ useLocalization('productDetail.leavePageModal.description') }}</p>
            <div class="flex items-center justify-between gap-4">
              <PrimeVueButton
                class="text-lg w-56 text-primary font-semibold"
                variant="text"
                :label="useLocalization('productDetail.leavePageModal.discardButton')"
                @click="confirmLeave"
              />
              <PrimeVueButton
                class="w-56 text-lg border-2 border-primary text-primary font-semibold"
                variant="text"
                :label="useLocalization('productDetail.leavePageModal.cancelButton')"
                @click="cancelLeave"
              />
            </div>
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<style lang="scss" scoped></style>
