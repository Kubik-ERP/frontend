<script setup lang="ts">
// service
import { useReportService } from '../services/report.service';
const {
  customerReport_columns,
  report_queryParams,
  report_getCustomerReport,
  customerReport_values,
  outlet_lists_options,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();
const popover = ref();
const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Customer Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: customerReport_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Customer Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: customerReport_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData = customerReport_values.value.map(item => ({
    nama: item.nama,
    gender: useTitleCaseWithSpaces(item.gender || '') || '-',
    totalSales: useCurrencyFormat({ data: item.totalSales }),
    dateAdded: useFormatDate(item.dateAdded, 'dd/MMM/yyyy'),
    outstanding: useCurrencyFormat({ data: item.outstanding || 0 }),
    loyaltyPoints: useCurrencyFormat({ data: item.loyaltyPoints || 0, hidePrefix: true }),
  }));

  return newData || [];
};
const page = ref<number>(1);
const limit = ref<number>(10);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};

onMounted(async () => {
  await report_getCustomerReport();
});
</script>
<template>
  <section>
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="customerReport_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      :is-using-filter="false"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Customer Report</h1>
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
        <section class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            filter
            class="col-span-1 w-full"
            @change="report_getCustomerReport()"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
