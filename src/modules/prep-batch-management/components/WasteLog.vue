<script setup lang="ts">
// constants
import { ITEM_UNIT_DROPDOWN } from '@/modules/items/constants';
const wasteLog_formData = reactive({
  item: null,
  quantity: null,
  uom: null,
  category: null,
  photo: null,
  notes: null,
});
</script>
<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-semibold text-2xl text-text-primary flex items-center gap-1">
      Waste Log
      <p class="text-text-disabled">(Optional)</p>
    </h1>

    <section class="flex flex-col gap-2">
      <AppBaseFormGroup
        v-slot="{ classes }"
        class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
        is-name-as-label
        label-for="item"
        name="Item"
        spacing-bottom="mb-0"
      >
        <!-- dropdown -->
        <PrimeVueSelect
          v-model="wasteLog_formData.item"
          :options="[
            { id: 1, name: 'Item 1' },
            { id: 2, name: 'Item 2' },
          ]"
          option-label="name"
          option-value="id"
          placeholder="Select item"
          class="text-sm  w-full"
          :class="{ ...classes }"
        />
      </AppBaseFormGroup>

      <div class="grid grid-cols-2 gap-4 pl-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="quantity"
          name="Quantity"
          spacing-bottom="mb-0"
          class=""
        >
          <PrimeVueInputNumber
            v-model="wasteLog_formData.quantity"
            class="w-full"
            :min="0"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="uom"
          name="UOM"
          spacing-bottom="mb-0"
          class=""
        >
          <PrimeVueSelect
            v-model="wasteLog_formData.uom"
            :options="ITEM_UNIT_DROPDOWN"
            option-label="label"
            option-value="value"
            placeholder="Select UOM"
            class="text-sm  w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="category"
          name="Category"
          spacing-bottom="mb-0"
          class=""
        >
          <PrimeVueSelect
            v-model="wasteLog_formData.category"
            :options="[
              { id: 1, name: 'Category 1' },
              { id: 2, name: 'Category 2' },
            ]"
            option-label="name"
            option-value="id"
            placeholder="Select category"
            class="text-sm  w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <AppBaseFormGroup
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="photo"
          name="Photo (Optional)"
          spacing-bottom="mb-0"
          class=""
        >
          <PrimeVueButton
            label="Upload Photo"
            class="text-sm text-primary w-fit min-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
            severity="secondary"
            variant="outlined"
          >
            <template #icon>
              <AppBaseSvg name="image" class="!w-4 !h-4 filter-primary-color" />
            </template>
          </PrimeVueButton>
        </AppBaseFormGroup>

        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="notes"
          name="Notes"
          spacing-bottom="mb-0"
          class="col-span-2"
        >
          <PrimeVueTextarea v-model="wasteLog_formData.notes" class="w-full" :class="{ ...classes }" />
        </AppBaseFormGroup>
      </div>
    </section>

    <footer>
      <!-- actions add waste button -->
      <PrimeVueButton class="text-primary text-sm" label="Add Waste" type="reset" variant="text">
        <template #icon>
          <AppBaseSvg name="plus-line" class="!w-4 !h-4 filter-primary-color" />
        </template>
      </PrimeVueButton>
    </footer>
  </div>
</template>
