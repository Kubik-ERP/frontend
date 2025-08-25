<script setup lang="ts">
const chartData = ref();
const chartOptions = ref();

const setChartData = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Sales',
        data: [500, 550, 500, 530, 540, 550, 560, 570, 580, 590, 600, 610],
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
          <span class="font-semibold text-black text-base"> Rp. 100.000 </span>

          <PrimeVueChip class="bg-secondary-background p-1">
            <AppBaseSvg name="arrow-up-success-circle" class="w-3 h-3" />

            <span class="font-semibold text-secondary-hover text-xs"> 10% </span>
          </PrimeVueChip>
        </section>
      </section>

      <section id="period">
        <span class="font-normal text-grayscale-70 text-xs"> January 2024 - December 2024 </span>
      </section>
    </section>

    <PrimeVueChart type="line" :data="chartData" :options="chartOptions" class="h-[20rem] lg:h-[30rem]" />
  </section>
</template>
