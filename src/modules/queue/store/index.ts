// Constants
import { QUEUE_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IQueueListResponse, IQueueStateStore, IQueueListRequestQuery } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useQueueStore = defineStore('daily-sales', {
  state: (): IQueueStateStore => ({
    queue_isLoading: false,
    queue_invoiceLists: {
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 10,
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
      params: IQueueListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IQueueListResponse> {
      this.queue_isLoading = true;

      try {
        const response = await httpClient.get<IQueueListResponse>(QUEUE_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.queue_invoiceLists.data = response.data.data;

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.queue_isLoading = false;
      }
    },
  },
});
