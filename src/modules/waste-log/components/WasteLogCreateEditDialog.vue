<script setup lang="ts">
// Interfaces
import type { IWasteLogListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const {
  wasteLogList_batchOptions,
  wasteLogList_categoryOptions,
  wasteLogList_formData,
  wasteLogList_formValidations,
  wasteLogList_inventoryItems,
  wasteLogList_isLoadingBatchOptions,
  wasteLogList_isLoadingInventoryItems,
  wasteLogList_onAddWasteLogItem,
  wasteLogList_onDeleteWasteLogItem,
  wasteLogList_onRemovePhoto,
  wasteLogList_onSaveWasteLog,
  wasteLogList_onSelectPhoto,
  wasteLogList_onShowDialogCancelAddOrEditWasteLog,
  wasteLogList_setScrollCallback,
  wasteLogList_uomOptions,
} = inject('wasteLogList') as IWasteLogListProvided;

/**
 * @description Reactive variables for file input refs and item refs
 */
const fileInputRefs = ref<Record<number, HTMLInputElement>>({});
const itemRefs = ref<Record<number, HTMLElement>>({});

/**
 * @description Set up scroll callback on component mount
 */
onMounted(() => {
  wasteLogList_setScrollCallback((index: number) => {
    const element = itemRefs.value[index];
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  });
});
</script>

<template>
  <AppBaseDialog id="waste-log-add-or-edit-waste-log-dialog">
    <template #header>
      <h5 class="font-semibold text-black text-lg">Waste Record</h5>
    </template>

    <template #content>
      <section id="content" class="flex flex-col gap-4 w-full">
        <section id="batch" class="w-full">
          <AppBaseFormGroup
            v-slot="{ classes }"
            class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
            is-name-as-label
            label-for="batch"
            name="Batch"
            :validators="wasteLogList_formValidations.batchId"
          >
            <PrimeVueDropdown
              v-model="wasteLogList_formData.batchId"
              :options="wasteLogList_batchOptions"
              :loading="wasteLogList_isLoadingBatchOptions"
              option-label="batchName"
              :option-value="(option: any) => option"
              placeholder="Select Recipe Batch"
              class="text-sm w-full"
              :class="{ ...classes }"
            >
              <template #value="slotProps">
                <div v-if="slotProps.value && typeof slotProps.value === 'object'" class="flex flex-col">
                  <span class="font-medium text-sm">{{ slotProps.value.menu_recipes.recipe_name }}</span>

                  <span class="text-xs text-gray-500">
                    Date: {{ new Date(slotProps.value.date).toLocaleDateString() }} | Status:
                    {{ slotProps.value.status }}
                  </span>
                </div>
                <span v-else>{{ slotProps.placeholder }}</span>
              </template>

              <template #option="slotProps">
                <div class="flex flex-col">
                  <span class="font-medium text-sm">{{ slotProps.option.menu_recipes.recipe_name }}</span>
                  <span class="text-xs text-gray-500">
                    Date: {{ new Date(slotProps.option.date).toLocaleDateString() }} | Status:
                    {{ slotProps.option.status }}
                  </span>
                </div>
              </template>
            </PrimeVueDropdown>
          </AppBaseFormGroup>
        </section>

        <section id="waste-logs" class="flex flex-col gap-4 w-full">
          <div class="flex items-center justify-between">
            <h6 class="font-semibold text-black text-base">Waste Log</h6>
            <PrimeVueButton
              class="bg-primary border-none text-sm py-2 px-4"
              label="Add Item"
              type="button"
              @click="wasteLogList_onAddWasteLogItem"
            />
          </div>

          <div v-if="wasteLogList_formData.wasteLogs.length === 0" class="text-center py-8">
            <p class="text-gray-500 mb-4">No waste log items added yet.</p>
            <PrimeVueButton
              class="bg-primary border-none text-sm py-2 px-4"
              label="Add First Item"
              type="button"
              @click="wasteLogList_onAddWasteLogItem"
            />
          </div>

          <section
            v-for="(wasteLog, wasteLogIndex) in wasteLogList_formData.wasteLogs"
            v-else
            id="content"
            :key="`waste-log-${wasteLogIndex}`"
            :ref="
              (el: any) => {
                if (el) itemRefs[wasteLogIndex] = el;
              }
            "
            class="grid grid-rows-1 grid-cols-12 gap-4 px-4 pt-9 border border-gray-200 rounded-lg relative"
          >
            <!-- Delete Button -->
            <PrimeVueButton
              class="absolute top-2 right-2 !w-8 !h-8 !p-0 bg-red-500 border-none hover:bg-red-600"
              icon="pi pi-times"
              severity="danger"
              size="small"
              @click="wasteLogList_onDeleteWasteLogItem(wasteLogIndex)"
            />
            <section id="product-item" class="col-span-12 md:col-span-6">
              <AppBaseFormGroup
                v-slot="{ classes }"
                class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                is-name-as-label
                label-for="itemId"
                name="Item"
                :validators="
                  useFormValidateEach({
                    validation: wasteLogList_formValidations.wasteLogs,
                    fieldIndex: wasteLogIndex,
                    field: 'itemId',
                  })
                "
              >
                <PrimeVueSelect
                  id="itemId"
                  v-model="wasteLog.itemId"
                  filter
                  :loading="wasteLogList_isLoadingInventoryItems"
                  :options="wasteLogList_inventoryItems"
                  option-label="itemName"
                  option-value="id"
                  placeholder="Select Item"
                  class="[&>span]:text-sm text-black w-full"
                  :class="{ ...classes }"
                  :pt="{
                    optionLabel: 'text-sm',
                  }"
                  v-on="useListenerFormEach(wasteLogList_formValidations.wasteLogs, wasteLogIndex, 'itemId')"
                />
              </AppBaseFormGroup>
            </section>

            <section id="quantity" class="col-span-12 md:col-span-6 w-full">
              <AppBaseFormGroup
                v-slot="{ classes }"
                class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                is-name-as-label
                label-for="quantity"
                name="Quantity"
                :validators="
                  useFormValidateEach({
                    validation: wasteLogList_formValidations.wasteLogs,
                    fieldIndex: wasteLogIndex,
                    field: 'quantity',
                  })
                "
              >
                <PrimeVueInputNumber
                  id="quantity"
                  v-model="wasteLog.quantity"
                  mode="decimal"
                  :min-fraction-digits="0"
                  :max-fraction-digits="2"
                  placeholder="0"
                  class="text-sm w-full"
                  :class="{ ...classes }"
                  v-on="useListenerFormEach(wasteLogList_formValidations.wasteLogs, wasteLogIndex, 'quantity')"
                />
              </AppBaseFormGroup>
            </section>

            <section id="unit-of-measurement" class="col-span-12 md:col-span-6 w-full">
              <AppBaseFormGroup
                v-slot="{ classes }"
                class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                is-name-as-label
                label-for="unit"
                name="Unit of Measurement"
                :validators="
                  useFormValidateEach({
                    validation: wasteLogList_formValidations.wasteLogs,
                    fieldIndex: wasteLogIndex,
                    field: 'uom',
                  })
                "
              >
                <PrimeVueSelect
                  id="unit"
                  v-model="wasteLog.uom"
                  filter
                  :options="wasteLogList_uomOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Unit"
                  class="[&>span]:text-sm text-black w-full"
                  :class="{ ...classes }"
                  :pt="{
                    optionLabel: 'text-sm',
                  }"
                  v-on="useListenerFormEach(wasteLogList_formValidations.wasteLogs, wasteLogIndex, 'uom')"
                />
              </AppBaseFormGroup>
            </section>

            <section id="category" class="col-span-12 md:col-span-6 w-full">
              <AppBaseFormGroup
                v-slot="{ classes }"
                class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
                is-name-as-label
                label-for="category"
                name="Category"
                :validators="
                  useFormValidateEach({
                    validation: wasteLogList_formValidations.wasteLogs,
                    fieldIndex: wasteLogIndex,
                    field: 'category',
                  })
                "
              >
                <PrimeVueSelect
                  id="category"
                  v-model="wasteLog.category"
                  filter
                  :options="wasteLogList_categoryOptions"
                  option-label="label"
                  option-value="value"
                  placeholder="Select Category"
                  class="[&>span]:text-sm text-black w-full"
                  :class="{ ...classes }"
                  :pt="{
                    optionLabel: 'text-sm',
                  }"
                  v-on="useListenerFormEach(wasteLogList_formValidations.wasteLogs, wasteLogIndex, 'category')"
                />
              </AppBaseFormGroup>
            </section>

            <section id="photo" class="col-span-full flex items-center justify-center w-full">
              <div class="flex flex-col items-center justify-center mb-4">
                <p class="text-sm font-medium text-gray-900 mb-2">
                  {{ useLocalization('items.form.photo.label') }}
                </p>

                <div v-if="wasteLog.photoPreview" class="mb-4">
                  <AppBaseImage
                    :src="wasteLog.photoPreview"
                    alt="Photo"
                    class="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>

                <div
                  v-else
                  class="w-32 h-32 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center mb-4"
                >
                  <span class="text-gray-500 text-sm">No Photo</span>
                </div>

                <input
                  :ref="
                    el => {
                      if (el) fileInputRefs[wasteLogIndex] = el as HTMLInputElement;
                    }
                  "
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="wasteLogList_onSelectPhoto(wasteLogIndex, $event)"
                />

                <div class="flex items-center justify-center gap-2">
                  <PrimeVueButton
                    :label="useLocalization('items.form.photo.button')"
                    class="shadow-xs hover:bg-transparent rounded-xl px-4 py-2 text-primary border-primary border-2 text-sm"
                    variant="outlined"
                    @click="fileInputRefs[wasteLogIndex]?.click()"
                  />
                  <PrimeVueButton
                    v-if="wasteLog.photoPreview"
                    :label="useLocalization('items.form.photo.delete')"
                    class="shadow-xs hover:bg-transparent rounded-xl px-4 py-2 text-red-600 border-red-600 border-2 text-sm"
                    variant="outlined"
                    @click="wasteLogList_onRemovePhoto(wasteLogIndex)"
                  />
                </div>
              </div>
            </section>

            <section id="notes" class="col-span-full w-full flex flex-col mb-4">
              <label for="notes" class="font-normal text-sm text-gray-900 mb-2"> Notes </label>

              <PrimeVueIconField>
                <PrimeVueTextarea
                  id="notes"
                  v-model="wasteLog.notes"
                  placeholder="Describe the waste..."
                  class="text-sm w-full"
                  rows="3"
                />
              </PrimeVueIconField>
            </section>
          </section>
        </section>
      </section>
    </template>

    <template #footer>
      <footer class="flex items-center justify-end w-full gap-4">
        <PrimeVueButton
          class="font-semibold text-base text-primary w-full max-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
          label="Cancel"
          severity="secondary"
          variant="outlined"
          @click="wasteLogList_onShowDialogCancelAddOrEditWasteLog"
        />

        <PrimeVueButton
          class="bg-primary border-none text-base py-[10px] w-full max-w-40"
          label="Save"
          type="button"
          :disabled="wasteLogList_formData.wasteLogs.length === 0"
          @click="wasteLogList_onSaveWasteLog"
        />
      </footer>
    </template>
  </AppBaseDialog>
</template>
