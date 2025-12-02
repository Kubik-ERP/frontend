<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import DownloadingDialog from '../DownloadingDialog.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  staffReport_individual_columns,
  report_queryParams,
  report_getStaffReport,
  hasManageStaffMemberPermission,
  staffReport_Individual_values,
  outlet_lists_options,
  staff_lists_values,
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
    reportName: 'Staff Report - Individual Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: staffReport_individual_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = staffReport_Individual_values.value?.table?.map(item => ({
    invoiceNumber: item.invoiceNumber,
    date: useFormatDate(item.date, 'dd/MMM/yyyy'),
    customer: item.customer,
    grandTotal: useCurrencyFormat({ data: item.grandTotal }),
    itemsCount: item.itemsCount,
    totalCommission: useCurrencyFormat({ data: item.totalCommission }),
  }));

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
    <PrimeVueCard>
      <template #content>
        <table class="w-full">
          <tbody>
            <tr class="odd:bg-secondary/10">
              <th class="text-left p-1.5">Total Invoice Served</th>
              <td class="text-right p-1.5">
                {{ staffReport_Individual_values.dashboard?.totalInvoicesServed || 0 }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Total Items Sold</th>
              <td class="text-right p-1.5">
                {{ staffReport_Individual_values.dashboard?.totalItemsSold || 0 }}
              </td>
            </tr>
            <tr class="odd:bg-secondary/10">
              <th class="text-left p-1.5">Total Vouchers Used</th>
              <td class="text-right p-1.5">
                {{ staffReport_Individual_values.dashboard?.totalVouchersUsed || 0 }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Total Item Commission</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: staffReport_Individual_values.dashboard?.totalItemCommission || 0,
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
                    data: staffReport_Individual_values.dashboard?.totalVoucherCommission || 0,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Grand Total Commission</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({ data: staffReport_Individual_values.dashboard?.grandTotalCommission || 0 })
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
      :columns="staffReport_individual_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-body
      is-using-custom-footer
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Staff Individual Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          label="Export"
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
              label="Export to .pdf"
              :loading="isDownloading"
              @click="report_downloadPDF('staff-report', 'individual-report')"
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
        <section class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1 xl:col-span-2 2xl:col-span-1"
            @update:end-date="report_getStaffReport('individual-report')"
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
            @change="report_getStaffReport('individual-report')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
          <PrimeVueSelect
            v-if="hasManageStaffMemberPermission"
            v-model="report_queryParams.staff_ids"
            :options="staff_lists_values"
            option-label="fullname"
            option-value="id"
            placeholder="Select Staff"
            filter
            class="col-span-1 w-full"
            @change="report_getStaffReport('individual-report')"
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
