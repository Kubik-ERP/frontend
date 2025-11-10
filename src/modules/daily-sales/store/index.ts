// Constants
import { DAILY_SALES_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IDailySalesListResponse, IDailySalesStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';
import { IDailySalesListRequestQuery } from '../interfaces/daily-sales-list.interface';

export const useDailySalesStore = defineStore('daily-sales', {
  state: (): IDailySalesStateStore => ({
    dailySales_isLoading: false,
    dailySales_invoiceLists: {
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    },
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api daily sales - get invoice lists
     * @url /invoice
     * @method GET
     * @access private
     */
    async dailySales_list(
      params: IDailySalesListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IDailySalesListResponse> {
      this.dailySales_isLoading = true;

      try {
        const response = await httpClient.get<IDailySalesListResponse>(DAILY_SALES_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.dailySales_invoiceLists.data = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.dailySales_isLoading = false;
      }
    },
  },
});
