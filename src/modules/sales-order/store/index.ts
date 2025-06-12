// Constants
import { SALES_ORDER_INVOICE_BASE_ENDPOINT } from '../constants/sales-order-api.constant';

import { defineStore } from 'pinia';

// Interfaces
import { AxiosRequestConfig } from 'axios';
import { IDailySalesData, IDailySalesDataResponse } from '../interfaces/daily-sales.interface';

// Plugins
import httpClient from '@/plugins/axios';

export const useSalesOrderStore = defineStore('sales-order', {
  state: () => ({}),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    // handle fetch api sales order daily sales

    /**
     * @description Handle fetch api sales order daily sales
     * @url /api/invoice
     * @method GET
     */
    async salesOrder_fetchDailySales(requestConfigurations: AxiosRequestConfig = {}): Promise<IDailySalesData> {
      try {
        const response = await httpClient.get<IDailySalesDataResponse>(SALES_ORDER_INVOICE_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },
  },
});
