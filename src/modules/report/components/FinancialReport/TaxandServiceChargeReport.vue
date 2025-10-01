<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_taxAndServiceCharge_columns,
  report_queryParams,
  report_getFinancialReport,
  report_taxAndServiceCharge_values,
  outlet_lists_options,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();
const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Financial Report - Tax & Service Charge Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_taxAndServiceCharge_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Financial Report - Tax & Service Charge Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_taxAndServiceCharge_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = report_taxAndServiceCharge_values.value.map(item => {
    return {
      type: item.type,
      rate: item.rate + '%',
      subtotalApplied: useCurrencyFormat({ data: item.subtotalApplied }),
      nominal: useCurrencyFormat({ data: item.nominal }),
    };
  });
  return newData || [];
};

const popover = ref();
</script>
<template>
  <section>
    <!-- <pre class="p-4 my-4 bg-gray-100 rounded-lg break-all" style="white-space: pre-wrap; word-wrap: break-word">
      {{ report_taxAndServiceCharge_values }}
      {{ formattedDataTable() }}
    </pre> -->
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="financialReport_taxAndServiceCharge_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-body
      is-using-custom-footer
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Tax & Service Charge Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton variant="outlined" label="Export" @click="popover.toggle($event)">
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
        <section class="flex items-center gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            @update:end-date="report_getFinancialReport('tax-and-service-summary')"
          />
          <PrimeVueSelect
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            class="min-w-80"
            filter
            show-clear
            @change="report_getFinancialReport('tax-and-service-summary')"
            ><template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>

      <template #body="{ data, column }">
        <template v-if="column.value === 'rate'">
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
