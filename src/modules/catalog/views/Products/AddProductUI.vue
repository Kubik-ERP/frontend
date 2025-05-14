<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Products Detail</h1>
      <h2 class="text-xl font-semibold">Product Information</h2>
      <div class="flex flex-col items-center justify-center">
        <p>Photo (Optional)</p>
        {{ product }}
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
          <div class="flex flex-col">
            <label for="name">Product Name</label>
            <PrimeVueInputText
              v-model="product.name"
              type="text"
              class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
            />
          </div>
          <div class="flex flex-col">
            <label for="category">Category</label>
            <PrimeVueMultiSelect
              v-model="product.category"
              display="chip"
              :options="categories"
              option-label="category"
              filter
              placeholder="Select"
              class="w-full text-primary"
              dropdown-icon="pi pi-circle"
            >
              <template #option="{ option }">
                {{ option.category }}
              </template>
            </PrimeVueMultiSelect>
          </div>
          <div class="flex flex-col">
            <label for="price">Price</label>
            <PrimeVueInputNumber
              v-model="product.price"
              prefix="Rp "
              fluid
              class="border shadow-xs border-grayscale-30 rounded-lg"
              @change="calculateDiscount"
            />
          </div>
          <span></span>
        </div>
        <div class="grid grid-cols-2 h-fit w-full gap-x-8 mt-8">
          <div class="flex items-center gap-2 col-span-2">
            <PrimeVueCheckbox v-model="product.isDiscount" binary @change="calculateDiscount" />
            <label for="product.isDiscount" class="font-bold"> Add Discount Price </label>
          </div>
          <div class="flex flex-col mt-4" :class="product.isDiscount ? 'block' : 'hidden'">
            <label for="price">Discount Price</label>
            <div class="relative w-full">
              <div
                class="flex items-center border shadow-xs border-grayscale-30 rounded-lg overflow-hidden w-full"
              >
                <PrimeVueInputNumber
                  v-model="product.discount_value"
                  class="w-full"
                  :prefix="product.discount_unit === 'Rp' ? 'Rp ' : ''"
                  :suffix="product.discount_unit === '%' ? ' %' : ''"
                  @change="calculateDiscount"
                />
                <div class="absolute right-0 flex items-center rounded-lg border-none ring-0">
                  <PrimeVueSelect
                    v-model="product.discount_unit"
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
                >Total Price After Discount : <b> Rp {{ product.discount_price }}</b></span
              >
            </div>
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
              <div v-for="(variant, index) in product.variants" :key="index" class="grid grid-cols-2 gap-x-8">
                <div class="flex flex-col">
                  <label for="name">Variant Name</label>
                  <PrimeVueInputText v-model="variant.name" type="text" />
                </div>
                <div class="flex flex-col">
                  <label for="price">Variant Price</label>
                  <div class="flex gap-2">
                    <PrimeVueInputNumber v-model="variant.price" prefix="Rp " fluid />
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
          <div class="flex gap-4">
            <PrimeVueButton
              label="Cancel"
              class="text-xl w-48 py-2 border-2 border-primary rounded-lg text-primary bg-transparent font-semibold"
              unstyled
            />
            <PrimeVueButton
              label="Add Product"
              class="text-xl w-48 py-2 border-2 border-primary rounded-lg text-white bg-primary font-semibold"
              unstyled
              @click="handleCreateProduct"
            />
          </div>
        </div>
      </div>
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
import { createProduct } from '@/modules/catalog/services/Product/ProductServices';
import { getAllCategories } from '@/modules/catalog/services/Category/categoryService';

const product = reactive({
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
      previewImage.value = reader.result;
      // product.image = reader.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleCreateProduct = async () => {
  try {
    const response = await createProduct(product);
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
  if (!product.isDiscount) {
    product.discount_price = 0;
  }

  if (product.isDiscount) {
    if (product.discount_unit === 'Rp') {
      product.discount_price = product.price - product.discount_value;
    } else {
      product.discount_price = product.price - (product.price * product.discount_value) / 100;
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
    const response = await getAllCategories();
    categories.value = response;
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