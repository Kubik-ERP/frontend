<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_paymentMethod_columns,
  report_queryParams,
  report_getFinancialReport,
  report_paymentMethod_values,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();

const popover = ref();

const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Financial Report - Payment Method Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_paymentMethod_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Financial Report - Payment Method Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_paymentMethod_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = report_paymentMethod_values.value.reportData.map(item => {
    return {
      paymentMethod: item.paymentMethod,
      transaction: item.transaction,
      nominal: useCurrencyFormat({ data: item.nominal }),
    };
  });
  newData.push({
    paymentMethod: 'Total',
    transaction: report_paymentMethod_values.value.totals.transaction,
    nominal: useCurrencyFormat({ data: report_paymentMethod_values.value.totals.nominal }),
  });

  return newData || [];
};
</script>
<template>
  <section>
    <!-- <pre class="p-4 my-4 bg-gray-100 rounded-lg break-all" style="white-space: pre-wrap; word-wrap: break-word">
      {{ report_paymentMethod_values }}
      {{ formattedDataTable() }}
    </pre> -->
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="financialReport_paymentMethod_columns"
      is-using-custom-body
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-footer
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Payment Method Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
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
          @update:start-date="report_getFinancialReport('payment-method')"
        />
      </template>
      <template #body="{ data, column }">
        <template v-if="data.paymentMethod === 'Total'">
          <span v-if="column.value === 'paymentMethod'" class="text-sm font-bold text-text-primary">
            {{ data[column.value] }}
          </span>
          <span v-else-if="column.value === 'transaction'" class="text-sm font-bold text-primary">
            {{ data[column.value] }}
          </span>
          <span v-else-if="column.value === 'nominal'" class="text-sm font-bold text-primary">
            {{ data[column.value] }}
          </span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">
            {{ data[column.value] }}
          </span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
