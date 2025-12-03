<script setup lang="ts">
// components
import DownloadingDialog from '../DownloadingDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import SummaryReport from '../SummaryReport.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  salesReport_columns,
  report_queryParams,
  report_getSalesReport,
  hasManageStaffMemberPermission,
  salesReport_salesByItem_values,
  staff_lists_options,
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

const handleExportToCsv = () => {
  exportToCsv({
    // Translated Report Name
    reportName: `Sales Report - Sales By Item`,
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: salesReport_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData =
    salesReport_salesByItem_values.value?.groupedSummary?.map(item => {
      return {
        group: item.group,
        jumlahTerjual: item.jumlahTerjual,
        kotor: useCurrencyFormat({ data: item.kotor }),
        diskonItem: useCurrencyFormat({ data: item.diskonItem }),
        refund: useCurrencyFormat({ data: item.refund }),
        pajak: useCurrencyFormat({ data: item.pajak }),
        biayaLayanan: useCurrencyFormat({ data: item.biayaLayanan }),
        totalPenjualan: useCurrencyFormat({ data: item.totalPenjualan }),
        countPenggunaanVoucher: item.countPenggunaanVoucher,
      };
    }) || [];

  return newData || [];
};

const page = ref<number>(1);
const limit = ref<number>(10);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};
</script>

<template>
  <DownloadingDialog :visible="isDialogVisible" :status="downloadStatus" @reset="dialogDownload_onClose" />
  <section class="flex flex-col gap-4">
    <SummaryReport :summary="salesReport_salesByItem_values?.overallSummary" />
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="salesReport_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">
          {{ useLocalization('reports.sales.item.title') }}
        </h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          :disabled="formattedDataTable().length === 0"
          variant="outlined"
          :label="useLocalization('reports._common.actions.export')"
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
              @click="report_downloadPDF('advanced-sales-report', 'item')"
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
        <section class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1 xl:col-span-2 2xl:col-span-1"
            @update:end-date="report_getSalesReport('item')"
          />
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            :placeholder="useLocalization('reports._common.filters.select_outlet')"
            filter
            class="col-span-1 w-full"
            @change="report_getSalesReport('item')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
          <PrimeVueSelect
            v-if="hasManageStaffMemberPermission"
            v-model="report_queryParams.staff_ids"
            :options="staff_lists_options"
            option-label="label"
            option-value="value"
            :placeholder="useLocalization('reports._common.filters.select_staff')"
            filter
            class="col-span-1 w-full"
            @change="report_getSalesReport('item')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>