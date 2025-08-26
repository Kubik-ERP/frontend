<script setup lang="ts">
import { ref } from 'vue';
import { IInventoryItems } from '../interfaces';

const step = ref<1 | 2 | 3>(1);
const file = ref<File | null>(null);
const previewData = ref<IInventoryItems[]>([]); // contoh hasil parsing CSV/XLS
const errorRows = ref<number[]>([]);

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files?.length) {
    file.value = target.files[0];
    // TODO: parse file jadi previewData.value
    step.value = 2;
  }
};

const handleImport = () => {
  // simulasi validasi error
  errorRows.value = [5]; // misal row ke-5 error
  if (errorRows.value.length > 0) {
    step.value = 3;
  } else {
    // TODO: submit data ke API
  }
};
</script>

<template>
  <AppBaseDialog
    id="item-import-file-modal"
    :style="{ width: '80vw', maxWidth: '1000px', }"
    :dismissable-mask="true"
  >
    <template #header>
      <h2 class="font-semibold text-lg">Import File</h2>
    </template>

    <template #content>
      <div class="h-80vh border border-grayscale-10">
        <!-- Step 1: Upload -->
        <section v-if="step === 1" class="flex flex-col items-center justify-center gap-4 py-10 h-[400px]">
          <div class="rounded-lg w-full flex flex-col items-center justify-center cursor-pointer">
            <i class="pi pi-paperclip text-4xl text-gray-400 mb-3"></i>
            <p class="text-gray-500 text-sm">
              Drop your CSV/XLSX file here or
              <span class="text-primary underline cursor-pointer">click</span> to browse from your device.
            </p>
            <input type="file" accept=".csv,.xls,.xlsx" class="hidden" @change="handleFileUpload" />
          </div>

          <div class="flex flex-col items-center gap-2">
            <span class="text-gray-400">or</span>
            <PrimeVueButton
              icon="pi pi-download"
              label="Download Template"
              class="bg-white border border-primary text-primary px-4 py-2"
            />
          </div>
        </section>

        <!-- Step 2 & 3: Preview -->
        <section v-else>
          <table class="w-full border border-gray-200">
            <thead>
              <tr class="bg-gray-100 text-sm text-left">
                <th class="p-2">No</th>
                <th class="p-2">Item Name</th>
                <th class="p-2">Category</th>
                <th class="p-2">Brand</th>
                <th class="p-2">Stock</th>
                <th class="p-2">Price</th>
                <th class="p-2">Expiry Date</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in previewData"
                :key="index"
                :class="['border-t text-sm', errorRows.includes(index) ? 'bg-red-50 text-red-600' : '']"
              >
                <td class="p-2">{{ index + 1 }}</td>
                <td class="p-2">{{ row }}</td>
                <td class="p-2">{{ row.category }}</td>
                <td class="p-2">{{ row.brand }}</td>
                <td class="p-2">{{ row.stockQuantity }}</td>
                <td class="p-2">{{ row.pricePerUnit }}</td>
                <td class="p-2">{{ row.expiryDate }}</td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <PrimeVueButton label="Previous" class="px-4 py-2" />
            <PrimeVueButton label="Next" class="px-4 py-2" />
          </div>

          <!-- Error message (Step 3) -->
          <div v-if="step === 3 && errorRows.length" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
            Some rows contain errors. Please fix them before proceeding.
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <PrimeVueButton 
        label="Cancel" 
        class="px-4 py-2 bg-white border border-primary text-primary" 
        />
        <PrimeVueButton
          label="Import"
          class="px-4 py-2 bg-primary text-white disabled:bg-gray-400 disabled:text-white disabled:border-none"
          :disabled="step === 1 && !file"
          @click="handleImport"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>
