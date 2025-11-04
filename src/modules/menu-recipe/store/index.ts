// Constants
import { MENU_RECIPE_BASE_ENDPOINT } from '../constants';

// Interfaces
import type { AxiosRequestConfig } from 'axios';
import type {
  IMenuRecipeCreateEditFormPayload,
  IMenuRecipeCreateEditResponse,
  IMenuRecipeDeleteResponse,
  IMenuRecipeDetailResponse,
  IMenuRecipeDetailVersionResponse,
  IMenuRecipeListQueryParams,
  IMenuRecipeListResponse,
  IMenuRecipeListVersionResponse,
  IMenuRecipeStateStore,
} from '../interfaces';

// Plugins
import httpClient from '@/plugins/axios';

export const useMenuRecipeStore = defineStore('menu-recipe', {
  state: (): IMenuRecipeStateStore => ({
    menuRecipe_selectedData: null,
    menuRecipe_isLoading: false,
    menuRecipe_lists: {
      meta: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      items: [],
    },
    menuRecipe_versions: null,
  }),
  getters: {
    /**
     * @description Usually, we define getters if the getter name is different from the state name.
     */
  },
  actions: {
    /**
     * @description Handle fetch api menu recipe - create
     * @url /recipes
     * @method POST
     * @access private
     */
    async menuRecipe_create(
      payload: IMenuRecipeCreateEditFormPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeCreateEditResponse> {
      this.menuRecipe_isLoading = true;

      try {
        const response = await httpClient.post<IMenuRecipeCreateEditResponse>(MENU_RECIPE_BASE_ENDPOINT, payload, {
          ...requestConfigurations,
        });

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipe_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api menu recipe - delete
     * @url /recipes/:id
     * @method DELETE
     * @access private
     */
    async menuRecipe_delete(
      menuRecipeId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeDeleteResponse> {
      this.menuRecipe_isLoading = true;

      try {
        const response = await httpClient.delete<IMenuRecipeDeleteResponse>(
          `${MENU_RECIPE_BASE_ENDPOINT}/${menuRecipeId}`,
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipe_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api menu recipe - detail
     * @url /recipes/:id
     * @method GET
     * @access private
     */
    async menuRecipe_detail(
      menuRecipeId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeDetailResponse> {
      this.menuRecipe_isLoading = true;

      try {
        const response = await httpClient.get<IMenuRecipeDetailResponse>(
          `${MENU_RECIPE_BASE_ENDPOINT}/${menuRecipeId}`,
          {
            ...requestConfigurations,
          },
        );

        this.menuRecipe_selectedData = response.data.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipe_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api menu recipe - detail version
     * @url /recipes/:id/versions/:versionId
     * @method GET
     * @access private
     */
    async menuRecipe_detailVersion(
      menuRecipeId: string,
      versionId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeDetailVersionResponse> {
      this.menuRecipe_isLoading = true;

      try {
        const response = await httpClient.get<IMenuRecipeDetailVersionResponse>(
          `${MENU_RECIPE_BASE_ENDPOINT}/${menuRecipeId}/versions/${versionId}`,
          {
            ...requestConfigurations,
          },
        );

        this.menuRecipe_selectedData = response.data.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipe_isLoading = false;
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
      this.menuRecipe_isLoading = true;

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
        this.menuRecipe_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api menu recipe - list versions
     * @url /recipes/:id/versions
     * @method GET
     * @access private
     */
    async menuRecipe_listVersions(
      menuRecipeId: string,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeListVersionResponse> {
      this.menuRecipe_isLoading = true;

      try {
        const response = await httpClient.get<IMenuRecipeListVersionResponse>(
          `${MENU_RECIPE_BASE_ENDPOINT}/${menuRecipeId}/versions`,
          {
            ...requestConfigurations,
          },
        );

        this.menuRecipe_versions = response.data.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipe_isLoading = false;
      }
    },

    /**
     * @description Handle fetch api menu recipe - update
     * @url /recipes/:id
     * @method PUT
     * @access private
     */
    async menuRecipe_update(
      menuRecipeId: string,
      payload: IMenuRecipeCreateEditFormPayload,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IMenuRecipeCreateEditResponse> {
      this.menuRecipe_isLoading = true;

      try {
        const response = await httpClient.put<IMenuRecipeCreateEditResponse>(
          `${MENU_RECIPE_BASE_ENDPOINT}/${menuRecipeId}`,
          payload,
          {
            ...requestConfigurations,
          },
        );

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.menuRecipe_isLoading = false;
      }
    },
  },
});
