<script setup lang="ts">
// Interfaces
import type { IIntegrationProvided } from '../interfaces/integration.interface';

/**
 * @description Inject all the data and methods what we need
 */
const {
  integration_fileInputRef,
  integration_formData,
  integration_formValidations,
  integration_isLoading,
  integration_onDragLeave,
  integration_onDragOver,
  integration_onDrop,
  integration_onFileSelect,
  integration_onRemoveFile,
  integration_onSubmit,
  integration_previewUrl,
  integration_triggerFileInput,
} = inject<IIntegrationProvided>('integration')!;
</script>

<template>
  <section id="static-qr-code-content" class="flex flex-col col-span-full lg:col-span-6 gap-2">
    <header class="flex items-center gap-2 w-full">
      <h5 class="font-semibold text-black text-lg">Static QR Code</h5>

      <PrimeVueToggleSwitch v-model:model-value="integration_formData.isStatic" />
    </header>

    <PrimeVueCard class="w-full border border-solid border-grayscale-20 shadow-none">
      <template #content>
        <div class="flex flex-col w-full gap-4">
          <!-- QR Code Upload Section -->
          <section v-if="integration_formData.isStatic" id="qr-code-upload" class="flex flex-col gap-4">
            <h6 class="font-semibold text-sm text-black">Upload QR Code</h6>

            <!-- File Upload Area -->
            <div
              class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-primary transition-colors"
              :class="{ 'border-blue-primary bg-blue-50': integration_isLoading }"
              @click="integration_triggerFileInput"
              @drop="integration_onDrop"
              @dragover="integration_onDragOver"
              @dragleave="integration_onDragLeave"
            >
              <input
                ref="integration_fileInputRef"
                type="file"
                accept="image/*"
                class="hidden"
                @change="integration_onFileSelect"
              />

              <div v-if="!integration_previewUrl" class="flex flex-col items-center gap-2">
                <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p class="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                <p class="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
              </div>

              <!-- QR Code Preview -->
              <div v-else class="flex flex-col items-center gap-2">
                <div class="relative">
                  <img
                    :src="integration_previewUrl"
                    alt="QR Code Preview"
                    class="w-32 h-32 object-contain border border-gray-200 rounded"
                  />
                  <button
                    type="button"
                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    @click.stop="integration_onRemoveFile"
                  >
                    ×
                  </button>
                </div>
                <p class="text-sm font-medium text-gray-900">QR Code uploaded successfully</p>
                <p class="text-xs text-gray-500 cursor-pointer hover:text-blue-primary">Click to change</p>
              </div>
            </div>

            <!-- QR Code Information -->
            <section
              v-if="integration_previewUrl"
              id="qr-code-info"
              class="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg"
            >
              <h6 class="font-semibold text-sm text-black">QR Code Information</h6>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Status:</span>
                  <span class="text-green-600 font-medium">Active</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Type:</span>
                  <span class="text-gray-900">Static QR Code</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Format:</span>
                  <span class="text-gray-900">{{ integration_formData.qrCodeFile?.type || 'Image' }}</span>
                </div>
              </div>
            </section>
          </section>

          <!-- Disabled State Message -->
          <section v-else id="disabled-message" class="p-4 bg-gray-50 rounded-lg text-center">
            <p class="text-sm text-gray-600">
              Enable Static QR Code to upload and manage your restaurant's QR code
            </p>
          </section>

          <!-- Save Button -->
          <PrimeVueButton
            class="bg-blue-primary border-none text-sm py-[10px] w-40 mt-2"
            label="Save"
            type="submit"
            :disabled="integration_formValidations.$invalid || integration_isLoading"
            :loading="integration_isLoading"
            @click="integration_onSubmit"
          />
        </div>
      </template>
    </PrimeVueCard>
  </section>
</template>

<style scoped>
/* Add any specific styles for drag and drop visual feedback if needed */
.drop-zone-active {
  border-color: #3b82f6;
  background-color: #eff6ff;
}
</style>
