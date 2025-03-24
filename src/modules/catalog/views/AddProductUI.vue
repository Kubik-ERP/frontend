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
          variant="outlined"
        />
        <div class="grid grid-cols-2 w-full gap-8 mt-8">
          <div class="flex flex-col">
            <label for="name">Product Name</label>
            <input id="name" type="text" class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" />
          </div>
          <div class="flex flex-col">
            <label for="category">Category</label>
            <input id="category" type="text" class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" />
          </div>
          <div class="flex flex-col">
            <label for="price">Price</label>
            <input id="price" type="number" class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-full" />
          </div>
          <div class="flex items-center gap-2 col-span-2">
            <PrimeVueCheckbox v-model="isDiscount" binary />
            <label for="isDiscount" class="font-bold"> Add Discount Price </label>
          </div>
          <div class="flex flex-col  col-span-2" :class="isDiscount ? 'block' : 'hidden'">
            <label for="price">Discount Price</label>
            <input
              id="discount_price"
              type="number"
              class="border shadow-xs border-grayscale-30 rounded-lg p-2 w-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const isDiscount = ref(false);
</script>

<style lang="scss" scoped>
</style>