<script setup>
import { useProductService } from '@/modules/catalog/services/Product/ProductServices';
import { useCategoryService } from '../../services/Category/CategoryService';

const { getAllCategories } = useCategoryService();
const { createProduct, product_formData, product_formValidations } = useProductService();
const discount_unit = ref('Rp');
function clearForm() {
  product_formData.name = '';
  product_formData.price = 0;
  product_formData.isDiscount = false;
  product_formData.discount_value = 0;
  product_formData.discount_price = 0;
  product_formData.variants = [];
  product_formData.categories = [];
  product_formData.image = null;

  product_formValidations.value.$reset();
}

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleImageUpload = event => {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      product_formData.image = reader.result;
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
    await createProduct(product_formData);
    clearForm();
    product_formValidations.value.$reset();
  } catch (error) {
    console.error(error);
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
  product.variants.splice(index, 1);
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

const loadCategories = async () => {
  try {
    const response = await getAllCategories(1, 100, '');
    categories.value = response.categories;
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

onMounted(async () => {
  loadCategories();
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

watch(product_formData, () => {
  calculateDiscount();
});
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-4">
      <!-- {{ product_formData }}
      <br />
      {{ product_formValidations }}
      <br />
      {{ product_formValidations.$invalid }} -->
      <h1 class="text-2xl font-bold">Products Detail</h1>
      <h2 class="text-xl font-semibold">Product Information</h2>
      <form class="flex flex-col items-center justify-center" @submit.prevent="handleCreateProduct">
        <p>Photo (Optional)</p>
        <img
          class="rounded-lg mt-2 w-64 h-64 object-cover"
          :src="product_formData.image || 'https://placehold.co/250'"
          alt="Photo"
        />

        <!-- Hidden File Input -->
        <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload" />

        <!-- PrimeVue Button as file selector -->
        <PrimeVueButton
          label="Select Image"
          icon="pi pi-image"
          class="mt-4 shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
          variant="outlined"
          @click="triggerFileInput"
        />

        <div class="grid grid-cols-2 w-full gap-8 mt-8">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="name"
            name="Product Name"
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
              name="Category"
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
                dropdown-icon="pi pi-circle"
                :class="{ ...classes }"
                v-on="useListenerForm(product_formValidations, 'categories')"
              >
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
              name="Price"
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
        </div>
        <div class="grid grid-cols-2 h-fit w-full gap-x-8 mt-8">
          <div class="flex items-center gap-2 col-span-2">
            <PrimeVueCheckbox v-model="product_formData.isDiscount" binary @change="calculateDiscount" />
            <label for="product_formData.isDiscount" class="font-bold"> Add Discount Price </label>
          </div>
          <div class="flex flex-col mt-4" :class="product_formData.isDiscount ? 'block' : 'hidden'">
            <AppBaseFormGroup
              v-slot="{ classes }"
              class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
              is-name-as-label
              label-for="discount_value"
              name="Discount Value"
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
                      dropdown-icon="pi pi-circle"
                      @update:modelValue="calculateDiscount"
                    >
                      <template #option="{ option }">
                        {{ option }}
                      </template>
                    </PrimeVueSelect>
                  </div>
                </div>
                <span
                  >Total Price After Discount : <b> Rp {{ product_formData.discount_price }}</b></span
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
                    name="Variant Name"
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
                      :name="`variants`"
                      class="border shadow-xs border-grayscale-30 rounded-lg w-full"
                      :class="{ ...classes }"
                    />
                  </AppBaseFormGroup>
                </div>

                <div class="flex flex-col">
                  <div class="flex gap-2">
                    <AppBaseFormGroup
                      v-slot="{ classes }"
                      class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                      is-name-as-label
                      label-for="variant-name"
                      name="Variant Name"
                      class="w-full"
                      :validators="
                        useFormValidateEach({
                          validation: product_formValidations.variants,
                          fieldIndex: index,
                          field: 'name',
                        })
                      "
                    >
                      <PrimeVueInputNumber
                        :id="`variant-price-${index}`"
                        v-model="product_formData.variants[index].price"
                        prefix="Rp "
                        fluid
                        :name="`variants.${index}.price`"
                        class="border shadow-xs border-grayscale-30 rounded-lg w-full"
                        :class="{ ...classes }"
                      />
                    </AppBaseFormGroup>
                    <PrimeVueButton
                      icon="pi pi-times"
                      variant="text"
                      severity="danger"
                      @click="removeVariant(index)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <PrimeVueButton
              label="Add Variant"
              icon="pi pi-plus"
              class="mt-4 col-span-2 w-fit text-xl px-8 py-2 text-primary pl-4 bg-transparent border-none font-semibold flex items-center justify-center gap-2"
              @click="addVariant"
            />
          </div>
          <div class="flex gap-4 mb-8">
            <router-link to="/catalog/products">
              <PrimeVueButton
                label="Cancel"
                class="text-xl w-48 py-2 border-2 border-primary cursor-pointer rounded-lg text-primary bg-transparent font-semibold"
                unstyled
              />
            </router-link>
            <PrimeVueButton
              :label="'Add Product'"
              class="text-xl w-48 py-2 cursor-pointer border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
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
            <span><i class="pi pi-trash" style="font-size: 2.5rem"></i></span>
            <h1 class="text-2xl font-semibold">Are you sure you want to leave this page?</h1>
            <p>Any changes you make to the data will be lost if you leave this page without saving</p>
            <div class="flex items-center justify-between gap-4">
              <PrimeVueButton
                class="text-lg w-56 text-primary font-semibold"
                variant="text"
                label="Discard Changes"
                @click="confirmLeave"
              />
              <PrimeVueButton
                variant="text"
                class="w-56 text-lg border-2 border-primary text-primary font-semibold"
                @click="cancelLeave"
                >Cancel</PrimeVueButton
              >
            </div>
          </div>
        </div>
      </template>
    </PrimeVueDialog>
  </div>
</template>

<style lang="scss" scoped></style>
