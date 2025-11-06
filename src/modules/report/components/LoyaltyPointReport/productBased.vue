<script setup lang="ts">
// service
import { useReportService } from '../../services/report.service';
const {
  loyaltyPointReport_productBased_columns,
  report_queryParams,
  report_getLoyaltyPointReport,
  loyaltyPointReport_productBased_values,
  outlet_lists_options,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv, export_isloading } = useReportExporter();
const popover = ref();

const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Loyalty Point Report - Product Based',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: loyaltyPointReport_productBased_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Loyalty Point Report - Product Based',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: loyaltyPointReport_productBased_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  const newData =
    loyaltyPointReport_productBased_values?.value?.table?.map(item => {
      return {
        productName: item.productName,
        productPrice: useCurrencyFormat({ data: item.productPrice }),
        pointsToIDR: useCurrencyFormat({ data: item.pointsToIDR, hidePrefix: true }),
        sumOfPointsGivenToCust: item.sumOfPointsGivenToCust,
        totalCust: item.totalCust,
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
                    data: loyaltyPointReport_productBased_values?.dashboard?.sumOfAllPoints,
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
                    data: loyaltyPointReport_productBased_values?.dashboard?.sumOfAllPointsExpired,
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
                    data: loyaltyPointReport_productBased_values?.dashboard?.totalCustomers,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Total Products For Earning Benefit</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: loyaltyPointReport_productBased_values?.dashboard?.totalProductsForEarningBenefit,
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
      :columns="loyaltyPointReport_productBased_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="formattedDataTable().length"
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Product Based</h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          label="Export"
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
              label="Export to .pdf"
              :loading="export_isloading"
              @click="handleExportToPdf"
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
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Outlet"
            class="col-span-1 w-full"
            filter
            @change="report_getLoyaltyPointReport('product-based')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
    </AppBaseDataTable>
  </section>
</template>
