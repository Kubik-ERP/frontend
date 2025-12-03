<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import DownloadingDialog from '../DownloadingDialog.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  staffReport_commission_columns,
  report_queryParams,
  report_getStaffReport,
  // hasManageStaffMemberPermission,
  staffReport_Commission_values,
  outlet_lists_options,
  // staff_lists_options,
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
    reportName: 'Staff Report - Commission Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: staffReport_commission_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = staffReport_Commission_values.value?.table?.map(item => ({
    staffName: item.staffName,
    totalInvoices: item.totalInvoices,
    totalItemsSold: item.totalItemsSold,
    totalRevenue: useCurrencyFormat({ data: item.totalRevenue }),
    totalVouchersUsed: item.totalVouchersUsed,
    totalItemCommission: useCurrencyFormat({ data: item.totalItemCommission }),
    totalVoucherCommission: item.totalVoucherCommission,
    grandTotalCommission: useCurrencyFormat({ data: item.grandTotalCommission }),
  }));

  return newData;
};

const page = ref<number>(1);
const limit = ref<number>(10);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};
</script>
<template>
  <section class="flex flex-col gap-4">
    <PrimeVueCard>
      <template #content>
        <table class="w-full">
          <tbody>
            <tr class="odd:bg-secondary/10">
              <th class="text-left p-1.5">Total Staff</th>
              <td class="text-right p-1.5">
                {{ staffReport_Commission_values.dashboard?.totalStaff || 0 }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Total Invoices</th>
              <td class="text-right p-1.5">
                {{ staffReport_Commission_values.dashboard?.totalInvoices || 0 }}
              </td>
            </tr>
            <tr class="odd:bg-secondary/10">
              <th class="text-left p-1.5">Total Revenue</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: staffReport_Commission_values.dashboard?.totalRevenue || 0 }) }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Total Item Commission</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: staffReport_Commission_values.dashboard?.totalItemCommission || 0,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr class="odd:bg-secondary/10">
              <th class="text-left p-1.5">Total Voucher Commission</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: staffReport_Commission_values.dashboard?.totalVoucherCommission || 0,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Grand Total Commission</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({ data: staffReport_Commission_values.dashboard?.grandTotalCommission || 0 })
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </PrimeVueCard>
    <DownloadingDialog
      v-model:visible="isDialogVisible"
      :status="downloadStatus"
      @reset="dialogDownload_onClose"
    />
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="staffReport_commission_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      is-using-custom-filter
      is-using-custom-body
      is-using-custom-footer
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Staff Commission Report</h1>
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
              @click="report_downloadPDF('staff-report', 'commission-report')"
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
            @update:end-date="report_getStaffReport('commission-report')"
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
            @change="report_getStaffReport('commission-report')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
          <!-- <PrimeVueSelect
            v-if="hasManageStaffMemberPermission"
            v-model="report_queryParams.staff_ids"
            :options="staff_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Staff"
            filter
            class="col-span-1 w-full"
            @change="report_getStaffReport('commission-report')"
            ><template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect> -->
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
