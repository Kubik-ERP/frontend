// Plugins
import httpClient from '@/plugins/axios';

// type
import type { AxiosRequestConfig } from 'axios';
import type { IProductListQueryParams, IProductListResponse } from '../interfaces';

// constant
import { PRODUCTS_BASE_ENDPOINT } from '../constants';

export const useDiscountStore = defineStore('discount', {
  state: () => ({
    productList_isLoading: false,
    productList_values: {} as IProductListResponse,
  }),
  actions: {
    async fetchProductList(params: IProductListQueryParams, requestConfigurations: AxiosRequestConfig) {
      this.productList_isLoading = true;
      try {
        const response = await httpClient.get(`${PRODUCTS_BASE_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        this.productList_values = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.productList_isLoading = false;
      }
    },
  },
});
