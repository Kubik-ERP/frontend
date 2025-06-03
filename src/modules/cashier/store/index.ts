import { defineStore } from 'pinia';

// Constants
import {
  CASHIER_ENDPOINT_CATEGORIES,
  CASHIER_ENDPOINT_COSTUMERS,
  CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
  CASHIER_ENDPOINT_PAYMENT_INSTANT,
  CASHIER_ENDPOINT_PAYMENT_METHOD,
  CASHIER_ENDPOINT_PAYMENT_PROCESS,
  CASHIER_ENDPOINT_PRODUCTS,
  CASHIER_ENDPOINT_SIMULATE_PAYMENT,
} from '../constants/cashierApi.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import { ICashierOrderSummaryPaymentMethodResponse } from '../interfaces/cashier-order-summary';
import {
  ICashierCategoriesData,
  ICashierCategoriesResponse,
  ICashierCustomerResponse,
  ICashierProduct,
  ICashierProductResponse,
  ICashierResponseCalulateEstimation,
  ICashierResponseMidtransQrisPayment,
  ICashierResponseProcessCheckout,
} from '../interfaces/cashier-response';

// Plugins
import httpClient from '@/plugins/axios';
import { ICashierStateStore } from '../interfaces';

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashierProduct_selectedProduct: [],
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api cashier search.
     * @url /api/products
     * @method GET
     * @access public
     */
    async cashierProduct_fetchSearch(searchData: string): Promise<ICashierProduct[]> {
      try {
        const response = await httpClient.get<ICashierProductResponse>(
          CASHIER_ENDPOINT_PRODUCTS + '/' + searchData,
        );

        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle fetch api cashier product category
     * @url /api/categories
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategory(
      categoryId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierCategoriesData> {
      try {
        const response = await httpClient.get<ICashierCategoriesResponse>(
          CASHIER_ENDPOINT_CATEGORIES + '/' + categoryId,
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle fetch api product per category
     * @url /api/categories/:categoryId
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategoryById(
      categoryId: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierProduct[]> {
      try {
        const response = await httpClient.get<ICashierProduct[]>(CASHIER_ENDPOINT_CATEGORIES + '/' + categoryId, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle calculate payment estimation.
     * @url /payment/calculate/estimation
     * @method POST
     * @access public
     */
    async cashierProduct_calculateEstimation(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseCalulateEstimation> {
      try {
        const response = await httpClient.post<ICashierResponseCalulateEstimation>(
          CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
          payload,
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
      }
    },

    /**
     * @description Handle payment process.
     * @url /payment/process
     * @method POST
     * @access public
     */
    async cashierProduct_paymentProcess(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseProcessCheckout> {
      try {
        const response = await httpClient.post<ICashierResponseProcessCheckout>(
          CASHIER_ENDPOINT_PAYMENT_PROCESS,
          payload,
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
      }
    },

    /**
     * @description Handle payment process.
     * @url /payment/process
     * @method POST
     * @access public
     */
    async cashierProduct_paymentInstant(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseMidtransQrisPayment> {
      try {
        const response = await httpClient.post<ICashierResponseMidtransQrisPayment>(
          CASHIER_ENDPOINT_PAYMENT_INSTANT,
          payload,
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
      }
    },

    /**
     * @description Handle fetch get payment method.
     * @url /cashier/product
     * @method GET
     * @access public
     */
    async cashierProduct_fetchPaymentMethod(
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierOrderSummaryPaymentMethodResponse> {
      try {
        const response = await httpClient.get<ICashierOrderSummaryPaymentMethodResponse>(
          CASHIER_ENDPOINT_PAYMENT_METHOD,
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
      }
    },

    /**
     * @description Handle simulate payment.
     * @url /cashier/simulate-payment
     * @method POST
     * @access public
     */
    async cashierProduct_simulatePayment(
      payload: unknown,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      try {
        const response = await httpClient.post<unknown>(CASHIER_ENDPOINT_SIMULATE_PAYMENT, payload, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    /**
     * @description Handle fetch list customers.
     * @url /customers
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCustomers(
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierCustomerResponse> {
      try {
        const response = await httpClient.get<ICashierCustomerResponse>(CASHIER_ENDPOINT_COSTUMERS, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
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
