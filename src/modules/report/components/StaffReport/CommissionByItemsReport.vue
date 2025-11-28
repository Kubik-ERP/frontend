<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
import DownloadingDialog from '../DownloadingDialog.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  staffReport_commissionByItem_columns,

  report_queryParams,
  report_getStaffReport,
  // hasManageStaffMemberPermission,
  staffReport_CommissionByItem_values,

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
    reportName: 'Staff Report - Commission By Items Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: staffReport_commissionByItem_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = staffReport_CommissionByItem_values.value?.table?.map(item => ({
    itemName: item.itemName,
    itemPrice: useCurrencyFormat({ data: item.itemPrice }),
    totalCommissionAccumulated: useCurrencyFormat({ data: item.totalCommissionAccumulated }),
    averageCommissionRatio: useCurrencyFormat({ data: item.averageCommissionRatio, hidePrefix: true }),
  }));

  return newData || [];
};
</script>
<template>
  <section class="flex flex-col gap-4">
    <DownloadingDialog
      v-model:visible="isDialogVisible"
      :status="downloadStatus"
      @reset="dialogDownload_onClose"
    />
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="staffReport_commissionByItem_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-body
      is-using-custom-footer
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Staff Commission By Items Report</h1>
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
              @click="report_downloadPDF('staff-report', 'commission-by-items')"
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
            @update:end-date="report_getStaffReport('commission-by-items')"
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
            @change="report_getStaffReport('commission-by-items')"
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
            @change="report_getStaffReport('commission-by-items')"
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
