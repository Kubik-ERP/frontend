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
      monthlySalesData: [
        {
          month: 'January',
          sales: 0,
        },
        {
          month: 'February',
          sales: 0,
        },
        {
          month: 'March',
          sales: 0,
        },
        {
          month: 'April',
          sales: 0,
        },
        {
          month: 'May',
          sales: 0,
        },
        {
          month: 'June',
          sales: 0,
        },
        {
          month: 'July',
          sales: 0,
        },
        {
          month: 'August',
          sales: 280000,
        },
        {
          month: 'September',
          sales: 0,
        },
        {
          month: 'October',
          sales: 0,
        },
        {
          month: 'November',
          sales: 0,
        },
        {
          month: 'December',
          sales: 0,
        },
      ],
      latestSales: {
        value: 280000,
        percentageChange: 100,
      },
      productSales: [
        {
          name: 'Sausage McMuffin',
          quantity: 6,
        },
        {
          name: 'Egg & Cheese Muffin',
          quantity: 1,
        },
      ],
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
        console.log(response.data.data);
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
