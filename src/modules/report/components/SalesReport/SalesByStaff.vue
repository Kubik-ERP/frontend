<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import SummaryReport from '../SummaryReport.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  salesReport_columns,
  report_queryParams,
  report_getSalesReport,
  salesReport_salesByStaff_values,
  outlet_lists_options,
  findOutletDetail,
  findStaffDetail,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();
const popover = ref();
const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Sales Report - Sales By Staff Report',
    storeName: findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores',
    storeAddress: findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores',
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: salesReport_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Sales Report - Sales By Staff Report',
    storeName: findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores',
    storeAddress: findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores',
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: salesReport_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData =
    salesReport_salesByStaff_values.value?.groupedSummary?.map(item => {
      return {
        group: item.group,
        jumlahTerjual: item.jumlahTerjual,
        kotor: useCurrencyFormat({ data: item.kotor }),
        diskonItem: useCurrencyFormat({ data: item.diskonItem }),
        refund: useCurrencyFormat({ data: item.refund }),
        pajak: useCurrencyFormat({ data: item.pajak }),
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
  <section class="flex flex-col gap-4">
    <SummaryReport :summary="salesReport_salesByStaff_values?.overallSummary" />
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
        <h1 class="font-bold text-2xl text-text-primary">Sales By Staff</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          :disabled="formattedDataTable().length === 0"
          variant="outlined"
          label="Export"
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
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1"
            @update:end-date="report_getSalesReport('staff')"
          />
          <PrimeVueSelect
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            filter
            class="col-span-1 w-full"
            @change="report_getSalesReport('staff')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
