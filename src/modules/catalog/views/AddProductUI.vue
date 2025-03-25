<template>
  <div class="container mx-auto">
    <div class="flex flex-col gap-4">
      <h1 class="text-2xl font-bold">Products Detail</h1>
      <h2 class="text-xl font-semibold">Product Information</h2>

      <div class="flex flex-col items-center justify-center">
        <p>Photo (Optional)</p>
        <img class="rounded-lg mt-2" src="https://placehold.co/250" alt="Photo" />
        <PrimeVueButton
          label="Select Image"
          icon="pi pi-image"
          class="mt-4 shadow-xs hover:bg-transparent rounded-xl px-8 py-2 text-primary border-primary border-2"
          :select-all="false"
          variant="outlined"
        />
        <div class="grid grid-cols-2 w-full gap-8 mt-8">
          <div class="flex flex-col">
            <label for="name">Product Name</label>
            <PrimeVueInputText
              id="name"
              type="text"
              class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full"
            />
          </div>
          <div class="flex flex-col">
            <label for="category">Category</label>
            <PrimeVueMultiSelect
              v-model="selectedCategories"
              display="chip"
              :options="categories"
              filter
              option-label="name"
              placeholder="Select"
              class="w-full text-primary"
            />
          </div>
          <div class="flex flex-col">
            <label for="price">Price</label>
            <PrimeVueInputNumber
              id="price"
              type="number"
              prefix="Rp "
              fluid
              class="border shadow-xs border-grayscale-30 rounded-lg"
            />
          </div>
          <div class="flex items-center gap-2 col-span-2">
            <PrimeVueCheckbox v-model="isDiscount" binary />
            <label for="isDiscount" class="font-bold"> Add Discount Price </label>
          </div>
          <div class="flex flex-col" :class="isDiscount ? 'block' : 'hidden'">
            <label for="price">Discount Price</label>
            <PrimeVueInputNumber
              id="discount_price"
              class="border w-full shadow-xs border-grayscale-30 rounded-lg"
            />
          </div>
          <span></span>
          <div>
            <div class="relative w-full">
              <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full">
                <!-- Number Input -->
                <PrimeVueInputNumber
                  v-model="numberValue"
                  class="flex-1 ring-0 border-none focus:ring-0"
                  input-class="w-full px-2 py-1 pr-10"
                />

                <!-- Dropdown inside the input box (Absolute positioned) -->
                <div class="absolute right-2 flex items-center">
                  <PrimeVueDropdown
                    v-model="selectedDiscountUnit"
                    :options="['Rp', '%']"
                    class=" border-none w-fit bg-transparent text-gray-600"
                    dropdown-icon="pi pi-circle"
                  >
                    <template #value="data">
                      <div>
                        {{data.value}}
                      </div>
                    </template>
                    <template #option="data">
                      <div class="w-fit ">
                        {{data.option}}
                      </div>
                    </template>
                  </PrimeVueDropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isDiscount = ref(false);
const selectedCategories = ref();
const categories = ref([
  { name: 'Category 1' },
  { name: 'Category 2' },
  { name: 'Category 3' },
  { name: 'Category 4' },
  { name: 'Category 5' },
  { name: 'Category 6' },
  { name: 'Category 7' },
  { name: 'Category 8' },
  { name: 'Category 9' },
  { name: 'Category 10' },
]);

const selectedDiscountUnit = ref()

</script>

<style lang="scss" scoped>
</style>