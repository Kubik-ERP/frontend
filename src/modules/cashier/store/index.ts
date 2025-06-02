import { defineStore } from 'pinia';

// Constants
import {
  CASHIER_ENDPOINT_CATEGORIES,
  CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
  CASHIER_ENDPOINT_PAYMENT_INSTANT,
  CASHIER_ENDPOINT_PAYMENT_METHOD,
  CASHIER_ENDPOINT_PAYMENT_PROCESS,
  CASHIER_ENDPOINT_PRODUCTS,
  CASHIER_ENDPOINT_SIMULATE_PAYMENT,
} from '../constants/cashierApi.constant';

import {
  CASHIER_DUMMY_LIST_CATEGORY,
  CASHIER_DUMMY_LIST_DRINK,
  CASHIER_DUMMY_LIST_FEATURED_PRODUCT,
  CASHIER_DUMMY_LIST_FOOD,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import { ICashierProduct, ICashierStateStore } from '../interfaces';
import { ICashierOrderSummaryPaymentMethodResponse } from '../interfaces/cashier-order-summary';
import {
  ICashierResponseCalulateEstimation,
  ICashierResponseMidtransQrisPayment,
  ICashierResponseProcessCheckout,
} from '../interfaces/cashier-response';

// Plugins
import httpClient from '@/plugins/axios';

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashierProduct_selectedProduct: [
      {
        product: {} as ICashierProduct,
        variant: {} as ICashierProduct['variant'][0],
        productId: '0196cf23-e3fb-7caa-b7be-f08248b20a33',
        variantId: '0196cf23-e3fb-70cf-a3ff-443bf28e7f0e',
        quantity: 1,
        notes: 'Ini adalah catatan',
      },
    ],
    cashierProduct_listCategory: CASHIER_DUMMY_LIST_CATEGORY,

    cashierProduct_listFeaturedProduct: CASHIER_DUMMY_LIST_FEATURED_PRODUCT,

    cashierProduct_listFood: CASHIER_DUMMY_LIST_FOOD,

    cashierProduct_listDrink: CASHIER_DUMMY_LIST_DRINK,
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
        const response = await httpClient.get<ICashierProduct[]>(CASHIER_ENDPOINT_PRODUCTS + '/' + searchData);

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
     * @description Handle fetch api cashier product category
     * @url /api/categories
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategory(
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
  },
});
