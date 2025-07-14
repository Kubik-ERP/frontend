import { CUSTOMER_WAITING_LIST_BASE_ENDPOINT } from '../constants';

import type { AxiosRequestConfig } from 'axios';
import httpClient from '@/plugins/axios';

export const useCustomerWaitingListStore = defineStore('customer-waiting-list', {
  state: () => ({
    customerWaitingList_isLoading: false,
    customerWaitingList_lists: [],
  }),
  actions: {
    /**
     * @description Handle fetch api daily sales - get invoice lists
     * @url /invoice
     * @method GET
     * @access private
     */
    async customerWaitingList(
      requestConfigurations: AxiosRequestConfig,
    ) {
      try {
        this.customerWaitingList_isLoading = true;

        const response = await httpClient.get(CUSTOMER_WAITING_LIST_BASE_ENDPOINT, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.customerWaitingList_isLoading = false;
      }
    },
  },
});
