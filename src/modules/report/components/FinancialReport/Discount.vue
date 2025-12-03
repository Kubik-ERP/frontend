<script setup lang="ts">
// components
import DownloadingDialog from '../DownloadingDialog.vue';
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_discount_columns,
  report_queryParams,
  report_getFinancialReport,
  hasManageStaffMemberPermission,
  report_discount_values,
  outlet_lists_options,
  staff_lists_options,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
  report_downloadPDF,
  isDownloading,
  // download dialog
  isDialogVisible,
  downloadStatus,
  dialogDownload_onClose,
} = useReportService();

// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToCsv, export_isloading } = useReportExporter();

const popover = ref();

const formattedDataTable = () => {
  const newData = report_discount_values?.value?.discountList?.map(item => {
    return {
      name: item.nama,
      price: useCurrencyFormat({ data: item.nilaiBarang }),
      discount: useCurrencyFormat({ data: item.jumlahDiskon }),
    };
  });
  return newData;
};

const page = ref<number>(1);
const limit = ref<number>(10);
const totalRecords = ref<number>(formattedDataTable.length);
const onChangePage = (newPage: number) => {
  page.value = newPage;
};

const handleExportToCsv = () => {
  exportToCsv({
    // Translated Title
    reportName: `Financial Report - ${useLocalization('reports.financial.discount.title')}`,
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || useLocalization('reports.financial.summary.filters.all_stores')
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || useLocalization('reports.financial.summary.filters.all_stores')
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || useLocalization('reports.financial.summary.filters.all_staff'),
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_discount_columns,
    tableData: formattedDataTable(),
  });
};
</script>

<template>
  <DownloadingDialog v-model:visible="isDialogVisible" :status="downloadStatus" @reset="dialogDownload_onClose" />

  <section class="flex flex-col gap-4">
    <PrimeVueCard>
      <template #content>
        <table class="w-full">
          <tbody>
            <tr class="bg-secondary/10">
              <th class="text-left p-1.5">{{ useLocalization('reports.financial.discount.summary_cards.total_discount') }}</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: report_discount_values.simpleWidget?.totalJumlahDiskon,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">{{ useLocalization('reports.financial.discount.summary_cards.total_price') }}</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: report_discount_values.simpleWidget?.totalItemValue }) }}
              </td>
            </tr>
            <tr class="bg-secondary/10">
              <th class="text-left p-1.5">{{ useLocalization('reports.financial.discount.summary_cards.total_discounted_item') }}</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: report_discount_values.simpleWidget?.totalItemWithDiscount,
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
      :columns="financialReport_discount_columns"
      :first="(page - 1) * limit"
      :rows-per-page="limit"
      :total-records="totalRecords"
      is-using-custom-body
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      @update:currentPage="onChangePage"
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">
          {{ useLocalization('reports.financial.discount.title') }}
        </h1>
      </template>
      <template #header-suffix>
        <PrimeVueButton
          variant="outlined"
          :label="useLocalization('reports._common.actions.export')"
          :disabled="formattedDataTable()?.length === 0"
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
              @click="report_downloadPDF('financial-report', 'discount-summary')"
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
        <section class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 pt-4">
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1 xl:col-span-2 2xl:col-span-1"
            @update:end-date="report_getFinancialReport('discount-summary')"
          />
          <PrimeVueSelect
            v-if="hasAccessAllStorePermission"
            v-model="report_queryParams.store_ids"
            :options="outlet_lists_options"
            option-label="label"
            option-value="value"
            :placeholder="useLocalization('reports._common.filters.select_outlet')"
            class="col-span-1 w-full border border-primary-border"
            filter
            @change="report_getFinancialReport('discount-summary')"
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
            class="col-span-1 w-full border border-primary-border"
            @change="report_getFinancialReport('discount-summary')"
            ><template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 filter-primary-color" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>

      <template #body="{ data, column }">
        <template v-if="column.value === 'name'">
          <span class="text-sm text-text-primary">#{{ data[column.value] }}</span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">{{ data[column.value] }}</span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>