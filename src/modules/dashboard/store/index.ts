// Plugins
import httpClient from '@/plugins/axios';

// constants
import { DASHBOARD_BASE_ENDPOINT } from '../constants';

// type
import type { AxiosRequestConfig } from 'axios';
import type { IDashboardStore, IDashboardQueryParams } from '../interfaces';

export const useDashboardStore = defineStore('dashboard', {
  state: (): IDashboardStore => ({
    dashboard_isLoading: false,
    dashboard_values: {
      summary: {
        totalSales: {
          value: 240000,
          percentageChange: 100,
        },
        totalCostOfGoodSold: {
          value: 240000,
          percentageChange: 100,
        },
        totalGrossProfit: {
          value: 0,
          percentageChange: 0,
        },
        totalNettProfit: {
          value: 0,
          percentageChange: 0,
        },
      },
      salesData: [
        {
          label: 'January',
          value: 0,
        },
        {
          label: 'February',
          value: 0,
        },
        {
          label: 'March',
          value: 0,
        },
        {
          label: 'April',
          value: 0,
        },
        {
          label: 'May',
          value: 0,
        },
        {
          label: 'June',
          value: 0,
        },
        {
          label: 'July',
          value: 0,
        },
        {
          label: 'August',
          value: 280000,
        },
        {
          label: 'September',
          value: 0,
        },
        {
          label: 'October',
          value: 0,
        },
        {
          label: 'November',
          value: 0,
        },
        {
          label: 'December',
          value: 0,
        },
      ],
      latestSales: {
        value: 280000,
        percentageChange: 100,
      },
      productSales: [],
      stockStatus: {
        stockStatus: {
          available: 1,
          outOfStock: 1,
          lowStock: 1,
        },
        detailedLowStock: {
          items: [
            {
              name: 'item',
              stock: 1,
              unit: 'gram',
              minimumStock: 10,
            },
          ],
          count: 0,
        },
        detailedOutOfStock: {
          items: [
            {
              name: 'Milk',
              stock: 0,
              unit: 'unit',
              minimumStock: 1,
            },
          ],
          count: 0,
        },
      },
    },
  }),
  actions: {
    async getDashboardData(params: IDashboardQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.dashboard_isLoading = true;
      try {
        const response = await httpClient.get(`${DASHBOARD_BASE_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        // console.log(response.data.data);
        this.dashboard_values = response.data.data;
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.dashboard_isLoading = false;
      }
    },
  },
});
