// store
import { useAuthenticationStore } from '@/modules/authentication/store';
import { useDashboardStore } from '../store';

// interface
import type { IDashboardProvided, IDashboardQueryParams } from '../interfaces';
export const useDashboardService = (): IDashboardProvided => {
  const authenticationStore = useAuthenticationStore();
  const { authentication_userData } = storeToRefs(authenticationStore);

  const store = useDashboardStore();
  const { dashboard_isLoading, dashboard_values } = storeToRefs(store);

  const { httpAbort_registerAbort } = useHttpAbort();

  const dashboard_queryParams = reactive<IDashboardQueryParams>({
    startDate: new Date(),
    endDate: new Date(),
    type: 'time',
  });

  watch(
    () => dashboard_queryParams,
    debounce(async () => {
      await dashboard_getSummary();
      chartData.value = setChartData();
      chartOptions.value = setChartOptions();
    }, 500),
    { deep: true, immediate: true },
  );

  // chart
  const chartData = ref();
  const chartOptions = ref();

  /**
   * This function will set the chart data
   * @returns {object} chart data
   */
  const setChartData = (): object => {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
      labels: dashboard_values.value.salesData.map(item => item.label),
      datasets: [
        {
          label: 'Sales',
          data: dashboard_values.value.salesData.map(item => item.value),
          fill: false,
          borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
          tension: 0.4,
        },
      ],
    };
  };

  /**
   * This function will set the chart options
   * @returns {object} chart options
   * @description
   * This function will return an object that contains the options for the chart.
   * The options include the aspect ratio, the legend options, and the scales options.
   * The scales options include the x and y scales, and the options for the ticks and grid.
   * The ticks and grid will be colored using the secondary color and the surface border color.
   */
  const setChartOptions = (): object => {
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
          min: 0,
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

  const dashboard_getSummary = async () => {
    try {
      const formattedQueryParams: IDashboardQueryParams = {
        startDate: (new Date(dashboard_queryParams.startDate).toISOString().split('T')[0] +
          'T00:00:00.000Z') as unknown as Date,
        endDate: (new Date(dashboard_queryParams.endDate).toISOString().split('T')[0] +
          'T23:59:59.999Z') as unknown as Date,
        type: dashboard_queryParams.type,
      };
      await store.getDashboardData(formattedQueryParams, {
        ...httpAbort_registerAbort('DASHBOARD_SUMMARY_REQUEST'),
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error);
      } else {
        console.error(new Error(String(error)));
      }
    }
  };

  return {
    authentication_userData,
    dashboard_queryParams,
    dashboard_isLoading,
    dashboard_values,
    dashboard_getSummary,

    // chart
    setChartData,
    setChartOptions,
    chartData,
    chartOptions,
  };
};
