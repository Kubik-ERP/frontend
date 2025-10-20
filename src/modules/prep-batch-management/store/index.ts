// Constants
import { MENU_RECIPE_BASE_ENDPOINT } from '@/modules/menu-recipe/constants';
// interfaces
import type {
  IMenuRecipeListQueryParams,
  IMenuRecipeListResponse,
  IMenuRecipeDetailResponse,
} from '@/modules/menu-recipe/interfaces';
import type { AxiosRequestConfig } from 'axios';
import type { IBatchStateStore } from '../interfaces';

// plugins
import httpClient from '@/plugins/axios';

export const useBatchStore = defineStore('batch', {
  state: (): IBatchStateStore => ({
    menuRecipe_lists: {
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      items: [],
    },
    menuRecipeList_isLoading: false,
    menuRecipe_ingredients: [],
  }),
  getters: {},
  actions: {
    /**
     * @description Handle fetch api menu recipe - list
     * @url /recipes?query
     * @method GET
     * @access private
     */
    async menuRecipe_list(
      params: IMenuRecipeListQueryParams,
      requestConfigurations: AxiosRequestConfig = {},
    ): Promise<IMenuRecipeListResponse> {
      this.menuRecipeList_isLoading = true;

      try {
        const response = await httpClient.get<IMenuRecipeListResponse>(MENU_RECIPE_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.menuRecipe_lists = response.data.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipeList_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api menu recipe - detail
     * @url /recipes/:id
     * @method GET
     * @access private
     */
    async menuRecipe_ingridients(
      menuRecipeId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeDetailResponse> {
      this.menuRecipeList_isLoading = true;

      try {
        const response = await httpClient.get<IMenuRecipeDetailResponse>(
          `${MENU_RECIPE_BASE_ENDPOINT}/${menuRecipeId}`,
          {
            ...requestConfigurations,
          },
        );

        this.menuRecipe_ingredients = response.data.data.ingredients;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipeList_isLoading = false;
      }
    },
  },
});
