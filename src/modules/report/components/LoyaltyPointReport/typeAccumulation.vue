<script setup lang="ts">
// components
import DownloadingDialog from '../DownloadingDialog.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  loyaltyPointReport_typeAccumulation_columns,
  report_queryParams,
  report_getLoyaltyPointReport,
  loyaltyPointReport_typeAccumulation_values,
  outlet_lists_options,
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
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToCsv, export_isloading } = useReportExporter();
const popover = ref();

const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Loyalty Point Report - Type Accumulation',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: loyaltyPointReport_typeAccumulation_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData =
    loyaltyPointReport_typeAccumulation_values?.value?.table?.map(item => {
      return {
        type: item.type,
        sumTotalPoints: useCurrencyFormat({ data: item.sumTotalPoints, hidePrefix: true }),
        totalCustomers: useCurrencyFormat({ data: item.totalCustomers, hidePrefix: true }),
      };
    }) || [];
  return newData;
};

const page = ref<number>(1);
const limit = ref<number>(10);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};
</script>
<template>
  <DownloadingDialog :visible="isDialogVisible" :status="downloadStatus" @reset="dialogDownload_onClose" />
  <section class="flex flex-col gap-4">
    <PrimeVueCard>
      <template #content>
        <table class="w-full">
          <tbody>
            <tr class="bg-secondary/10">
              <th class="text-left p-1.5">Sum of All Points</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: loyaltyPointReport_typeAccumulation_values?.dashboard?.sumOfAllPoints || 0,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Sum of All points Expired</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: loyaltyPointReport_typeAccumulation_values?.dashboard?.sumOfAllPointsExpired || 0,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr class="bg-secondary/10">
              <th class="text-left p-1.5">Total Customer</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: loyaltyPointReport_typeAccumulation_values?.dashboard?.totalCustomers || 0,
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
      :columns="loyaltyPointReport_typeAccumulation_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Type Accumulation</h1>
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
              @click="report_downloadPDF('loyalty-report', 'type-accumulation')"
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              label="Export to .csv"
              :loading="export_isloading"
              @click="handleExportToCsv"
            />
          </section>
        </PrimeVuePopover>
      </template>

      <template #filter>
        <section class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
          <!-- <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1 xl:col-span-2 2xl:col-span-1"
            @update:end-date="report_getLoyaltyPointReport('type-accumulation')"
          /> -->
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            class="col-span-1 w-full"
            filter
            @change="report_getLoyaltyPointReport('type-accumulation')"
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
            @change="report_getLoyaltyPointReport('type-accumulation')"
            ><template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect> -->
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
