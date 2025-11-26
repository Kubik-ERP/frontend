import { defineStore } from 'pinia';

// Constants
import {
  SELF_ORDER_API_CATEGORIES,
  SELF_ORDER_API_CATEGORIES_PRODUCTS,
  SELF_ORDER_API_CUSTOMER_SIGNIN,
  SELF_ORDER_API_CUSTOMER_SIGNUP,
  SELF_ORDER_API_VERIFY,
} from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  ISelfOrderLoginPayload,
  ISelfOrderRegisterPayload,
  ISelfOrderStoreState,
  ISelfOrderVerifyPayload,
  ISelfOrderVerifyResponse,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';
import { useRoute } from 'vue-router';

/**
 * @description Helper function to add store header for self-order API calls
 */
function withStoreHeader(extra: AxiosRequestConfig = {}): AxiosRequestConfig {
  const route = useRoute();
  return {
    ...extra,
    headers: {
      ...(extra.headers || {}),
      'X-STORE-ID': (route.query.storeId as string) || '',
    },
  };
}

export const useSelfOrderStore = defineStore('selfOrder', {
  state: (): ISelfOrderStoreState => ({
    selfOrder_isLoading: false,
    selfOrderInvalid_isLoading: false,
    selfOrderLogin_isLoading: false,
    selfOrderRegister_isLoading: false,
  }),

  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },

  actions: {
    /**
     * @description Handle fetch api self-order categories
     * @url /self-order/categories/all
     * @method GET
     * @access public
     */
    async selfOrder_fetchCategory(requestConfigurations: AxiosRequestConfig = {}): Promise<unknown> {
      try {
        const response = await httpClient.get<unknown>(SELF_ORDER_API_CATEGORIES, {
          ...withStoreHeader(requestConfigurations),
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
     * @description Handle fetch api self-order category products
     * @url /self-order/categories/products
     * @method GET
     * @access public
     */
    async selfOrder_fetchCategoryProducts(
      categoryId: string,
      search: string,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      try {
        const response = await httpClient.get<unknown>(SELF_ORDER_API_CATEGORIES_PRODUCTS, {
          ...withStoreHeader(requestConfigurations),
          params: {
            categoryId,
            search,
          },
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
     * @description Handle self-order customer sign in
     * @url /self-order/customers/signin
     * @method GET
     * @access public
     */
    async selfOrderLogin_handleSignIn(
      params: ISelfOrderLoginPayload,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      this.selfOrderLogin_isLoading = true;

      try {
        const response = await httpClient.get<unknown>(SELF_ORDER_API_CUSTOMER_SIGNIN, {
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
        this.selfOrderLogin_isLoading = false;
      }
    },

    /**
     * @description Handle self-order customer sign up
     * @url /self-order/customers/signup
     * @method POST
     * @access public
     */
    async selfOrderRegister_handleSignUp(
      params: ISelfOrderRegisterPayload,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<unknown> {
      this.selfOrderRegister_isLoading = true;

      try {
        const response = await httpClient.post<unknown>(
          SELF_ORDER_API_CUSTOMER_SIGNUP,
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
        this.selfOrderRegister_isLoading = false;
      }
    },

    /**
     * @description Handle self-order verification
     * @url /self-order
     * @method POST
     * @access public
     */
    async selfOrder_handleVerify(
      params: ISelfOrderVerifyPayload,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<ISelfOrderVerifyResponse> {
      try {
        const response = await httpClient.post<ISelfOrderVerifyResponse>(SELF_ORDER_API_VERIFY, params, {
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

