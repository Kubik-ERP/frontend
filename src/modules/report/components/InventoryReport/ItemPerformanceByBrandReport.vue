<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  inventoryReport_itemPerformanceByBrand_columns,
  report_queryParams,
  report_getInventoryReport,
  inventoryReport_itemPerformanceByBrand_values,
  outlet_lists_options,
  staff_lists_options,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
} = useReportService();

// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();

const popover = ref();

const formattedDataTable = () => {
  const newData = inventoryReport_itemPerformanceByBrand_values?.value?.map(item => {
    return {
      brand: item.brand,
      itemCount: useCurrencyFormat({ data: item.itemCount || 0, hidePrefix: true }),
      totalStockValue: useCurrencyFormat({ data: item.totalStockValue || 0 }),
      totalMovementsCount: useCurrencyFormat({ data: item.totalMovementsCount || 0, hidePrefix: true }),
      totalQtyOut: useCurrencyFormat({ data: item.totalQtyOut || 0, hidePrefix: true }),
    };
  });
  return newData;
};

const page = ref<number>(1);
const limit = ref<number>(10);
const totalRecords = ref<number>(formattedDataTable.length);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};

const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Inventory Report - Item Performance By Brand Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: inventoryReport_itemPerformanceByBrand_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Inventory Report - Item Performance By Brand Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: inventoryReport_itemPerformanceByBrand_columns,
    tableData: formattedDataTable(),
  });
};
</script>
<template>
  <section>
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="inventoryReport_itemPerformanceByBrand_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="totalRecords"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Item Performance By Brand Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          label="Export"
          :disabled="formattedDataTable()?.length === 0"
          @click="popover.toggle($event)"
        >
          <template #icon>
            <AppBaseSvg name="export" class="!w-5 !h-5" />
          </template>
        </PrimeVueButton>
        <PrimeVuePopover
          ref="popover"
          :pt="{
            content: 'p-0',
          }"
        >
          <section id="popover-content" class="flex flex-col">
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              label="Export to .pdf"
              @click="handleExportToPdf"
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              label="Export to .csv"
              @click="handleExportToCsv"
            />
          </section>
        </PrimeVuePopover>
      </template>

      <template #filter>
        <section class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1 xl:col-span-2 2xl:col-span-1"
            @update:end-date="report_getInventoryReport('item-performance-by-brand')"
          />
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            class="col-span-1 w-full"
            filter
            @change="report_getInventoryReport('item-performance-by-brand')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
          <PrimeVueSelect
            v-model="report_queryParams.staff_ids"
            :options="staff_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Staff"
            filter
            class="col-span-1 w-full"
            @change="report_getInventoryReport('item-performance-by-brand')"
            ><template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
