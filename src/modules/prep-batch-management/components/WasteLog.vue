<script setup lang="ts">
// --- MODIFIED ---
import { ref, onUnmounted, watch, inject } from 'vue';
// -------------

// interfaces
import type { IBatchListProvided } from '../interfaces';

/**
 * @description Inject all the data and methods what we need
 */
const { batch_wasteLog_formData, batchDetail_values } = inject<IBatchListProvided>('batchDetails')!;

// constants
import { WASTE_LOG_CATEGORIES } from '../constants';
import { ITEM_UNIT_DROPDOWN } from '@/modules/items/constants';

// Define a type for our waste log entry for better type-safety
interface WasteLogEntry {
  item: number | null;
  quantity: number | null;
  uom: string | null;
  category: number | null; // This is the ID from the dropdown
  photo: File | null;
  photoPreviewUrl: string | null; // <-- To store the preview URL
  notes: string | null;
}

// Helper function to create a new, empty log entry
const createEmptyWasteLog = (): WasteLogEntry => ({
  item: null,
  quantity: null,
  uom: null,
  category: null,
  photo: null,
  photoPreviewUrl: null, // <-- Default to null
  notes: null,
});

// Main state for the UI, initialized with one empty log
// This ref is *only* for the UI logic
const wasteLogs = ref<WasteLogEntry[]>([createEmptyWasteLog()]);

// Moved item options here from the template
const mockItems = batchDetail_values.value?.batch_cooking_recipe_ingredient.map(item => ({
  id: item.ingredients.master_inventory_items.id,
  name: item.ingredients.master_inventory_items.name,
}));

// --- ADDED: This is the magic! ---
// This watch syncs your UI's `wasteLogs` ref with the injected `batch_wasteLog_formData`
watch(
  wasteLogs,
  currentWasteLogs => {
    if (!batch_wasteLog_formData) return;

    // 1. Map the UI data (with Files, numbers, etc.)
    //    to the service data structure (with strings, nulls, etc.)
    const newServiceItems = currentWasteLogs
      .filter(log => log.item !== null || log.quantity !== null || log.category !== null) // Only add non-empty rows
      .map(log => ({
        inventoryItemId: String(log.item ?? ''), // Convert item ID (number) to string
        quantity: log.quantity ?? 0,
        uom: log.uom ?? '',
        category: log.category?.toString() ?? '', // Convert category ID (number) to name (string)
        notes: log.notes ?? null,

        // IMPORTANT: File upload is a separate process.
        // We are storing the `log.photo` File object in the UI state,
        // but the service state `photoUrl` will be null for now.
        // You'll need a separate function to upload `log.photo`
        // and get a URL to save here.
        photoUrl: null,
      }));

    // 2. Update the injected service object
    batch_wasteLog_formData.wasteLog.items = newServiceItems;
  },
  { deep: true }, // 'deep' ensures the watch triggers on any change inside the array
);
// --- END ADDED ---

// Function to add a new, empty form row
function addWasteRow() {
  wasteLogs.value.push(createEmptyWasteLog());
}

// Function to remove a form row by its index
function removeWasteRow(index: number) {
  // Ensure we revoke URL on remove
  const logToRemove = wasteLogs.value[index];
  if (logToRemove.photoPreviewUrl) {
    URL.revokeObjectURL(logToRemove.photoPreviewUrl);
  }

  if (wasteLogs.value.length > 1) {
    wasteLogs.value.splice(index, 1);
  } else {
    // Or, if you prefer, just reset the last row
    clearPhoto(0); // <-- Use clearPhoto to handle reset
    wasteLogs.value[0] = createEmptyWasteLog();
  }
}

// Array to store refs for each file input, so we can trigger them
const fileInputRefs = ref<HTMLInputElement[]>([]);

// Function to trigger the hidden file input click
function triggerFileInput(index: number) {
  fileInputRefs.value[index]?.click();
}

// Function to handle file selection
function handleFileChange(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  const log = wasteLogs.value[index]; // Revoke old URL if one exists, to prevent memory leaks

  if (log.photoPreviewUrl) {
    URL.revokeObjectURL(log.photoPreviewUrl);
  }

  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    log.photo = file; // Create a new local URL for the selected file
    log.photoPreviewUrl = URL.createObjectURL(file);
  } else {
    log.photo = null;
    log.photoPreviewUrl = null;
  }
}

// Function to clear a selected photo
function clearPhoto(index: number) {
  const log = wasteLogs.value[index]; // Revoke the URL to free up memory

  if (log.photoPreviewUrl) {
    URL.revokeObjectURL(log.photoPreviewUrl);
  }

  log.photo = null;
  log.photoPreviewUrl = null; // Also reset the file input value to allow selecting the same file again

  if (fileInputRefs.value[index]) {
    fileInputRefs.value[index].value = '';
  }
}

// Clean up all preview URLs when component is unmounted
onUnmounted(() => {
  wasteLogs.value.forEach(log => {
    if (log.photoPreviewUrl) {
      URL.revokeObjectURL(log.photoPreviewUrl);
    }
  });
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="font-semibold text-2xl text-text-primary flex items-center gap-1">
      Waste Log
      <p class="text-text-disabled">(Optional)</p>
    </h1>

    <section
      v-for="(wasteLog, index) in wasteLogs"
      :key="index"
      class="flex flex-col gap-2 border-b border-gray-200 pb-4"
    >
      <div class="grid grid-cols-2 gap-4">
        <AppBaseFormGroup
          v-slot="{ classes }"
          class-label="block text-sm font-medium leading-6 text-gray-900 w-full"
          is-name-as-label
          label-for="item"
          :name="`Item ${index + 1}`"
          spacing-bottom="mb-0"
        >
          <PrimeVueSelect
            v-model="wasteLog.item"
            :options="mockItems"
            option-label="name"
            option-value="id"
            placeholder="Select item"
            class="text-sm w-full"
            :class="{ ...classes }"
          />
        </AppBaseFormGroup>

        <div v-if="wasteLogs.length > 1" class="flex justify-end">
          <PrimeVueButton label="" severity="danger" variant="text" class="text-sm" @click="removeWasteRow(index)">
            <template #icon>
              <AppBaseSvg name="trash" class="!w-4 !h-4" />
            </template>
          </PrimeVueButton>
        </div>
      </div>

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
          <PrimeVueInputNumber v-model="wasteLog.quantity" class="w-full" :min="0" :class="{ ...classes }" />
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
            v-model="wasteLog.uom"
            :options="ITEM_UNIT_DROPDOWN"
            option-label="label"
            option-value="value"
            placeholder="Select UOM"
            class="text-sm w-full"
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
            v-model="wasteLog.category"
            :options="WASTE_LOG_CATEGORIES"
            option-label="label"
            option-value="value"
            placeholder="Select category"
            class="text-sm w-full"
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
          <input
            :ref="
              el => {
                if (el) fileInputRefs[index] = el as HTMLInputElement;
              }
            "
            type="file"
            class="hidden"
            accept="image/*"
            @change="handleFileChange($event, index)"
          />

          <div class="w-full">
            <div
              v-if="wasteLog.photoPreviewUrl"
              class="relative w-40 h-40 rounded-md overflow-hidden border border-gray-200"
            >
              <img
                :src="wasteLog.photoPreviewUrl"
                alt="Photo preview"
                class="w-full h-full object-cover cursor-pointer"
                @click="triggerFileInput(index)"
              />
              <PrimeVueButton
                icon="pi pi-times"
                severity="danger"
                class="!absolute !top-1 !right-1 !w-6 !h-6 !p-0 !min-w-0"
                rounded
                @click.stop="clearPhoto(index)"
              />
            </div>

            <PrimeVueButton
              v-else
              label="Upload Photo"
              class="text-sm text-primary w-fit min-w-40 border border-solid border-primary basic-smooth-animation hover:bg-grayscale-10"
              severity="secondary"
              variant="outlined"
              type="button"
              @click="triggerFileInput(index)"
            >
              <template #icon>
                <AppBaseSvg name="image" class="!w-4 !h-4 filter-primary-color" />
              </template>
            </PrimeVueButton>
          </div>
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
          <PrimeVueTextarea v-model="wasteLog.notes" class="w-full" :class="{ ...classes }" />
        </AppBaseFormGroup>
      </div>
    </section>

    <footer>
      <PrimeVueButton
        class="text-primary text-sm"
        label="Add Waste"
        type="button"
        variant="text"
        @click="addWasteRow"
      >
        <template #icon>
          <AppBaseSvg name="plus-line" class="!w-4 !h-4 filter-primary-color" />
        </template>
      </PrimeVueButton>
    </footer>
  </div>
</template>
