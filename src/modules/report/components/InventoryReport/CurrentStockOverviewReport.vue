<script setup lang="ts">
// components
import DownloadingDialog from '../DownloadingDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  inventoryReport_currentStockOverview_columns,
  report_queryParams,
  report_getInventoryReport,
  inventoryReport_currentStockOverview_values,
  outlet_lists_options,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
  // download pdf
  isDialogVisible,
  downloadStatus,
  isDownloading,
  report_downloadPDF,
  dialogDownload_onClose,
} = useReportService();

// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToCsv, export_isloading } = useReportExporter();

const popover = ref();

const formattedDataTable = () => {
  return [
    {
      description: 'Total On Hand',
      value: useCurrencyFormat({ data: inventoryReport_currentStockOverview_values.value.totalOnHand }),
    },
    {
      description: 'Total Stock Cost',
      value: useCurrencyFormat({ data: inventoryReport_currentStockOverview_values.value.totalStockCost }),
    },
    {
      description: 'Average Stock Cost',
      value: useCurrencyFormat({ data: inventoryReport_currentStockOverview_values.value.averageStockCost }),
    },
    {
      description: 'Total Retail Price',
      value: useCurrencyFormat({ data: inventoryReport_currentStockOverview_values.value.totalRetailPrice }),
    },
  ];
};

const page = ref<number>(1);
const limit = ref<number>(10);
const totalRecords = ref<number>(formattedDataTable.length);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};

const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Inventory Report - Current Stock Overview Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: inventoryReport_currentStockOverview_columns,
    tableData: formattedDataTable(),
  });
};
</script>
<template>
  <DownloadingDialog :visible="isDialogVisible" :status="downloadStatus" @reset="dialogDownload_onClose" />
  <section>
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="inventoryReport_currentStockOverview_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="totalRecords"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Current Stock Overview Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          :label="useLocalization('reports._common.actions.export')"
          :disabled="formattedDataTable()?.length === 0"
          class="border border-primary-border text-primary"
          @click="popover.toggle($event)"
        >
          <template #icon>
            <AppBaseSvg name="export" class="!w-5 !h-5 filter-primary-color" />
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
              :label="useLocalization('reports._common.actions.export_pdf')"
              :loading="isDownloading"
              @click="report_downloadPDF('inventory-report', 'current-stock-overview')"
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              :label="useLocalization('reports._common.actions.export_csv')"
              :loading="export_isloading"
              @click="handleExportToCsv"
            />
          </section>
        </PrimeVuePopover>
      </template>

      <template #filter>
        <section class="grid grid-cols-1 xl:grid-cols-2 gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class=""
            @update:end-date="report_getInventoryReport('current-stock-overview')"
          />
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            class=""
            filter
            @change="report_getInventoryReport('current-stock-overview')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
