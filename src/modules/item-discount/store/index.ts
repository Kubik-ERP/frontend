// Plugins
import httpClient from '@/plugins/axios';

// type
import type { AxiosRequestConfig } from 'axios';
import type { IProductListQueryParams, IProductListResponse, IItemDiscountFormData } from '../interfaces';

// constant
import { PRODUCTS_BASE_ENDPOINT,PRODUCTS_DISCOUNT_ENDPOINT } from '../constants';

export const useDiscountStore = defineStore('discount', {
  state: () => ({
    productList_isLoading: false,
    productDiscount_isLoading: false,
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

    async patchDiscountPrice(productIds: string[], payload: IItemDiscountFormData, requestConfigurations: AxiosRequestConfig) {
      this.productDiscount_isLoading = true;
      const formData = {
        productIds: productIds,
        value: payload.discountValue,
        isPercent: payload.isPercent,
      }
      try {
        const response = await httpClient.patch(`${PRODUCTS_DISCOUNT_ENDPOINT}`, formData, {
          ...requestConfigurations,
        });
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      } finally {
        this.productDiscount_isLoading = false;
      }
    },
  },
});
