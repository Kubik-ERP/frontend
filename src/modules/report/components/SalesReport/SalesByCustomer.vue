<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import SummaryReport from '../SummaryReport.vue';
// service
import { useReportService } from '../../services/report.service';
const { salesReport_columns, report_queryParams, report_getSalesReport, salesReport_salesByCustomer_values } =
  useReportService();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();
const popover = ref();
const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Sales Report - Sales By Customer Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: salesReport_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Sales Report - Sales By Customer Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: salesReport_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData =
    salesReport_salesByCustomer_values.value?.groupedSummary?.map(item => {
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
    <SummaryReport :summary="salesReport_salesByCustomer_values?.overallSummary" />
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
        <h1 class="font-bold text-2xl text-text-primary">Sales By Customer</h1>
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
        <CustomDatePicker
          v-model:start-date="report_queryParams.startDate"
          v-model:end-date="report_queryParams.endDate"
          :should-update-type="false"
          @update:start-date="report_getSalesReport('customer')"
        />
      </template>
    </AppBaseDataTable>
  </section>
</template>
