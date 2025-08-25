<script setup lang="ts">
// components
import CustomDatePicker from '../components/CustomDatePicker.vue';
// service
import { useReportService } from '../services/report.service';
const { lossReport_columns } = useReportService();

const popover = ref();

const TEMPORARY_FORMDATA = reactive({
  // ... other properties
  start_date: new Date(),
  end_date: new Date(),
});
</script>
<template>
  <section>
    <AppBaseDataTable
      :columns="lossReport_columns"
      is-using-custom-header-prefix
      is-using-custom-header-suffix
      is-using-custom-filter
      is-using-server-side-pagination
    >
      <template #header-prefix>
        <h1 class="font-bold text-2xl text-text-primary">Loss Report</h1>
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
          v-model:start-date="TEMPORARY_FORMDATA.start_date"
          v-model:end-date="TEMPORARY_FORMDATA.end_date"
        />
      </template>
    </AppBaseDataTable>
  </section>
</template>
