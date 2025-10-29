// types
import type { IRecipeList, IProductStateStore } from '../interfaces';
import type { AxiosRequestConfig } from 'axios';
// constants
import { MENU_RECIPE_BASE_ENDPOINT } from '@/modules/menu-recipe/constants';
// Plugins
import httpClient from '@/plugins/axios';
export const useProductDetailsStore = defineStore('product', {
  state: (): IProductStateStore => ({
    recipeList_values: [] as IRecipeList[],
  }),
  actions: {
    async fetchRecipeList(searchQuery: string, requestConfigurations: AxiosRequestConfig) {
      try {
        const response = await httpClient.get(MENU_RECIPE_BASE_ENDPOINT, {
          params: {
            search: searchQuery,
            page: 1,
            pageSize: 100,
          },
          ...requestConfigurations,
        });
        this.recipeList_values = response.data.data.items;
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
