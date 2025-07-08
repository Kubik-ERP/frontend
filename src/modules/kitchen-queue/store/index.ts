// Interfaces
import type { AxiosRequestConfig } from 'axios';

// Plugins
import httpClient from '@/plugins/axios';
import { IKitchenQueueData, IKitchenQueueListResponse, IKitchenQueueStateStore } from '../interfaces';
import { KITCHEN_QUEUE_INVOICE } from '../constants/kitchen-queue-api.constant';

export const useKitchenQueueStore = defineStore('daily-sales', {
  state: (): IKitchenQueueStateStore => ({
    kitchenQueue_isLoading: false,
    kitchenQueue_invoices: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle
     * @url /
     * @method GET
     * @access private
     */
    async kitchenQueue_list(
      params: unknown,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IKitchenQueueData[]> {
      this.kitchenQueue_isLoading = true;

      try {
        const response = await httpClient.get<IKitchenQueueListResponse>(KITCHEN_QUEUE_INVOICE, {
          params,
          ...requestConfigurations,
        });

        this.kitchenQueue_invoices = response.data.data;

        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.kitchenQueue_isLoading = false;
      }
    },
  },
});
