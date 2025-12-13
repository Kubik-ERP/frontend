<script setup lang="ts">
import { watch } from 'vue';

// The parent will control this with v-model:visible
const visible = defineModel<boolean>('visible', { default: false });

// The parent passes in the current download status
const props = defineProps<{
  status: 'downloading' | 'success' | 'error';
}>();

// This emits a 'reset' event *before* closing
const emit = defineEmits<{
  (e: 'reset'): void;
}>();

// --- THIS IS THE CORRECTED LOGIC ---
watch(
  () => props.status,
  newStatus => {
    // When the download is finished (either success or error)...
    if (newStatus === 'success' || newStatus === 'error') {
      // Wait for the delay to show the message
      setTimeout(() => {
        // 1. NOW tell the parent to reset its state for the next download
        emit('reset');

        // 2. NOW close the dialog
        visible.value = false;
      }, 1500); // 1.5 second delay (you can make this longer or shorter)
    }
  },
);
</script>

<template>
  <AppBaseDialog
    id="downloading-dialog"
    v-model:visible="visible"
    :modal="true"
    :closable="false"
    :draggable="false"
    header-class="hidden"
    class="max-w-md w-full"
  >
    <template #content>
      <!-- 1. DOWNLOADING STATE -->
      <div v-if="status === 'downloading'" class="flex flex-col items-center justify-center gap-5 p-8 text-center">
        <PrimeVueProgressSpinner style="width: 50px; height: 50px" stroke-width="4" animation-duration="1.5s" />
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-900">
            {{ useLocalization('components.download_dialog.status.downloading.title') }}
          </h2>
          <p class="text-gray-600">
            {{ useLocalization('components.download_dialog.status.downloading.message') }}
          </p>
        </div>
      </div>

      <!-- 2. SUCCESS STATE -->
      <div
        v-else-if="status === 'success'"
        class="flex flex-col items-center justify-center gap-5 p-8 text-center"
      >
        <!-- Success Icon -->
        <span class="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
          <!--  -->
          <i class="pi pi-check text-4xl text-green-600"></i>
        </span>

        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-900">{{ useLocalization('components.download_dialog.status.success.title') }}</h2>
          <p class="text-gray-600">{{ useLocalization('components.download_dialog.status.success.message') }}</p>
        </div>
      </div>

      <!-- 3. ERROR STATE -->
      <div v-else-if="status === 'error'" class="flex flex-col items-center justify-center gap-5 p-8 text-center">
        <!-- Error Icon -->
        <span class="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
          <!--  -->
          <i class="pi pi-times text-4xl text-red-600"></i>
        </span>

        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-semibold text-gray-900">{{ useLocalization('components.download_dialog.status.error.title') }}</h2>
          <p class="text-gray-600">{{ useLocalization('components.download_dialog.status.error.message') }}</p>
        </div>
      </div>
    </template>
  </AppBaseDialog>
</template>
