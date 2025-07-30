<script setup>
import { useProductService } from '../services/catalog-product.service';
import { useCategoryService } from '@/modules/catalog/services/Category/CategoryService';
import excludeSVG from '@/app/assets/icons/exclude.svg';
import deleteSVG from '@/app/assets/icons/delete.svg';
import plusLineSVG from '@/app/assets/icons/plus-line.svg';
import chevronDownSVG from '@/app/assets/icons/chevron-down.svg';
import imageSVG from '@/app/assets/icons/image.svg';
import confirmationSVG from '@/app/assets/icons/confirmation.svg';
import closeRedSVG from '@/app/assets/icons/close-red.svg';
import deletePolygonSVG from '@/app/assets/icons/delete-polygon.svg';

const route = useRoute();

const { getAllCategories } = useCategoryService();
const { getProductById, updateProduct, deleteProduct, product_formData, product_formValidations } =
  useProductService();

const toggleVariant = ref(false);
const categories = ref([]);
const productID = ref(route.params.id);
function clearForm() {
  product_formData.name = '';
  product_formData.price = 0;
  product_formData.isDiscount = false;
  product_formData.discount_value = 0;
  product_formData.is_percent = false;
  product_formData.discount_price = 0;
  product_formData.variants = [];
  product_formData.categories = [];
  product_formData.imagePreview = '';

  toggleVariant.value = false;
  product_formValidations.value.$reset();
}

const loadCategories = async () => {
  try {
    const response = await getAllCategories(1, 100, '');
    categories.value = response.categories;
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

const discount_unit = ref('Rp');

const loadProduct = async () => {
  try {
    const response = await getProductById(route.params.id);

    product_formData.name = response.name;
    product_formData.price = response.price;
    product_formData.discount_price = response.discountPrice;
    product_formData.variants = response.variantHasProducts;
    product_formData.categories = response.categoriesHasProducts;
    product_formData.is_percent = response.isPercent;
    product_formData.imagePreview = response.picture_url;
    product_formData.isDiscount = response.discountPrice !== 0;

    if (product_formData.isDiscount) {
      if (response.isPercent) {
        product_formData.discount_value = 100 - (response.discountPrice / response.price) * 100;
        discount_unit.value = '%';
      } else {
        product_formData.discount_value = response.price - response.discountPrice;
        discount_unit.value = 'Rp';
      }
    }
    if (product_formData.variants.length > 0) {
      toggleVariant.value = true;
    }
  } catch (error) {
    console.error(error);
  }
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

const isDeleteOpen = ref(false);

const handleDelete = async () => {
  try {
    await deleteProduct(productID.value);
    isDeleteOpen.value = false;
    hasConfirmedLeave = true;
    router.push({ name: 'catalog.products.index' });
  } catch (error) {
    console.error('Failed to delete product:', error);
  }
};

const handleUpdateProduct = async () => {
  try {
    await updateProduct(productID.value, product_formData);
  } catch (error) {
    console.error(error);
  } finally {
    clearForm();
  }
};

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

onMounted(async () => {
  loadCategories();
  loadProduct();
});

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

// Modal state
const isUpdateModal = ref(false);

// Your action to call when confirming
const confirmUpdate = async () => {
  try {
    // Example: updateProduct() or any async call
    await handleUpdateProduct(); // Make sure this is defined/imported

    product_formValidations.value.$reset();
    hasConfirmedLeave = true;
    router.push({ name: 'catalog.products.index' });
    // Optionally show success feedback/toast here

    isUpdateModal.value = false;
  } catch (error) {
    console.error('Failed to update product:', error);
    // Optionally show error feedback
  }
};

// Cancel just closes the modal
const cancelUpdate = () => {
  isUpdateModal.value = false;
};
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">{{ useLocalization('productDetail.title') }}</h1>
      <h2 class="text-xl font-semibold">{{ useLocalization('productDetail.header') }}</h2>

      <form class="flex flex-col items-center justify-center" @submit.prevent="isUpdateModal = true">
        <p>{{ useLocalization('productDetail.photo.label') }}</p>
        <img
          class="rounded-lg mt-2 w-64 h-64 object-cover"
          :src="product_formData.imagePreview || 'https://placehold.co/250'"
          alt="Photo"
        />
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

        <PrimeVueButton
          :label="useLocalization('productDetail.photo.button')"
          class="mt-4 shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
          variant="outlined"
          @click="triggerFileInput"
        >
          <template #icon>
            <img :src="imageSVG" alt="" />
          </template>
        </PrimeVueButton>

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
              :class="classes ? '' : ''"
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
                :class="classes ? '' : ''"
                v-on="useListenerForm(product_formValidations, 'categories')"
              >
                <template #dropdownicon>
                  <img :src="chevronDownSVG" alt="" />
                </template>
                <template #option="{ option }">
                  {{ option.category }}
                </template>
              </PrimeVueMultiSelect>
            </AppBaseFormGroup>
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
                :class="classes ? '' : ''"
                v-on="useListenerForm(product_formValidations, 'price')"
                @change="calculateDiscount"
              />
            </AppBaseFormGroup>
          </div>
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
                    @update:modelValue="calculateDiscount"
                    v-on="useListenerForm(product_formValidations, 'discount_value')"
                  />
                  <div class="absolute right-0 flex items-center rounded-lg border-none ring-0">
                    <PrimeVueSelect
                      v-model="discount_unit"
                      :options="['Rp', '%']"
                      class="border-none bg-transparent"
                      @update:modelValue="calculateDiscount"
                      @change="calculateDiscount"
                    >
                      <template #dropdownicon>
                        <img :src="chevronDownSVG" alt="" />
                      </template>
                      <template #option="{ option }">
                        {{ option }}
                      </template>
                    </PrimeVueSelect>
                  </div>
                </div>
                <span
                  >{{ useLocalization('productDetail.form.discount.total') }}
                  <b> Rp {{ product_formData.discount_price }}</b></span
                >
              </div>
            </AppBaseFormGroup>
          </div>
          <span></span>
        </div>

        <div class="flex flex-col w-full gap-8 mt-8">
          <div class="flex gap-4">
            <label for="variant"><b>Variant</b></label>
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
                      :class="classes"
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
                <img :src="plusLineSVG" alt="" />
              </template>
            </PrimeVueButton>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <router-link to="/catalog/products">
                <PrimeVueButton
                  :label="useLocalization('productDetail.form.button.cancel')"
                  class="text-xl w-48 py-2 border-2 border-primary cursor-pointer rounded-lg text-primary bg-transparent font-semibold"
                  unstyled
                />
              </router-link>
              <PrimeVueButton
                :label="useLocalization('productDetail.form.button.edit')"
                class="text-xl w-48 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
                unstyled
                type="submit"
              />
            </div>

            <PrimeVueButton
              :label="useLocalization('productDetail.form.button.delete')"
              class="text-xl w-56 py-2 border-2 border-none cursor-pointer rounded-lg text-red-500 bg-transparent font-semibold"
              @click="isDeleteOpen = true"
            >
              <template #icon>
                <img :src="deleteSVG" alt="" />
              </template>
            </PrimeVueButton>
          </div>
        </div>
      </form>
    </div>
    <PrimeVueDialog :visible="isLeavingModal" modal header="">
      <template #container>
        <div class="w-[35rem] p-8">
          <div class="flex flex-col items-center gap-4 text-center">
            <span><img :src="excludeSVG" alt="" /></span>
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

    <PrimeVueDialog v-model:visible="isDeleteOpen" modal header="">
      <template #container>
        <div class="w-[35rem] p-8">
          <div class="flex flex-col items-center gap-4 text-center">
            <img :src="deletePolygonSVG" alt="Delete icon" class="mx-auto" />
            <h1 class="text-2xl font-semibold">{{ useLocalization('productDetail.deleteModal.title') }}</h1>
            <p>{{ useLocalization('productDetail.deleteModal.description') }}</p>
            <div class="flex items-center justify-between gap-4">
              <PrimeVueButton
                class="text-lg w-56 text-red-500 bg-transparent border-none"
                variant="outlined"
                :label="useLocalization('productDetail.deleteModal.deleteButton')"
                severity="danger"
                @click="
                  handleDelete();
                  isDeleteOpen = false;
                "
              >
                <template #icon>
                  <img :src="deleteSVG" alt="" />
                </template>
              </PrimeVueButton>
              <PrimeVueButton
                class="w-56 text-lg bg-primary border-primary"
                :label="useLocalization('productDetail.deleteModal.cancelButton')"
                @click="isDeleteOpen = false"
              />
            </div>
          </div>
        </div>
      </template>
    </PrimeVueDialog>

    <PrimeVueDialog :visible="isUpdateModal" modal header="">
      <template #container>
        <div class="w-[35rem] p-8">
          <div class="flex flex-col items-center gap-4 text-center">
            <span><img :src="confirmationSVG" alt="" /></span>
            <h1 class="text-2xl font-semibold">Are you sure want to update this product item?</h1>
            <p>The update will affect the product items in the catalog</p>
            <div class="flex items-center justify-between gap-4">
              <PrimeVueButton
                variant="text"
                class="w-56 text-lg border-2 border-primary text-primary font-semibold"
                @click="cancelUpdate"
                >Cancel</PrimeVueButton
              >
              <PrimeVueButton
                class="text-xl w-56 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
                unstyled
                label="Yes, I'm Sure"
                @click="confirmUpdate"
              />
            </div>
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<style lang="scss" scoped></style>
