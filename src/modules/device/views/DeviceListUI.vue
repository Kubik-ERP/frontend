<script setup lang="ts">
import DeviceFormModal from '../components/DeviceFormModal.vue';
import { useDeviceListService } from '../services/device-list-service';

const {
  device_columns,
  device_values,
  device_isLoading,
  device_onCreate,
  device_onChangePage,
  device_onView,
  device_handleOnSortChange,
  device_queryParams,
} = useDeviceListService();

function capitalizeFirstLetter(text: string) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

</script>

<template>
  <section id="device-list-ui" class="flex flex-col relative inset-0 z-0">
    <AppBaseDataTable
      :columns="device_columns"
      :data="device_values.data.items"
      header-title="Registered Devices"
      :rows-per-page="device_values.data.meta.pageSize"
      :total-records="device_values.data.meta.total"
      :first="(device_values.data.meta.page - 1) * device_values.data.meta.pageSize"
      :is-loading="device_isLoading"
      :sort-field="device_queryParams.orderBy"
      :sort-order="device_queryParams.orderDirection === 'asc' ? 1 : -1"
      is-using-server-side-pagination
      is-using-custom-header-suffix
      is-using-header
      is-using-custom-body
      :is-using-custom-filter="true"
      @update:currentPage="device_onChangePage"
      @update:sort="device_handleOnSortChange"
    >
      <!-- Header Suffix -->
      <template #header-suffix>
        <div class="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <PrimeVueButton
            class="bg-primary hover:bg-primary-600 text-white px-4 py-2 h-10 rounded-md flex items-center gap-2"
            @click="device_onCreate"
          >
            <i class="pi pi-plus text-sm"></i>
            {{ $t('device.createButton') }}
          </PrimeVueButton>
        </div>
      </template>

      <!-- Filter -->
      <template #filter>
        <!-- Custom filter content can be added here -->
      </template>

      <!-- Body Table -->
      <template #body="{ column, data, index }">
        <template v-if="column.value === 'iteration'">
          <span class="text-gray-700">{{ index + 1  }}</span>
        </template>
        <template v-if="column.value === 'code'">
          <span class="text-gray-700">{{ data.code }}</span>
        </template>
        <template v-if="column.value === 'name'">
          <span class="text-gray-700">{{ data.name }}</span>
        </template>
        <template v-else-if="column.value === 'status'">
          <span
            class="px-3 py-1 text-sm font-medium rounded-full"
            :class="{
              'bg-red-50 text-red-500': data.status === 'disconnected',
              'bg-yellow-50 text-yellow-500': data.status === 'pending',
              'bg-primary-100 text-primary': data.status === 'connected',
            }"
          >
            {{ capitalizeFirstLetter(data.status) }}
          </span>
        </template>
        <template v-else-if="column.value === 'lastConnectedAt'">
          <span class="text-gray-700">
            {{
              new Date(data.lastConnectedAt).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            }}
          </span>
        </template>

        <template v-if="column.value === 'action'">
          <PrimeVueButton variant="text" rounded aria-label="Filter" @click="device_onView(data)">
            <template #icon>
              <AppBaseSvg name="eye-visible" class="!w-5 !h-5" />
            </template>
          </PrimeVueButton>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
  <DeviceFormModal />
  <AppBaseDialogConfirmation id="device-dialog-confirmation" />
</template>
