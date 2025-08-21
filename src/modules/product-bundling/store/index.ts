// constants
import { PRODUCT_BUNDLING_BASE_ENDPOINT } from '../constants';
// interface
import type {
  IProductBundlingStore,
  IProductListRequestQuery,
  IProductListResponse,
  IProductBundlingPayload,
} from '../interfaces';
import type { AxiosRequestConfig } from 'axios';
// Plugins
import httpClient from '@/plugins/axios';
export const useProductBundlingStore = defineStore('product-bundling', {
  state: (): IProductBundlingStore => ({
    productList_isLoading: false,
    productBundling_productList: [
      {
        id: '',
        name: '',
        categories: '',
        price: 0,
        discountPrice: 0,
        quantity: 0,
      },
    ],
    productBundling_list: {
      data: [],
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
    },
  }),
  getters: {},
  actions: {
    async productBundling_fetchProductList(
      params: IProductListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      this.productList_isLoading = true;
      try {
        const response = await httpClient.get(`/products`, {
          params,
          ...requestConfigurations,
        });
        this.productBundling_productList = response.data.data.products.map((product: IProductListResponse) => {
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            discountPrice: product.discountPrice,
            categories: (product.categoriesHasProducts as { categories: { id: string; category: string } }[]).map(
              ({ categories }) => categories.category,
            ),
          };
        });
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

    async productBundling_fetchProductBundlingList(
      params: IProductListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      try {
        const response = await httpClient.get(`${PRODUCT_BUNDLING_BASE_ENDPOINT}`, {
          params,
          ...requestConfigurations,
        });
        this.productBundling_list = response.data.data;
        return Promise.resolve(response.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    async productBundling_fetchCreateProductBundlingList(
      payload: IProductBundlingPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      try {
        const response = await httpClient.post(
          `${PRODUCT_BUNDLING_BASE_ENDPOINT}`,
          payload,
          requestConfigurations,
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

    async productBundling_fetchUpdateProductBundlingList(
      payload: IProductBundlingPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      try {
        const response = await httpClient.patch(
          `${PRODUCT_BUNDLING_BASE_ENDPOINT}/${payload.id}`,
          payload,
          requestConfigurations,
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

    async productBundling_fetchProductBundlingDetails(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      try {
        const response = await httpClient.get(`${PRODUCT_BUNDLING_BASE_ENDPOINT}/${id}`, requestConfigurations);
        return Promise.resolve(response.data.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error(error);
        } else {
          console.error(new Error(String(error)));
        }
      }
    },

    async productBundling_fetchDeleteProductBundlingList(
      id: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<unknown> {
      try {
        const response = await httpClient.delete(`${PRODUCT_BUNDLING_BASE_ENDPOINT}/${id}`, requestConfigurations);
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
