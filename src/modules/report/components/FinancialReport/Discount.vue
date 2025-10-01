<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_discount_columns,
  report_queryParams,
  report_getFinancialReport,
  report_discount_values,
  outlet_lists_options,
} = useReportService();

// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();

const popover = ref();

const formattedDataTable = () => {
  const newData = report_discount_values?.value?.discountList?.map(item => {
    return {
      name: item.nama,
      price: useCurrencyFormat({ data: item.nilaiBarang }),
      discount: useCurrencyFormat({ data: item.jumlahDiskon }),
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
    reportName: 'Financial Report - Discount Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_discount_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Financial Report - Discount Report',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_discount_columns,
    tableData: formattedDataTable(),
  });
};
</script>
<template>
  <section class="flex flex-col gap-4">
    <PrimeVueCard>
      <template #content>
        <table class="w-full">
          <tbody>
            <tr class="bg-primary-background">
              <th class="text-left p-1.5">Total Discount</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: report_discount_values.simpleWidget?.totalJumlahDiskon,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Total Price</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: report_discount_values.simpleWidget?.totalItemValue }) }}
              </td>
            </tr>
            <tr class="bg-primary-background">
              <th class="text-left p-1.5">Total Discounted Item</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: report_discount_values.simpleWidget?.totalItemWithDiscount,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </PrimeVueCard>
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="financialReport_discount_columns"
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
        <h1 class="font-bold text-2xl text-text-primary">Discount Report</h1>
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
        <section class="flex items-center justify-start gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            @update:end-date="report_getFinancialReport('discount-summary')"
          />
          <PrimeVueSelect
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            class="min-w-64"
            filter
            @change="report_getFinancialReport('discount-summary')"
            ><template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>

      <template #body="{ data, column }">
        <template v-if="column.value === 'name'">
          <span class="text-sm text-text-primary">#{{ data[column.value] }}</span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
