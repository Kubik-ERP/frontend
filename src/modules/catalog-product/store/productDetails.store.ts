// constant
import { PRODUCT_API_BASE_ENDPOINT } from '../constants';
// type
import type { IProductDetailsStateStore, IProductDetails } from '../interfaces';
import type { AxiosRequestConfig } from 'axios';
// plugins
import httpClient from '@/plugins/axios';
export const useProductDetailsStore = defineStore('product-details', {
  state: (): IProductDetailsStateStore => ({
    productDetails_isLoading: false,
    productDetails: {
      id: '64adf394-d6d7-4f44-bb44-0e8f13b17d03',
      photoUrl: '1757395160529-227739470.webp',
      name: 'Super Giant',
      categories: ['Super', 'Giant'],
      menuRecipes: [
        {
          recipeId: '64adf394-d6d7-4f44-bb44-0e8f13b17d03',
          recipeName: 'Recipe Super Giant',
        },
      ],
      price: 92000,
      discountPrice: 90000,
      productVariant: [
        {
          name: 'Original1',
          additionalPrice: 0,
        },
        {
          name: 'Pedas',
          additionalPrice: 10000,
        },
      ],
      portionStock: [
        {
          batchName: 'BATCH-0001',
          batchDate: new Date('2023-01-01'),
          batchActualPortion: 100,
          batchPortionLeft: 100,
          difference: 0,
        },
      ],
    } as IProductDetails,
  }),
  actions: {
    /**
     * @description Fetch product details by id
     * @param id The id of the product
     * @param requestConfigurations The configuration of the axios request
     * @returns A promise that resolves with the product details
     * @throws If the request fails, it will throw an error
     */
    async fetchProductDetails(id: string, requestConfigurations: AxiosRequestConfig) {
      try {
        const response = await httpClient.get(`${PRODUCT_API_BASE_ENDPOINT}/${id}`, requestConfigurations);
        this.productDetails = response.data.data;
        this.productDetails.photoUrl = response.data.data.pictureUrl;
        this.productDetails.productVariant = response.data.data.variantHasProducts.map(
          (item: { variant: { name: string; price: number } }) => {
            return {
              name: item.variant.name,
              additionalPrice: item.variant.price,
            };
          },
        );
        this.productDetails.categories = response.data.data.categoriesHasProducts.map(
          (item: { categories: { category: string } }) => {
            // Return the string directly
            return item.categories.category;
          },
        );
        this.fetchProductStockAdjustmentList(id, requestConfigurations);
      } catch (error: unknown) {
        if (error instanceof Error) {
          return Promise.reject(error);
        } else {
          return Promise.reject(new Error(String(error)));
        }
      }
    },

    async fetchProductStockAdjustmentList(id: string, requestConfigurations: AxiosRequestConfig) {
      try {
        const response = await httpClient.get(
          `${PRODUCT_API_BASE_ENDPOINT}/${id}/portion-stock-adjustments`,
          requestConfigurations,
        );
        this.productDetails.portionStock = response.data.data.items;
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
