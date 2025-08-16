import { AxiosRequestConfig } from "axios";
import { defineStore } from "pinia";
import {
  IInventoryCategoryActionResponse,
  IInventoryCategoryCreateUpdatePayload,
  IInventoryCategoryListResponse,
  IInventoryCategoryStateStore,
  IInventoryCategory,
} from "../interfaces";
import { IInventoryCategoryListRequestQuery } from "../interfaces/inventory-category-list.interface";
import httpClient from "@/plugins/axios";
import { INVENTORY_CATEGORY_BASE_ENDPOINT } from "../constants";

export const useInventoryCategoryStore = defineStore('inventory-category', {
  state: (): IInventoryCategoryStateStore & {
    inventoryCategoryFormMode: 'create' | 'edit';
    inventoryCategory_editingItem: IInventoryCategory | null;
  } => ({
    inventoryCategoryList_isLoading: false,
    inventoryCategoryList: {
      statusCode: 200,
      message: '',
      data: {
        items: [],
        meta: {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 1,
        },
      },
    },
    // NEW: shared form mode & editing item
    inventoryCategoryFormMode: 'create',
    inventoryCategory_editingItem: null,
  }),

  actions: {
    // NEW helper to set mode + editing item
    setFormMode(mode: 'create' | 'edit', item: IInventoryCategory | null = null) {
      this.inventoryCategoryFormMode = mode;
      this.inventoryCategory_editingItem = item;
    },

    /**
     * @description Usually, we define actions if the action name is different from the state name.
     */
    async inventoryCategoryList_fetchList(
      params: IInventoryCategoryListRequestQuery,
      requestConfigurations: AxiosRequestConfig,
    ): Promise<IInventoryCategoryListResponse> {
      this.inventoryCategoryList_isLoading = true;

      try {
        const response = await httpClient.get<IInventoryCategoryListResponse>(INVENTORY_CATEGORY_BASE_ENDPOINT, {
          params,
          ...requestConfigurations,
        });

        this.inventoryCategoryList = response.data;

        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        this.inventoryCategoryList_isLoading = false;
      }
    },

    async inventoryCategoryList_createCategory(payload: IInventoryCategoryCreateUpdatePayload): Promise<IInventoryCategoryActionResponse> {
      try {
        const response = await httpClient.post<IInventoryCategoryActionResponse>(INVENTORY_CATEGORY_BASE_ENDPOINT, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryCategoryList_editCategory(categoryId: string, payload: IInventoryCategoryCreateUpdatePayload): Promise<IInventoryCategoryActionResponse> {
      try {
        const response = await httpClient.put<IInventoryCategoryActionResponse>(`${INVENTORY_CATEGORY_BASE_ENDPOINT}/${categoryId}`, payload);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    async inventoryCategoryList_deleteCategory(categoryId: string): Promise<IInventoryCategoryActionResponse> {
      try {
        const response = await httpClient.delete<IInventoryCategoryActionResponse>(`${INVENTORY_CATEGORY_BASE_ENDPOINT}/${categoryId}`);
        return Promise.resolve(response.data);
      } catch (error) {
        return Promise.reject(error);
      } finally {
        // Refetch list after delete
        await this.inventoryCategoryList_fetchList({
          page: 1,
          pageSize: 10,
          orderBy: null,
          orderDirection: 'desc',
        }, {
          paramsSerializer: useParamsSerializer,
        });
      }
    },
  },
});
