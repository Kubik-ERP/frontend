// interface
import type { IProductBundlingStore, IProductListRequestQuery, IProductListResponse } from '../interfaces';
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
  },
});
