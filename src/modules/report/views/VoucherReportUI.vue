<script setup lang="ts">
// components
import CustomDatePicker from '../components/CustomDatePicker.vue';
// service
import { useReportService } from '../services/report.service';
const {
  voucherReport_columns,
  report_queryParams,
  report_getVoucherReport,
  voucherReport_values,
  findOutletDetail,
  findStaffDetail,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();
const popover = ref();
const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Voucher Report',
    storeName: findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores',
    storeAddress: findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores',
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: voucherReport_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Voucher Report',
    storeName: findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores',
    storeAddress: findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores',
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: voucherReport_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = voucherReport_values.value.map(item => {
    return {
      voucherName: item.voucherName,
      promoCode: item.promoCode,
      validityPeriod:
        useFormatDate(item.validityPeriod.split(' - ')[0], 'dd/MMM/yyyy') +
        ' - ' +
        useFormatDate(item.validityPeriod.split(' - ')[1], 'dd/MMM/yyyy'),
      status: item.status,
      totalUsage: item.totalUsage,
      totalQuota: item.totalQuota,
      remainingQuota: item.remainingQuota,
    };
  });

  return newData || [];
};

const page = ref<number>(1);
const limit = ref<number>(10);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};

onMounted(async () => {
  await report_getVoucherReport();
});
</script>
<template>
  <section>
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="voucherReport_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Voucher Report</h1>
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
        <section class="flex items-center pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="max-w-96"
            @update:end-date="report_getVoucherReport()"
          />
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
