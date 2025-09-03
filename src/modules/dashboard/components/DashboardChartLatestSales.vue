<script setup lang="ts">
import type { IDashboardProvided } from '../interfaces';
// inject
const {
  dashboard_queryParams,
  dashboard_values, // chart
  setChartData,
  setChartOptions,
  chartData,
  chartOptions,
} = inject<IDashboardProvided>('dashboard')!;

onMounted(() => {
  setChartData();
  setChartOptions();
});
</script>

<template>
  <section
    id="dashboard-chart-latest-sales"
    class="col-span-full lg:col-span-8 flex flex-col bg-white border border-solid border-grayscale-10 p-4 gap-4 rounded-sm"
  >
    <h5 class="font-semibold text-lg text-grayscale-70">Latest Sales</h5>

    <section id="detail-information" class="flex items-center justify-between">
      <section id="total-sales" class="flex flex-col gap-1">
        <span class="font-normal text-grayscale-70 text-xs">Total Sales</span>

        <section id="amount" class="flex items-center gap-1">
          <span class="font-semibold text-black text-base">
            {{ useCurrencyFormat({ data: dashboard_values.summary.totalSales.value }) }}
          </span>

          <PrimeVueChip
            class="py-1 px-2"
            :class="[
              dashboard_values.summary.totalSales.percentageChange < 0
                ? 'bg-error-background'
                : 'bg-secondary-background',
            ]"
          >
            <AppBaseSvg
              :name="
                dashboard_values.summary.totalSales.percentageChange < 0 ? 'arrow-down-danger' : 'arrow-up-success'
              "
              class="w-3 h-3"
            />

            <span class="font-semibold text-secondary-hover text-xs">
              {{ dashboard_values.summary.totalSales.percentageChange }}%
            </span>
          </PrimeVueChip>
        </section>
      </section>

      <section id="period">
        <span class="font-normal text-grayscale-70 text-xs">
          {{ useFormatDate(dashboard_queryParams.startDate, 'dd MMM yyyy') }} -
          {{ useFormatDate(dashboard_queryParams.endDate, 'dd MMM yyyy') }}
        </span>
      </section>
    </section>

    <PrimeVueChart type="line" :data="chartData" :options="chartOptions" class="h-[20rem] lg:h-[30rem]" />
  </section>
</template>
