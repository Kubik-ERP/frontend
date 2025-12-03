<script setup lang="ts">
// components
import CustomDatePicker from '../components/CustomDatePicker.vue';
// service
import { useReportService } from '../services/report.service';
const {
  lossReport_columns,
  report_queryParams,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../composables/useReportExporter';
const { exportToPdf, exportToCsv, export_isloading } = useReportExporter();
const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Loss Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: lossReport_columns,
    tableData: TEMPORARY_DATA,
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Loss Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: lossReport_columns,
    tableData: TEMPORARY_DATA,
  });
};

const popover = ref();

const TEMPORARY_DATA = reactive([
  {
    date: '01/08/2024',
    sku: 'FNB-001',
    itemName: 'Susu UHT Full Cream',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '01/08/2024',
    sku: 'FNB-002',
    itemName: 'Roti Tawar',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '01/08/2024',
    sku: 'FNB-003',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Roger',
  },
  {
    date: '01/08/2024',
    sku: 'FNB-004',
    itemName: 'Saus Sambal',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 10000,
    totalLoss: 100000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-005',
    itemName: 'Kecap Asin',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-006',
    itemName: 'Beras',
    notes: 'Expired',
    qtyLoss: -20,
    unitCost: 15000,
    totalLoss: 300000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-007',
    itemName: 'Gula Pasir',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 12000,
    totalLoss: 120000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-008',
    itemName: 'Tepung Terigu',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 10000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-009',
    itemName: 'Minyak Goreng',
    notes: 'Expired',
    qtyLoss: -20,
    unitCost: 18000,
    totalLoss: 360000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-010',
    itemName: 'Mie Instant',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-011',
    itemName: 'Saus Tomat',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-012',
    itemName: 'Saus Sambal',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-013',
    itemName: 'Kecap Asin',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-014',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-015',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-016',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-017',
    itemName: 'Kecap Asin',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-018',
    itemName: 'Saus Tomat',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-019',
    itemName: 'Saus Sambal',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-020',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-021',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-022',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-023',
    itemName: 'Kecap Asin',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-025',
    itemName: 'Saus Sambal',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-026',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-027',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-028',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-029',
    itemName: 'Kecap Asin',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-030',
    itemName: 'Saus Tomat',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-031',
    itemName: 'Saus Sambal',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-032',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-033',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-035',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-036',
    itemName: 'Kecap Asin',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-037',
    itemName: 'Saus Tomat',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-038',
    itemName: 'Saus Sambal',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-039',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-040',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-041',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-042',
    itemName: 'Kecap Asin',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-043',
    itemName: 'Saus Tomat',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-044',
    itemName: 'Saus Sambal',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-045',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-046',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-047',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-048',
    itemName: 'Kecap Asin',
    notes: 'Loss',
    qtyLoss: -15,
    unitCost: 12000,
    totalLoss: 180000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-049',
    itemName: 'Saus Tomat',
    notes: 'Expired',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-050',
    itemName: 'Saus Sambal',
    notes: 'Damaged',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-051',
    itemName: 'Kecap Manis',
    notes: 'Loss',
    qtyLoss: -10,
    unitCost: 7000,
    totalLoss: 70000,
    reportedBy: 'Samantha',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-052',
    itemName: 'Roti Tawar',
    notes: 'Expired',
    qtyLoss: -5,
    unitCost: 8000,
    totalLoss: 40000,
    reportedBy: 'Roger',
  },
  {
    date: '02/08/2024',
    sku: 'FNB-053',
    itemName: 'Susu UHT Full Cream',
    notes: 'Damaged',
    qtyLoss: -10,
    unitCost: 15000,
    totalLoss: 150000,
    reportedBy: 'Samantha',
  },
]);

const page = ref<number>(1);
const limit = ref<number>(10);
const totalRecords = ref<number>(TEMPORARY_DATA.length);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};
</script>
<template>
  <section>
    <AppBaseDataTable
      :data="TEMPORARY_DATA"
      :columns="lossReport_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="totalRecords"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Loss Report</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          :label="useLocalization('reports._common.actions.export')"
          class="border border-primary-border text-primary"
          :loading="export_isloading"
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
              :loading="export_isloading"
              @click="handleExportToPdf"
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              :label="useLocalization('reports._common.actions.export_csv')"
              :loading="export_isloading"
              @click="handleExportToCsv"
            />
          </section>
        </PrimeVuePopover>
      </template>

      <template #filter>
        <CustomDatePicker
          v-model:start-date="report_queryParams.startDate"
          v-model:end-date="report_queryParams.endDate"
          v-model:type="report_queryParams.type"
        />
      </template>
    </AppBaseDataTable>
  </section>
</template>
