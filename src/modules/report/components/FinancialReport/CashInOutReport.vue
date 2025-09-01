<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_cashInOut_columns,
  report_queryParams,
  report_getFinancialReport,
  report_cashInOut_values,
} = useReportService();

// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();

const popover = ref();

const page = ref<number>(1);
const limit = ref<number>(10);
const totalRecords = ref<number>(report_cashInOut_values.value.length);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};

const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Financial Report - Cash In/Out Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_cashInOut_columns,
    tableData: report_cashInOut_values.value,
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Financial Report - Cash In/Out Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_cashInOut_columns,
    tableData: report_cashInOut_values.value,
  });
};
</script>
<template>
  <section>
    <!-- <pre class="p-4 my-4 bg-gray-100 rounded-lg break-all" style="white-space: pre-wrap; word-wrap: break-word">
      {{ report_cashInOut_values }}
    </pre> -->
    <AppBaseDataTable
      :data="report_cashInOut_values"
      :columns="financialReport_cashInOut_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="totalRecords"
      is-using-custom-body
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Cash In/Out Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          label="Export"
          :disabled="report_cashInOut_values.length === 0"
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
          @update:start-date="report_getFinancialReport('cashin-out')"
        />
      </template>

      <template #body="{ data, column }">
        <template v-if="column.value === 'date'">
          <span class="text-sm text-text-primary">
            {{ useFormatDate(data[column.value], 'dd/mm/yyyy') }}
            {{ useFormatDateLocal(data[column.value]) }}
          </span>
        </template>
        <template v-else-if="column.value === 'notes'">
          <span v-if="data.type === 'Cash In'" class="flex flex-col text-sm text-text-primary">
            {{ data[column.value].split(' ')[0] }}
            <router-link :to="`/invoice/${data[column.value].split(' ')[1]}`">
              <span class="text-sm font-semibold text-sky-600 cursor-pointer">
                #{{ data[column.value].split(' ')[1] }}
              </span>
            </router-link>
          </span>
          <span v-else class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
        <template v-else-if="column.value === 'nominal'">
          <span class="text-sm text-text-primary">{{ useCurrencyFormat({ data: data[column.value] }) }}</span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
