<script setup lang="ts">
import { useSupplierImportService } from '../services/supplier-import.service';


const {
  supplierImport_step,
  supplierImport_isLoading,
  supplierImport_values,
  supplierImport_onSubmit,
  supplierImport_onClose,
  supplierImport_handleDownloadTemplate,
  supplierImport_handleDropFile,
  // supplierImport_handleUpload,
  supplierImport_triggerUpload,
  supplierImport_columns,
} = useSupplierImportService();
</script>

<template>
  <AppBaseDialog
    id="supplier-import-modal"
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
          v-if="supplierImport_step === 1"
          class="flex flex-col items-center justify-center w-full h-full relative"
        >
          <div
            class="relative rounded-lg w-full h-full flex flex-col items-center justify-center cursor-pointer border-gray-300 p-4 z-9"
            @click="supplierImport_triggerUpload"
            @dragover.prevent
            @drop.prevent="
              supplierImport_handleDropFile($event.dataTransfer?.files ? Array.from($event.dataTransfer.files) : [])
            "
          >
            <i class="pi pi-paperclip text-4xl text-gray-400 mb-3"></i>

            <p class="text-gray-500 text-sm text-center mb-3">
              Drop your CSV/XLSX file here <br />
              or
              <span class="text-primary cursor-pointer" @click.stop="supplierImport_triggerUpload">click</span>
              to browse from your device.
            </p>

            <!-- Tombol Download Template nempel di bawah paragraf -->
            <div class="flex justify-center items-center flex-col">
              <span class="text-gray-400">or</span>
              <PrimeVueButton
                icon="pi pi-download"
                label="Download Excel"
                class="bg-white border border-primary text-primary px-4 py-2 mt-1"
                @click.stop="supplierImport_handleDownloadTemplate"
              />
            </div>
          </div>
        </section>

        <!-- Step 2: Loading -->
        <section
          v-else-if="supplierImport_isLoading"
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
        <section v-else-if="supplierImport_step === 3" class="flex flex-col w-full h-full relative">
          <div class="flex flex-col w-full">
            <AppBaseDataTable
              :columns="supplierImport_columns"
              :data="supplierImport_values?.data.mergedData"
              :rows-per-page="10"
              :total-records="supplierImport_values?.data.mergedData.length"
              :first="0"
              :is-loading="supplierImport_isLoading"
              is-using-custom-header-suffix
              is-using-header
              is-using-custom-body
              :is-using-custom-filter="true"
            >
              <template #body="{ column, data }">
                <template v-if="column.value === 'code'">
                  <span class="text-gray-700">{{ data.supplierCode }}</span>
                </template>
                <template v-else-if="column.value === 'supplierName'">
                  <span class="text-gray-700">{{ data.supplierName }}</span>
                </template>
                <template v-else-if="column.value === 'contactPerson'">
                  <span class="text-gray-500">{{ data.contactPerson }}</span>
                </template>
                <template v-else-if="column.value === 'phoneNumber'">
                  <span class="text-gray-500">{{ data.phoneNumber }}</span>
                </template>
                <template v-else-if="column.value === 'email'">
                  <span class="text-gray-500">{{ data.email }}</span>
                </template>
                <template v-else-if="column.value === 'address'">
                  <span class="text-gray-500">{{ data.address }}</span>
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
          @click="supplierImport_onClose"
        />
        <PrimeVueButton
          label="Import"
          class="px-4 py-2 bg-primary text-white disabled:bg-gray-400 disabled:text-white disabled:border-none"
          :disabled="
            supplierImport_step === 1 || supplierImport_values?.data?.mergedData?.some(item => item.status === 'failed')
          "
          @click="supplierImport_onSubmit"
        />
      </div>
    </template>
  </AppBaseDialog>
</template>
