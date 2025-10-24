// Constants
import { MENU_RECIPE_BASE_ENDPOINT } from '@/modules/menu-recipe/constants';
import { BATCH_BASE_ENDPOINT } from '../constants';
// interfaces
import type {
  IMenuRecipeListQueryParams,
  IMenuRecipeListResponse,
  IMenuRecipeDetailResponse,
} from '@/modules/menu-recipe/interfaces';
import type { AxiosRequestConfig } from 'axios';
import type { IBatchStateStore, IBatchFormData } from '../interfaces';

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
    async batch_create(payload: IBatchFormData, requestConfigurations: AxiosRequestConfig): Promise<unknown> {
      const data = {
        recipeId : payload.recipe.id,
        date: useFormatDateLocal(payload.batchDate),
        batchTargetYield: payload.targetYield,
        notes: payload.notes,
        batchWaste: payload.waste
      }
      try {
        const response = await httpClient.post(BATCH_BASE_ENDPOINT, data, {
          ...requestConfigurations,
        });
        return response.data;
      } catch (error: unknown) {
        if (error instanceof Error) return Promise.reject(error);
        else return Promise.reject(new Error(String(error)));
      }
    },

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
