<script setup lang="ts">
// components
// import CustomDatePicker from '../../components/CustomDatePicker.vue';
// // service
// import { useReportService } from '../../services/report.service';
// const {
//   salesReport_columns,
//   report_queryParams,
//   report_getSalesReport,
// } = useReportService();
// // composables for export pdf
// import { useReportExporter } from '../../composables/useReportExporter';
// const { exportToPdf, exportToCsv } = useReportExporter();
// const popover = ref();
// const handleExportToPdf = () => {
//   exportToPdf({
//     reportName: 'Sales Report - Sales By Order Type Report',
//     period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
//     columns: salesReport_columns,
//     tableData: formattedDataTable(),
//   });
// };
// const handleExportToCsv = () => {
//   exportToCsv({
//     reportName: 'Sales Report - Sales By Order Type Report',
//     period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
//     columns: salesReport_columns,
//     tableData: formattedDataTable(),
//   });
// };

// const formattedDataTable = () => {
//   const newData = salesReport_salesByOrderType_values.value.groupedSummary.map(item => {
//     return {
//       group: item.group,
//       jumlahTerjual: item.jumlahTerjual,
//       kotor: item.kotor,
//       diskonItem: item.diskonItem,
//       refund: item.refund,
//       pajak: item.pajak,
//       totalPenjualan: item.totalPenjualan,
//       countPenggunaanVoucher: item.countPenggunaanVoucher,
//     };
//   });

//   return newData || [];
// };

// const page = ref<number>(1);
// const limit = ref<number>(10);
// const onChangePage = (newPage: number) => {
//   page.value = newPage;
// };
</script>
<template>
  <section>
    <!-- <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="salesReport_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-body
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Sales By Order Type</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton variant="outlined" label="Export" class="border border-primary-border text-primary"  @click="popover.toggle($event)">
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
          @update:end-date="report_getSalesReport('order')"
        />
      </template>

      <template #body="{ data, column }">
        <template v-if="column.value === 'invoiceId'">
          <router-link :to="`/invoice/${data.invoiceId}`">
            <span class="text-sm text-primary">#{{ data.invoiceId }}</span>
          </router-link>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable> -->
  </section>
</template>
