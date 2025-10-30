// Constants
import { QUEUE_BASE_ENDPOINT, DAILY_SALES_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IQueueStateStore,
  IQueueListRequestBody,
  IQueueListResponse,
  IDailySalesListRequestQuery,
  IDailySalesListResponse,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useQueueStore = defineStore('queue', {
  state: (): IQueueStateStore => ({
    queue_isLoading: false,
    dailySales_invoiceLists: {
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 10,
          totalPages: 1,
        },
        queueStatusCounts: {
          inProgress: 0,
          placed: 0,
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
      this.queue_isLoading = true;

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
        this.queue_isLoading = false;
      }
    },
    /**
     * @description Handle fetch api daily sales - get invoice lists
     * @url /invoice
     * @method PUT
     * @access private
     */
    async fetchQueue_updateOrderStatus(
      id: string,
      body: IQueueListRequestBody,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IQueueListResponse> {
      this.queue_isLoading = true;

      try {
        const response = await httpClient.put<IQueueListResponse>(`${QUEUE_BASE_ENDPOINT}/${id}`, body, {
          ...requestConfigurations,
        });

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
