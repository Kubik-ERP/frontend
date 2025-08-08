import {
  CUSTOMER_DETAILS_BASE_ENDPOINT,
  LOYALTY_POINTS_ENDPOINT,
  CUSTOMER_SALES_ORDER_ENDPOINT,
  INCREASE_POINT_ENDPOINT,
  DECREASE_POINT_ENDPOINT,
} from '../constants';

// import type { ICustomerDetailsRequestQuery } from '../interfaces/CustomerDetailInterface';

import type { AxiosRequestConfig } from 'axios';

import type {
  ICustomerDetailsStore,
  ICustomerLoyaltyPointQuery,
  ICustomer_salesInvoice_list,
  IDecreasePoint,
  IIncreasePoint,
  IloyaltyPoints,
} from '../interfaces/CustomerDetailInterface';

import httpClient from '@/plugins/axios';

export const useCustomerDetailsStore = defineStore('customer-details', {
  state: (): ICustomerDetailsStore => ({
    loyaltyPoints_isLoading: false,
    customerDetails_isLoading: false,
    customerDetails: {
      id: '0014cc8a-748a-431b-a7f2-7449e1764f56',
    },
    loyaltyPoints_list: {
      total: 0,
      data: [],
      meta: {
        total: 0,
        page: 0,
        limit: 0,
        totalPages: 0,
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
     * @description Handle fetch api customer -
     * @url /customer/{id}/details
     * @method GET
     * @access private
     */
    async salesInvoice_list(
      id: string,
      formattedParams: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<ICustomer_salesInvoice_list> {
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
    async fetch_loyaltyPoints_list(
      id: string,
      requestConfigurations: AxiosRequestConfig,
      params: ICustomerLoyaltyPointQuery,
    ): Promise<IloyaltyPoints> {
      this.loyaltyPoints_isLoading = true;
      try {
        const response = await httpClient.get(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${LOYALTY_POINTS_ENDPOINT}/${id}`,
          {
            params,
            ...requestConfigurations,
          },
        );
        this.loyaltyPoints_list = response.data.data.points;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.loyaltyPoints_isLoading = false;
      }
    },

    async increasePoint_onSubmit(
      requestConfigurations: AxiosRequestConfig,
      data: IIncreasePoint,
      customer_id: string,
    ): Promise<IloyaltyPoints> {
      this.loyaltyPoints_isLoading = true;
      try {
        const response = await httpClient.post(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${LOYALTY_POINTS_ENDPOINT}${INCREASE_POINT_ENDPOINT}`,
          {
            customer_id: customer_id,
            value: data.point,
            expiry_date:
              data.isHaveExpiryDate === 'No Expiry Date' ? null : useFormatDateLocal(data.ExpiryDate as Date),
            notes: data.notes,
          },
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
        this.loyaltyPoints_isLoading = false;
      }
    },
    async increasePoint_onEdit(
      requestConfigurations: AxiosRequestConfig,
      id:string,
      data: IIncreasePoint,
      customer_id: string,
    ): Promise<IloyaltyPoints> {
      this.loyaltyPoints_isLoading = true;
      try {
        const response = await httpClient.patch(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${LOYALTY_POINTS_ENDPOINT}/${id}`,
          {
            customer_id: customer_id,
            value: data.point,
            expiry_date:
              data.isHaveExpiryDate === 'No Expiry Date' ? null : useFormatDateLocal(data.ExpiryDate as Date),
            notes: data.notes,
          },
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
        this.loyaltyPoints_isLoading = false;
      }
    },

    async decreasePoint_onSubmit(
      requestConfigurations: AxiosRequestConfig,
      data: IDecreasePoint,
      customerId: string,
    ): Promise<IloyaltyPoints> {
      this.loyaltyPoints_isLoading = true;
      try {
        const response = await httpClient.post(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${LOYALTY_POINTS_ENDPOINT}${DECREASE_POINT_ENDPOINT}`,
          {
            customer_id: customerId,
            value: data.point,
            notes: data.notes,
          },
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
        this.loyaltyPoints_isLoading = false;
      }
    },
    async decreasePoint_onEdit(
      requestConfigurations: AxiosRequestConfig,
      data: IDecreasePoint,
      id: string,
      customerId: string,
    ): Promise<IloyaltyPoints> {
      this.loyaltyPoints_isLoading = true;
      try {
        const response = await httpClient.patch(
          `${CUSTOMER_DETAILS_BASE_ENDPOINT}${LOYALTY_POINTS_ENDPOINT}/${id}`,
          {
            customer_id: customerId,
            value: data.point,
            notes: data.notes,
          },
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
        this.loyaltyPoints_isLoading = false;
      }
    },
  },
});
