<script setup lang="ts">
// components
import CustomDatePicker from '../../components/CustomDatePicker.vue';
// service
import { useReportService } from '../../services/report.service';
const {
  financialReport_taxAndServiceCharge_columns,
  report_queryParams,
  report_getFinancialReport,
  report_taxAndServiceCharge_values,
} = useReportService();

const popover = ref();
</script>
<template>
  <section>
    <pre class="p-4 my-4 bg-gray-100 rounded-lg break-all" style="white-space: pre-wrap; word-wrap: break-word">
      {{ report_taxAndServiceCharge_values }}
    </pre>
    <AppBaseDataTable
      :columns="financialReport_taxAndServiceCharge_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-server-side-pagination
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Tax & Service Charge Report</h1>
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
            />
            <PrimeVueButton
              class="w-full text-black font-normal px-4 py-3"
              variant="text"
              label="Export to .csv"
            />
          </section>
        </PrimeVuePopover>
      </template>

      <template #filter>
        <CustomDatePicker
          v-model:start-date="report_queryParams.startDate"
          v-model:end-date="report_queryParams.endDate"
          :should-update-type="false"
          @update:start-date="report_getFinancialReport('tax-service')"
        />
      </template>
    </AppBaseDataTable>
  </section>
</template>
