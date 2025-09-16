// Plugins
import httpClient from '@/plugins/axios';

// type
import type { AxiosRequestConfig } from 'axios';
// import type { IDashboardStore, IDashboardQueryParams } from '../interfaces';

// constant
import {} from '../constants'

export const useDiscountStore = defineStore('discount', {
  state: () => ({
    productList_isLoading: false,
    productList_values: [],
  }),
  actions: {
    async fetchProductList(requestConfigurations: AxiosRequestConfig) {
      this.productList_isLoading = true;
      try {
        const params = {
          page: 1,
          limit: 10,
        };
        const response = await httpClient.get(`/products`, {
          params,
          ...requestConfigurations,
        });
        this.productList_values = response.data.data.products;
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
