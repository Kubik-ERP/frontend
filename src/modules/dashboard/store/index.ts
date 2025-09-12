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
          value: 0,
          percentageChange: 0,
        },
        totalCostOfGoodSold: {
          value: 0,
          percentageChange: 0,
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
          value: 0,
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
        value: 0,
        percentageChange: 0,
      },
      productSales: [],
      paymentMethods:[
        {
          label: 'Cash',
          value: 0,
        },
        {
          label: 'Qris',
          value: 0,
        }
      ],
      stockStatus: {
        stockStatus: {
          available: 0,
          outOfStock: 0,
          lowStock: 0,
        },
        detailedLowStock: {
          items: [
            
          ],
          count: 0,
        },
        detailedOutOfStock: {
          items: [
            
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
