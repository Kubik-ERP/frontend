// Constants
import { QUEUE_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type { IQueueStateStore, IQueueListRequestBody, IQueueListResponse } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useQueueStore = defineStore('queue', {
  state: (): IQueueStateStore => ({
    queue_isLoading: false,
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
     * @method PUT
     * @access private
     */
    async fetchQueue_updateOrderStatus(
      id:string,
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
