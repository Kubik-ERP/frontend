import { defineStore } from 'pinia';

import { RouteLocationNormalizedLoadedGeneric, useRoute } from 'vue-router';

// Constants
import {
  CASHIER_BASE_INVOICE_ENDPOINT,
  CASHIER_ENDPOINT_CATEGORIES,
  CASHIER_ENDPOINT_COSTUMERS,
  CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
  CASHIER_ENDPOINT_PAYMENT_INSTANT,
  CASHIER_ENDPOINT_PAYMENT_METHOD,
  CASHIER_ENDPOINT_PAYMENT_PROCESS,
  CASHIER_ENDPOINT_PAYMENT_UNPAID,
  CASHIER_ENDPOINT_PRODUCTS,
  CASHIER_ENDPOINT_SIMULATE_PAYMENT,
} from '../constants/cashierApi.constant';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import { ICashierOrderSummaryPaymentMethodResponse } from '../interfaces/cashier-order-summary';
import {
  ICashierCategoriesHasProductResponse,
  ICashierCategoriesResponse,
  ICashierCustomerResponse,
  ICashierProduct,
  ICashierProductResponse,
  ICashierResponseCalulateEstimation,
  ICashierResponseMidtransQrisPayment,
  ICashierResponseProcessCheckout,
} from '../interfaces/cashier-response';

import { ICashierSelected, ICashierStateStore } from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';
import { ICustomerCreateResponse } from '@/modules/customer/interfaces/CustomersInterface';

function withStoreHeader(
  route: RouteLocationNormalizedLoadedGeneric,
  extra: AxiosRequestConfig = {},
): AxiosRequestConfig {
  if (route.name === 'self-order') {
    return {
      ...extra,
      headers: {
        ...(extra.headers || {}),
        'X-STORE-ID': route.query.storeId as string,
      },
    };
  }
  return extra;
}

export const useCashierStore = defineStore('cashier', {
  state: (): ICashierStateStore => ({
    cashierProduct_selectedProduct: [],
    cashierSelfOrder_isLoadingSignIn: false,
    cashierSelfOrder_isLoadingSignUp: false,
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
    async cashierProduct_fetchSearch(
      searchData: string,
      route: RouteLocationNormalizedLoadedGeneric,
    ): Promise<ICashierProduct[]> {
      try {
        const response = await httpClient.get<ICashierProductResponse>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_PRODUCTS + '/' + searchData,
          {
            headers: {
              'X-STORE-ID': route.query.storeId as string,
            },
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
     * @description Handle fetch api cashier product category
     * @url /api/categories
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategory(
      route: RouteLocationNormalizedLoadedGeneric,
      params: {
        page?: number;
        limit?: number;
      },
    ): Promise<ICashierCategoriesResponse> {
      try {
        const response = await httpClient.get<ICashierCategoriesResponse>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_CATEGORIES,
          withStoreHeader(route, { params }),
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
     * @description Handle fetch api cashier product category
     * @url /api/categories/{:categoryId}
     * @method GET
     * @access public
     */
    async cashierProduct_fetchCategoryByID(
      categoryId: string,
      route: RouteLocationNormalizedLoadedGeneric,
      params: {
        page?: number;
        limit?: number;
      },
    ): Promise<ICashierCategoriesHasProductResponse> {
      try {
        const response = await httpClient.get<ICashierCategoriesHasProductResponse>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_CATEGORIES + '/' + categoryId,

          withStoreHeader(route, {
            params,
          }),
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
        const route = useRoute();

        const response = await httpClient.get<ICashierProduct[]>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_CATEGORIES + '/' + categoryId,
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
     * @description Handle calculate payment estimation.
     * @url /payment/calculate/estimation
     * @method POST
     * @access public
     */
    async cashierProduct_calculateEstimation(
      payload: {
        voucherId?: string | null;
        products: unknown;
        orderType?: string;
      },
      route?: RouteLocationNormalizedLoadedGeneric,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseCalulateEstimation> {
      try {
        const response = await httpClient.post<ICashierResponseCalulateEstimation>(
          (route?.name === 'self-order' || route?.name === 'self-order-invoice' ? '/self-order' : '') +
            CASHIER_ENDPOINT_PAYMENT_CALCULATE_ESTIMATION,
          payload,

          withStoreHeader(route || useRoute(), requestConfigurations),
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
      payload: {
        products: ICashierSelected[];
        orderType: string;
        paymentMethodId: string;
        vouchers: string;
        customerId: string;
        tableCode: string;
        storeId: string;
      },
      route: RouteLocationNormalizedLoadedGeneric,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseProcessCheckout> {
      try {
        const response = await httpClient.post<ICashierResponseProcessCheckout>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_PAYMENT_PROCESS,
          payload,
          withStoreHeader(route, requestConfigurations),
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
      payload: {
        products: ICashierSelected[];
        orderType: string;
        provider: string;
        paymentMethodId: string;
        customerId: string | undefined;
        tableCode: string;
        storeId: string;
        paymentAmount: number | null;
        voucherId: string | null;
      },
      route: RouteLocationNormalizedLoadedGeneric,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseMidtransQrisPayment> {
      try {
        const response = await httpClient.post<ICashierResponseMidtransQrisPayment>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_PAYMENT_INSTANT,
          payload,

          withStoreHeader(route, requestConfigurations),
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
     * @description Handle payment for unpaid status.
     * @url /invoiceo/process/payment
     * @method POST
     * @access public
     */
    async cashierProduct_paymentUnpaid(
      payload: {
        provider: string;
        invoiceId: string;
        paymentMethodId: string;
      },
      route: RouteLocationNormalizedLoadedGeneric,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierResponseMidtransQrisPayment> {
      try {
        const response = await httpClient.post<ICashierResponseMidtransQrisPayment>(
          CASHIER_ENDPOINT_PAYMENT_UNPAID,
          payload,

          withStoreHeader(route, requestConfigurations),
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
      isSelfOrder: boolean,
      route: RouteLocationNormalizedLoadedGeneric,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICashierOrderSummaryPaymentMethodResponse> {
      try {
        const response = await httpClient.get<ICashierOrderSummaryPaymentMethodResponse>(
          (route.name === 'self-order' ? '/self-order' : '') + CASHIER_ENDPOINT_PAYMENT_METHOD,
          {
            ...withStoreHeader(route, requestConfigurations),

            params: {
              ...(requestConfigurations.params || {}),
              isSelfOrder,
            },
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
      payload: {
        order_id: string;
      },
      route: RouteLocationNormalizedLoadedGeneric,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      try {
        const response = await httpClient.post<unknown>(
          CASHIER_ENDPOINT_SIMULATE_PAYMENT,
          payload,

          withStoreHeader(route, requestConfigurations),
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

    async cashierProduct_handleEditOrder(
      payload: {
        invoiceId: string;
        products: ICashierSelected[];
      },
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<void> {
      try {
        const response = await httpClient.put<void>(
          `${CASHIER_BASE_INVOICE_ENDPOINT}/${payload.invoiceId}`,
          {
            products: payload.products.map(f => {
              return {
                productId: f.productId,
                quantity: f.quantity,
                variantId: f.variantId,
                notes: f.notes,
              };
            }),
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
      }
    },

    async cashierSelfOrder_handleSignIn(
      params: {
        code: string;
        number: string;
        storeId: string | null;
      },
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICustomerCreateResponse> {
      this.cashierSelfOrder_isLoadingSignIn = true;

      try {
        const response = await httpClient.get<ICustomerCreateResponse>('/self-order/customers/signin', {
          ...requestConfigurations,

          params: {
            ...params,
          },
        });

        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.cashierSelfOrder_isLoadingSignIn = false;
      }
    },

    async cashierSelfOrder_handleSignUp(
      params: {
        name: string;
        code: string;
        number: string;
        storeId: string | null;
      },
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ICustomerCreateResponse> {
      this.cashierSelfOrder_isLoadingSignIn = true;

      try {
        const response = await httpClient.post<ICustomerCreateResponse>(
          '/self-order/customers/signup',
          {
            ...params,
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
        this.cashierSelfOrder_isLoadingSignIn = false;
      }
    },
  },
});
