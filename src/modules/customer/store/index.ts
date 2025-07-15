import {
  CUSTOMER_DETAILS_BASE_ENDPOINT,
  LOYALTY_POINTS_ENDPOINT,
  CUSTOMER_SALES_ORDER_ENDPOINT,
} from '../constants';

// import type { ICustomerDetailsRequestQuery } from '../interfaces/CustomerDetailInterface';

import type { AxiosRequestConfig } from 'axios';

import httpClient from '@/plugins/axios';

export const useCustomerDetailsStore = defineStore('customer-details', {
  state: () => ({
    customerDetails_isLoading: false,
    customerDetails: {},
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api customer -
     * @url /customer/{id}/details
     * @method GET
     * @access private
     */
    async salesInvoice_list(
      id: string,
      formattedParams: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.customerDetails_isLoading = true;
      try {
        const response = await httpClient.get(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${CUSTOMER_SALES_ORDER_ENDPOINT}/${id}${formattedParams}`,
          {
            ...requestConfigurations,
          },
        );
        this.customerDetails = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.customerDetails_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api customer - loyalty points
     * @url /customer/loyalty-points/{id}
     * @method GET
     * @access private
     */
    async loyaltyPoints_list(id: string, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      this.customerDetails_isLoading = true;
      try {
        const response = await httpClient.get(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${LOYALTY_POINTS_ENDPOINT}/${id}`,
          {
            ...requestConfigurations,
          },
        );
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.customerDetails_isLoading = false;
      }
    },
  },
});
