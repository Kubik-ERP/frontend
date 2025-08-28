<script setup lang="ts">
import type { IDashboardProvided } from '../interfaces';
// inject
const { dashboard_queryParams, dashboard_values } = inject<IDashboardProvided>('dashboard')!;

const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: dashboard_values.value.monthlySalesData.map(item => item.sales),
        fill: false,
        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
        tension: 0.4,
      },
    ],
  };
};

const setChartOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--p-text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
  const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
      y: {
        ticks: {
          color: textColorSecondary,
        },
        grid: {
          color: surfaceBorder,
        },
      },
    },
  };
};

onMounted(() => {
  chartData.value = setChartData();
  chartOptions.value = setChartOptions();
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
            {{ useCurrencyFormat({ data: dashboard_values.latestSales.value }) }}
          </span>

          <PrimeVueChip
            class="py-1 px-2"
            :class="[
              dashboard_values.latestSales.percentageChange < 0
                ? 'bg-error-background'
                : 'bg-secondary-background',
            ]"
          >
            <AppBaseSvg
              :name="dashboard_values.latestSales.percentageChange < 0 ? 'arrow-down-danger' : 'arrow-up-success'"
              class="w-3 h-3"
            />

            <span class="font-semibold text-secondary-hover text-xs">
              {{ dashboard_values.latestSales.percentageChange }}%
            </span>
          </PrimeVueChip>
        </section>
      </section>

      <section id="period">
        <span class="font-normal text-grayscale-70 text-xs">
          January {{ dashboard_queryParams.startDate.getFullYear() }} - December
          {{ dashboard_queryParams.endDate.getFullYear() }}
        </span>
      </section>
    </section>

    <PrimeVueChart type="line" :data="chartData" :options="chartOptions" class="h-[20rem] lg:h-[30rem]" />
  </section>
</template>
