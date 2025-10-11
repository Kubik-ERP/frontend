<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_paymentMethod_columns,
  report_queryParams,
  report_getFinancialReport,
  hasManageStaffMemberPermission,
  report_paymentMethod_values,
  outlet_lists_options,
  staff_lists_options,
  findOutletDetail,
  findStaffDetail,
  hasAccessAllStorePermission,
  outlet_currentOutlet,
} = useReportService();
// composables for export pdf
import { useReportExporter } from '../../composables/useReportExporter';
const { exportToPdf, exportToCsv } = useReportExporter();

const popover = ref();

const handleExportToPdf = () => {
  exportToPdf({
    reportName: 'Financial Report - Payment Method Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_paymentMethod_columns,
    tableData: formattedDataTable(),
  });
};
const handleExportToCsv = () => {
  exportToCsv({
    reportName: 'Financial Report - Payment Method Report',
    storeName: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.name || 'All Stores'
      : outlet_currentOutlet.value!.name,
    storeAddress: hasAccessAllStorePermission
      ? findOutletDetail(report_queryParams.store_ids!)?.address || 'All Stores'
      : outlet_currentOutlet.value!.address,
    staffMember: findStaffDetail(report_queryParams.staff_ids!)?.name || 'All Staff Member',
    period: `${useFormatDate(report_queryParams.startDate, 'dd/MMM/yyyy')} - ${useFormatDate(report_queryParams.endDate, 'dd/MMM/yyyy')}`,
    columns: financialReport_paymentMethod_columns,
    tableData: formattedDataTable(),
  });
};

const formattedDataTable = () => {
  // const newData = {}
  const newData = report_paymentMethod_values.value?.paymentList?.reportData.map(item => {
    return {
      paymentMethod: item.paymentMethod,
      transaction: item.transaction,
      nominal: useCurrencyFormat({ data: item.nominal }),
    };
  });
  newData?.push({
    paymentMethod: 'Total',
    transaction: useCurrencyFormat({
      data: report_paymentMethod_values.value?.paymentList?.totals?.transaction as number,
      hidePrefix: true,
    }),
    nominal: useCurrencyFormat({ data: report_paymentMethod_values.value?.paymentList?.totals?.nominal }),
  });

  return newData || [];
};
</script>
<template>
  <section class="flex flex-col gap-4">
    <PrimeVueCard>
      <template #content>
        <table class="w-full">
          <tbody>
            <tr class="bg-primary-background">
              <th class="text-left p-1.5">Total Transaction</th>
              <td class="text-right p-1.5">
                {{
                  useCurrencyFormat({
                    data: report_paymentMethod_values.simpleWidget?.totalTransaksi,
                    hidePrefix: true,
                  })
                }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Gross Sales</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: report_paymentMethod_values.simpleWidget?.pendapatanKotor }) }}
              </td>
            </tr>
            <tr class="bg-primary-background">
              <th class="text-left p-1.5">Total Refund</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: report_paymentMethod_values.simpleWidget?.totalRefund }) }}
              </td>
            </tr>
            <tr>
              <th class="text-left p-1.5">Voucher Used</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: report_paymentMethod_values.simpleWidget?.totalPenggunaanVoucher }) }}
              </td>
            </tr>
            <tr class="bg-primary-background">
              <th class="text-left p-1.5">Nett Sales</th>
              <td class="text-right p-1.5">
                {{ useCurrencyFormat({ data: report_paymentMethod_values.simpleWidget?.nettSummary }) }}
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </PrimeVueCard>
    <AppBaseDataTable
      :data="formattedDataTable()"
      :columns="financialReport_paymentMethod_columns"
      is-using-custom-body
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-custom-footer
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Payment Method Report</h1>
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
          <CustomDatePicker
            v-model:start-date="report_queryParams.startDate"
            v-model:end-date="report_queryParams.endDate"
            :should-update-type="false"
            class="col-span-1 xl:col-span-2 2xl:col-span-1"
            @update:end-date="report_getFinancialReport('payment-summary')"
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
            @change="report_getFinancialReport('payment-summary')"
          >
            <template #dropdownicon>
              <AppBaseSvg name="store" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
          <PrimeVueSelect
            v-if="hasManageStaffMemberPermission"
            v-model="report_queryParams.staff_ids"
            :options="staff_lists_options"
            option-label="label"
            option-value="value"
            placeholder="Select Staff"
            filter
            class="col-span-1 w-full"
            @change="report_getFinancialReport('payment-summary')"
            ><template #dropdownicon>
              <AppBaseSvg name="staff" class="w-5 h-5 text-text-primary" />
            </template>
          </PrimeVueSelect>
        </section>
      </template>
      <template #body="{ data, column }">
        <template v-if="data.paymentMethod === 'Total'">
          <span v-if="column.value === 'paymentMethod'" class="text-sm font-bold text-text-primary">
            {{ data[column.value] }}
          </span>
          <span v-else-if="column.value === 'transaction'" class="text-sm font-bold text-primary">
            {{ data[column.value] }}
          </span>
          <span v-else-if="column.value === 'nominal'" class="text-sm font-bold text-primary">
            {{ data[column.value] }}
          </span>
        </template>
        <template v-else>
          <span class="text-sm text-text-primary">
            {{ data[column.value] }}
          </span>
        </template>
      </template>
    </AppBaseDataTable>
  </section>
</template>
