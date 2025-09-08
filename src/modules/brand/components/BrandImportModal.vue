<script setup lang="ts">
import { useBrandImportService } from '../services/brand-import.service';

const {
  brandImport_step,
  brandImport_isLoading,
  brandImport_values,
  brandImport_onSubmit,
  brandImport_onClose,
  brandImport_handleDownloadTemplate,
  brandImport_handleDropFile,
  // brandImport_handleUpload,
  brandImport_triggerUpload,
  brandImport_columns,
} = useBrandImportService();
</script>

<template>
  <AppBaseDialog
    id="brand-import-modal"
    :style="{
      width: '90vw',
      maxWidth: '100%',
    }"
    class="w-full sm:w-[90vw]"
    :dismissable-mask="true"
  >
    <template #header>
      <h2 class="font-semibold text-lg">Import File</h2>
    </template>

    <template #content>
      <div class="h-full sm:h-[400px] flex items-center justify-center border border-grayscale-10">
        <!-- Step 1: Upload -->
        <section
          v-if="brandImport_step === 1"
          class="flex flex-col items-center justify-center w-full h-full relative"
        >
          <div
            class="relative rounded-lg w-full h-full flex flex-col items-center justify-center cursor-pointer border-gray-300 p-4 z-9"
            @click="brandImport_triggerUpload"
            @dragover.prevent
            @drop.prevent="
              brandImport_handleDropFile($event.dataTransfer?.files ? Array.from($event.dataTransfer.files) : [])
            "
          >
            <i class="pi pi-paperclip text-4xl text-gray-400 mb-3"></i>

            <p class="text-gray-500 text-sm text-center mb-3">
              Drop your CSV/XLSX file here <br />
              or
              <span class="text-primary cursor-pointer" @click.stop="brandImport_triggerUpload">click</span>
              to browse from your device.
            </p>

            <!-- Tombol Download Template nempel di bawah paragraf -->
            <div class="flex justify-center items-center flex-col">
              <span class="text-gray-400">or</span>
              <PrimeVueButton
                icon="pi pi-download"
                label="Download Template"
                class="bg-white border border-primary text-primary px-4 py-2 mt-1"
                @click.stop="brandImport_handleDownloadTemplate"
              />
            </div>
          </div>
        </section>

        <!-- Step 2: Loading -->
        <section
          v-else-if="brandImport_isLoading"
          class="flex flex-col items-center justify-center w-full h-full z-10"
        >
          <ProgressSpinner
            style="width: 50px; height: 50px"
            stroke-width="8"
            fill="transparent"
            animation-duration=".8s"
          />
          <p class="text-gray-500 mt-4">Uploading file...</p>
        </section>

        <!-- Step 3: Preview / Error -->
        <section v-else class="flex flex-col w-full h-full relative">
          <div class="flex flex-col w-full">
            <AppBaseDataTable
              :columns="brandImport_columns"
              :data="brandImport_values?.data.mergedData.sort((a, b) => a.rowNumber - b.rowNumber)"
              :rows-per-page="10"
              :total-records="brandImport_values?.data.mergedData.length"
              :first="0"
              :is-loading="brandImport_isLoading"
              is-using-custom-header-suffix
              is-using-header
              is-using-custom-body
              :is-using-custom-filter="true"
              :is-using-server-side-pagination="false"
            >
              <template #body="{ column, data }">
                <template v-if="column.value === 'code'">
                  <span class="text-gray-700">{{ data.code }}</span>
                </template>
                <template v-else-if="column.value === 'name'">
                  <span class="text-gray-700">{{ data.name }}</span>
                </template>
                <template v-else-if="column.value === 'notes'">
                  <span class="text-gray-500">{{ data.notes }}</span>
                </template>
                  <template v-else-if="column.value === 'status'">
                  <span
                    v-if="data.status === 'success'"
                    class="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700"
                  >
                    Success
                  </span>
                  <span
                    v-else-if="data.status === 'failed'"
                    v-tooltip.bottom="{
                      value: data.errorMessages,
                      class: ' text-white text-sm rounded-lg px-3 py-2 shadow-lg max-w-xs break-words',
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 cursor-help transition duration-200 hover:bg-red-200"
                  >
                    Failed
                  </span>
                  <span v-else class="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {{ data.status }}
                  </span>
                </template>
              </template>
            </AppBaseDataTable>
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <PrimeVueButton
          label="Cancel"
          class="px-4 py-2 bg-white border border-primary text-primary"
          @click="brandImport_onClose"
        />
        <PrimeVueButton
          label="Import"
          class="px-4 py-2 bg-primary text-white disabled:bg-gray-400 disabled:text-white disabled:border-none"
          :disabled="
            brandImport_step === 1 || brandImport_values?.data?.mergedData?.some((item) => item.status === 'failed')
          "
          @click="brandImport_onSubmit"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>
