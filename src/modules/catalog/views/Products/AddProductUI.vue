<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Products Detail</h1>
      <h2 class="text-xl font-semibold">Product Information</h2>
      {{ product_formData }}
      <form class="flex flex-col items-center justify-center" @submit.prevent="handleCreateProduct">
        <p>Photo (Optional)</p>
        <img
          class="rounded-lg mt-2 w-64 h-64 object-cover"
          :src="previewImage || 'https://placehold.co/250'"
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
              name="Category"
              :validators="product_formValidations.category_ids"
            >
              <PrimeVueMultiSelect
                v-model="product_formData.category_ids"
                name="category"
                display="chip"
                :options="categories"
                option-label="category"
                option-value="id"
                filter
                placeholder="Select"
                class="w-full text-primary"
                dropdown-icon="pi pi-circle"
                :class="classes ? '' : ''"
                v-on="useListenerForm(product_formValidations, 'category_ids')"
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
                    :prefix="product_formData.discount_unit === 'Rp' ? 'Rp ' : ''"
                    :suffix="product_formData.discount_unit === '%' ? ' %' : ''"
                    :class="classes ? '' : ''"
                    @change="calculateDiscount"
                    v-on="useListenerForm(product_formValidations, 'discount_value')"
                  />
                  <div class="absolute right-0 flex items-center rounded-lg border-none ring-0">
                    <PrimeVueSelect
                      v-model="product_formData.discount_unit"
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
                  <label :for="`variant-name-${index}`">Variant Name</label>
                  <PrimeVueInputText
                    :id="`variant-name-${index}`"
                    v-model="variant.name"
                    :name="`variants.${index}.name`"
                  />
                </div>

                <div class="flex flex-col">
                  <label :for="`variant-price-${index}`">Variant Price</label>
                  <div class="flex gap-2">
                    <PrimeVueInputNumber
                      :id="`variant-price-${index}`"
                      v-model="variant.price"
                      prefix="Rp "
                      fluid
                      :name="`variants.${index}.price`"
                    />
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
            <PrimeVueButton
              label="Cancel"
              class="text-xl w-48 py-2 border-2 border-primary rounded-lg text-primary bg-transparent font-semibold"
              unstyled
            />
            <PrimeVueButton
              :label="product.id ? 'Edit Product' : 'Add Product'"
              class="text-xl w-48 py-2 border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
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

<script setup>
import { useProductService } from '@/modules/catalog/services/Product/ProductServices';
import { useCategoryService } from '../../services/Category/CategoryService';
const route = useRoute();
// const router = useRouter();

const { getAllCategories } = useCategoryService();
const { createProduct, product_formData, product_formValidations } = useProductService();

const product = reactive({
  id: null,
  image: '',
  name: '',
  category: [],
  price: 0,
  isDiscount: false,
  discount_value: 0,
  discount_unit: 'Rp',
  discount_price: 0,
  variants: [],
});

// const resolver = ({ values }) => {
//   const errors = {};

//   if (!values.username) {
//     errors.name = [{ message: 'Name is required.' }];
//   }
//   if (!values.category || values.category.length === 0) {
//     errors.category = [{ message: 'Category is required.' }];
//   }
//   if (!values.price) {
//     errors.price = [{ message: 'Price is required.' }];
//   }
//   if (product.isDiscount) {
//     if (!values.discount_value) {
//       errors.discount_value = [{ message: 'Discount value is required.' }];
//     }
//     if (!values.discount_unit) {
//       errors.discount_unit = [{ message: 'Discount unit is required.' }];
//     }
//   }

//   values.variants?.forEach((v, i) => {
//     if (!v.name) {
//       errors[`variants.${i}.name`] = [{ message: 'Variant name is required.' }];
//     }
//     if (!v.price) {
//       errors[`variants.${i}.price`] = [{ message: 'Variant price is required.' }];
//     }
//   });

//   console.log('errors:', errors);

//   return {
//     values,
//     errors,
//   };
// };

const previewImage = ref(null);
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
  try {
    const response = await createProduct(product_formData);
    console.log(response);
  } catch (error) {
    console.log(error);
  }
};

const categories = ref([]);

const toggleVariant = ref(false);

const addVariant = () => {
  console.log('add variant');
  product.variants.push({
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
    if (product_formData.discount_unit === 'Rp') {
      product_formData.discount_price = product_formData.price - product_formData.discount_value;
    } else {
      product_formData.discount_price =
        product_formData.price - (product_formData.price * product_formData.discount_value) / 100;
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

// const loadProduct = async () => {
//   try {
//     const response = await getProductByID();
//     products.value = response;
//   } catch (error) {
//     console.error('Failed to load products:', error);
//   }
// };

const loadCategories = async () => {
  try {
    const response = await getAllCategories();
    categories.value = response;
  } catch (error) {
    console.error('Failed to load categories:', error);
  }
};

onMounted(async () => {
  loadCategories();
  product.id = route.params.id || null;
  // loadProduct();
});

const cancelLeave = () => {
  isLeavingModal.value = false;
  nextRoute.value = null;
  hasConfirmedLeave = false;
};

onBeforeRouteLeave((to, from, next) => {
  console.log('onBeforeRouteLeave triggered', isLeavingModal.value, hasConfirmedLeave);

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

watch(product, () => {
  calculateDiscount();
});
</script>


<style lang="scss" scoped>
</style>