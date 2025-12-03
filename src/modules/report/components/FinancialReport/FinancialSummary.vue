<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import DownloadingDialog from '../DownloadingDialog.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_profitAndLost_columns,
  report_queryParams,
  report_getFinancialReport,
  hasManageStaffMemberPermission,
  report_profitAndLost_values,
  outlet_lists_options,
  staff_lists_options,
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

const popover = ref();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';

const { exportToCsv } = useReportExporter();

const handleExportToCsv = () => {
  exportToCsv({
    reportName: `Financial Report - Financial Summary Report`,
    storeName: hasAccessAllStorePermission
      // FIX: Use _common
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      // FIX: Use _common
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    // FIX: Use _common
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff',
    
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_profitAndLost_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  return [
    {
      description: useLocalization('reports.financial.summary.rows.gross_sales'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.penjualanKotor }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.discount'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.diskon }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.refund'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.refund }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.net_sales'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.penjualanBersih }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.tax'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.pajak }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.service_charge'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.biayaLayanan }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.rounding'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.pembulatan }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.voucher_used'),
      nominal: useCurrencyFormat({
        data: report_profitAndLost_values.value?.sales?.penggunaanVoucher,
        hidePrefix: true,
      }),
    },
    {
      description: useLocalization('reports.financial.summary.rows.net_total'),
      nominal: useCurrencyFormat({ data: report_profitAndLost_values.value?.sales?.nettTotal }),
    },
  ];
};
</script>

<template>
  <section>
    <DownloadingDialog v-model:visible="isDialogVisible" :status="downloadStatus" @reset="dialogDownload_onClose" />
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="financialReport_profitAndLost_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-body
      is-using-custom-footer
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">
          {{ useLocalization('reports.financial.summary.title') }}
        </h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
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
              @click="report_downloadPDF('financial-report', 'financial-summary')"
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              :label="useLocalization('reports._common.actions.export_csv')"
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
            @update:end-date="report_getFinancialReport('financial-summary')"
          />
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            :placeholder="useLocalization('reports._common.filters.select_outlet')"
            class="col-span-1 w-full"
            filter
            @change="report_getFinancialReport('financial-summary')"
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
            @change="report_getFinancialReport('financial-summary')"
            ><template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
      <template #body="{ data, column }">
        <template v-if="column.value === 'description'">
          <span class="font-semibold text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>